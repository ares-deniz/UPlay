const BASE_URL = 'https://youtube-v31.p.rapidapi.com';

/**
 * @typedef {Record<string, string|number|boolean|undefined>} QueryParams
 */

/**
 * Fetch from the YouTube API via RapidAPI.
 * @param {string} path
 * @param {QueryParams} [params={}]
 * @returns {Promise<any>}
 */
export async function fetchFromAPI(path, params = {}) {
  const apiKey = import.meta.env?.VITE_RAPID_API_KEY;
  if (!apiKey) {
    throw new Error('Missing VITE_RAPID_API_KEY. Set it in your .env file.');
  }

  const url = new URL(`${BASE_URL}/${path}`);
  const mergedParams = { maxResults: 50, ...params };
  Object.entries(mergedParams).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }

  return await res.json();
}
