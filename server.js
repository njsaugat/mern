
const express=require('express');
const flash=require('connect-flash')
const session=require('express-session')
const cookieParser=require('cookie-parser')

const app=express();
const path=require('path');
const { getErrors } = require('./controllers/errors');
const User=require('./models/user')

const multer=require('multer')
 
const MongoDBStore=require('connect-mongodb-session')(session)//above line's session pass as arg here 


const sessionStore=new MongoDBStore({
    uri:'mongodb://127.0.0.1:27017/shops',  
    collection:'sessions'
})


const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images')
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString()+''+file.originalname  )
    }
})

const fileFilter=(req,file, cb)=>{
    if(file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg'){
        cb(null,true )
    }else{
        cb(null,true )
    }
}

app.set('view engine','ejs');
app.set('views','viewsEjs')//to set views to viewsEjs folder;but by default it's set to views; since we already has views set up; created viewsEjs

const mongoose=require('mongoose');

const bodyParser=require('body-parser')


// const csrf=require('csurf')

// const csrfProtect=csrf({cookie:true})

// const csrfProtection=csrf()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(multer({storage:fileStorage, fileFilter:fileFilter}).single('image'))
app.use(express.static(path.join(__dirname)))
app.use(express.static(path.join(__dirname,'images')))

app.use(cookieParser())
app.use(session({
    secret:'my secret',
    resave:false, 
    saveUninitialized:false,
    store:sessionStore
}))//here we can also configure cookie 
 
// app.use(csrfProtection)

app.use(flash())

app.use((req,res,next)=>{//passing the user data through the middleware
    if(!req.session.user){//initially session xaina vane yaha bata redirect hune
        return next()
    }
    User.findById(req.session.user._id)//but how will this return user while running this app for first time 
    .then((user)=>{
        req.user=user;//every req will have user data
        next();
    })
    
})

app.use((req,res,next)=>{
    res.locals.isAuthenticated=req.session.isLoggedIn;
    // var token=req.csrfToken()
    // res.cookie('XSRF-TOKEN',token)
    // res.locals.csrfToken=token
    // res.locals.csrfToken=req.csrfToken();
    next()
})

//login->server->upper middleware(found user with session id)->controllers
const {router}  = require('./routes/admin');
const routerShop  = require('./routes/shop');
const authRoutes=require('./routes/auth')


app.use('/admin',router);//middleware to kinda bring the router
app.use('/',routerShop)//like the default page
app.use(authRoutes)

app.use(getErrors)


const PORT=process.env.PORT||3000;

  
mongoose.connect('mongodb://127.0.0.1:27017/shops')  
    .then(result=>{
        app.listen(PORT,()=>(console.log(`Serving from port no. ${PORT}`)))
    }).catch(err=>console.log(err))

// depracated:
// mongoose.connect('mongodb://127.0.0.1:27017/shops')  
//     .then(result=>{
//         User.findOne().then(user=>{
//             if(!user){
//                 console.log()
//                 const user=User.create({
//                     name:'Saugat',
//                     email:'saugat@mail.com',  
//                     cart:{
//                         item:[]
//                     }
//                 })
//             }
//         })
//         app.listen(PORT,()=>(console.log(`Serving from port no. ${PORT}`)))
//     }).catch(err=>console.log(err))

