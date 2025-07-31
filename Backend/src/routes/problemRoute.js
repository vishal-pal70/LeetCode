const express =require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const problemRouter = express.Router();
const {createProblem, updateProblem, deleteProblem, getProblemById,getAllProblem,solvedAllProblemByUser, submittedProblem} = require('../controllers/problem');
const userMiddelware = require('../middleware/userMiddelware');



// create
problemRouter.post("/create",adminMiddleware ,createProblem);
problemRouter.put("/update/:id",adminMiddleware , updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware , deleteProblem);


problemRouter.get("/problemById/:id",userMiddelware, getProblemById);
problemRouter.get("/getAllProblem",userMiddelware, getAllProblem);
problemRouter.get("/problemSolvedByUser",userMiddelware, solvedAllProblemByUser);
problemRouter.get("/submittedProblem/:pid", userMiddelware, submittedProblem)

// fetch
// update
// delete


module.exports = problemRouter;