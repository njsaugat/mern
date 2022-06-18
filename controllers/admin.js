const Product=require('../models/productData')
const {validationResult}=require('express-validator')

const fileHelper=require('../utils/file')
const getAddProduct=(req,res)=>{
    res.render('admin/add-product',{
        docTitle:'Add Product',
        isAuthenticated:req.session.isLoggedIn,
        finalProduct:{
            title:'',
            imageUrl:'',
            price:'',
            description:''
        },
        errorMessage:''
    })
}


const postAddProduct=(req,res,next)=>{
    const title=req.body.title;
    const image=req.file;
    const price=req.body.price;
    const description=req.body.description; 
    const errors=validationResult(req)

    if(!image){
        return res.status(422).render('admin/add-product',{
            finalProduct:{title,image,price,description},
            docTitle:'Add Product',
            isAuthenticated:req.session.isLoggedIn,
            errorMessage:'Attached file is not an image',
        })
    }
    if(!errors.isEmpty()){
        return res.status(422).render('admin/add-product',{
            finalProduct:{title,image,price,description},
            docTitle:'Add Product',
            isAuthenticated:req.session.isLoggedIn,
            errorMessage:errors.array()[0].msg,
     
        })
    }

    const imageUrl=image.path;
    const product=new Product({
        title:title,
        imageUrl:imageUrl,
        price:price,
        description:description,
        userId:req.user._id
    }) 
    product.save()
        .then(result=>{
            console.log('product created')
            res.redirect('/admin/products')
        })
}

const getProductsAdmin=(req,res,next)=>{
    Product.find({userId:req.user._id})
    // .select('title price -_id  ')//selecting and populating certain fields
    // .populate('userId','name')
    .then(products=>{
        res.render('admin/products-admin',{
            products,
            hasProducts:products.length>0,
            docTitle:'Admin Products',
            isAuthenticated:req.session.isLoggedIn 
        })
    })
    .catch(err=>console.log(err))   
}

const editProduct=(req,res,next)=>{
    // const title=req.body.title;
    // const imageUrl=req.body.imageUrl;
    // const price=req.body.price;
    // const description=req.body.description;
    const title=req.body.title;
    const image=req.file;
    const price=req.body.price;
    const description=req.body.description; 
    const errors=validationResult(req)

    
    Product.findById(req.params.id)
    .then(product=>{
        if(!errors.isEmpty()){
            return res.status(422).render('admin/edit-product',{
                finalProduct:product,
                docTitle:'Edit Product',
                isAuthenticated:req.session.isLoggedIn,
                errorMessage:errors.array()[0].msg,
         
            })
        }
        console.log(req.file)
        console.log(product)
        res.render('admin/edit-product',{
            finalProduct:product,
            docTitle:'Edit Products',
            isAuthenticated:req.session.isLoggedIn,
            errorMessage:null
        }) 
    })
    .catch(err=>console.log(err))
    
}


const postProduct=(req,res,next)=>{
    const image=req.file;
    const editObject={ 
        id:req.params.id,
        title:req.body.title,
        // imageUrl:req.body.imageUrl,
        price:req.body.price,
        description:req.body.description
    }
    if(image){
        editObject.imageUrl=image.path
    }
    Product.updateOne({_id:req.params.id},{...editObject})
    .then(product=>{
        if(product){
            return res.redirect('/admin/products');
        }
    })    
}

const deleteProduct=(req,res,next)=>{
    Product.findById(req.params.id)
    .then(product=>{
        if(!product){
            console.log('No product found')
        }
        fileHelper.deleteFile(product.imageUrl)
        return Product.deleteOne({_id:req.params.id})
    })
    .then(()=>{
        res.redirect('/')
        
    })
    .catch(err=>console.log(err))

    
}
// //
module.exports={
    getAddProduct,
    postAddProduct,
    getProductsAdmin,
    editProduct,
    postProduct,
    deleteProduct
}

