module.exports = async function () {
  try {
    const res = await fetch('https://livinginterface.substack.com/s/agentic-systems/feed');
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
  } catch (e) {
    console.warn('[writing.js] Failed to fetch Substack feed:', e.message);
    return [];
  }
};
