//imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());

// Middleware
app.use(express.json());

// MongoDB connection and fetching data...
mongoose.connect('mongodb://localhost:27017/Users', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch(err => {
    console.error("Error while connecting to MongoDB");
  });
  

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, 
    password: { type: String, required: true } 
}); 

const User = mongoose.model('Users', userSchema,'User');
let f=0.0;
let data={
  weight:0.0,metal:false,fill:0.0
};

// route for login...(verification logic);
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        console.log("Received username:", username);
        console.log("Received password:"+password);
        const user = await User.findOne({ username });

        if (!user) {
            console.log("User not found with username:", username);
            return res.status(400).json({ message: 'Invalid username' });
        }
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid password' });
        }
       
        res.json({ message: 'Login successful',fill:data.fill });
    } 
    catch (error) {
        console.error("Error during login process:", error);
        res.status(500).json({ message: "Server error" });
    }
    
    
});
app.get('/index2', (req, res) => {
  res.json(data);
  console.log("data sent to html");
});

app.post('/sensor', (req, res) => {
  data.weight=req.body.weight;
  data.metal=req.body.metalDetected;
  data.fill=req.body.fillLevel;

  console.log("Received data from ESP32:", data);
  res.status(200).send("Data received");
});


app.listen(port,()=>{
    console.log("server started");
});

