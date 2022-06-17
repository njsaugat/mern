const express = require("express");
const router = express.Router();
const path=require('path');
// const adminData  = require('./admin');
const rootDirectory=require('../utils/pathFinder')
const shopController=require('../controllers/shop');
const { route } = require("express/lib/application");

const isAuth=require('../middleware/isAuth')

router.get('/',shopController.getIndex);

router.get('/products',shopController.getProducts);

router.get('/products/:id', shopController.getProduct)//dynamic routes has to at lat

router.get('/orders/:orderid')
// // router.get('/products/delete')


router.get('/cart',isAuth,shopController.getCart);

router.post('/add-to-cart/:id',isAuth,shopController.postCart)

router.post('/cart-delete-item/:id',isAuth,shopController.postCartDelete)

router.get('/orders',isAuth,shopController.getOrder);

router.post('/create-order',isAuth,shopController.postOrder)

// router.get('/checkout',shopController.getCheckout)


module.exports = router;
