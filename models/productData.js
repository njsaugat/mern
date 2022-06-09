const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const productSchema=new Schema({//blueprint
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    price:{
        type:Number,
        required:true
    },
    description: {
        type: String,
        required: true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})

module.exports=mongoose.model('Product',productSchema)
     
// const mongodb=require('mongodb') 
// class Product{
//     constructor(title,imageUrl,price,description,userId){
//         this.title=title;
//         this.imageUrl=imageUrl;
//         this.price=price;
//         this.description=description;
//         this.userId=userId;
//         // this._id=id;
//     }
//     save(){
//         const db=getDb();
//         return db.collection('products')
//             .insertOne(this)//this points to the current object
//             .then(result=>{
//                 console.log(result)
//                 console.log('product saved/Created')
//             })
//             .catch(err=>{
//                 console.log(err) 
//             })
//     }
//     static fetchAll(){
//         const db=getDb();
//         return db.collection('products')
//             .find()
//             .toArray()
//             .then(products=>{
//                 console.log('all products found/Read')
//                 return products;
//             })
//             .catch(err=>{console.log(err)})
//     }
//     static findById(id){
//         const db=getDb();
//         return db.collection('products')
//             .findOne({_id:new mongodb.ObjectId(id)})
//             .then(product=>{
//                 console.log('product found!!/Read');
//                 return product; 
//             })
//             .catch(err=>{
//                 console.log(err) 
//             })
//     }
//     static update(editObject,id){
//         const db=getDb()
//         return db.collection('products')
//             .updateOne({_id:new mongodb.ObjectId(id)},
//                 {$set:editObject})
//             .then(result=>{
//                 console.log('product Updated')
//                 return result;
//             })
//             .catch(err=>{
//                 console.log(err) 
//             })
//     } 

//     static deleteById(id){
//         const db=getDb();
//         return db.collection('products')
//             .deleteOne({_id:new mongodb.ObjectId(id)})
//             .then(result=>{
//                 console.log('product deleted')
//             })
//             .catch(err=>{
//                 console.log(err)
//             })
//     }
// }


// module.exports=Product;



// // alternative of saving to accomodate even for updates
// // function save(){
// //     const db=getDb()
// //     let dbOp;
// //     if(this._id){//this means that id already exists so we update the prod
// //         //update the prouduct
// //         dbOp=db.collection('products')
// //             .updateOne({_id:new mongodb.ObjectId(this._id)},
// //                         { $set:this})
// //     }
// //     else{
// //         dbOp=db.collection()
// //         .insertOne(this)
// //     }
// //     return dbOp 
// //         .then(result=>{
// //             console.log('product insert')
// //         })
// //         .catch(err=>{
// //             console.log(err);
// //         })
// // }