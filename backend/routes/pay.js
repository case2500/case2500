const express = require('express');
const router = express.Router();
const payController = require('../controllers/payController.js');

/* http://localhost:8000/pay */
router.get('/', payController.index);

// /* http://localhost:8000/product/:id */
// router.put('/',  orderController.updateOrder);

// /* http://localhost:8000/product/:id */
// router.get('/:id',  orderController.getSingleOrder);

// /* http://localhost:8000/product/:id */
//  router.delete('/:id', payController.deletePay);

// router.delete('/', orderController.destroy);
// /* http://localhost:8000/pay */
 router.post('/', payController.insert);

module.exports = router;