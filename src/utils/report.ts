/**
 * Send a crash report to a Discord webhook.
 * NOTE: For CORS reasons this may require a server-side proxy in production.
 * Configure the webhook via `VITE_DISCORD_WEBHOOK_URL` or `saveConfig({discordWebhook: '...'})`.
 */
import config from '../config';
import reporting from '../api/reporting';

export async function sendCrashReport(payload: {title?:string;message:string;stack?:string}){
  // Try server-side reporting endpoint first (if available)
  try{
    const serverRes = await reporting.sendReport({ title: payload.title, message: payload.message, stack: payload.stack });
    if(serverRes && serverRes.ok) return { ok: true, status: serverRes.status };
    // If server reports not ok, fall through to webhook fallback
  }catch(e){ /* continue to webhook fallback */ }

  // Fallback: direct Discord webhook (client-side). May be blocked by CORS in production.
  const DISCORD_WEBHOOK_URL = config.getDiscordWebhook();
  if(!DISCORD_WEBHOOK_URL) {
    console.warn('Discord webhook URL not configured and server reporting failed.');
    return {ok:false,reason:'no-reporting-endpoint'};
  }

  const body = {
    content: `Crash report: ${payload.title||'client'}`,
    embeds: [
      {
        title: payload.title || 'Client crash',
        description: payload.message,
        fields: payload.stack ? [{name:'stack',value:payload.stack.substring(0,1024)}] : undefined,
        timestamp: new Date().toISOString()
      }
    ]
  };

  try{
    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    return {ok:res.ok,status:res.status};
  }catch(err:any){
    return {ok:false,reason:err.message};
  }
}
