const express = require("express");
const router = express.Router();
const path=require('path');
// const adminData  = require('./admin');
const rootDirectory=require('../utils/pathFinder')
const shopController=require('../controllers/shop');
const { route } = require("express/lib/application");
router.get('/',shopController.getIndex);

router.get('/products',shopController.getProducts);

router.get('/products/:id', shopController.getProduct)//dynamic routes has to at lat

// // router.get('/products/delete')


router.get('/cart',shopController.getCart);

router.post('/add-to-cart/:id',shopController.postCart)

router.post('/cart-delete-item/:id',shopController.postCartDelete)

router.get('/orders',shopController.getOrder);

router.post('/create-order',shopController.postOrder)

// router.get('/checkout',shopController.getCheckout)


module.exports = router;
