// Cloudflare Pages Functions API 代理
// 将所有 /api/* 请求转发到后端 API

interface Env {
  BACKEND_API_URL: string;
}

export async function onRequest(context: {
  request: Request;
  env: Env;
  params: { path: string[] };
}) {
  const { request, env, params } = context;

  // 获取后端 API URL（从环境变量）
  const backendUrl = env.BACKEND_API_URL || 'https://nvdv338g40.execute-api.us-east-1.amazonaws.com/dev';

  // 构建目标 URL
  const path = params.path ? params.path.join('/') : '';
  const url = new URL(request.url);
  const targetUrl = `${backendUrl}/api/${path}${url.search}`;

  // 复制原始请求的 headers
  const headers = new Headers(request.headers);
  headers.set('Origin', backendUrl);

  // 转发请求
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
  });

  // 复制响应的 headers
  const responseHeaders = new Headers(response.headers);

  // 添加 CORS headers
  responseHeaders.set('Access-Control-Allow-Origin', '*');
  responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理 OPTIONS 请求（预检请求）
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: responseHeaders,
    });
  }

  // 返回响应
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}
