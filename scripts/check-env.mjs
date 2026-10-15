try { process.loadEnvFile(); } catch { /* Hosts commonly inject environment variables. */ }
const failures=[];
if (!/^postgres(ql)?:\/\//.test(process.env.DATABASE_URL||'')) failures.push('DATABASE_URL must be a PostgreSQL connection string (pooled).');
if (!/^postgres(ql)?:\/\//.test(process.env.DIRECT_URL||'')) failures.push('DIRECT_URL must be the direct (non-pooled) PostgreSQL connection string used for migrations.');
const storage=['AWS_ENDPOINT_URL_S3','AWS_ACCESS_KEY_ID','AWS_SECRET_ACCESS_KEY'];
if(storage.some(k=>process.env[k]) && !storage.every(k=>process.env[k])) failures.push('Configure AWS_ENDPOINT_URL_S3, AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY together, or leave all blank for local-disk uploads.');
if(!storage.every(k=>process.env[k])) console.warn('Object storage not configured: uploads are written to local disk, which is lost on redeploy for container hosts.');
if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32 || process.env.AUTH_SECRET.includes('change-me')) failures.push('Set a random AUTH_SECRET of at least 32 characters.');
try { const raw=process.env.NEXT_PUBLIC_SITE_URL?.trim(); if(!raw) throw new Error(); const url=new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`); if(url.protocol!=='https:' && url.hostname!=='localhost') failures.push('Use an HTTPS public origin.'); } catch { failures.push('Set NEXT_PUBLIC_SITE_URL to your public origin.'); }
if(failures.length){ console.error(failures.join('\n')); process.exit(1); }
console.log('Deployment environment validated.');
