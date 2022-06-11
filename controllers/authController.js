const User = require("../models/user")

const getLogin=(req,res,next)=>{
    // const isLoggedIn=req.get('Cookie').trim().split('=')[1]
    const isLoggedIn=true
    console.log(req.session.isLoggedIn)
    res.render('auth/login',{
        docTitle:'Login',
        isAuthenticated:req.session.isLoggedIn
    })
}

const postLogin=(req,res,next)=>{
    // res.setHeader('Set-Cookie','loggedIn=true;')//loggedIn=true; Expires= new Date.now() ; Max-age= 10; Secure;HttpOnly
    // req.isLoggedIn=true;
    
    //session:
    User.findById('62a0a9a9e6247f61284f23dc')
        .then(user=>{
            req.session.isLoggedIn=true
            req.session.user=user;
            req.session.save((err)=>{//making sure we save to db and then redirect ie making it async
                console.log(err)
                res.redirect('/')
            })
        })
        .catch(err=>console.log(err))

}
const postLogout=(req,res,next)=>{
    req.session.destroy((err)=>{
        console.log(err)
        res.redirect('/')
    })
}

module.exports={
    getLogin,
    postLogin,
    postLogout
}