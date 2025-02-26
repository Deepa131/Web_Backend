const express = require('express');
const authMiddleware = require('../middleware/authMiddleware'); 
const diaryController = require('../controllers/diaryController');

const router = express.Router();

router.post('/create', authMiddleware.verifyToken, diaryController.createDiaryEntry);
router.get('/all', authMiddleware.verifyToken, diaryController.getAllDiaryEntries);
router.get('/:id', authMiddleware.verifyToken, diaryController.getDiaryEntryById);
router.put('/:id', authMiddleware.verifyToken, diaryController.updateDiaryEntry);
router.delete('/:id', authMiddleware.verifyToken, diaryController.deleteDiaryEntry);

module.exports = router;
