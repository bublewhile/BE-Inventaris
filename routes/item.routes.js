const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload');
const itemController = require('../controllers/item.controller');

// route.httpMethod('/path', middleware, controller)
//prefix route di definisikan di app.js, jadi disini cukup '/' sama dengan '/items'
//single(image): ambil 1 file yang di upload di inputan image
router.post('/', upload.single('image'), itemController.createItem);
router.get('/', itemController.getItem);
// path dinamis pake (:) buat diambil req.params
router.get('/:id', itemController.showItem);
router.put('/:id', upload.single('image'), itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;