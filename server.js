const bodyParser=require('body-parser')
const express=require('express');
const {router}  = require('./routes/admin');
const routerShop  = require('./routes/shop');
const app=express();
const path=require('path');
const { getErrors } = require('./controllers/errors');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname)))
app.use((req,res,next)=>{//passing the user data through the middleware
    // User.findByPk(1)//but how will this return user while running this app for first time 
    // //it will do so bcz middleware ta suru ma register matra ta hune ho; pahila ta sequelize ko tala ko code run hunxa
    // .then((user)=>{//above stuff returned a promise
    //     req.user=user;//req euta object ho; tei object mai user vanera haldine;new field added in req;req.user is sequelize object so sequelize's api can be added
        // })
    next();
})


const {mongoConnect}=require('./utils/database') 

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

