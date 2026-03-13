const SECTION_FEED = 'https://livinginterface.substack.com/s/agentic-systems/feed';
const FULL_FEED    = 'https://livinginterface.substack.com/feed';

async function parseFeed(url) {
  const res = await fetch(url);
  if (!res.ok) return [];
  const xml = await res.text();

  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < 3) {
    const block = match[1];

    const title =
      block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1]?.trim() ||
      block.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() || '';

    const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() || '';

    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() || '';

    const subtitle =
      block.match(/<subtitle><!\[CDATA\[([\s\S]*?)\]\]><\/subtitle>/)?.[1]?.trim() ||
      block.match(/<subtitle>([\s\S]*?)<\/subtitle>/)?.[1]?.trim() || '';

    if (title && link) {
      const date = pubDate
        ? new Date(pubDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : '';
      items.push({ title, link, date, subtitle });
    }
  }

  return items;
}

module.exports = async function () {
  try {
    const items = await parseFeed(SECTION_FEED);
    if (items.length > 0) return items;

    console.log('[writing.js] Section feed empty or unavailable, falling back to full feed');
    return await parseFeed(FULL_FEED);
  } catch (e) {
    console.warn('[writing.js] Failed to fetch Substack feed:', e.message);
    return [];
  }
};
