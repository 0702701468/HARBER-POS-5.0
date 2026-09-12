const fs = require('fs');
const crypto = require('crypto');
const { Client } = require('pg');
const path = require('path');

const url = process.env.DATABASE_URL;
if (!url) { console.error('DATABASE_URL is required'); process.exit(1); }
function hashPassword(password) { const salt=crypto.randomBytes(16).toString('hex'); const hash=crypto.scryptSync(password,salt,64).toString('hex'); return `scrypt:${salt}:${hash}`; }
(async()=>{
 const client=new Client({connectionString:url,ssl:process.env.PGSSLMODE==='require'?{rejectUnauthorized:false}:undefined});
 await client.connect();
 try {
  const schema=fs.readFileSync(path.join(__dirname,'schema.sql'),'utf8');
  await client.query(schema);
  let biz=await client.query('select id from businesses order by created_at asc limit 1');
  let bid;
  if(biz.rowCount) bid=biz.rows[0].id;
  else { const r=await client.query(`insert into businesses(name,phone,location,address,currency) values($1,$2,$3,$4,'KES') returning id`,['HarborPOS Business','+254 700 000 000','Nairobi, Kenya','Moi Avenue, Nairobi']); bid=r.rows[0].id; }
  const levels=[[1,'Level 1 — Owner',['*']],[2,'Level 2 — General Manager',['dashboard','branches','pos','customers','suppliers','products','conversions','credit','repayments','rooms','reservations','stays','payments','reports','users','settings']],[3,'Level 3 — Manager',['dashboard','branches','pos','customers','products','conversions','credit','repayments','rooms','reservations','stays','payments','reports']],[4,'Level 4 — Cashier / Reception',['dashboard','pos','customers','credit','repayments','rooms','reservations','stays','payments']],[5,'Level 5 — Waiter / Housekeeping',['dashboard','pos','customers','rooms','stays']]];
  for(const [id,name,features] of levels) await client.query(`insert into access_levels(id,business_id,name,features) values($1,$2,$3,$4::jsonb) on conflict(id) do update set business_id=excluded.business_id,name=excluded.name,features=excluded.features`,[id,bid,name,JSON.stringify(features)]);
  let br=await client.query(`select id from branches where business_id=$1 and code=$2 limit 1`,[bid,'CBD']); let branchId;
  if(br.rowCount) branchId=br.rows[0].id; else { const r=await client.query(`insert into branches(business_id,name,code,location) values($1,'Nairobi CBD','CBD','Nairobi') returning id`,[bid]); branchId=r.rows[0].id; }
  const demoUsers=[['System Admin','admin@harborpos.local','Owner',1],['General Manager','manager@harborpos.local','General Manager',2],['Cashier','cashier@harborpos.local','Cashier',4]];
  for(const [name,email,role,level] of demoUsers){ let u=await client.query('select id from users where lower(email)=lower($1) limit 1',[email]); if(!u.rowCount){ const r=await client.query(`insert into users(business_id,name,email,password_hash,role,level_id) values($1,$2,$3,$4,$5,$6) returning id`,[bid,name,email,hashPassword('HarborPOS123!'),role,level]); u=r; } await client.query(`insert into user_branches(user_id,branch_id) values($1,$2) on conflict do nothing`,[u.rows[0].id,branchId]); }
  console.log('Database initialization/migration complete.');
 } finally { await client.end(); }
})().catch(e=>{ console.error('Database initialization failed:',e.message); process.exit(1); });
