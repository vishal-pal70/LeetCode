const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/db');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoute');
const redisClient = require("./config/redis");
const problemRouter = require("./routes/problemRoute");
const submitRouter = require("./routes/submitRoute");
const cors = require('cors');
const aiRouter = require("./routes/aiChatting");
const videoRouter = require('./routes/videoRoute');
const studyRouter = require('./routes/studyPlan');


const allowedOrigins = [
  'http://localhost:5173',
  'https://leetcode-frontend-bps2.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());

// api
app.use("/user", userRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiRouter);
// app.use("/video",videoRouter);
app.use('/study', studyRouter);




const InitalizeConnection = async ()=>{
    try {
        await Promise.all([main(), redisClient.connect()]);
        console.log("DB Connected!");

        
    app.listen(process.env.PORT, ()=>{
    console.log("Server Listen Port Number: "+ process.env.PORT);
    })

    } catch (err) {
        console.log("Error: "+err);
    }
}


InitalizeConnection();

