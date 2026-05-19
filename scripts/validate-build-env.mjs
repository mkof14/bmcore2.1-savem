const requiredPublicEnv = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];

const shouldSkipValidation = process.env.VITE_MOCK_MODE === '1';

if (shouldSkipValidation) {
  console.log('[env-check] VITE_MOCK_MODE=1, skipping required env validation');
  process.exit(0);
}

const missing = requiredPublicEnv.filter((key) => {
  const value = process.env[key];
  return !value || value.trim() === '';
});

if (missing.length > 0) {
  console.warn('[env-check] Missing public environment variables; build will use client fallbacks:');
  missing.forEach((key) => console.warn(`  - ${key}`));
  process.exit(0);
}

console.log('[env-check] Required public environment variables are present.');
