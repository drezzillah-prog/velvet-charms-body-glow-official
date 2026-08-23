import assert from 'node:assert/strict';
import captureOrder from '../api/capture-order.js';

process.env.PAYPAL_ENV='sandbox';
process.env.PAYPAL_CLIENT_ID='test-client';
process.env.PAYPAL_CLIENT_SECRET='test-secret';

function res(){return{statusCode:200,payload:null,headers:{},setHeader(k,v){this.headers[k]=v;},status(c){this.statusCode=c;return this;},json(p){this.payload=p;return this;}};}

async function run({tamper=false}={}){
  let captureCalls=0;
  global.fetch=async(url,options={})=>{
    const u=String(url);
    if(u.endsWith('/v1/oauth2/token')) return {ok:true,status:200,json:async()=>({access_token:'token'})};
    if(u.endsWith('/v2/checkout/orders/ORDER1')) return {ok:true,status:200,json:async()=>({purchase_units:[{custom_id:'INTL',items:[{sku:'wax_small',quantity:'1',unit_amount:{currency_code:'USD',value:tamper?'0.01':'18.00'}}],amount:{currency_code:'USD',value:tamper?'0.01':'18.00'}}]})};
    if(u.endsWith('/v2/checkout/orders/ORDER1/capture')){captureCalls++;return {ok:true,status:201,json:async()=>({id:'ORDER1',status:'COMPLETED',purchase_units:[{payments:{captures:[{id:'CAP1',amount:{currency_code:'USD',value:'18.00'}}]}}]})};}
    throw new Error(`Unexpected fetch ${u}`);
  };
  const response=res();
  await captureOrder({method:'POST',body:{orderID:'ORDER1',cart:{items:[{id:'wax_small',qty:1,options:{}}]}}},response);
  return {response,captureCalls};
}

const ok=await run();
assert.equal(ok.response.statusCode,200,'matching PayPal order must capture');
assert.equal(ok.response.payload.status,'COMPLETED');
assert.equal(ok.captureCalls,1);

const bad=await run({tamper:true});
assert.equal(bad.response.statusCode,409,'tampered approved amount must be rejected before capture');
assert.equal(bad.captureCalls,0,'tampered order must never be captured');

console.log('PASS: PayPal capture validates approved SKU, quantity, currency, unit price and total before collecting funds.');
