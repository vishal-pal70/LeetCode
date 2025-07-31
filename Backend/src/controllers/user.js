const redisClient = require('../config/redis');
const Submission = require('../models/submissionSchema');
const User = require('../models/userSchema');
const userValidate = require('../utils/validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const register = async (req, res)=>{
    try {

        // validate user
        userValidate(req.body);

        const {firstNmae, emailId, password} = req.body;

        // hash password
        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'user';

        const user = await User.create(req.body);

         // jwt token
       const token = jwt.sign({_id:user._id, emailId:emailId, role: 'user'}, process.env.JWT_KEY, {expiresIn: 60*60});

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id
       }


      res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'None', // 🔥 Required when frontend & backend are on different domains
  maxAge: 60 * 60 * 1000 // 1 hour
});


       res.status(201).json({
        user:reply,
        message: "Register Successfully"
       });


    } catch (err) {
        res.status(400).send("Error: "+err);
    }
}


const login = async (req,res)=>{
    try {


        const {emailId, password} = req.body;

        if(!emailId)
            throw new Error("Invalid Credentials")

         if(!password)
            throw new Error("Invalid Credentials")

        const user = await User.findOne({emailId});

       const match = await bcrypt.compare(password, user.password);

       if(!match)
        throw new Error("Invalid Credentials");

       const reply = {
        firstName: user.firstName,
        emailId: user.emailId,
        _id: user._id
       }
        

             // jwt token
       const token = jwt.sign({_id:user._id, emailId:emailId, role: user.role}, process.env.JWT_KEY, {expiresIn: 60*60});
       res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'None', // 🔥 Required when frontend & backend are on different domains
  maxAge: 60 * 60 * 1000 // 1 hour
});


       res.status(201).json({
        user:reply,
        message: "Login Successfully"
       });


    } catch (err) {
        res.status(401).send("Error: "+err);
    }
}


const logout = async (req, res)=>{
    try {
        const {token} = req.cookies;

        const payload = jwt.decode(token, process.env.JWT_KEY);

        await redisClient.set(`token:${token}`,'Blocked');
        await redisClient.expireAt(`token:${token}`,payload.exp);

        res.cookie("token",null, {expires: new Date(Date.now())});
        res.send("User Logout Successfully");
    } catch (err) {
        res.status(503).send("Error: "+err)
    }
}


const adminRegister = async (req, res)=>{
      try {

        // validate user
        userValidate(req.body);

        const {firstNmae, emailId, password} = req.body;

        // hash password
        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'admin';

        const user = await User.create(req.body);

         // jwt token
       const token = jwt.sign({_id:user._id, emailId:emailId, role: 'admin'}, process.env.JWT_KEY, {expiresIn: 60*60});
       res.cookie('token', token, {maxAge: 60*60*1000});

       res.status(201).send("User Register Successfully");


    } catch (err) {
        res.status(400).send("Error: "+err);
    }
}

const deleteProfile = async (req, res)=>{
    try {
        const userId = req.result._id;
        await User.findByIdAndDelete(userId);

       await Submission.deleteMany({userId});

       res.status(200).send("Deleted Successfully!");


    } catch (err) {
        res.status(500).send("Error: "+err);
    }
}

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .select('-password') // don't return password
      .populate('problemSolved'); // populate referenced problems

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
    
  } catch (error) {
    console.error("Error in getUser:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports ={register, login, logout, adminRegister, deleteProfile, getUser}
