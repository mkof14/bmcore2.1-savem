import { createClient } from '@supabase/supabase-js';

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

const supabaseUrl = isValidHttpUrl(rawUrl) ? rawUrl : 'https://mock.supabase.co';
const supabaseAnonKey = rawKey && rawKey.trim() ? rawKey : 'mock-anon-key';

if (!isValidHttpUrl(rawUrl)) {
  console.warn('[supabase] Invalid/missing VITE_SUPABASE_URL, using mock fallback.');
}
if (!rawKey || !rawKey.trim()) {
  console.warn('[supabase] Missing VITE_SUPABASE_ANON_KEY, using mock fallback.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
