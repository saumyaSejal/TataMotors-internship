const express=require('express');
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
const hbs=require('hbs')
const path=require('path');
const { type } = require('os');

var publicPath=path.join(__dirname,'public');
var app=express();

app.use(bodyParser.json())
app.use(express.static(publicPath));
// var publicPath = path.join('public');

app.use(bodyParser.urlencoded({
  extended : true
}))


//mongoose connection to hospital database

mongoose.connect('mongodb://127.0.0.1:27017/hospital',{
    useNewurlParser:true,
    useUnifiedTopology:true
});

var db=mongoose.connection;

db.on('error',()=>{
    console.log("Error in connection to the database");
});

db.once('open',()=>console.log("connection to Database"));


//GET requests for the 4 pages 

app.get('/',(req,res)=>{
  res.set({
    "Allow-access-Allow-Origin": '*'
})
res.sendFile('public\index.html');
})

app.get('/doctor',(req,res)=>{
  res.sendFile(publicPath + '/doctor.html')
})


app.get('/patient',(req,res)=>{
  res.sendFile(publicPath + '/patient.html')
})


app.get('/admin',(req,res)=>{
  res.sendFile(publicPath + '/admin.html')
})


app.get('/register_success',(req,res)=>{
  res.sendFile(publicPath + '/register_success.html')
})


app.get('/doctorslist',(req,res)=>{
  db.collection('doctors').find({}).toArray((err,result)=>{
    if(err){
      console.log('failed to retrive data');
      throw err;}
      console.log("no error reteiving doctors");
      res.send(result);
      console.log(result);


  });
})

app.get('/patientslist',(req,res)=>{
  db.collection('patients').find({}).toArray((err,result)=>{
    if(err){
      console.log('failed to retrive data');
      throw err;}
      console.log("no error reteiving patients");
      res.send(result);
      console.log(result);


  });
})

app.get('/adminslist',(req,res)=>{
  db.collection('admin').find({}).toArray((err,result)=>{
    if(err){
      console.log('failed to retrive data');
      throw err;}
      console.log("no error reteiving admin");
      res.send(result);
      console.log(result);


  });
})

//POST requests 
app.post("/registerpatient",(req,res)=>{
  var fname=req.body.fname;
  var lname=req.body.lname;
  var ph=req.body.ph;
  var age=req.body.age;
  var email=req.body.email;
  var gender= req.body.gender;
  var confpswd=req.body.confpswd;

  var data={
      "name":fname+" "+lname,
      "email":email,
      "ph":ph,
      "age":age,
      "gender":gender,
      "confpswd" :confpswd


  }
   
  console.log("data",data);

  db.collection('patients').insertOne(data,(err,collection)=>{
      if(err){
          throw err;
      }
      console.log("Record inserted successfully for:"+fname+" "+lname);
  });

  return res.redirect("register_success.html")

})

app.post("/adminregisteration",(req,res)=>{
  var fname=req.body.fname;
  var lname=req.body.lname;
  var ph=req.body.ph;
  var age=req.body.age;
  var email=req.body.email;
  var gender= req.body.gender;
  var confpswd=req.body.confpswd;
  var usertype=req.body.usertype;

  console.log(usertype);

  var data={
      "name":fname+" "+lname,
      "email":email,
      "ph":ph,
      "age":age,
      "gender":gender,
      "confpswd" :confpswd,
      "usertype":usertype


  }

  console.log("usertype check");
    if(String(usertype)=='patient'){
      
      db.collection('patients').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record inserted successfully for:"+fname+" "+lname+" in patients collection");
    });
  
    return res.redirect("register_success.html")
  
    }
     else if(String(usertype)=='doctor'){
      db.collection('doctors').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record inserted successfully for:"+fname+" "+lname+" in doctors collection");
    });
  
    return res.redirect("register_success.html")
  
     }

     else{
      db.collection('admin').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record inserted successfully for:"+fname+" "+lname+" in admin collection");
    });
  
    return res.redirect("register_success.html")
  
     }
  // db.collection('patients').insertOne(data,(err,collection)=>{
  //     if(err){
  //         throw err;
  //     }
  //     console.log("Record inserted successfully for:"+fname+" "+lname);
  // });

  // return res.redirect("register_success.html")

})

app.post('/login',(req,res)=>{
  console.log("req",req.body);
  var usertype=req.body.usertype;
  var phno=req.body.phno;
  var loginpswd= req.body.loginpswd;

  
 

if(String(usertype)=="patient"){
  console.log("patient req",req.body);
  db.collection('patients').findOne({$and: [{'ph': phno},{'confpswd': loginpswd}]},(err,result)=>{
    if(err) throw err;
    else if(!result){
      console.log('patient not found');
      res.redirect("error.html")
    }
    else{
      // 
      console.log("r",result);
      const pname=result.name;
      const pdet=result.age+","+result.gender;
      const pemail=result.email;
      const pno=result.ph;
      const queryParams = `name=${encodeURIComponent(pname)}&pno=${encodeURIComponent(pno)}&email=${encodeURIComponent(pemail)}&det=${encodeURIComponent(pdet)}`;
      console.log(queryParams);
      // res.send(queryParams);
      return res.redirect(`/patient?${queryParams}`)
      // return res.redirect("/patient?name=${result.name}&phone=${result.ph}&email=${result.email}&age={result.age}&gender={result.gender}")
    }
  });
}


else if(String(usertype)=="doctor"){
  console.log('hi from doctor');
  db.collection('doctors').findOne({$and: [{'ph': phno},{'confpswd': loginpswd}]},(err,result)=>{
    if(err) throw err;
    else if(!result){
      console.log('doctor not found')
      res.redirect("error.html")
    }
    else{
      res.redirect("doctor.html")
    }
  });
}

else if(String(usertype)=="admin"){
  db.collection('admin').findOne({$and: [{'ph': phno},{'confpswd': loginpswd}]},(err,result)=>{
    if(err) throw err;
    else if(!result){
      console.log('admin not found')
      res.redirect("error.html")
    }
    else{
      res.redirect("admin.html")
    }
  });
}

})


app.listen(8000,(err)=>{
  if(err){
    console.log(err)
  }
  console.log("Server listening to PORT 8000")
})
