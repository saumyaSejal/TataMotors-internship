const express = require('express');
const router = express.Router();
const mongoose=require('mongoose');

// GET route for homepage
router.get('/', (req, res) => {
  res.render('index');
  console.log("index page rendered sucessfully")
});

// GET route for about page
router.get('/patient', (req, res) => {
  res.render('patient');
});

router.get('/doctor', (req, res) => {
    res.render('doctor');
  });

router.get('/admin', (req, res) => {
    res.render('admin');
  });


  mongoose.connect('mongodb://127.0.0.1:27017/hospital', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });


  //db connection code . 
  
  var db = mongoose.connection;
  
  db.on('error', () => {
    console.log("Error in connection to the database");
  });
  
  db.once('open', () => console.log("Connected to the database"));



  app.post("/registerpatient", (req, res) => {
    var fname = req.body.fname;
    var lname = req.body.lname;
    var ph = req.body.ph;
    var age = req.body.age;
    var email = req.body.email;
    var gender=req.body.gender;
  
    var data = {
      "name": fname + " " + lname,
      "email": email,
      "ph": ph,
      "age": age,
      "gender":gender
  
    };
  
    db.collection('patients').insertOne(data, (err, collection) => {
      if (err) {
        console.log("Error inserting record:", err);
        return res.status(500).send("Error inserting record");
      }
      console.log("Record inserted successfully for: " + fname + " " + lname);
      return res.status(200).send("Form data submitted successfully");
    });
  });


  app.post("/loginuser", (req, res) => {
    var usertype=req.body.usertype;
    var ph = req.body.ph;
    
  
    var data = {
      "usertype": usertype,
      "ph": ph,
    };
    
    db.collection('patients').findOne({ph :'ph'}, (err, collection) => {
      if (err) {
        console.log("Error finding  record:", err);
        return res.status(500).send("Error finding record");
      }
      console.log("Record inserted successfully for: " + fname + " " + lname);
      return res.status(200).send("Form data submitted successfully");
    });
  });




module.exports = router;




