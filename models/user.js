const mongodb = require('mongodb');
const {getDb}=require('../utils/database')
class User{
    constructor(id,username,email,cart){
        this._id=id;
        this.name=username;
        this.email=email;
        this.cart=cart;
    }
    save(){
        const db=getDb();
        return db.collection('users')
            .insertOne(this)
            .then(result=>{
                console.log('User created')
            })
            .catch(err=>{
                console.log(err);
            })
    }
    static findById(userId){
        const db=getDb();
        return db.collection('users')
                .findOne({_id:new mongodb.ObjectId(userId)})
                .then(user=>{
                    console.log('user found')
                    return user;
                })
                .catch(err=>{
                    console.log(err);
                })    
    }

    //user{username,email,cart:{items:[
//              {_id,title,imageUrl,price,description},{title,imageUrl,price,description}
    // ]}}
    addToCart(product){
        let updatedCart;
        const cartProductIndex=this.cart.items.findIndex(item=>{
            // console.log(product._id.toString()===item.productId.toString());
            return item.productId.toString()===product._id.toString()
        })
        console.log(cartProductIndex)
        if(cartProductIndex>0){
            this.cart.items[cartProductIndex].quantity++
        }
        // if(cartProductIndex>=0){}
        else{
            this.cart.items.push({productId:new mongodb.ObjectId(product._id),quantity:1})
        }
        updatedCart=this.cart;
        const db=getDb();
        return db.collection('users')
            .updateOne({_id:new mongodb.ObjectId(this._id)},
                    {$set:{cart:updatedCart}})
            .then((user)=>{
                return user;
            })
            .catch(err=>console.log(err))
    }
}

module.exports=User;