require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const projects = await db.collection('projects').find({ status: 'PUBLISHED' }).toArray();
  console.log('Published projects:', projects.length);
  console.log(projects.map(p => p.name));
  process.exit(0);
}

test();
