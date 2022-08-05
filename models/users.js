const mongoose= require('mongoose')
let userSchema= new mongoose.Schema({
    name:String,
    email:String,
    department:String,
    address:String,
    password:String,
})

module.exports=mongoose.model('users',userSchema)