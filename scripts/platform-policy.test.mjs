import assert from 'node:assert/strict';
import { test } from 'node:test';
import Stripe from 'stripe';
import { paymentMatches } from '../src/lib/payment-policy.ts';
import { portfolioSchema, starterContent } from '../src/lib/portfolio-content.ts';

const purchase = { userId: 'owner-a', priceId: 'price_template', status: 'PENDING' };
const paid = () => ({ mode: 'payment', payment_status: 'paid', client_reference_id: 'owner-a', line_items: { data: [{ price: { id: 'price_template' }, quantity: 1 }] }, payment_intent: { id: 'pi_1', latest_charge: { refunded: false, amount_refunded: 0, disputed: false } } });
test('matching one-time payment grants access', () => assert.equal(paymentMatches(paid(), purchase), true));
test('unpaid, wrong customer, price, quantity or mode never grants access', () => {
  for (const [key,value] of [['payment_status','unpaid'],['client_reference_id','owner-b'],['mode','subscription'],['payment_intent','pi_unexpanded']]) assert.equal(paymentMatches({...paid(),[key]:value},purchase),false);
  assert.equal(paymentMatches(paid(),{...purchase,priceId:'other'}),false);
  const two = paid(); two.line_items.data[0].quantity = 2; assert.equal(paymentMatches(two,purchase),false);
});
test('refunds, partial refunds, disputes and revoked purchases cannot regrant access', () => {
  for (const [key,value] of [['refunded',true],['amount_refunded',1],['disputed',true]]) { const session=paid(); session.payment_intent.latest_charge[key]=value; assert.equal(paymentMatches(session,purchase),false); }
  assert.equal(paymentMatches(paid(),{...purchase,status:'REVOKED'}),false);
});
test('starter template is valid; scripts, unsafe images and oversized projects are rejected', () => {
  assert.equal(portfolioSchema.safeParse(starterContent).success,true);
  assert.equal(portfolioSchema.safeParse({...starterContent,heroImage:'javascript:alert(1)'}).success,false);
  assert.equal(portfolioSchema.safeParse({...starterContent,heroImage:'data:text/html,bad'}).success,false);
  assert.equal(portfolioSchema.safeParse({...starterContent,projects:Array(25).fill(starterContent.projects[0])}).success,false);
});
test('Stripe signature validation rejects tampering and stale signatures', () => {
  const stripe = new Stripe('sk_test_fixture'); const secret='whsec_fixture';
  const payload=JSON.stringify({id:'evt_fixture',type:'checkout.session.completed',data:{object:{}}});
  const header=stripe.webhooks.generateTestHeaderString({payload,secret});
  assert.equal(stripe.webhooks.constructEvent(payload,header,secret).id,'evt_fixture');
  assert.throws(()=>stripe.webhooks.constructEvent(payload+' ',header,secret));
  const stale=stripe.webhooks.generateTestHeaderString({payload,secret,timestamp:1});
  assert.throws(()=>stripe.webhooks.constructEvent(payload,stale,secret));
});
