var fs=require('fs');
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
  
  const Output_file_Schema = new mongoose.Schema({
    problem_code: {
      type: String,
      required: true
    },
    output_file_index: {
      type: Number,
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
const Output_file_database=mongoose.model("Output_file",Output_file_Schema);
var file="out1.txt"
var data=fs.readFileSync(file);
data=new Buffer(data).toString('ascii');
/*
THus problem_code and index is later on it will be imported from front end and database temporarily used*/
var out1=new Output_file_database({
    problem_code:"ABC1",
    output_file_index:1,
    output:data
})
 /*Output_file_database.insertMany([out1],function(err){
    if(err)
    console.log(err);
    else 
    console.log("file_submitted");
});*/
app.get('/test',function(req,res){
    res.sendFile(__dirname+"/fileupload.html");
});
var path_name;
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        console.log(file);
        cb(null, path_name=(file.fieldname + '-' + Date.now() + path.extname(file.originalname)));
        console.log(path_name);
    }
});


app.post('/upload',function(req,res){
    var problem_code='ABC1';
    var o_f_i=1;
    let upload = multer({ storage: storage }).single('output_file');

    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select a text file to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
    });
    
    var user_file_output;
    var original_output;
    setTimeout(function(){
        console.log("helicopta1");
        
        user_file_output=fs.readFileSync("./uploads/"+path_name);
        user_file_output=new Buffer(user_file_output).toString('ascii');
        console.log(user_file_output);
        
    },1500);

    setTimeout(function(){
         console.log("helicopta2");
         console.log(problem_code+" "+o_f_i);
        let o_f= Output_file_database.findOne({problem_code:problem_code,output_file_index:o_f_i},function(err,obj){
            if(err)
            {
                console.log("No problem for this code found we are working soon.");
            }
            if(!isEmpty(obj)&&obj.problem_code==problem_code)
            {


                original_output=obj.output;
                console.log("hey output"+original_output);
                if(user_file_output==original_output)
                {
                    res.send("Accepted");
                    console.log("matched");
                }
                else 
                {
                    res.send("WA");
                    console.log("Wrong Answer");
                }
            }
            else 
            {
                console.log("hey error I can beat you!");
            }
        });
    },3000);
    
});
app.listen(3000,function(){
    console.log("App started on 3000");
});