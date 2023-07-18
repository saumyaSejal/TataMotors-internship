const express=require("express")
const mongoose=require("mongoose")
const bodyParser=require("body-parser")

const app = express()
app.use(bodyParser.json())
app.use(express.static('public'))

app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://127.0.0.1:27017/hospital',{
    useNewurlParser:true,
    useUnifiedTopology:true
});

var db=mongoose.connection;

db.on('error',()=>{
    console.log("Error in connection to the database");
});

db.once('open',()=>console.log("connection to Database"));

app.post("/registerpatient",(req,res)=>{
    var fname=req.body.fname;
    var lname=req.body.lname;
    var ph=req.body.ph;
    var age=req.body.age;
    var email=req.body.email;
    // var gender= req.body.gen;

    var data={
        "name":fname+" "+lname,
        "email":email,
        "ph":ph,
        "age":age


    }

    db.collection('patients').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record inserted successfully for:"+fname+" "+lname);
    });

    return res.redirect("register_success.html")

})

app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('index.html')
}).listen(7000);
console.log("listening to PORT 7000")
