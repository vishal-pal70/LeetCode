const express = require('express');
const aiRouter = express.Router();
const userMiddelware = require('../middleware/userMiddelware');
const solveDoubt = require('../controllers/solveDoubt');




aiRouter.post("/chat", userMiddelware, solveDoubt);


module.exports = aiRouter;