const mongoose=require('mongoose')

const Schema=mongoose.Schema
const userSchema= new Schema({
    // name:{
    //     type:String,
    //     required:true
    // },

    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    // confirmPassword:{
    //     type:String,
    //     required:true
    // },
    resetToken:String,
    tokenExpiration:Date, 
    cart:{
        items:[{
            productId: {
                type:Schema.Types.ObjectId, 
                ref:'Product',
                required:true
            },
            quantity:{
                type:Number,
                required:true
            }
        }]
    }
}) 

userSchema.methods.addToCart=function(product){
    // let updatedCart;
        const cartProductIndex=this.cart.items.findIndex(item=>{
            return item.productId.toString()===product._id.toString()
        })
        if(cartProductIndex>=0){
            this.cart.items[cartProductIndex].quantity++
        }
        else{
            this.cart.items.push({productId:(product._id),quantity:1})
        }
        // updatedCart=this.cart;
        this.markModified('this.cart')
        this.save()
}

userSchema.methods.removeFromCart= function(productId){
    const updatedCartItems=this.cart.items.filter(item=>{
        return item.productId.toString() !== productId.toString() 
    })
    this.cart.items=updatedCartItems;
    return this.save()
}

userSchema.methods.addOrder=function(){
    const orders={
        userId:this._id,
        username:this.name,
        items:this.cart.items,
    }
    
    return db.collection('orders')
        .insertOne(orders)
        .then(result=>{
            this.cart={items:[]}//placing order means emptying cart
            return db.collection('users')
                .updateOne({_id:new mongodb.ObjectId(this._id)}
                    , {$set:{'cart.items':[]}})
        })
}

userSchema.methods.clearCart=function(){
    this.cart={items:[]};
    return this.save()
}

module.exports=mongoose.model('User',userSchema)
// const req = require('express/lib/request');
// const mongodb = require('mongodb');
// const {getDb}=require('../utils/database')
// class User{
//     constructor(id,username,email,cart){
//         this._id=id;
//         this.name=username;
//         this.email=email;
//         this.cart=cart;
//     }
//     save(){
//         const db=getDb();
//         return db.collection('users')
//             .insertOne(this)
//             .then(result=>{
//                 console.log('User created')
//             })
//             .catch(err=>{
//                 console.log(err);
//             })
//     }
//     static findById(userId){
//         const db=getDb();
//         return db.collection('users')
//                 .findOne({_id:new mongodb.ObjectId(userId)})
//                 .then(user=>{
//                     console.log('user found')
//                     return user;
//                 })
//                 .catch(err=>{
//                     console.log(err);
//                 })    
//     }

//     addToCart(product){
//         
//     }
//     removeFromCart(productId){
//         const updatedCartItems=this.cart.items.filter(item=>{
//             return item.productId.toString() !== productId.toString() 
//         })
//         const db=getDb()
//         return db.collection('users')
//             .updateOne({_id:new mongodb.ObjectId(this._id)}
//                 , {$set:{'cart.items':updatedCartItems}})
//     }
//     
//     getOrders(userId){
//         const db=getDb()
//         return db.collection('orders')
//             .findOne({userId:new mongodb.ObjectId(userId)})
//             .then(orders=>{
//                 return orders
//             })
//             .catch(err=>{
//                 console.log(err)
//             })

            
    
//     }
// }

// module.exports=User;

// //alternative way to getProductForCart
// // function getProductsForCart(){
// //     const db=getDb();
// //     const productIds=this.cart.items.map((item)=>{
// //         return item.productId
// //     })
// //     db.collection('products')
// //         .find({id:{$in:productIds}})
// //         .toArray()
// //         .then(products=> {
// //             return products.map(product=>{
// //                 return {...product,quantity:this.cart.items.find(item=>{
// //                     return item.productId.toString()===product._id.toString();
// //                 })}.quantity
// //             }) 
// //         })
// // }