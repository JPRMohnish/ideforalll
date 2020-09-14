const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const mongoose=require("mongoose");
const app=express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/public'));
const db = require('./config/keys').mongoURI;
const path = require('path');
// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
  
  const  problem_schema = new mongoose.Schema({

    problem_statement:{
      type: String,
      required: true
    },
    problem_code: {
      type: String,
      required: true
    },
    input:{
      type: String,
      required: true
    },
    output: {
      type: String,
      required:true
    }
  });
  function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

const problem_database=mongoose.model("problem_database",problem_schema);
app.get("/makeproblem",function(req,res){
    res.sendFile(__dirname+"/question_adder_admin.html");
    
});
app.post("/problemset",function(req,res){
     var problemcode=req.body.problemcode;
     problemcode=problemcode.toString('ascii');
     var problemstatement=req.body.problemtext;
     problemstatement=problemstatement.toString('ascii');

     var input=req.body.input;
     input=input.toString('ascii');

     var output=req.body.output;
     output.toString('ascii');
     
     var problem1=new problem_database({
       problem_statement:problemstatement,
       problem_code:problemcode,
       input:input,
       output:output
     });
     console.log(problem1);
     setTimeout(function(){
     problem_database.insertMany([problem1],function(err){
         if(err)
         {
             console.log(err);
             res.send("error")
         }
         else 
         {
             console.log("problem_inserted_successfully");
             res.send("problem_inserted_successfully)");
         }
     });
     },300);
});

app.listen(3001,function(err){
if(err)
console.log(err);
else 
console.log("ADMIN CAN ADD PROBLEMS");
}
);