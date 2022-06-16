const express=require('express')
const path=require('path')
const router=express.Router();//like routing ko lagi special
const rootDirectory=require('../utils/pathFinder')
const adminController=require('../controllers/admin');
const { route } = require('express/lib/application');
const { rmSync } = require('fs');
const { runInContext } = require('vm');
const req = require('express/lib/request');

const {body}=require('express-validator')
const isAuth=require('../middleware/isAuth')

router.get('/add-product',isAuth,adminController.getAddProduct)
// // app.post('/message',parser,(req,res)=>{//body-parser package install garera garyo vane function bhitra pass garna pardaina

router.post('/add-product',
    [
        body('title')
            .isString()
            .isLength({min:3})
            .trim(),
        // body('imageUrl')
        //     .isURL(),
        body('price')
            .isFloat(),
        body('description')
            .isLength({min:5, max:400})
            .trim()
    ]
    ,
    isAuth,adminController.postAddProduct)

router.get('/products',isAuth,adminController.getProductsAdmin)

router.get('/edit-product/:id',
        [
        body('title')
            .isString()
            .isLength({min:3})
            .trim(),
        // body('imageUrl')
        //     .isURL(),
        body('price')
            .isFloat(),
        body('description')
            .isLength({min:5, max:400})
            .trim()
        ],
        isAuth,adminController.editProduct)

router.post('/products/:id',
    [
        body('title')
            .isAlphanumeric()
            .isLength({min:3})
            .trim(),
        body('imageUrl').isURL(),
        body('price').isFloat(),
        body('description')
            .isLength({min:5, max:400})
            .trim()
    ],
    isAuth,adminController.postProduct)

router.post('/delete-product/:id',isAuth,adminController.deleteProduct)

// router.get('/products/:id',adminController.editProduct)
module.exports={router};
