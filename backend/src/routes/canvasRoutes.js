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

// If you're doing the auth bonus, uncomment `protect,` in each line below
// to require login before touching canvases.

router.post('/', /* protect, */ createCanvas);
router.get('/', /* protect, */ getAllCanvases);
router.get('/:id', /* protect, */ getCanvasById);
router.put('/:id', /* protect, */ updateCanvas);
router.delete('/:id', /* protect, */ deleteCanvas);

module.exports = router;