import dotenv from 'dotenv';
import { connectDatabase } from '../config/db.js';
import Career from '../models/Career.js';
import College from '../models/College.js';
import Notification from '../models/Notification.js';
import fs from 'fs';
import path from 'path';
import url from 'url';

dotenv.config();

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function run() {
  await connectDatabase(process.env.MONGO_URI);
  const careers = JSON.parse(fs.readFileSync(path.join(__dirname, 'careers.json'), 'utf-8'));
  const colleges = JSON.parse(fs.readFileSync(path.join(__dirname, 'colleges.json'), 'utf-8'));
  const indianColleges = JSON.parse(fs.readFileSync(path.join(__dirname, 'indianColleges.json'), 'utf-8'));

  await Career.deleteMany({});
  await College.deleteMany({});
  await Notification.deleteMany({});

  await Career.insertMany(careers);
  await College.insertMany([...colleges, ...indianColleges]);

  await Notification.insertMany([
    { title: 'ABC University B.Tech Admissions', type: 'admission', deadline: new Date(Date.now() + 1000*60*60*24*30), stream: 'Science' },
    { title: 'National Scholarship Test', type: 'scholarship', deadline: new Date(Date.now() + 1000*60*60*24*45), stream: 'Commerce' }
  ]);

  console.log('Seed complete');
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});



