const express=require('express')

const router=express.Router()

const {check, body}=require('express-validator')

const authController=require('../controllers/authController')

router.get('/login',authController.getLogin)

router.post('/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address')
            .normalizeEmail(),
        body('password','Password has to be valid')
            .isLength({min:5})
            .isAlphanumeric()
        
    ],
        authController.postLogin)

router.post('/logout',authController.postLogout)

router.get('/signup',authController.getSignup)

router.post('/signup',
    [    
    check('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail( )
        // .custom((value,{req})=>{==> for custom 
        //     if(value==='test@test.com'){
        //         throw new Error('This email is forbidden')
        //     }
        //     return true
        // })
        ,
    body(
        'password',
        'Please enter a password with only numbers and text and at least 5 characters'//->passed as dft error
        )
        .isLength({min:5})
        .isAlphanumeric()
        .trim(),
    body('confirmPassword')
        .custom((value,{req})=>{
            if(value!==req.body.password){
                throw new Error('Passwords have to match')
            }
            return true
        })

    ]
        ,authController.postSignup)

router.get('/reset',authController.getReset )

router.post('/reset',authController.postReset )

router.get('/reset/:token',authController.getNewPassword )

router.post('/new-password',authController.postNewPassword)

module.exports=router