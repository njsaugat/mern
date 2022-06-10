const getLogin=(req,res,next)=>{
    // const isLoggedIn=req.get('Cookie').trim().split('=')[1]
    const isLoggedIn=true
    console.log(req.session.isLoggedIn)
    res.render('auth/login',{
        docTitle:'Login',
        isAuthenticated:isLoggedIn
    })
}

const postLogin=(req,res,next)=>{
    // res.setHeader('Set-Cookie','loggedIn=true;')//loggedIn=true; Expires= new Date.now() ; Max-age= 10; Secure;HttpOnly
    
    //session:
    req.session.isLoggedIn=true

    // req.isLoggedIn=true;
    res.redirect('/')
}
module.exports={
    getLogin,
    postLogin
}