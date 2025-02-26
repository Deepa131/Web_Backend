const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// User Authentication Routes
router.post('/signup', userController.signupUser);
router.post('/login', userController.loginUser);

// Protected User Routes (Require Authentication)
router.get('/profile', authMiddleware.verifyToken, userController.getUserById);  
router.put('/profile', authMiddleware.verifyToken, userController.updateUser);   
router.delete('/profile', authMiddleware.verifyToken, userController.deleteUser); 

module.exports = router;
