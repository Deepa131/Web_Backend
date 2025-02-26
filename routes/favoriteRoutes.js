const express = require('express');
const favoriteController = require('../controllers/favoriteController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/add_favorite', verifyToken, favoriteController.addFavorite);

router.get('/get_favorite', verifyToken, favoriteController.getFavorites);

router.get('/:id', verifyToken, favoriteController.getFavoriteById);

router.put('/:id', verifyToken, favoriteController.updateFavorite);

router.delete('/:id', verifyToken, favoriteController.removeFavorite);

router.put('/:id/toggle', verifyToken, favoriteController.toggleFavorite);

module.exports = router;
