import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorPage from './pages/Error';
import { I18nProvider, ToastProvider } from './components';
import './styles';

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');
const root = createRoot(container);

function renderApp(){
  root.render(
    <React.StrictMode>
      <I18nProvider>
        <ToastProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </ToastProvider>
      </I18nProvider>
    </React.StrictMode>
  );
}

function renderErrorPage(err: Error){
  try{
    root.render(
      <React.StrictMode>
        <I18nProvider>
          <ToastProvider>
            <ErrorPage error={err} info={undefined} onBack={renderApp} />
          </ToastProvider>
        </I18nProvider>
      </React.StrictMode>
    );
  }catch(e){
    // last resort: log
    console.error('Failed to render ErrorPage', e);
  }
}

// Global handlers for uncaught errors/promises
window.addEventListener('error', (ev) => {
  const err = (ev as ErrorEvent).error || new Error((ev as ErrorEvent).message || 'Unknown error');
  console.error('Uncaught error:', err);
  renderErrorPage(err);
});

window.addEventListener('unhandledrejection', (ev) => {
  const reason = (ev as PromiseRejectionEvent).reason;
  const err = reason instanceof Error ? reason : new Error(String(reason));
  console.error('Unhandled rejection:', err);
  renderErrorPage(err);
});

renderApp();

// Intercept React console warnings/errors for particular messages and show ErrorPage.
(() => {
  const originalError = (console as any).error.bind(console);
  const originalWarn = (console as any).warn.bind(console);
  let handled = false;

  function checkAndHandle(args: any[]){
    try{
      if(handled) return;
      // If an Error object was logged, handle it
      for(const a of args){
        if(a instanceof Error){
          handled = true;
          setTimeout(()=> renderErrorPage(a), 10);
          return;
        }
      }

      const msg = String(args && args[0] ? args[0] : '');
      // specific React warning we previously handled
      if(msg.includes('Encountered two children with the same key')){
        handled = true;
        const e = new Error(msg);
        setTimeout(()=> renderErrorPage(e), 10);
        return;
      }

      // generic error-like messages — treat conservatively
      if(/\b(Error|Uncaught|Unhandled|Exception)\b/i.test(msg)){
        handled = true;
        const e = new Error(msg);
        setTimeout(()=> renderErrorPage(e), 10);
        return;
      }
    }catch(e){ /* ignore */ }
  }

  (console as any).error = (...args:any[]) => { checkAndHandle(args); originalError(...args); };
  (console as any).warn = (...args:any[]) => { checkAndHandle(args); originalWarn(...args); };
})();
