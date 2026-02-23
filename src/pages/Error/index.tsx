import React, {useState} from 'react';
import { sendCrashReport } from '../../utils/report';
import { useI18n, useToast } from '../../components';
import menuStyles from '../../components/Menu/Menu.module.css';
import Button from '../../components/Button';
import styles from './Error.module.css';

export default function ErrorPage({error, info, onBack}:{error:Error, info?:React.ErrorInfo | null, onBack?:()=>void}){
  const { t } = useI18n();
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const toast = useToast();
  const [copied, setCopied] = useState<string | null>(null);

  async function handleSend(){
    setSending(true);
    const res = await sendCrashReport({title: error.message, message: String(error), stack: info?.componentStack});
    setSending(false);
    if(res.ok){
      setResult('sent');
      try{ toast.show({ title: t('report_sent_title'), message: t('report_sent_message'), type: 'success' }); }catch{}
    }else{
      const reason = res.reason || `status ${res.status}`;
      setResult(`failed: ${reason}`);
      try{ toast.show({ title: t('report_failed_title'), message: t('report_failed_message_prefix') + reason, type: 'error', duration: 6000 }); }catch{}
    }
  }

  async function handleCopy(){
    try{
      const payload = `${error.name}: ${error.message}\n\n${info?.componentStack || ''}`;
      await navigator.clipboard.writeText(payload);
      setCopied('Copied!');
      setTimeout(()=>setCopied(null),2000);
    }catch(e:any){
      setCopied('Failed');
      setTimeout(()=>setCopied(null),2000);
    }
  }

  function handleBack(){
    if(onBack) return onBack();
    // fallback: reload
    window.location.href = '/';
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.stage} role="main">
        <div className={styles.icon} aria-hidden>😵</div>
        <h2 className={styles.title}>{t('error_title')}</h2>
        <div className={styles.message}>{t('error_message')}</div>

        <details className={styles.details}>
          <summary style={{cursor:'pointer',fontWeight:700}}>{t('show_details')}</summary>
          <div style={{marginTop:8}}><strong>{error.name}:</strong> {error.message}</div>
          <pre style={{whiteSpace:'pre-wrap',marginTop:8,fontSize:12,opacity:0.95}}>{info?.componentStack}</pre>
        </details>

        <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <Button variant="primary" className={`${styles.actionBtn}`} onClick={handleSend} disabled={sending}>{sending? t('sending') : t('send_crash')}</Button>
            <Button variant="secondary" className={styles.actionBtn} onClick={handleBack}>{t('return_menu')}</Button>
            <Button variant="secondary" className={`${styles.actionBtn} ${styles.copyBtn}`} onClick={handleCopy}>{copied? copied : t('copy_details')}</Button>
            {result && <div className={styles.sendStatus}>Report status: {result}</div>}
          </div>
        </div>

        <div className={styles.footer}>{t('error_footer')}</div>
      </div>
    </div>
  );
}
