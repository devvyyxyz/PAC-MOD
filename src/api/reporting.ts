import client from './client';

type ReportPayload = {
  title?: string;
  message?: string;
  stack?: string;
  meta?: Record<string, any>;
};

export async function sendReport(payload: ReportPayload){
  try{
    const res = await client.post('/reports', payload);
    return { ok: res.ok, status: res.status, reason: res.data?.message || res.text };
  }catch(e:any){
    return { ok: false, status: 0, reason: e?.message || String(e) };
  }
}

export default { sendReport };
