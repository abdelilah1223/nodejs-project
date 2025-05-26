const express=require("express");
const app=express();
const { MongoClient, ObjectId } = require('mongodb');
const jwt=require("jsonwebtoken");
const cors=require("cors");
const auth=require("./midllware/auth");
app.use(cors());
app.use(express.json());
const os = require('os');

const uri = 'mongodb://localhost:27017'; // MongoDB URI
const client = new MongoClient(uri);

app.use(express.json());
function getServerIP() {
  const interfaces = os.networkInterfaces();
  for (let iface in interfaces) {
    for (let i of interfaces[iface]) {
      if (i.family === 'IPv4' && !i.internal) {
        return i.address;
      }
    }
  }
  return 'IP not found';
}

let db;
let collection;


async function connectDB() {
  try {
    await client.connect();
    db = client.db('G_stagaire'); 
    collection = db.collection('users'); 
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
}
app.get('/users',auth,   async (req, res) => {
    try {
        const data = await collection.find().toArray();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});



const SECRET_KEY = 'abdelilahabdo123';
app.use(express.static('public'));
const path = require('path');
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const target = await collection.findOne({ username, password });
        
        if (!target) {
            res.status(401).json({ message: "Invalid username or password" });
        } else {
            const token = jwt.sign({ username: target.username }, SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({ token });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});



connectDB().then(()=>{app.listen(3000 , ()=>{
    console.log("link http://localhost:3000");
})})