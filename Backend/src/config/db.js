const mongoose = require('mongoose');


async function main() {
   await mongoose.connect(process.env.MONGO_DB);
}


module.exports = main;