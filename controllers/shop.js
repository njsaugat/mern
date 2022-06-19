// // const adminData  = require('./admin')
 
// // const Cart = require('../models/cart');
const PDFDocument=require('pdfkit')
const fs=require('fs')
const path=require('path')
const Product=require('../models/productData');
const user = require('../models/user');
const User = require('../models/user');
// // let products=require('../data/productsData.json')
const Order=require('../models/order');
const order = require('../models/order');
// // const CartItem=require('../models/cartItem')

const ITEMS_PER_PAGE=2

const getProducts=(req, res,next) => {
    Product.find()
    .then((products)=>{
        res.render('shop/product-list',{
            products:products,
            docTitle:'Shop',
            hasProducts:products.length>0,
            // csrfToken:req.csrfToken()
            });
    })
    .catch(err=>console.log(err))}


const getProduct= (req,res,next)=>{
    Product.findById(req.params.id)
    .then((product)=>{//sequelize auto gives only one product
        res.render('shop/product-detail',{
            product,
            docTitle:'Product Details'
        })
    })
    .catch()
    

}



const getIndex=(req,res,next)=>{
    const page=+req.query.page ||1;
    let totalItems;
    Product.find()
    .countDocuments()
    .then(numProducts=>{
        totalItems=numProducts
        return Product.find()
                    .skip((page-1)*ITEMS_PER_PAGE)
                    .limit(ITEMS_PER_PAGE)
    })
    .then((products)=>{
        res.render('shop/index',{
            products:products,
            docTitle:'Shop',
            hasProducts:products.length>0,
            currentPage:page,
            hasNextPage:ITEMS_PER_PAGE*page<totalItems,
            hasPreviousPage:page>1,
            nextPage:page+1,
            previousPage:page-1,
            lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE)
            });
    })
    .catch(err=>console.log(err))
      
}


  
    

const getCart=(req,res,next)=>{
    let products=[];
    let index=0;
    if(req.user.cart.items.length===0){
        res.render('shop/cart',{
            docTitle:'Your Cart',
            products:[],
        })
    }
    req.user.cart.items.forEach(item=>{
        Product.findById(item.productId)//make index auto
        .then(product=>{
            let actualProduct;
            if(product){
                actualProduct=product._doc
            }
            // else if(typeof(product)===null){
            //     user.cart.items.pop(

            //     )
            // }
            index++;
            products.push({...actualProduct,quantity:item.quantity})
            if(index===(req.user.cart.items.length)){
                res.render('shop/cart',{
                    docTitle:'Your Cart',
                    products:products,
                })
            }
        })
        .catch(err=>{
            console.log(err)
        })
        

    })
    

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
            res.redirect('/cart')
        })
        .catch(err=>{
            console.log(err)
        })    
}





const postCartDelete=(req,res,next)=>{
    req.user.removeFromCart(req.params.id)
        .then(deleted=>{
            res.redirect('/')
        })
}
const postOrder=(req,res,next)=>{
    req.user
    .populate('cart.items.productId')
    .then(user=>{
        console.log(user)
        const products=user.cart.items.map(item=>{
            return { product:item.productId._doc
                ,quantity:item._doc.quantity}
        });
        console.log(products)
        const order=new Order({
            user:{
                email:req.user.email,
                userId:req.user 
            },
            products 
        })
        order.save()
    })
    .then(result=>{
        return req.user.clearCart()
    })
    .then(()=>{
        res.redirect('/')
    })
    .catch(err=>{
        console.log(err)
    })
}
const getOrder=(req,res,next)=>{
    Order.findOne({'user.userId':req.user._id}) 
    .then(orders=>{
            if(!orders){
                return res.render('shop/orders',{
                    docTitle:'Your Cart',
                    products:[]
                })
            }
            // console.log(orders.products)
            const products=orders.products.map(productObj=>{
                return {...productObj.product,quantity:productObj.quantity,orderId:orders._id}
            })
            res.render('shop/orders',{
                docTitle:'Your Cart',
                products,
            })
        })
    .catch(err=>{
        console.log(err)
    })
}

