const express =require('express');
const userMiddelware = require('../middleware/userMiddelware');
const submitRouter = express.Router();
const {submitCode, runCode} = require('../controllers/userSubmission');



submitRouter.post('/submit/:id', userMiddelware, submitCode);
submitRouter.post('/run/:id', userMiddelware, runCode);


module.exports = submitRouter;