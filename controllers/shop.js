// // const adminData  = require('./admin')

// // const Cart = require('../models/cart');
// const Product=require('../models/productData');
// const User = require('../models/user');
// // let products=require('../data/productsData.json')
// // const Order=require('../models/order')
// // const CartItem=require('../models/cartItem')
// const getProducts=(req, res,next) => {
//     // Product.findAll()//built in method in sequelize
//     Product.fetchAll()
//     .then((products)=>{
//         res.render('shop/product-list',{
//             products:products,
//             docTitle:'Shop',
//             hasProducts:products.length>0
//             });
//     })
//     .catch(err=>console.log(err))}


// const getProduct= (req,res,next)=>{
//     Product.findById(req.params.id)
//     .then((product)=>{//sequelize auto gives only one product
//         res.render('shop/product-detail',{
//             product,
//             docTitle:'Product Details',
//         })
//     })
//     .catch()
    

// }



// const getIndex=(req,res,next)=>{
//     Product.fetchAll()//built in method in sequelize
//     .then((products)=>{
//         res.render('shop/index',{
//             products:products,
//             docTitle:'Shop',
//             hasProducts:products.length>0,
//             });
//     })
//     .catch(err=>console.log(err))
      
// }

// const postCart=(req,res,next)=>{
//     // const user=User('sau','sau@mail.com',{items:[]})
//     const user=req.user
//     Product.findById(req.params.id)
//         .then(product=>{
//             return user.addToCart(product)
//         })
//         .then(user=>{
//             console.log('cart updated')
//             res.redirect('/')
//         })
//         .catch(err=>{
//             console.log(err)
//         })    
// }
// // const renderCart=(req,res,next,products)=>{
// //     res.render('shop/cart',{
// //         docTitle:'Your Cart',
// //         products:products
// //     })
// //     next();
// // }

// const getCart=(req,res,next)=>{
//     let products=[];
//     let index=0;
//     if(req.user.cart.items.length===0){
//         res.render('shop/cart',{
//             docTitle:'Your Cart',
//             products:[]
//         })
//     }
//     req.user.cart.items.forEach(item=>{
//         Product.findById(item.productId)//make index auto
//         .then(product=>{
//             index++;
//             products.push({...product,quantity:item.quantity})
//             if(index===(req.user.cart.items.length)){
//                 res.render('shop/cart',{
//                     docTitle:'Your Cart',
//                     products:products
//                 })
//             }
//         })
//         .catch(err=>{
//             console.log(err)
//         })
        

//     })
    

// }

// const postCartDelete=(req,res,next)=>{
//     req.user.removeFromCart(req.params.id)
//         .then(deleted=>{
//             res.redirect('/')
//         })
// }
// const postOrder=(req,res,next)=>{
//     req.user
//         .addOrder()
//         .then(result=>{
//             console.log('in postOrder')
//             res.redirect('/')
//         })
// }

// const getOrder=(req,res,next)=>{
//     let index=0
//     let products=[] 
//     req.user.getOrders(req.user._id)
//         .then(orders=>{
//             console.log(orders)
//             if(orders.items.length===0 ){
//                 res.render('shop/orders',{
//                     docTitle:'Your Cart',
//                     products:[]
//                 })
//             }
//             orders.items.forEach(item=>{
//                 Product.findById(item.productId)//make index auto
//                 .then(product=>{
//                     index++;
//                     products.push({...product,quantity:item.quantity})
//                     if(index===(orders.items.length)){
//                         res.render('shop/orders',{
//                             docTitle:'Your Cart',
//                             products:products
//                         })
//                     }
//                 })
//             })
//         })
// }



// // const getOrder=(req,res,next)=>{
// //     req.user.getOrders({include:['products']})
// //     .then(orders=>{
// //         res.render('shop/orders',{
// //             orders,
// //             docTitle:'Your Order'
// //         })
// //     })
// //     .catch(err=>console.log(err))
    
// // }

// // const postOrder=(req,res,next)=>{
// //     let fetchedCart;
// //     req.user
// //         .getCart()
// //         .then(cart=>{
// //             fetchedCart=cart;
// //             return cart.getProducts()
// //         })
// //         .then(products=>{
// //             return req.user.createOrder();
// //         })
// //         .then(order=>{
// //             order.addProducts(products.map(product=>{
// //                 product.orderItem={quantity:product.cartItem.quantity }
// //                 return product;
// //             }))
// //         })
// //         .then(result=>{
// //             return fetchedCart.setProducts(null);
// //         })
// //         .then(result=>{
// //             res.redirect('/orders')

// //         })
        
// //         .catch(err=>console.log(err))
// // }
// // const getCheckout=(req,res,next)=>{
// //     res.render('shop/checkout',{
// //         docTitle:'Chekout'
// //     })
// // }


// module.exports={
//     getProducts,
//     getIndex,
//     getProduct,
//     // getCheckout,
//     postCartDelete,
//     getCart,
//     postCart,
//     getOrder,
//     postOrder
// }

