import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { SignJWT } from 'jose';
import { starterContent } from '../src/lib/portfolio-content.ts';

process.loadEnvFile();
const base=process.env.TEST_URL || 'http://localhost:3002';
assert.equal(new URL(base).hostname,'localhost','Run fixtures only against a local test server.');
const db=new PrismaClient(); const ids=[]; const suffix=randomUUID().slice(0,8);
try {
  for(const path of ['/','/template','/login','/register','/demo']) {
    const response=await fetch(base+path); assert.equal(response.status,200,path);
    const html=await response.text(); assert.ok(!/johns|antony|rydge/i.test(html),`Personal branding in ${path}`);
  }
  const userA=await db.user.create({data:{name:'Test Owner A',email:`audit-a-${suffix}@example.invalid`,passwordHash:'test-fixture-not-a-password',role:'EDITOR',portfolio:{create:{slug:`audit-a-${suffix}`,content:JSON.stringify({...starterContent,name:'Owner A private draft'})}}}}); ids.push(userA.id);
  const userB=await db.user.create({data:{name:'Test Owner B',email:`audit-b-${suffix}@example.invalid`,passwordHash:'test-fixture-not-a-password',role:'EDITOR',portfolio:{create:{slug:`audit-b-${suffix}`,content:JSON.stringify({...starterContent,name:'Owner B private draft'})}}}}); ids.push(userB.id);
  async function cookie(user) { const token=await new SignJWT({email:user.email,name:user.name,role:'EDITOR'}).setSubject(user.id).setIssuedAt().setExpirationTime('5m').setProtectedHeader({alg:'HS256'}).sign(new TextEncoder().encode(process.env.AUTH_SECRET)); return `forma_session=${token}`; }
  const authA=await cookie(userA), authB=await cookie(userB);
  const unpaid=await fetch(base+'/dashboard/editor',{headers:{cookie:authA},redirect:'manual'}); assert.equal(unpaid.status,307); assert.ok(unpaid.headers.get('location').endsWith('/dashboard'));
  await db.purchase.create({data:{userId:userA.id,priceId:'price_fixture',status:'PAID'}});
  const editor=await fetch(base+'/dashboard/editor',{headers:{cookie:authA}}); assert.equal(editor.status,200); const html=await editor.text(); assert.ok(html.includes('Owner A private draft')); assert.ok(!html.includes('Owner B private draft'));
  const other=await fetch(base+'/dashboard/editor',{headers:{cookie:authB},redirect:'manual'}); assert.equal(other.status,307);
  const admin=await fetch(base+'/admin/settings',{headers:{cookie:authA},redirect:'manual'}); assert.equal(admin.status,307); assert.ok(admin.headers.get('location').endsWith('/dashboard'));
  assert.equal((await fetch(base+`/p/audit-a-${suffix}`)).status,404,'Draft must not be public');
  await db.portfolio.update({where:{ownerId:userA.id},data:{published:true,publishedContent:JSON.stringify({...starterContent,name:'Owner A published'})}});
  const publicHtml=await (await fetch(base+`/p/audit-a-${suffix}`)).text(); assert.ok(publicHtml.includes('Owner A published')); assert.ok(!publicHtml.includes('Owner A private draft'));
  await db.purchase.updateMany({where:{userId:userA.id},data:{status:'REVOKED'}});
  assert.equal((await fetch(base+`/p/audit-a-${suffix}`)).status,404,'Refund revokes public access');
  const webhook=await fetch(base+'/api/stripe/webhook',{method:'POST',body:'{}',headers:{'stripe-signature':'forged'}}); assert.ok([400,503].includes(webhook.status));
  console.log('PASS: branding, public routes, unpaid gate, paid editor, account isolation, admin isolation, private drafts, publishing, revocation and forged webhook.');
} finally { await db.user.deleteMany({where:{id:{in:ids}}}); await db.$disconnect(); }
