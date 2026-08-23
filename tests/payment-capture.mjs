import assert from 'node:assert/strict';
import captureOrder from '../api/capture-order.js';

process.env.PAYPAL_ENV='sandbox';
process.env.PAYPAL_CLIENT_ID='test-client';
process.env.PAYPAL_CLIENT_SECRET='test-secret';
delete process.env.FORMSPREE_ENDPOINT;
delete process.env.FORMSPREE_FORM_ID;

function res(){return{statusCode:200,payload:null,headers:{},setHeader(k,v){this.headers[k]=v;},status(c){this.statusCode=c;return this;},json(p){this.payload=p;return this;}};}

async function run({tamper=false,alreadyCompleted=false,captureFailure=false,invalidMarket=false,badCompletedAmount=false}={}){
  let captureCalls=0;
  global.fetch=async(url,options={})=>{
    const u=String(url);
    if(u.endsWith('/v1/oauth2/token')) return {ok:true,status:200,json:async()=>({access_token:'token'})};
    if(u.endsWith('/v2/checkout/orders/ORDER1')) {
      const value=tamper?'0.01':'18.00';
      return {ok:true,status:200,json:async()=>({
        id:'ORDER1',
        status:alreadyCompleted?'COMPLETED':'APPROVED',
        purchase_units:[{
          custom_id:invalidMarket?'XX':'INTL',
          items:[{sku:'wax_small',quantity:'1',unit_amount:{currency_code:'USD',value}}],
          amount:{currency_code:'USD',value},
          ...(alreadyCompleted?{payments:{captures:[{id:'CAP-EXISTING',amount:{currency_code:'USD',value:badCompletedAmount?'17.00':'18.00'}}]}}:{})
        }]
      })};
    }
    if(u.endsWith('/v2/checkout/orders/ORDER1/capture')){
      captureCalls++;
      if(captureFailure) return {ok:false,status:422,json:async()=>({name:'UNPROCESSABLE_ENTITY'})};
      return {ok:true,status:201,json:async()=>({id:'ORDER1',status:'COMPLETED',purchase_units:[{payments:{captures:[{id:'CAP1',amount:{currency_code:'USD',value:'18.00'}}]}}]})};
    }
    throw new Error(`Unexpected fetch ${u}`);
  };
  const response=res();
  await captureOrder({method:'POST',headers:{host:'preview.test'},body:{orderID:'ORDER1',cart:{items:[{id:'wax_small',qty:1,options:{}}]}}},response);
  return {response,captureCalls};
}

const ok=await run();
assert.equal(ok.response.statusCode,200,'matching PayPal order must capture');
assert.equal(ok.response.payload.status,'COMPLETED');
assert.equal(ok.response.payload.recovered,false);
assert.equal(ok.captureCalls,1);

const bad=await run({tamper:true});
assert.equal(bad.response.statusCode,409,'tampered approved amount must be rejected before capture');
assert.equal(bad.captureCalls,0,'tampered order must never be captured');

const recovered=await run({alreadyCompleted:true});
assert.equal(recovered.response.statusCode,200,'a previously completed order must be recoverable after a lost browser/server response');
assert.equal(recovered.response.payload.status,'COMPLETED');
assert.equal(recovered.response.payload.recovered,true);
assert.equal(recovered.response.payload.captureID,'CAP-EXISTING');
assert.equal(recovered.captureCalls,0,'recovery must never attempt to charge the PayPal order a second time');

const completedMismatch=await run({alreadyCompleted:true,badCompletedAmount:true});
assert.equal(completedMismatch.response.statusCode,409,'completed PayPal orders with a mismatched captured amount must not be accepted');
assert.equal(completedMismatch.captureCalls,0);

const badMarket=await run({invalidMarket:true});
assert.equal(badMarket.response.statusCode,409,'an unrecognized server-stamped pricing market must be rejected');
assert.equal(badMarket.captureCalls,0);

const paypalFailure=await run({captureFailure:true});
assert.equal(paypalFailure.response.statusCode,502,'PayPal capture failures must not be reported as successful payments');
assert.equal(paypalFailure.captureCalls,1);

console.log('PASS: Body Glow validates approved pricing before capture, rejects tampering, handles PayPal failures, and safely recovers already-completed orders without charging twice.');
