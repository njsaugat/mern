const express=require('express')
const path=require('path')
const router=express.Router();//like routing ko lagi special
const rootDirectory=require('../utils/pathFinder')
const adminController=require('../controllers/admin');
const { route } = require('express/lib/application');
const { rmSync } = require('fs');
const { runInContext } = require('vm');
const req = require('express/lib/request');

router.get('/add-product',adminController.getAddProduct)
// app.post('/message',parser,(req,res)=>{//body-parser package install garera garyo vane function bhitra pass garna pardaina

router.post('/add-product',adminController.postAddProduct)

router.get('/products',adminController.getProductsAdmin)

router.get('/edit-product/:id',adminController.editProduct)

router.post('/products/:id',adminController.postProduct)

router.post('/delete-product/:id',adminController.deleteProduct)

// router.get('/products/:id',adminController.editProduct)
module.exports={router};
