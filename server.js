const bodyParser=require('body-parser')
const express=require('express');
const {router}  = require('./routes/admin');
const routerShop  = require('./routes/shop');
const app=express();
const path=require('path');
const { getErrors } = require('./controllers/errors');
const User=require('./models/user')

const mongoose=require('mongoose');
 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname)))

app.use((req,res,next)=>{//passing the user data through the middleware
    User.findById('62a0a9a9e6247f61284f23dc')//but how will this return user while running this app for first time 
    .then((user)=>{
        req.user=new User(user);//every req will have user data
        next();
    })
    // next()
})


 


app.set('view engine','ejs');
app.set('views','viewsEjs')//to set views to viewsEjs folder;but by default it's set to views; since we already has views set up; created viewsEjs


app.use('/admin',router);//middleware to kinda bring the router
app.use('/',routerShop)//like the default page


app.use(getErrors)


const PORT=process.env.PORT||3000;

  
mongoose.connect('mongodb://127.0.0.1:27017/shops')  
    .then(result=>{
        User.findOne().then(user=>{
            if(!user){
                console.log()
                const user=User.create({
                    name:'Saugat',
                    email:'saugat@mail.com',  
                    cart:{
                        item:[]
                    }
                })
            }
        })
        app.listen(PORT,()=>(console.log(`Serving from port no. ${PORT}`)))
    }).catch(err=>console.log(err))

// depracated:

