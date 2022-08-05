const express= require('express');
const app=express();
const mongoose= require('mongoose');
const User=require('./models/users')

const dotenv = require('dotenv');
var bodyParser = require('body-parser');
var jsonParser= bodyParser.json();
var crypto = require('crypto');
var key="password";
var algo='aes256';

const jwt= require('jsonwebtoken')
jwtKey="jwt"


app.post('/register',jsonParser,function(req,res){
    var cipher= crypto.createCipher(algo,key);
    var encrypted=cipher.update(req.body.password,'utf8','hex')
    +cipher.final('hex');
    console.warn(encrypted)
    const data= new User({
       _id:mongoose.Types.ObjectId(),
       name:req.body.name,
       email:req.body.email,
       department:req.body.department,
       address:req.body.adress,
       password:encrypted,

    })
    data.save().then((result)=>{
        jwt.sign({result},jwtKey,{expiresIn:'400s'},(err,token)=>{
        res.status(201).json({token})
    })

 })

    .catch((err)=>console.warn(err))
    

})

app.post('/login',jsonParser,function(req,res){
    User.findOne({email:req.body.email}).then((data)=>{
        var decipher=crypto.createDecipher(algo,key);
        var decrypted=decipher.update(data.password,'hex','utf8')+
        decipher.final('utf8');
        if(decrypted==req.body.password)
        {
            jwt.sign({data},jwtKey,{expiresIn:'400s'},(err,token)=>{
                res.status(201).json({token})
            })
        }
  
      
    })
})

app.get('/users',verifyToken,function(req,res){
User.find().then((result)=>{
res.status(200).json(result)

})
})

function verifyToken(req, res, next) { 
    const bearerHeader = req.headers['authorization'];
   if (typeof bearerHeader !== 'undefined') { 
    const bearer = bearerHeader.split(' ')
    console.warn(bearer [1]) 
    req.token = bearer [1] 
    jwt.verify(req.token, jwtKey, (err, authData) => {
        if (err) {
            res.json({ result: err })
        }
        else {
            next();
        }
    })
}
else {
    res.send({ "result": "Token not provied" })
}
}


const connectDB = require('./config/db');
dotenv.config({ path: './config/config.env'});
connectDB();
app.listen(5000);
