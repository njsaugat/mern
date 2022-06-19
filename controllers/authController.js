const User = require("../models/user")
const mailchimp = require("@mailchimp/mailchimp_marketing");
const nodemailer=require('nodemailer')
const crypto=require('crypto')
const mongodb=require('mongodb')
const mongoose=require('mongoose')

const {validationResult}=require('express-validator')
const transporter= nodemailer.createTransport({
    service:"hotmail",
    // port:587,
    // secure:false,
    auth:{
        user:"njsaugat@outlook.com",
        pass:"$Saugat2058"
    }
})

// let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: testAccount.user, // generated ethereal user
//       pass: testAccount.pass, // generated ethereal password
//     },
//   });

const bcrypt=require('bcryptjs') 

const getLogin=(req,res,next)=>{
    // const isLoggedIn=req.get('Cookie').trim().split('=')[1]
    const isLoggedIn=true
    let message=req.flash('error')
    if(message.length<=0){
        message=null
    }
    res.render('auth/login',{
        docTitle:'Login',
        errorMessage:message,
        oldInput:{
            email:'',
            password:''
        },
        validationErrors:[]
    })
}

const postLogin=(req,res,next)=>{
    // res.setHeader('Set-Cookie','loggedIn=true;')//loggedIn=true; Expires= new Date.now() ; Max-age= 10; Secure;HttpOnly
    // req.isLoggedIn=true;
    
    //session:
    // console.log(req.session._id)
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422)//validation failed
                .render('auth/login',{
                    docTitle:'Signup',
                    isAuthenticated:false, 
                    errorMessage:errors.array()[0].msg,
                    oldInput:{
                        email:req.body.email,
                        password:req.body.password
                    },
                    validationErrors:errors.array()
                })
    }
    User.findOne({email:req.body.email})
        .then(async (user)=>{
            if(!user){
                // req.flash('error','Invalid email or password ')
                return res.status(422)//validation failed
                .render('auth/login',{
                    docTitle:'Signup',
                    isAuthenticated:false, 
                    errorMessage:'Invalid email or password ',
                    oldInput:{
                        email:req.body.email,
                        password:req.body.password
                    },
                    validationErrors:[]
                })
            }
            // const password=req.body.password.toString();
            // const pass=await bcrypt.hash(req.body.password.toString(),12)
            // console.log(user.password)
            // console.log(pass)
            bcrypt.compare(req.body.password,user.password)
                .then(doMatch=>{
                    if(doMatch){
                        req.session.isLoggedIn=true
                        req.session.user=user;
                        return req.session.save((err)=>{//making sure we save to db and then redirect ie making it async
                            console.log(err)
                            res.redirect('/')
                         })
                    }else{
                        return res.render('auth/login',{
                            docTitle:'Signup',
                            isAuthenticated:false, 
                            errorMessage:'Invalid email or password ',
                            oldInput:{
                                email:req.body.email,
                                password:req.body.password
                            },
                            validationErrors:[]
                        })
                        
                    }       
                })
                .catch(err=>console.log(err))
        })
        .catch(err=>console.log(err))

}
const postLogout=(req,res,next)=>{
    req.session.destroy((err)=>{
        console.log(err)
        res.redirect('/')
    })
}

const getSignup=(req,res,next)=>{
    let message=req.flash('error')
    if(message.length<=0){
        message=null
    }
    res.render('auth/signup',{
        docTitle:'Signup',
        isAuthenticated:false, 
        errorMessage:message,
        oldInput:{email:'',
            password:'',
            confirmPassword:''},
        validationErrors:[]
    })
}
const postSignup=(req,res,next)=>{
    const email=req.body.email
    const password=req.body.password;
    const confirmPassword=req.body.confirmPassword;
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422)//validation failed
                .render('auth/signup',{
                    docTitle:'Signup',
                    isAuthenticated:false, 
                    errorMessage:errors.array()[0].msg,
                    oldInput:{email:req.body.email,
                        password:req.body.password,
                        confirmPassword:req.body.confirmPassword},
                    validationErrors:errors.array()
                })
    } 
    User.findOne({email:email})
        .then(user=>{
            if(user){//user already exists->no need to signup
                req.flash('error','E-mail exists already, use another to signup!')
                return res.redirect('/signup') 
            }
            return bcrypt
            .hash(password,12)            
            .then(hashedPassword=>{
                const newUser=new User({
                    email,
                    password:hashedPassword,
                    cart:{items:[]}    
                })
                console.log(newUser)
                return newUser.save()
                
            })
        })
        .then(result=>{
            if(result){
                res.redirect('/login')
                return transporter.sendMail({
                    to:email,
                    from:'njsaugat@outlook.com',
                    subject:'Signup succeeded',
                    html:'<h1>You successfully signed up!!</h1>'
                })        
            }
        
        })
        .catch(err=>console.log(err))
}

const getReset=(req,res,next)=>{
    let message=req.flash('error')
    if(message.length<=0){
        message=null
    }
    res.render('auth/passwordReset',{
        docTitle:'Reset Password',
        isAuthenticated:false, 
        errorMessage:message
    })
}

const postReset=(req,res,next)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
            return res.redirect('/reset')
        }
        const token =buffer.toString('hex')
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                req.flash('error','No email found')
                return res.redirect('/reset')
            }
            user.resetToken=token;
            user.tokenExpiration=Date.now()+3600000  
            return user.save()
            
            
        })
        .then(result=>{
            if(!result){return}
            res.redirect('/')
            transporter.sendMail({
                to:req.body.email,
                from:'njsaugat@outlook.com',
                subject:'Password reset',
                html:`
                    <p>You requested a password reset</p>
                    <p>Click this
                        <a href="http://localhost:3000/reset/${token}">link</a>
                     to set a new password</p>
                `
            }) 
        })
        .catch(err=>console.log(err))
    })
}


const getNewPassword=(req,res,next)=>{
    // (req.params.token
    let message=req.flash('error')
    if(message.length<=0){
        message=null
    }
    User.findOne({resetToken:req.params.token,tokenExpiration:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            req.flash('error','No user found')
            return res.redirect('/reset')
        }
        return res.render('auth/newPassword',{
            docTitle:'Change Password',
            isAuthenticated:false, 
            errorMessage:message,
            userId:user._id.toString(),
            passwordToken:user.resetToken
        })
    })
}

const postNewPassword=(req,res,next)=>{
    // console.log(req.body.userId.toString('hex'))
    let resetUser;
    const userId=mongoose.Types.ObjectId(req.body.userId.trim());
    console.log(mongoose.Types.ObjectId.isValid(userId))
    // if (userId.match(/^[0-9a-fA-F]{24}$/)) {
    User.findOne({
                    // resetToken:req.body.passwordToken,
                    _id:userId,
                    // tokenExpiration:{$gt:Date.now()}
                })
    .then((user)=>{
        console.log(user)
        resetUser=user;
        const password=req.body.password.toString();
        return bcrypt.hash(password,12) 
    })
    .then(hashedPassword=>{
        resetUser.password=hashedPassword
        resetUser.resetToken=undefined
        resetUser.tokenExpiration=undefined
        return resetUser.save()
    })
    .then(result=>{
        res.redirect('/login')
    })
    .catch(err=>console.log(err))
    // }
    // return res.redirect('/')
}
module.exports={
    getLogin,
    postLogin,
    postLogout,
    getSignup,
    postSignup,
    getReset,
    postReset,
    getNewPassword,
    postNewPassword
}