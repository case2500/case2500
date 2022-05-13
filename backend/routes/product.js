const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

/* http://localhost:8000/product */
router.get('/', productController.index);

/* http://localhost:8000/product/:id */
router.put('/',  productController.updateProduct);

/* http://localhost:8000/product/:id */
router.get('/:id',  productController.getSingleProduct);

/* http://localhost:8000/product/:id */
router.delete('/:id', productController.deleteProduct);

router.delete('/', productController.destroy);
// /* http://localhost:8000/product */
 router.post('/', productController.add);

module.exports = router;