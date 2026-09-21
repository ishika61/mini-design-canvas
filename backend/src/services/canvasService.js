const Canvas = require('../models/Canvas');

const createCanvas = async ({ name, elements, ownerId }) => {
  const canvas = new Canvas({ name, elements, owner: ownerId || undefined });
  return canvas.save();
};

const getAllCanvases = async (ownerId) => {
  const filter = ownerId ? { owner: ownerId } : {};
  // return lightweight list — no need to send full elements array for a list view
  return Canvas.find(filter).select('name createdAt updatedAt').sort({ updatedAt: -1 });
};

const getCanvasById = async (id, ownerId) => {
  const filter = ownerId ? { _id: id, owner: ownerId } : { _id: id };
  const canvas = await Canvas.findOne(filter);
  if (!canvas) {
    const err = new Error('Canvas not found');
    err.statusCode = 404;
    throw err;
  }
  return canvas;
};

const updateCanvas = async (id, updates, ownerId) => {
  const filter = ownerId ? { _id: id, owner: ownerId } : { _id: id };
  const canvas = await Canvas.findOneAndUpdate(filter, updates, {
    new: true,
    runValidators: true,
  });
  if (!canvas) {
    const err = new Error('Canvas not found');
    err.statusCode = 404;
    throw err;
  }
  return canvas;
};

const deleteCanvas = async (id, ownerId) => {
  const filter = ownerId ? { _id: id, owner: ownerId } : { _id: id };
  const canvas = await Canvas.findOneAndDelete(filter);
  if (!canvas) {
    const err = new Error('Canvas not found');
    err.statusCode = 404;
    throw err;
  }
  return canvas;
};

module.exports = {
  createCanvas,
  getAllCanvases,
  getCanvasById,
  updateCanvas,
  deleteCanvas,
};