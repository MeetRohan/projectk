const express = require('express');
const router = express.Router();
const {check, validationResult}  = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv');
const jwt = require('jsonwebtoken');  
dotEnv.config({path:'./config/config.env'});
const authenticate = require('../middlewares/authenticate');
/*
    Register a User
    URL : /user/register
    METHOD: POST
    Access Public    
*/

router.post('/register',[
    check('name').notEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Enter a valid and unique email'),
    check('password').isLength({min:6}).withMessage('Enter a valid password'), 
], async (request,response)=>{
    let errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(401).json({errors:errors.array()});
    }
    try{
        // read the form data
        let {name,email,password} =  request.body;
        // user already exists or not
        let user = await User.findOne({email:email});
        if(user){
            return response.status(401).json({errors:[{msg:'User Already Exits'}]});
        }

        let salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password,salt);

        // avatar image for email
        

        user = new User({name, email,password});

        user = await user.save();

        response.status(200).json({
            result:'success',
            user:user
        });

    }catch(error){
        console.error(error);
        response.status(500).json({errors:[{msg:'server error'}]});
    }
});

/*
    Login User
    URL : /user/login
    METHOD: POST
    Access Public    
*/

router.post('/login',[
    check('email').isEmail().withMessage('Enter a valid and unique email'),
    check('password').isLength({min:6}).withMessage('Enter a valid password')
], async (request,response)=>{
    let errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(401).json({errors:errors.array()});
    }

    try{
        let {email,password} =  request.body;
        let user = await User.findOne({email:email});
        if(!user){
            return response.status(401).json({errors:[{msg:'Invalid crediential'}]});
        }

        let isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return response.status(401).json({errors:[{msg:'Invalid crediential'}]});
        }

        let payload = {
            user:{
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET_KEY,(err,token)=>{
            if(err) throw err;
            response.status(200).json({
                result : 'Login Success',
                token  : token
            });
        });
    }catch(error){
        console.error(error);
        response.status(500).json({errors:[{msg:'server error'}]});
    }
});

/*
    Get User Info
    URL : /user
    METHOD: POST
    Access Private    
*/

router.get('/', authenticate, async(request,response)=>{
    try{

        let user = await User.findById(request.user.id).select('-password');
        response.status(200).json(user);
    }catch(error){
        console.error(error);
        response.status(500).json({errors:[{msg:'server error'}]});
    }
})
module.exports = router;