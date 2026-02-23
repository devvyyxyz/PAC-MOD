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
    const meta = {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      platform: typeof navigator !== 'undefined' ? (navigator as any).platform || null : null,
      language: typeof navigator !== 'undefined' ? navigator.language : null,
      url: typeof window !== 'undefined' ? window.location.href : null,
      screen: typeof window !== 'undefined' && (window as any).screen ? `${(window as any).screen.width}x${(window as any).screen.height}` : null,
      time: new Date().toISOString(),
      appVersion: typeof (import.meta as any).env !== 'undefined' ? (import.meta as any).env.VITE_APP_VERSION || null : null
    };
    const serverRes = await reporting.sendReport({ title: payload.title, message: payload.message, stack: payload.stack, meta });
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
        fields: [
          { name: 'Error', value: String(payload.message).substring(0,1024) },
          ...(payload.stack ? [{ name: 'Stack', value: String(payload.stack).substring(0,1024) }] : []),
          { name: 'URL', value: (typeof window !== 'undefined' ? window.location.href : 'n/a').substring(0,1024) },
          { name: 'Device', value: (typeof navigator !== 'undefined' ? ((navigator as any).platform || navigator.userAgent) : 'n/a').substring(0,1024) },
          { name: 'User Agent', value: (typeof navigator !== 'undefined' ? navigator.userAgent : 'n/a').substring(0,1024) },
          { name: 'Language', value: (typeof navigator !== 'undefined' ? navigator.language : 'n/a') },
          { name: 'Screen', value: (typeof window !== 'undefined' && (window as any).screen ? `${(window as any).screen.width}x${(window as any).screen.height}` : 'n/a') },
          { name: 'Time', value: new Date().toISOString() }
        ].slice(0,10),
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
