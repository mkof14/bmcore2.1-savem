import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, fail, ok } from "../_shared/response.ts";

const ALLOWED_ACTIONS = new Set([
  // Keep this list aligned with src/features/saven/contracts/savenBackendApiContract.ts.
  "snapshot",
  "monitoring",
  "list_events",
  "incident_readiness",
  "apply_incident_action",
  "list_tasks",
  "list_endpoints",
  "list_care_contacts",
  "create_task",
  "assign_task",
  "send_command",
  "interpret_command",
  "verify_action",
  "update_continuity",
  "request_care_contact",
  "apply_admin_override",
]);

async function getUserFromRequest(req: Request) {
  const auth = req.headers.get("Authorization");
  if (!auth) return null;

  const url = Deno.env.get("SUPABASE_URL");
  const anon = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !anon) return null;

  const client = createClient(url, anon, {
    global: { headers: { Authorization: auth } },
  });

  const { data } = await client.auth.getUser();
  return data?.user || null;
}

async function isAdmin(userId: string): Promise<boolean> {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return false;

  const adminClient = createClient(url, serviceKey);
  const { data } = await adminClient.from("profiles").select("is_admin").eq("id", userId).maybeSingle();
  return !!data?.is_admin;
}

function safeDraftResponse(action: string, userId: string, payload: unknown) {
  return ok({
    action,
    status: "draft_ready",
    safety: "No external dispatch is performed by this draft gateway.",
    actorId: userId,
    payload,
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return fail("Method not allowed", 405, "BAD_REQUEST");
  }

  try {
    const caller = await getUserFromRequest(req);
    if (!caller) return fail("Unauthorized", 401, "UNAUTHORIZED");

    const body = await req.json().catch(() => null);
    const action = body?.action;
    const payload = body?.payload ?? {};

    if (!action || !ALLOWED_ACTIONS.has(action)) {
      return fail("Unknown SAVEN gateway action", 400, "BAD_REQUEST", { action });
    }

    const adminOnly = action === "apply_admin_override" || action === "request_care_contact";
    if (adminOnly) {
      const admin = await isAdmin(caller.id);
      if (!admin) return fail("Admin access required for this SAVEN action", 403, "FORBIDDEN");
    }

    if (action === "monitoring") {
      return safeDraftResponse(action, caller.id, {
        ...payload,
        route: "SAVEN monitoring snapshot",
      });
    }

    if (action === "list_events") {
      return safeDraftResponse(action, caller.id, {
        ...payload,
        route: "SAVEN event audit timeline",
      });
    }

    if (action === "incident_readiness") {
      return safeDraftResponse(action, caller.id, {
        ...payload,
        route: "SAVEN incident readiness",
      });
    }

    if (action === "apply_incident_action") {
      return safeDraftResponse(action, caller.id, {
        ...payload,
        audit: "incident action draft",
      });
    }

    if (action === "apply_admin_override") {
      return safeDraftResponse(action, caller.id, {
        ...payload,
        audit: "admin override draft",
      });
    }

    if (action === "send_command") {
      return safeDraftResponse(action, caller.id, {
        ...payload,
        route: "command intake draft",
      });
    }

    if (action === "interpret_command") {
      return safeDraftResponse(action, caller.id, {
        ...payload,
        route: "command intent draft",
        safety: "Intent classification only; no external dispatch.",
      });
    }

    return safeDraftResponse(action, caller.id, payload);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unknown SAVEN gateway error", 500, "SERVER_ERROR");
  }
});
