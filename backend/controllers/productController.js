const Product = require('../models/product')
const formidable = require("formidable");
const path = require("path");
const fs = require("fs-extra");
// const ErrorHandler = require('../utils/errorHandler');
// const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures')
// const cloudinary = require('cloudinary')

exports.add = ((req, res) => {


    try {

        const form = new formidable.IncomingForm();
        form.parse(req, async (error, fields, files) => {
            const name = fields.name;
            const price = fields.price;
            const stock = fields.stock;
            const image = 'nopic.png';
            const category = "it"
            const products = new Product({
                name,
                price,
                stock,
                image,
                category
            });
            const result = await products.save()
            uploadImage(files, result);
            console.log(result)
        });

    } catch (error) {

        console.log(error)
    }



})

// Upload Image
uploadImage = async (files, doc) => {
    if (files.image != null) {
        var fileExtention = files.image.originalFilename.split(".")[1];
        // console.log(fileExtention)
        doc.image = `${doc.id}.${fileExtention}`;
        const projectPath = path.resolve('./');
        //โฟลเดอร์และ path ของการอัปโหลด
        const newpath = `${projectPath}/public/images/` + "/" + doc.image;
        console.log(newpath)
        if (fs.exists(newpath)) {
            await fs.remove(newpath);
            console.log('remove success!')
        }
        fs.move(files.image.filepath, newpath)
            .then(() => {
                console.log('success!')
            })
            .catch(err => {
                console.error(err)
            })
        const results = Product.findByIdAndUpdate(doc.id, { image: doc.image },
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("Updated User : ", docs)
                }
            });
    }
};


// Upload Image Edit
uploadImageEdit = async (files, doc) => {
    if (files.image != null) {
        var fileExtention = files.image.originalFilename.split(".")[1];
        // console.log(fileExtention)
        docimage = `${doc}.${fileExtention}`;
        // console.log(docimage)
        const projectPath = path.resolve('./');
        //โฟลเดอร์และ path ของการอัปโหลด
        const newpath = `${projectPath}/public/images/` + docimage;
        // console.log(newpath)
        if (fs.exists(newpath)) {
            await fs.remove(newpath);
            console.log('remove success!')
        }
        fs.move(files.image.filepath, newpath)
            .then(() => {
                console.log('success!')
            })
            .catch(err => {
                console.error(err)
            })
        const results = Product.findByIdAndUpdate(doc, { image: docimage },
            function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("Updated User : ", docs)
                }
            });
        // console.log("results" + results)
    }
};


exports.updateProduct = ((req, res) => {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, (error, fields, files) => {
            const id = fields.id;
            const name = fields.name;
            const price = fields.price;
            const stock = fields.stock;
            const image = 'nopic.jpg'
            const result = Product.findByIdAndUpdate(fields.id, { name: name, price, stock },
                function (err, docs) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log("Updated User : ", docs)
                        console.log(id)
                        uploadImageEdit(files, id)
                    }
                })
        })
    } catch (error) {
        console.log(error)
    }
})

// Get all products   =>   /api/v1/products?keyword=apple
exports.index = async (req, res) => {
    //   const products = await Product.find().sort({ _id: -1 });
    const products = await Product.find().sort({ _id: 1 })
    res.status(200).json({
        data: products
    })
}

// Get all products (Admin)  =>   /api/v1/admin/products
exports.getAdminProducts = (async (req, res, next) => {
    const products = await Product.find()
    res.status(200).json({
        products
    })
})

// Get single product details   =>   /api/v1/product/:id
exports.getSingleProduct = (async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404))
    }
    res.status(200).json({
        product
    })
})

// Update Product   =>   /api/v1/admin/product/:id
exports.updateProductAdmin = (async (req, res, next) => {

    let product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler('Product not found', 404))
    }
    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }
    if (images !== undefined) {
        // Deleting images associated with the product
        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }
        let imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'products'
            });
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }
        req.body.images = imagesLinks
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        product
    })

})

// Delete Product   =>   /api/v1/admin/product/:id
exports.deleteProduct = (async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }
    await product.remove();
    res.status(200).json({
        success: true,
        message: 'Product is deleted.'
    })

})



exports.destroy = (async (req, res, next) => {

    // const product = await Product.findById(req.params.id);

    // if (!product) {
    //     return next(new ErrorHandler('Product not found', 404));
    // }

    // // Deleting images associated with the product
    // for (let i = 0; i < product.images.length; i++) {
    //     const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    // }

    //   await Product.remove();

    res.status(200).json({
        success: true,
        message: 'Product is deleted.'
    })

})

// Create new review   =>   /api/v1/review
exports.createProductReview = (async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

})




// Delete Product Review   =>   /api/v1/reviews
exports.deleteReview = (async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    console.log(product);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})


// Get Product Reviews   =>   /api/v1/reviews
exports.getProductReviews = (async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }
    res.status(200).json({
        product
    })
})
