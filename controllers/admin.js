const Product=require('../models/productData')
const getAddProduct=(req,res)=>{
    res.render('admin/add-product',{
        docTitle:'Add Product',
        isAuthenticated:req.session.isLoggedIn
    })
}


const postAddProduct=(req,res,next)=>{
    const title=req.body.title;
    const imageUrl=req.body.imageUrl;
    const price=req.body.price;
    const description=req.body.description; 
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
    Product.find()
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
    Product.findById(req.params.id)
    .then(product=>{
        res.render('admin/edit-product',{
            finalProduct:product,
            docTitle:'Edit Products',
            isAuthenticated:req.session.isLoggedIn
        }) 
    })
    .catch(err=>console.log(err))
    
}


const postProduct=(req,res,next)=>{
    const editObject={ 
        id:req.params.id,
        title:req.body.title,
        imageUrl:req.body.imageUrl,
        price:req.body.price,
        description:req.body.description
    }
    Product.updateOne({_id:req.params.id},{...editObject})
    .then(product=>{
        if(product){
            return res.redirect('/admin/products');
        }
    })    
}

const deleteProduct=(req,res,next)=>{
    Product.deleteOne({_id:req.params.id})
    .then(()=>res.redirect('/'))
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

