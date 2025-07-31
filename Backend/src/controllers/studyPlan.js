const Study = require('../models/studySchema');



const studyPlan = async (req, res) => {
    try {
        const { title, description, duration, level, topics } = req.body;

        // Create a new study plan
        const newPlan = new Study({
            title,
            description,
            duration,
            level,
            topics
        });

        await newPlan.save();

        res.status(201).json({
            message: 'Study plan created successfully',
            data: newPlan
        });
    } catch (error) {
        console.error("Error creating study plan:", error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

const allStudyPlan = async (req, res) => {
    try {
        const plans = await Study.find().sort({ createdAt: -1 }); // newest first
        res.status(200).json({
            message: "All study plans fetched successfully",
            data: plans
        });
    } catch (error) {
        console.error("Error fetching study plans:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = { studyPlan, allStudyPlan };