const { MongoClient } = require('mongodb');

const uri = "mongodb://172.17.0.2:27017/instagramClone";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db('instagramClone');
    const users = database.collection('users');
    // Find one user
    const user = await users.findOne();
    console.log(user._id.toString());
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
