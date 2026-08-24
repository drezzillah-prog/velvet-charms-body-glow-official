import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import contact from '../api/contact.js';

function res(){return{statusCode:200,payload:null,headers:{},setHeader(k,v){this.headers[k]=v;},status(c){this.statusCode=c;return this;},json(p){this.payload=p;return this;}};}
const req={method:'POST',body:{name:'Test Customer',email:'test@example.com',message:'Test message'}};

const contactHtml=readFileSync('contact.html','utf8');
assert.match(contactHtml,/fetch\('\/api\/contact'/,'contact form must call the extensionless Vercel function route');
assert.doesNotMatch(contactHtml,/fetch\('\/api\/contact\.js'/,'browser must never call /api/contact.js');

const oldEndpoint=process.env.FORMSPREE_ENDPOINT;
const oldId=process.env.FORMSPREE_FORM_ID;
delete process.env.FORMSPREE_ENDPOINT; delete process.env.FORMSPREE_FORM_ID;
let response=res(); await contact(req,response);
assert.equal(response.statusCode,503,'contact API must never claim success when Formspree is not configured');

process.env.FORMSPREE_ENDPOINT='https://formspree.io/f/testForm123';
let sentBody=null;
global.fetch=async(url,options)=>{sentBody=JSON.parse(options.body);return{ok:true,status:200,json:async()=>({ok:true})};};
response=res(); await contact(req,response);
assert.equal(response.statusCode,200); assert.equal(response.payload.ok,true);
assert.equal(sentBody.name,'Test Customer'); assert.equal(sentBody.email,'test@example.com'); assert.equal(sentBody.message,'Test message');

if(oldEndpoint===undefined) delete process.env.FORMSPREE_ENDPOINT; else process.env.FORMSPREE_ENDPOINT=oldEndpoint;
if(oldId===undefined) delete process.env.FORMSPREE_FORM_ID; else process.env.FORMSPREE_FORM_ID=oldId;
console.log('PASS: Body Glow Contact uses the correct Vercel route, fails honestly without Formspree, and forwards validated messages when configured.');
