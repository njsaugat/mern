// const adminData  = require('./admin')

// const Cart = require('../models/cart');
const Product=require('../models/productData');
const User = require('../models/user');
// let products=require('../data/productsData.json')
// const Order=require('../models/order')
// const CartItem=require('../models/cartItem')
const getProducts=(req, res,next) => {
    // Product.findAll()//built in method in sequelize
    Product.fetchAll()
    .then((products)=>{
        res.render('shop/product-list',{
            products:products,
            docTitle:'Shop',
            hasProducts:products.length>0
            });
    })
    .catch(err=>console.log(err))}


const getProduct= (req,res,next)=>{
    Product.findById(req.params.id)
    .then((product)=>{//sequelize auto gives only one product
        res.render('shop/product-detail',{
            product,
            docTitle:'Product Details',
        })
    })
    .catch()
    

}



const getIndex=(req,res,next)=>{
    Product.fetchAll()//built in method in sequelize
    .then((products)=>{
        res.render('shop/index',{
            products:products,
            docTitle:'Shop',
            hasProducts:products.length>0,
            });
    })
    .catch(err=>console.log(err))
      
}

const postCart=(req,res,next)=>{
    // const user=User('sau','sau@mail.com',{items:[]})
    const user=req.user
    Product.findById(req.params.id)
        .then(product=>{
            return user.addToCart(product)
        })
        .then(user=>{
            console.log('cart updated')
            res.redirect('/')
        })
        .catch(err=>{
            console.log(err)
        })    
}

const getCart=(req,res,next)=>{
    let products=[];
    let index=0;
    req.user.cart.items.forEach(item=>{
        Product.findById(item.productId)//make index auto
        .then(product=>{
            index++;
            products.push({...product,quantity:item.quantity})
            if(index===(req.user.cart.items.length)){
                res.render('shop/cart',{
                    docTitle:'Your Cart',
                    products:products
                })
            }
        })
        .catch(err=>{
            console.log(err)
        })
        

    })
    

}

// const getCart=(req,res,next)=>{
//     req.user
//         .getCart()
//         .then(cart=>{
//             return cart.getProducts();
//         })
//         .then(cartProducts=>{
//             res.render('shop/cart',{
//                 docTitle:'Your Cart',
//                 products:cartProducts
//             })

//         }) 
//         .catch(err=>console.log(err))
    
// }

// const postCart= (req,res,next)=>{
//     const prodId=req.params.id;
//     let fetchedCart;
//     let newQuantity=1;
//     req.user
//         .getCart()
//         .then(cart=>{
//             fetchedCart=cart;
//             return cart.getProducts({where:{id:prodId}})
//         })
//         .then(products=>{
//             let product;
//             if(products.length>0){
//                 product=products[0];
//             }
            
//             if(product){
//                 const oldQuantity=product.cartItem.quantity;
//                 newQuantity=oldQuantity+1;
//                 return product;
//             }
//             return Product.findByPk(prodId)
//                     // .then(product=>{
//                     //     return fetchedCart.addProduct(product, {
//                     //         through:{quantity:newQuantity}
//                     //     })
//                     // })
//                     // .catch(err=>console.log(err));
            
//         })
//         .then(product=>{
//             return fetchedCart.addProduct(product, {
//                 through:{quantity:newQuantity}
//             })
//         })
//         .then(()=>{
//             res.redirect('/')
//         })
//         .catch(err=>console.log(err))

// }

// const postCartDelete=(req,res,next)=>{
//     const productId=req.body.productId;
//     req.user
//         .getCart()
//         .then(cart=>{
//             return cart.getProducts({where:{id:productId}})
//         })
//         .then(products=>{
//             const product=products[0];
//             return product.cartItem.destroy();
//         }).then(result=>{
//             res.redirect('/cart') 
//         })
//         .catch(err=>console.log(err))
   
// }
// const getOrder=(req,res,next)=>{
//     req.user.getOrders({include:['products']})
//     .then(orders=>{
//         res.render('shop/orders',{
//             orders,
//             docTitle:'Your Order'
//         })
//     })
//     .catch(err=>console.log(err))
    
// }

// const postOrder=(req,res,next)=>{
//     let fetchedCart;
//     req.user
//         .getCart()
//         .then(cart=>{
//             fetchedCart=cart;
//             return cart.getProducts()
//         })
//         .then(products=>{
//             return req.user.createOrder();
//         })
//         .then(order=>{
//             order.addProducts(products.map(product=>{
//                 product.orderItem={quantity:product.cartItem.quantity }
//                 return product;
//             }))
//         })
//         .then(result=>{
//             return fetchedCart.setProducts(null);
//         })
//         .then(result=>{
//             res.redirect('/orders')

//         })
        
//         .catch(err=>console.log(err))
// }
// const getCheckout=(req,res,next)=>{
//     res.render('shop/checkout',{
//         docTitle:'Chekout'
//     })
// }


module.exports={
    getProducts,
    getIndex,
    getProduct,
    // getCheckout,
    // postCartDelete,
    getCart,
    postCart,
    // getOrder,
    // postOrder
}

