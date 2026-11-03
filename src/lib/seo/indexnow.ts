export const INDEXNOW_KEY = "e7b92f4c8a1d4e6b90c3f5a2d8e7b1c4";
export const INDEXNOW_HOST = "www.desknomads.store";

export async function submitToIndexNow(urls: string[]): Promise<{ ok: boolean; status: number; text: string }> {
  if (!urls || urls.length === 0) {
    return { ok: true, status: 200, text: "No URLs provided" };
  }

  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
    urlList: urls.slice(0, 10000), // IndexNow max limit per call
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    return {
      ok: res.ok,
      status: res.status,
      text: text || (res.ok ? "Submitted to IndexNow successfully" : "Failed"),
    };
  } catch (err) {
    console.error("IndexNow submission failed:", err);
    return {
      ok: false,
      status: 500,
      text: String(err),
    };
  }
}
