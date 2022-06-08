const bodyParser=require('body-parser')
const express=require('express');
const {router}  = require('./routes/admin');
const routerShop  = require('./routes/shop');
const app=express();
const path=require('path');
const { getErrors } = require('./controllers/errors');
const User=require('./models/user')

const {mongoConnect}=require('./utils/database')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname)))

app.use((req,res,next)=>{//passing the user data through the middleware
    User.findById('629eef1ca6257904323e2b19')//but how will this return user while running this app for first time 
    .then((user)=>{
        req.user=new User(user._id,user.name,user.email,user.cart);
        console.log(user)
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

  
mongoConnect(()=>{
    console.log()
    app.listen(PORT,()=>(console.log(`Serving from port no. ${PORT}`)))
    
})   
    

// depracated:

