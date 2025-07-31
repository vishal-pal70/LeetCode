const express = require('express');
const studyRouter = express.Router();
const {studyPlan, allStudyPlan} = require('../controllers/studyPlan');


studyRouter.post('/plan', studyPlan);
studyRouter.get('/allplans', allStudyPlan);



module.exports = studyRouter;