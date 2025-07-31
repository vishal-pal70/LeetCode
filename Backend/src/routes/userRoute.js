const express =require('express');
const userRouter = express.Router();
const {register, login, logout, adminRegister, deleteProfile, getUser, getStats} = require('../controllers/user');
const userMiddelware = require('../middleware/userMiddelware');
const adminMiddleware = require('../middleware/adminMiddleware');


userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", userMiddelware ,logout);
userRouter.post("/admin/register", adminMiddleware, adminRegister);
userRouter.delete("/deleteProfile", userMiddelware, deleteProfile);
userRouter.get("/profile/:id", userMiddelware, getUser);
userRouter.get("/stats", getStats);
userRouter.get("/check", userMiddelware, (req,res)=>{
    const reply = {
        firstName: req.result.firstName,
        emailId: req.result.emailId,
        _id: req.result._id,
        role:req.result.role
    }
    res.status(200).json({
        user:reply,
        message:"Valid User"
    })
})


module.exports = userRouter;
