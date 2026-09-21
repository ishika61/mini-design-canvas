const canvasService = require('../services/canvasService');

const createCanvas = async (req, res, next) => {
  try {
    const { name, elements } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Canvas name is required' });
    }
    const ownerId = req.user ? req.user.id : undefined; // set by auth middleware if logged in
    const canvas = await canvasService.createCanvas({ name, elements, ownerId });
    res.status(201).json(canvas);
  } catch (err) {
    next(err);
  }
};

const getAllCanvases = async (req, res, next) => {
  try {
    const ownerId = req.user ? req.user.id : undefined;
    const canvases = await canvasService.getAllCanvases(ownerId);
    res.status(200).json(canvases);
  } catch (err) {
    next(err);
  }
};

const getCanvasById = async (req, res, next) => {
  try {
    const ownerId = req.user ? req.user.id : undefined;
    const canvas = await canvasService.getCanvasById(req.params.id, ownerId);
    res.status(200).json(canvas);
  } catch (err) {
    next(err);
  }
};

const updateCanvas = async (req, res, next) => {
  try {
    const ownerId = req.user ? req.user.id : undefined;
    const { name, elements } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (elements !== undefined) updates.elements = elements;
    const canvas = await canvasService.updateCanvas(req.params.id, updates, ownerId);
    res.status(200).json(canvas);
  } catch (err) {
    next(err);
  }
};

const deleteCanvas = async (req, res, next) => {
  try {
    const ownerId = req.user ? req.user.id : undefined;
    await canvasService.deleteCanvas(req.params.id, ownerId);
    res.status(200).json({ message: 'Canvas deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCanvas,
  getAllCanvases,
  getCanvasById,
  updateCanvas,
  deleteCanvas,
};
