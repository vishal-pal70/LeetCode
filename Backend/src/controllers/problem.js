const Problem = require('../models/problemSchema');
const Submission = require('../models/submissionSchema');
const User = require('../models/userSchema');
const {getLanguageById, submitBatch, submitToken} = require('../utils/problemUtility')



const createProblem = async (req,res)=>{

    const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        referenceSolution, problemCreator
    } = req.body;


    try{
       
      for(const {language,completeCode} of referenceSolution){

        const languageId = getLanguageById(language);
          
        // I am creating Batch submission
        const submissions = visibleTestCases.map((testcase)=>({
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));


        const submitResult = await submitBatch(submissions);

        const resultToken = submitResult.map((value)=> value.token);
        
       const testResult = await submitToken(resultToken);

      

      //  for(const test of testResult){
      //   if(test.status_id!=3){
      //    return res.status(400).send("Error Occured");
      //   }
      //  }

      }
      // We can store it in our DB

    const userProblem =  await Problem.create({
        ...req.body,
        problemCreator: req.result._id
      });

      res.status(201).send("Problem Saved Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}


const updateProblem = async (req, res)=>{
    const {id} = req.params;

  

      const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        referenceSolution, problemCreator
    } = req.body;

    try {

        if(!id)
          return res.status(400).send("Missing Id");

        const DsaProblem = await Problem.findById(id);

        if(!DsaProblem){
          return res.status(404).send("Id is not Present in server")
        }
      
       for(const {language,completeCode} of referenceSolution){
         

        // source_code:
        // language_id:
        // stdin: 
        // expectedOutput:

        const languageId = getLanguageById(language);
          
        // I am creating Batch submission
        const submissions = visibleTestCases.map((testcase)=>({
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));


        const submitResult = await submitBatch(submissions);

        const resultToken = submitResult.map((value)=> value.token);

        
       const testResult = await submitToken(resultToken);

      

       for(const test of testResult){
        if(test.status_id!=3){
         return res.status(400).send("Error Occured");
        }
       }

      }


      const newProblem = await Problem.findByIdAndUpdate(id, {...req.body}, {runValidators:true, new: true});

      res.status(200).send(newProblem);

    } catch (err) {
      res.status(500).send("Error: "+err);
    }
}

const deleteProblem = async (req,res)=>{
  const {id} = req.params;

     try {

        if(!id)
          return res.status(400).send("Missing Id");

      const deletedProblem = await Problem.findByIdAndDelete(id);

      if(!deletedProblem){
        return res.status(404).send("Problem is Missing")
      }

      res.status(200).send("Problem Deleted Successfully!");

    } catch (err) {
      res.status(500).send("Error: "+err);
    }
}


const getProblemById = async (req,res)=>{
  const {id} = req.params;

    try {

        if(!id)
          return res.status(400).send("Missing Id");

      const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution');

      if(!getProblem){
        return res.status(404).send("Problem is Missing")
      }

      res.status(200).send(getProblem);

    } catch (err) {
      res.status(500).send("Error: "+err);
    }
}

const getAllProblem = async (req,res)=>{
  
    try {

      const getProblems = await Problem.find({}).select('_id title difficulty tags');

      if(getProblems.length==0){
        return res.status(404).send("Problem is Missing")
      }

      res.status(200).send(getProblems);

    } catch (err) {
      res.status(500).send("Error: "+err);
    }

}

const solvedAllProblemByUser = async (req,res)=>{
  try {
    const userId = req.result._id;

    const user = await User.findById(userId).populate({
      path: 'problemSolved',
      select: "_id title difficulty tags"
    });
    res.status(200).send(user.problemSolved);
  } catch (err) {
    res.status(500).send("Error: "+err);
  }
}


const submittedProblem = async (req,res)=>{
  try {


    const userId = req.result._id;
    const problemId = req.params.pid;

    const ans = await Submission.find({userId,problemId});

    if(ans.length==0){
      res.status(200).send("No submission!");
    }
    
    res.status(200).send(ans);

  } catch (err) {
    res.status(500).send("Error: "+err);
  }
}


module.exports = {createProblem,updateProblem,deleteProblem, getProblemById,getAllProblem,solvedAllProblemByUser, submittedProblem};