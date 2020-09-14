var fs=require('fs');
const request=require('request');
var file="odd_occ.cpp"
var data=fs.readFileSync(file);
var code=new Buffer(data).toString('ascii');
console.log(code);
 data=fs.readFileSync('test4.txt');
var input= new Buffer(data).toString('ascii');
const options = {
    script : code,
    language: "cpp",
   versionIndex: "3",
   stdin:input,
   clientId: '7d9991cbe222d3646bff319bf80f22f5',
   clientSecret: '43af25012171a821666830e737521534872365844c1b8dd4ffe85a9f0420c3d1'
};

request.post({url: 'https://api.jdoodle.com/execute',json:options},(error, res, body) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(`statusCode: ${res.statusCode}`);
    console.log(body);
  });