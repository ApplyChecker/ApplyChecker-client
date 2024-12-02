async function getCookieHeader(domain: string): Promise<string> {
  const cookies: chrome.cookies.Cookie[] = await chrome.cookies.getAll({
    domain: `.${domain}`,
  });
  return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
}

export default getCookieHeader;
