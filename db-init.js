const fs = require('fs');
const crypto = require('crypto');
const { Client } = require('pg');

const url = process.env.DATABASE_URL;
if (!url) { console.error('DATABASE_URL is required'); process.exit(1); }
function hashPassword(password){const salt=crypto.randomBytes(16).toString('hex');const hash=crypto.scryptSync(password,salt,64).toString('hex');return `scrypt:${salt}:${hash}`;}
(async()=>{
 const client=new Client({connectionString:url,ssl:process.env.PGSSLMODE==='require'?{rejectUnauthorized:false}:undefined});
 await client.connect();
 const schema=fs.readFileSync(require('path').join(__dirname,'schema.sql'),'utf8');
 await client.query(schema);
 const biz=await client.query(`insert into businesses(name,phone,location,address,currency) values($1,$2,$3,$4,'KES') returning id`,['HarborPOS Demo Business','+254 700 000 000','Nairobi, Kenya','Moi Avenue, Nairobi']);
 const bid=biz.rows[0].id;
 for(const [id,name,features] of [[1,'Level 1 — Owner',['*']],[2,'Level 2 — General Manager',['dashboard','branches','pos','customers','suppliers','products','conversions','credit','repayments','rooms','reservations','stays','payments','reports','users','settings']],[3,'Level 3 — Manager',['dashboard','branches','pos','customers','products','conversions','credit','repayments','rooms','reservations','stays','payments','reports']],[4,'Level 4 — Cashier / Reception',['dashboard','branches','pos','customers','credit','repayments','rooms','reservations','stays','payments']],[5,'Level 5 — Waiter / Housekeeping',['dashboard','pos','customers','rooms','stays']]]) await client.query(`insert into access_levels(id,business_id,name,features) values($1,$2,$3,$4::jsonb)`,[id,bid,name,JSON.stringify(features)]);
 const br=await client.query(`insert into branches(business_id,name,code,location) values($1,'Nairobi CBD','CBD','Nairobi') returning id`,[bid]);
 for(const [name,email,role,level] of [['System Admin','admin@harborpos.local','Owner',1],['General Manager','manager@harborpos.local','General Manager',2],['Cashier','cashier@harborpos.local','Cashier',4]]){
   const u=await client.query(`insert into users(business_id,name,email,password_hash,role,level_id) values($1,$2,$3,$4,$5,$6) returning id`,[bid,name,email,hashPassword('HarborPOS123!'),role,level]);
   await client.query(`insert into user_branches(user_id,branch_id) values($1,$2)`,[u.rows[0].id,br.rows[0].id]);
 }
 console.log('Database initialized. Demo password for all three users: HarborPOS123!');
 await client.end();
})().catch(e=>{console.error(e);process.exit(1)});
