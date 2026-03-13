import { schedule } from '@netlify/functions';

// Runs daily at 7am UTC — triggers a fresh build to pull latest RSS posts
export const handler = schedule('0 7 * * *', async () => {
  const hookUrl = process.env.BUILD_HOOK_RSS;
  if (!hookUrl) {
    console.error('[rebuild-rss] BUILD_HOOK_RSS env var not set');
    return { statusCode: 500 };
  }

  const res = await fetch(hookUrl, { method: 'POST' });
  console.log(`[rebuild-rss] Build triggered — status ${res.status}`);
  return { statusCode: 200 };
});