const getInvoice=(req,res,next)=>{
    const orderId=req.params.orderId
    Order.findById(orderId).then(order=>{
        if(!order){
            console.log('No order found')
        }
        if(order.user.userId.toString()!==req.user._id.toString()){//random user shouldn't access
            console.log('No order fromt this user.')
        }
        const invoiceName=`invoice-${orderId}.pdf`
        const invoicePath=path.join(path.dirname(process.mainModule.filename),'data','invoices',invoiceName)

        const pdfDoc=new PDFDocument();
        res.set('Content-Type','application/pdf') 
        pdfDoc.pipe(fs.createWriteStream(invoicePath))
        pdfDoc.pipe(res)

        pdfDoc.fontSize(26).text('Invoice',{
            underline:true
        })
        pdfDoc.fontSize(14).text('--------------------')
        let totalPrice=0
        order.products.forEach(prod=>{
            totalPrice=+prod.quantity*prod.product.price
            pdfDoc.text(
                prod.product.title+
                ' -->    '+
                prod.quantity + 
                ' *  ' + '$' +prod.product.price)
        })
        pdfDoc.fontSize(14).text('--------------------')
        pdfDoc.text(`Total Price $${totalPrice}`)
        pdfDoc.end( )
        //reading file
        // fs.readFile(path.join(path.dirname(process.mainModule.filename)
        // ,'data'
        // ,'invoices'
        // ,invoiceName)
        
        // ,(err,data)=>{
        //     if(err){console.log(err)}
        //     res.set('Content-Type','application/pdf')
        //     res.send(data)
        // }
        // )

        //streaming of the data:
        // const file=fs.createReadStream(invoicePath)
        // res.set('Content-Type','application/pdf') 
        // file.pipe(res)//file--> readable stream only send data; res-->writable stream only write to it;pipe would transfer
    })
}

module.exports={
    getProducts,
    getIndex,
    getProduct,
    // // getCheckout,
    postCartDelete,
    getCart,
    postCart,
    getOrder,
    postOrder,
    getInvoice
}

//other way of getting cart
//other way of getting cart
// const postCart=(req,res,next)=>{
//     // const user=User('sau','sau@mail.com',cart:{items:[{}]})
//     //when having multiple users pahila find out exact user ig in server
//     const user=req.user
//     Product.findById(req.params.id)
//         .then(product=>{
//             let updatedCart=user.cart
//             let quantity;
//             const cartItemIndex=user.cart.items.findIndex(item=>{
//                 return item.productId.toString()===product._id.toString()
//             })
//             console.log(cartItemIndex)
//             if(cartItemIndex>=0){
//                 updatedCart.items[cartItemIndex].quantity++
//             }else{                
//                 updatedCart.items.push(
//                     {productId:product._id,
//                     quantity:1}
//             )
//             }
//             return User.findOneAndUpdate({_id:user._id},{cart:updatedCart})
//         })
//         .then(user=>{
//             console.log('cart updated')
//             res.redirect('/')
//         })
//         .catch(err=>{
//             console.log(err)
//         })    
// }

//getting cart ig:
  // let products=[];
    // let index=0;
    // if(req.user.cart.items.length===0){
    //     res.render('shop/cart',{
    //         docTitle:'Your Cart',
    //         products:[]
    //     })
    // }
    // req.user.cart.items.forEach(item=>{
    //     Product.findById(item.productId)//make index auto
    //     .then(product=>{
    //         index++;
    //         products.push({...product,quantity:item.quantity})
    //         if(index===(req.user.cart.items.length)){
    //             res.render('shop/cart',{
    //                 docTitle:'Your Cart',
    //                 products:products
    //             })
    //         }
    //     })
    //     .catch(err=>{
    //         console.log(err)
    //     })
        

    // })