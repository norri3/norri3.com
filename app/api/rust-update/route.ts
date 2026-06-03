// Server route: proxies Steam's public news API for Rust (appid 252490).
// Direct browser calls to Steam are blocked by CORS, so we fetch it here and
// expose just the latest update's title + link. Cached for 30 minutes.

const RUST_APPID = 252490;

export const revalidate = 1800; // seconds

type SteamNewsItem = {
  gid: string;
  title: string;
  url: string;
  is_external_url: boolean;
  author: string;
  contents: string;
  feedlabel: string;
  date: number; // unix seconds
  feedname: string;
};

type SteamNewsResponse = {
  appnews?: {
    appid: number;
    newsitems?: SteamNewsItem[];
    count?: number;
  };
};

export async function GET() {
  const empty = Response.json({ title: null });

  try {
    const res = await fetch(
      `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${RUST_APPID}&count=10&maxlength=200&format=json`,
      { next: { revalidate } },
    );
    if (!res.ok) return empty;

    const data: SteamNewsResponse = await res.json();
    const items = data.appnews?.newsitems ?? [];
    if (items.length === 0) return empty;

    // During a wipe the monthly update is the newest official post. Prefer
    // Steam's own announcement feed; fall back to the newest item overall.
    const official = items.find(
      (it) => !it.is_external_url && it.feedname?.includes("steam"),
    );
    const pick = official ?? items[0];

    return Response.json({
      title: pick.title,
      url: pick.url,
      date: pick.date,
    });
  } catch {
    return empty;
  }
}
