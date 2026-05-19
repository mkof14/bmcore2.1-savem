import { createClient } from '@supabase/supabase-js';

type MockQueryResult = {
  data: null;
  error: null;
  count: null;
  status: number;
  statusText: string;
};

const mockQueryResult: MockQueryResult = {
  data: null,
  error: null,
  count: null,
  status: 200,
  statusText: 'OK',
};

function createMockQuery() {
  const terminalResult = Promise.resolve(mockQueryResult);
  const query = new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === 'then') return terminalResult.then.bind(terminalResult);
        if (prop === 'catch') return terminalResult.catch.bind(terminalResult);
        if (prop === 'finally') return terminalResult.finally.bind(terminalResult);
        if (prop === 'maybeSingle' || prop === 'single') {
          return () => Promise.resolve(mockQueryResult);
        }
        if (prop === 'select' || prop === 'insert' || prop === 'upsert' || prop === 'update' || prop === 'delete') {
          return () => query;
        }
        return () => query;
      },
    },
  );

  return query;
}

function createMockChannel() {
  return {
    on: () => createMockChannel(),
    subscribe: () => createMockChannel(),
    unsubscribe: async () => 'ok',
    send: async () => 'ok',
    track: async () => 'ok',
    untrack: async () => 'ok',
  };
}

function createMockSupabaseClient() {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
      signUp: async () => ({ data: { user: null, session: null }, error: null }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ data: {}, error: null }),
      updateUser: async () => ({ data: { user: null }, error: null }),
      signInWithOAuth: async () => ({ data: { provider: null, url: null }, error: null }),
      linkIdentity: async () => ({ data: { provider: null, url: null }, error: null }),
      unlinkIdentity: async () => ({ data: null, error: null }),
    },
    from: () => createMockQuery(),
    rpc: async () => mockQueryResult,
    channel: () => createMockChannel(),
    removeChannel: async () => 'ok',
    removeAllChannels: async () => [],
    storage: {
      from: () => ({
        upload: async (path: string) => ({ data: { path }, error: null }),
        download: async () => ({ data: null, error: null }),
        remove: async () => ({ data: null, error: null }),
        list: async () => ({ data: [], error: null }),
        createSignedUrl: async () => ({ data: { signedUrl: '' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
    functions: {
      invoke: async () => ({ data: null, error: null }),
    },
  };
}

function isValidHttpUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isMockMode = import.meta.env.VITE_MOCK_MODE === '1';

const supabaseUrl = isValidHttpUrl(rawUrl) ? rawUrl : 'https://mock.supabase.co';
const supabaseAnonKey = rawKey && rawKey.trim() ? rawKey : 'mock-anon-key';

if (isMockMode) {
  console.info('[supabase] VITE_MOCK_MODE=1, using local mock client.');
} else if (!isValidHttpUrl(rawUrl)) {
  console.warn('[supabase] Invalid/missing VITE_SUPABASE_URL, using mock fallback.');
}
if (!rawKey || !rawKey.trim()) {
  console.warn('[supabase] Missing VITE_SUPABASE_ANON_KEY, using mock fallback.');
}

export const supabase = isMockMode || !isValidHttpUrl(rawUrl) || !rawKey?.trim()
  ? createMockSupabaseClient() as unknown as ReturnType<typeof createClient>
  : createClient(supabaseUrl, supabaseAnonKey);
