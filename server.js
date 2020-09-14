/*
 * Manage Session in Node.js and ExpressJS
 * Author : Shahid Shaikh
 * Version : 0.0.2
*/
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();
const router = express.Router();
const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser:true});
const app = express();

app.use(session({
    secret: 'ssshhhhh',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
    saveUninitialized: false,
    resave: false
}));
const user_schema=new mongoose.Schema(
    {
      email:String,
      password:String
    });

const user_database=mongoose.model("user",user_schema);
 /* const aa=new user_database({
    email:"abc@gmail.com",
    password:"abc"
  });
  user_database.insertMany([aa],function(err){
    if(err)
    {
        console.log(err);
    }
    else 
    console.log("done");
  });*/

app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));

/*router.get('/',(req,res) => {

    let sess = req.session;
    //console.log("kuchbhi");
    if(sess.email) {
        //console.log("baddua "+sess.email+" hey ");
        return res.redirect('/admin');
    }
    
});*/
async function check(em,pass)
{
       var flag=0;
       let use= await user_database.findOne({email:em,password:pass});
       if(use)
       {
           flag=1;
           console.log(flag+"ii");
       }
       console.log(flag+"oo");
   return flag;
}
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
router.post('/login',(req,res) => {
    
    var em=req.body.email;
    var pass=req.body.pass;
    let dd="";
     let flag=0;
   /* if(user_database.find(function(err,x){
      if(err)
      console.log(err);
      else 
      {
              console.log(em+" "+pass);
              x.forEach(function(y){
              console.log(y.email+" "+y.password);
              if(y.email==em&&y.password==pass)
              {
                  flag=1;
              }
          });
      }
      console.log(" in "+flag);
      if(flag==1)
      {
          req.session.email = req.body.email;
          dd=em;
          console.log(req.session.email);
         // return res.end('done');
      }
    }));*/

    let use= user_database.findOne({email:em,password:pass},function(err,obj){
        if(err)
        {
            flag=0;
        }
        if(!isEmpty(obj)&&obj.email==em)
        { 
            flag=1;
            console.log(flag+"ii");
        }
    });
    
    setTimeout(function(){
        if(flag==1)
        {
            console.log(flag+"oo");
        req.session.email=em;
        res.end("done");
        }
    },1500);
    
    
});

router.get('/admin',(req,res) => {
    if(req.session.email) {
        res.write(`<h1>Hello ${req.session.email} </h1><br>`);
        res.end('<a href='+'/logout'+'>Logout</a>');
    }
    else {
        res.sendFile(__dirname+'/index.html');
    }
});

router.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });

});

app.use('/', router);

app.listen(process.env.PORT || 3000,() => {
    console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});
