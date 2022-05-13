const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordertController.js');

/* http://localhost:8000/product */
router.get('/', orderController.index);

// /* http://localhost:8000/product/:id */
// router.put('/',  orderController.updateOrder);

// /* http://localhost:8000/product/:id */
// router.get('/:id',  orderController.getSingleOrder);

// /* http://localhost:8000/product/:id */
 router.delete('/:id', orderController.deleteOrder);

// router.delete('/', orderController.destroy);
// /* http://localhost:8000/product */
 router.post('/', orderController.add);

module.exports = router;