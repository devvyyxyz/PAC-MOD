const API_BASE = import.meta.env.VITE_API_BASE || '/api';

type RequestOpts = {
  method?: string;
  headers?: Record<string,string>;
  body?: any;
};

async function request(path: string, opts: RequestOpts = {}){
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers: Record<string,string> = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  const res = await fetch(url, { method: opts.method || 'GET', headers, body: opts.body ? JSON.stringify(opts.body) : undefined });
  const text = await res.text();
  let data: any = text;
  try { data = text ? JSON.parse(text) : null; } catch(e) { /* non-json */ }
  return { ok: res.ok, status: res.status, data, text };
}

export async function post(path: string, body?: any){ return request(path, { method: 'POST', body }); }
export async function get(path: string){ return request(path, { method: 'GET' }); }

export default { get, post };
