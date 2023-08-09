const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
    name : {type:String, require:true},
    email : {type:String, require:true, unique:true},
    password : {type:String, require:true},
    avatar : {type:String, require:true},
    isAdmin : {type:Boolean, dafault:false},
    created : {type:Date, dafault:Date.now()},
});

let User = mongoose.model('user', UserSchema);  
module.exports = User;
