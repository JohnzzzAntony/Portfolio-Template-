try { process.loadEnvFile(); } catch { /* Hosts commonly inject environment variables. */ }
const failures=[];
if (!process.env.DATABASE_URL?.startsWith('file:')) failures.push('DATABASE_URL must point to a persistent SQLite file for this deployment.');
if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32 || process.env.AUTH_SECRET.includes('change-me')) failures.push('Set a random AUTH_SECRET of at least 32 characters.');
try { const raw=process.env.NEXT_PUBLIC_SITE_URL?.trim(); if(!raw) throw new Error(); const url=new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`); if(url.protocol!=='https:' && url.hostname!=='localhost') failures.push('Use an HTTPS public origin.'); } catch { failures.push('Set NEXT_PUBLIC_SITE_URL to your public origin.'); }
const stripe=['STRIPE_SECRET_KEY','STRIPE_PRICE_ID','STRIPE_WEBHOOK_SECRET'];
if(stripe.some(k=>process.env[k]) && !stripe.every(k=>process.env[k])) failures.push('Configure all three Stripe settings, or leave all blank for a preview-only deployment.');
const sandbox=/^(sk|rk)_test_/.test(process.env.STRIPE_SECRET_KEY||'');
if(process.env.STRIPE_SECRET_KEY && !sandbox && process.env.STRIPE_LIVE_MODE!=='enabled') failures.push('Live Stripe key detected. Use sandbox (sk_test_) keys, or set STRIPE_LIVE_MODE=enabled when you are ready to take real payments.');
if(failures.length){ console.error(failures.join('\n')); process.exit(1); }
console.log(!stripe.every(k=>process.env[k]) ? 'Preview deployment: payments are disabled until Stripe is configured.' : sandbox ? 'Deployment environment validated. Stripe sandbox: no real charges.' : 'Deployment environment validated. Stripe LIVE mode.');
