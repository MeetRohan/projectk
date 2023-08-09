const express =  require('express');
const app = express();
const cors = require('cors');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

//configure cors with express

app.use(cors());    
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// configure DOTENV
dotEnv.config({path:'./config/config.env'});

const port =  process.env.PORT || 5000;


//connect to mongo db
mongoose.connect(process.env.MONGODB_CLOUD_URL).then((response)=>{
     console.log('connection to mongo db is successful');
}).catch((error)=>{
    console.error(error);
    process.exit(1); // stops the Node Js process;
});

//for React Application Homepage
app.use(express.static(path.join(__dirname,'frontend','build')));
app.get('/',(request,response)=>{
    response.sendFile(path.join(__dirname,'frontend','build','index.html'));
});

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,'frontend','build')));
    app.get('/',(request,response)=>{
        response.sendFile(path.join(__dirname,'frontend','build','index.html'));
    });
}


// router configuration 
app.use('/user',require('./router/userRouter'));

app.listen(port, ()=>{
    console.log(`Express Server is started.....`)
})
