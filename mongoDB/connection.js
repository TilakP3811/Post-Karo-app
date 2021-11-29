const mongoose = require("mongoose");
const {database} = require("../config/key");

const DB = database;
mongoose.connect(DB).then(() => {
    console.log("Connection Success");
}).catch(() => {
    console.log("Connection Failed");
});