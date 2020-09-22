const express = require('express');
const request = require('request');
const multer = require('multer');
const bodyParser = require('body-parser');
const mongoose=require("mongoose");
const app=express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/public'));
app.set("view engine","ejs");
const db = require('./config/keys').mongoURI;
const path = require('path');
// Connect to MongoDB
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
var problem_database;
var ind=0;
var problemss=[];
var problem_object=[/*{problem_code:"problem_code",problem_statement:"problem_statement",input:"input",output:"output"}*/];
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(function(){ 
    console.log('MongoDB Connected')
    problem_database=mongoose.model("problem_database",problem_schema);
    problem_database.find(function(err,problems){
      if(err)
      {
  
      }
      else 
      {
          problems.forEach(function(problem){
                           if(problem.problem_code.length>1)
                           {
                   problem_object[ind]={problem_code:problem.problem_code,problem_statement:problem.problem_statement,input:problem.input,output:problem.output};
                   problemss[ind]=problem.problem_code;
                   ind++;
                           }
          });
      }
  });
  })
  .catch(err => console.log(err));
  
// Previous to this only database connectivity and fetching is there.

// Rendering Problem Page 

setTimeout(function(){
 //console.log(problemss);
// console.log(problem_object);
},1500)
var arr=[{lang:"java",version:"3"},{lang:"c",version:"4"},{lang:"cpp",version:"4"},{lang:"cpp14",version:"3"},{lang:"cpp17",version:"0"},{lang:"python2",version:"2"},{lang:"python3",version:"3"}]

app.get('/practice',function(req,res){
    res.render("practicepage",{problems:problemss});
});
app.post('/anyproblem',function(req,res){
      var problemcode=req.body.which_problem;
      //console.log(problemcode);
      for(let i=0;i<ind;i++)
      {
          if(problem_object[i].problem_code==problemcode)
          {
            
            //console.log("problemfound");
            var pseudocode="#include<iostream>\nusing namespace std;\nint main(){\nreturn 0;\n}"
            res.render("problempage",{problemcode:problem_object[i].problem_code,statement:problem_object[i].problem_statement,code:pseudocode,input:"INPUT",output:"",lang:"c / cpp /cpp14 /cpp17 /java /python2 /python3 "});
            break;
          }
      }


});



// CODE EVALUATING 

app.post('/check',function(req,res){
  var code=req.body.code;
  var problemcode=req.body.problemcode;
  var lang=req.body.lang;
  code=code.toString('ascii');problemcode=problemcode.toString('ascii');lang=lang.toString('ascii');
  lang=lang.trim();

  problemcode=problemcode.trim();
   //console.log(problemcode+" "+lang+" "+code+" ");


   var version="0";
   for(let i=0;i<7;i++)
   {
     if(arr[i].lang==lang)
     {
       version=lang.version;
       break;
     }
   }
  var answer="NULL";
  //console.log("entered checking mode\n");
  for(let i=0;i<ind;i++)
  {
    if(problem_object[i].problem_code==problemcode)
    {
          var input=problem_object[i].input;
          var out=problem_object[i].output;
          input=input.toString('ascii');
          out=out.toString('ascii');
         // console.log("checking happened\n");
         // console.log(input+" \n"+out);
          const options = {
            script : code,
            stdin:input,
            language: lang,
           versionIndex: version,
           clientId: '7d9991cbe222d3646bff319bf80f22f5',
           clientSecret: '43af25012171a821666830e737521534872365844c1b8dd4ffe85a9f0420c3d1'
        };
          var output=null;
        request.post({url: 'https://api.jdoodle.com/execute',json:options},(error, respo, body) => {
            if (error) {
              console.error(error);
              answer="retry API IS LOST"
             // console.log(answer);
              res.send({answer:answer});
            }
            else 
            {
            //console.log(body);
            output=body.output;
            if(output!=undefined)
            {
            output=output.toString('ascii');
            output.replace(/(\r\n|\n|\r)/gm,"");
            output.replace(/(\r\n|\n|\r)/gm,"");
            output.replace(/\s+/g," ");
            output.replace('\\n|\\r','');
            output.trim();
            }
            out.replace(/(\r\n|\n|\r)/gm,"");;
            out.trim();
           // console.log("Actual Checking "+out+" "+output);
           // console.log(output.localeCompare(out));
           var l1=output.length;
           var l2=out.length;
           let i=0,j=0;
           var x1=[],x2=[];
           while(i<output.length)
           {
             x1[i]=output.charCodeAt(i);
             i++;
           }

           while(j<out.length)
           {
             x2[j]=output.charCodeAt(j);
             j++;
           }
           var flag=true;
              
            i=0;
            j=0;
               while(i<l1&&j<l2)
               {
                //console.log(x1[i]+" "+x2[j]+" "+i+" "+j);
                 if(x1[i]==10)
                 {
                   i++;
                 }
                 else if(x2[j]==10)
                 {
                   j++;
                 }
                 else 
                 {
                   if(x1[i]!=x2[j])
                   {
                     flag=false;
                     
                     break;
                   }
                   i++;
                   j++;
                 }
               }
               while(i<l1)
               {
                 //console.log(x1[i]);
                 if(x1[i]==10||x1[i]==32)
                 {

                 }
                 else 
                 {
                   flag=false;
                 }
                 i++;
               }
               while(j<l2)
               {
                //console.log(x1[i]+" "+x2[j]);
                if(x2[j]==10||x2[j]==32)
                {

                }
                else 
                {
                  flag=false;
                }
                j++;
               }
              //console.log(flag);
              if(flag)
             {
               answer="ALL CORRECT";
               //console.log(answer);
               res.send({answer:answer});
             }
             else 
             {
              //console.log("Actual Checking2 "+out+" "+output);
              answer="NO BRO YOU MADE SOME ERROR";
              //console.log(answer);
              res.send({answer:answer});
             }
             


            }
          });
          break;
    }
    else
    {
      
    }
 }
});
    
// CODE TESTING 
app.post('/codes',function(req,res){

  var code=req.body.code;

  var lang=req.body.lang;
  var input=req.body.input;
  code=code.toString('ascii');
  lang=lang.toString('ascii');
  input=input.toString('ascii');
  lang=lang.trim();
  var version="0";
   for(let i=0;i<7;i++)
   {
     if(arr[i].lang==lang)
     {
       version=lang.version;
       break;
     }
   }
  const options = {
    script : code,
    stdin:input,
    language: lang,
   versionIndex: version,
   clientId: '7d9991cbe222d3646bff319bf80f22f5',
   clientSecret: '43af25012171a821666830e737521534872365844c1b8dd4ffe85a9f0420c3d1'
};
  var output=null;
request.post({url: 'https://api.jdoodle.com/execute',json:options},(error, respo, body) => {
    if (error) {
      console.error(error);
      return;
    }
    else 
    {
   // console.log(body);
    output=body.output;
    res.send({lang:lang,input:input,output:output,code:code});
    }
  });
});


  app.listen(3000,function(err){
    if(err)
    console.log(err)
    else 
    console.log("Server on ");
  });

