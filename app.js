const express = require("express");
const dotenv = require("dotenv");
//application
const app = express();

const port = process.env.PORT || 5000; //server port
require("./mongoDB/connection"); //mongoDB Connection

//middleware
app.use(express.urlencoded());
app.use(express.json());

app.use(require("./routes/auth"));//Home routes
app.use(require("./routes/post"));//upload post page
app.use(require("./routes/user"));//upload post page

if(process.env.NODE_ENV=="production"){
    app.use(express.static("client/build"));
    const path = require("path");
    app.get("*",(req, res)=>{
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html")); 
    })
}

app.listen(port, () => {
    console.log("Its Running");
})