const Problem = require("../models/problemSchema");
const Submission = require("../models/submissionSchema");
const { getLanguageById, submitBatch, submitToken} = require("../utils/problemUtility");



const submitCode = async (req,res) =>{

    try {
        const userId = req.result._id;
        const problemId = req.params.id;

        let {code, language} = req.body;

        if(!userId || !problemId || !code || !language)
            return res.status(400).send("Some Field Missing");

        if(language==='cpp')
            language='c++'

        // fetch the problem from database
        const problem = await Problem.findById(problemId);

        // submission store in db

        const submittedResult = await Submission.create({
            userId,
            problemId,
            language,
            code,
            status:'pending',
            testCasesTotal: problem.hiddenTestCases.length
        })

        // judge0 code ko submit karna

        const languageId = getLanguageById(language);

          const submissions = problem.hiddenTestCases.map((testcase)=>({
            source_code:code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

        const submitResult = await submitBatch(submissions);

        const resultToken = submitResult.map((value)=> value.token);

        const testResult = await submitToken(resultToken);


        // submittedResult ko update karna
        let testcasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = 'accepted';
        let errorMessage = null;

        for(const test of testResult){
            if(test.status_id==3){
                testcasesPassed++;
                runtime = runtime+parseFloat(test.time);
                memory = Math.max(memory, test.memory);
            }
            else{
                if(test.status_id==4){
                    status = 'error';
                    errorMessage = test.stderr
                }
                else{
                    status = 'wrong'
                    errorMessage = test.stderr
                }
            }
        }

        // store the result in db in submission
        submittedResult.status = status;
        submittedResult.testCasesPassed = testcasesPassed;
        submittedResult.errorMessage = errorMessage;
        submittedResult.runtime = runtime;
        submittedResult.memory = memory;

        await submittedResult.save();

        // problemId ko insert karenge userSchema ke problemSolved mai if it is not present there..
        
        if(!req.result.problemSolved.includes(problemId)){
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }

        const accepted = (status == 'accepted')
        res.status(201).json({
        accepted,
        totalTestCases: submittedResult.testCasesTotal,
        passedTestCases: testcasesPassed,
        runtime,
        memory
    });

    } catch (err) {
        res.status(500).send("Error: "+err);
    }
}


const runCode = async (req,res) =>{

    try {
        const userId = req.result._id;
        const problemId = req.params.id;

        const {code, language} = req.body;

        if(!userId || !problemId || !code || !language)
            return res.status(400).send("Some Field Missing");

        // fetch the problem from database
        const problem = await Problem.findById(problemId);

      

        // judge0 code ko submit karna

        const languageId = getLanguageById(language);

          const submissions = problem.visibleTestCases.map((testcase)=>({
            source_code:code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

        const submitResult = await submitBatch(submissions);

        const resultToken = submitResult.map((value)=> value.token);

        const testResult = await submitToken(resultToken);


             let testCasesPassed = 0;
            let runtime = 0;
            let memory = 0;
            let status = true;
            let errorMessage = null;

    for(const test of testResult){
        if(test.status_id==3){
           testCasesPassed++;
           runtime = runtime+parseFloat(test.time)
           memory = Math.max(memory,test.memory);
        }else{
          if(test.status_id==4){
            status = false
            errorMessage = test.stderr
          }
          else{
            status = false
            errorMessage = test.stderr
          }
        }
    }

    res.status(201).json({
    success:status,
    testCases: testResult,
    runtime,
    memory
   });

    } catch (err) {
        res.status(500).send("Error: "+err);
    }
}

module.exports = {submitCode, runCode};