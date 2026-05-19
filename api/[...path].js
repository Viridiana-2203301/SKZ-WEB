module.exports = async function handler(request, response) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    response.status(500).json({ error: 'BACKEND_URL is not configured in Vercel.' });
    return;
  }

  const targetBase = backendUrl.replace(/\/$/, '');
  const originalUrl = new URL(request.url, `https://${request.headers.host}`);
  const backendBasePath = new URL(targetBase).pathname.replace(/\/$/, '');
  const incomingPath = originalUrl.pathname.endsWith('/')
    ? originalUrl.pathname
    : `${originalUrl.pathname}/`;
  const backendPath = backendBasePath === '/api' && incomingPath.startsWith('/api/')
    ? incomingPath.replace(/^\/api/, '')
    : incomingPath;
  const targetUrl = new URL(`${targetBase}${backendPath}${originalUrl.search}`);
  const headers = new Headers();

  for (const [key, value] of Object.entries(request.headers)) {
    if (!value) continue;

    const lowerKey = key.toLowerCase();
    if (['host', 'connection', 'content-length'].includes(lowerKey)) continue;

    headers.set(key, Array.isArray(value) ? value.join(',') : value);
  }

  headers.set('origin', targetBase);
  headers.set('referer', `${targetBase}/`);

  const body = ['GET', 'HEAD'].includes(request.method || 'GET')
    ? undefined
    : Buffer.from(await readRequestBody(request));
  const backendResponse = await fetchWithFallbacks(targetUrl, {
    method: request.method,
    headers,
    body,
  });
  response.status(backendResponse.status);
  response.setHeader('x-skz-proxy-target', backendResponse.url);

  backendResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'content-encoding') return;
    response.setHeader(key, value);
  });

  const responseBody = Buffer.from(await backendResponse.arrayBuffer());
  response.send(responseBody);
};

async function readRequestBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

async function fetchWithFallbacks(targetUrl, options) {
  const urls = buildFallbackUrls(targetUrl);
  let lastResponse = null;

  for (const url of urls) {
    lastResponse = await fetch(url, buildFetchOptions(options));

    if (lastResponse.status !== 404) {
      return lastResponse;
    }
  }

  return lastResponse;
}

function buildFetchOptions(options) {
  const fetchOptions = {
    method: options.method,
    headers: options.headers,
    redirect: 'manual',
  };

  if (options.body) {
    fetchOptions.body = options.body;
    fetchOptions.duplex = 'half';
  }

  return fetchOptions;
}

function buildFallbackUrls(targetUrl) {
  const urls = [targetUrl];
  const path = targetUrl.pathname;

  addUrlVariant(urls, targetUrl, path.endsWith('/') ? path.slice(0, -1) : `${path}/`);

  if (path.startsWith('/api/')) {
    const withoutApi = path.replace(/^\/api/, '') || '/';
    addUrlVariant(urls, targetUrl, withoutApi);
    addUrlVariant(urls, targetUrl, withoutApi.endsWith('/') ? withoutApi.slice(0, -1) : `${withoutApi}/`);
  } else {
    const withApi = `/api${path.startsWith('/') ? path : `/${path}`}`;
    addUrlVariant(urls, targetUrl, withApi);
    addUrlVariant(urls, targetUrl, withApi.endsWith('/') ? withApi.slice(0, -1) : `${withApi}/`);
  }

  return urls;
}

function addUrlVariant(urls, originalUrl, pathname) {
  if (!pathname) return;

  const url = new URL(originalUrl.href);
  url.pathname = pathname;

  if (!urls.some(existingUrl => existingUrl.href === url.href)) {
    urls.push(url);
  }
}
