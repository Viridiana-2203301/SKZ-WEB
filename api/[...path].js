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

  const fetchOptions = {
    method: request.method,
    headers,
    redirect: 'manual',
  };

  if (!['GET', 'HEAD'].includes(request.method || 'GET')) {
    fetchOptions.body = request;
    fetchOptions.duplex = 'half';
  }

  const backendResponse = await fetch(targetUrl, fetchOptions);
  response.status(backendResponse.status);

  backendResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'content-encoding') return;
    response.setHeader(key, value);
  });

  const body = Buffer.from(await backendResponse.arrayBuffer());
  response.send(body);
};
