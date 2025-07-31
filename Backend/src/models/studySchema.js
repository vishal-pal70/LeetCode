

const mongoose = require('mongoose');
const {Schema} = mongoose;


const studySchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    duration:{
        type:String
    },
    level:{
            type:String,
            enum: ['Beginner', "Intermediate", 'Advanced'],
            default: "Beginner"
        },
    topics: [
    {
      name: { type: String, required: true },
      completed: { type: Boolean, default: false },
    },
  ],
},{timestamps:true});


const Study = mongoose.model("study", studySchema);
module.exports = Study;

