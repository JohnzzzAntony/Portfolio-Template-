try { process.loadEnvFile(); } catch { /* Hosts commonly inject environment variables. */ }
const failures=[];
if (!/^postgres(ql)?:\/\//.test(process.env.DATABASE_URL||'')) failures.push('DATABASE_URL must be a PostgreSQL connection string (pooled).');
if (!/^postgres(ql)?:\/\//.test(process.env.DIRECT_URL||'')) failures.push('DIRECT_URL must be the direct (non-pooled) PostgreSQL connection string used for migrations.');
const storage=['AWS_ENDPOINT_URL_S3','AWS_ACCESS_KEY_ID','AWS_SECRET_ACCESS_KEY'];
if(storage.some(k=>process.env[k]) && !storage.every(k=>process.env[k])) failures.push('Configure AWS_ENDPOINT_URL_S3, AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY together, or leave all blank for local-disk uploads.');
if(!storage.every(k=>process.env[k])) console.warn('Object storage not configured: uploads are written to local disk, which is lost on redeploy for container hosts.');
if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32 || process.env.AUTH_SECRET.includes('change-me')) failures.push('Set a random AUTH_SECRET of at least 32 characters.');
try { const raw=process.env.NEXT_PUBLIC_SITE_URL?.trim(); if(!raw) throw new Error(); const url=new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`); if(url.protocol!=='https:' && url.hostname!=='localhost') failures.push('Use an HTTPS public origin.'); } catch { failures.push('Set NEXT_PUBLIC_SITE_URL to your public origin.'); }
const stripe=['STRIPE_SECRET_KEY','STRIPE_PRICE_ID','STRIPE_WEBHOOK_SECRET'];
if(stripe.some(k=>process.env[k]) && !stripe.every(k=>process.env[k])) failures.push('Configure all three Stripe settings, or leave all blank for a preview-only deployment.');
const stripeKey=(process.env.STRIPE_SECRET_KEY||'').trim().replace(/^["']|["']$/g,'');
const sandbox=/^(sk|rk)_test_/.test(stripeKey);
const live=process.env.STRIPE_LIVE_MODE?.trim()==='enabled';
// A live key must not take the site down: checkout stays disabled until it is replaced or live mode is enabled.
if(stripeKey && !sandbox && !live) console.warn(`Stripe key starting "${stripeKey.slice(0,8)}" is not a sandbox key. Checkout is DISABLED. Set STRIPE_SECRET_KEY to your sk_test_ key (and a test-mode price and webhook secret), or set STRIPE_LIVE_MODE=enabled for real payments.`);
if(failures.length){ console.error(failures.join('\n')); process.exit(1); }
console.log(!stripe.every(k=>process.env[k]) ? 'Preview deployment: payments are disabled until Stripe is configured.' : sandbox ? 'Deployment environment validated. Stripe sandbox: no real charges.' : live ? 'Deployment environment validated. Stripe LIVE mode.' : 'Deployment environment validated. Payments disabled: non-sandbox Stripe key without STRIPE_LIVE_MODE.');
