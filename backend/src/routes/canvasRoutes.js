const express = require('express');
const router = express.Router();
const {
  createCanvas,
  getAllCanvases,
  getCanvasById,
  updateCanvas,
  deleteCanvas,
} = require('../controllers/canvasController');
const { protect } = require('../middleware/auth');
const {
  createCanvasValidation,
  updateCanvasValidation,
  mongoIdValidation,
} = require('../middleware/validate');

// If you're doing the auth bonus, uncomment `protect,` in each line below
// to require login before touching canvases.

router.post('/', protect, createCanvasValidation, createCanvas);
router.get('/', protect, getAllCanvases);
router.get('/:id', protect, mongoIdValidation, getCanvasById);
router.put('/:id', protect, mongoIdValidation, updateCanvasValidation, updateCanvas);
router.delete('/:id', protect, mongoIdValidation, deleteCanvas);

module.exports = router;
