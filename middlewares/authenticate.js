const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');
dotEnv.config({path:'./config/config.env'});

let authenticate = (request,resposne,next)=>{
    if(!request.headers.authorization){
        return resposne.status(401).send('Unthorized Request');
    }

    let token = request.headers.authorization.split(' ')[1];

    if(token === null){
        return resposne.status(401).send('Unthorized Request');
    }

    let payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if(!payload){
        return resposne.status(401).send('Unthorized Request');
    }

    request.user = payload.user;
    next();
};

module.exports =  authenticate;