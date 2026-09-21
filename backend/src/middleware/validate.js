const { body, param, validationResult } = require('express-validator');

const sendValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Invalid request data',
      errors: errors.array().map(({ path, msg }) => ({ field: path, message: msg })),
    });
  }
  next();
};

const canvasFields = [
  body('name').optional().isString().trim().isLength({ min: 1, max: 100 }).withMessage('Name must be 1 to 100 characters'),
  body('elements').optional().isArray({ max: 500 }).withMessage('Elements must be an array of at most 500 items'),
  body('elements.*.id').if(body('elements').exists()).isString().trim().notEmpty().withMessage('Element id is required'),
  body('elements.*.type').if(body('elements').exists()).isIn(['rect', 'circle', 'text']).withMessage('Element type must be rect, circle, or text'),
  body('elements.*.x').if(body('elements').exists()).isFloat().withMessage('Element x must be a number'),
  body('elements.*.y').if(body('elements').exists()).isFloat().withMessage('Element y must be a number'),
  body('elements.*.width').optional().isFloat({ gt: 0 }).withMessage('Width must be greater than zero'),
  body('elements.*.height').optional().isFloat({ gt: 0 }).withMessage('Height must be greater than zero'),
  body('elements.*.radius').optional().isFloat({ gt: 0 }).withMessage('Radius must be greater than zero'),
  body('elements.*.rotation').optional().isFloat().withMessage('Rotation must be a number'),
  body('elements.*.fill').optional().isString().trim().isLength({ min: 1, max: 100 }).withMessage('Fill must be a valid color value'),
  body('elements.*.text').optional().isString().isLength({ max: 5000 }).withMessage('Text must be at most 5000 characters'),
  body('elements.*.fontSize').optional().isFloat({ gt: 0, max: 500 }).withMessage('Font size must be between 0 and 500'),
  body('elements.*.zIndex').optional().isInt({ min: 0 }).withMessage('zIndex must be a non-negative integer'),
];

const createCanvasValidation = [
  body('name').isString().trim().isLength({ min: 1, max: 100 }).withMessage('Name must be 1 to 100 characters'),
  ...canvasFields.slice(1),
  sendValidationErrors,
];

const updateCanvasValidation = [
  body().custom((value) => {
    const keys = Object.keys(value);
    if (!keys.length || keys.some((key) => !['name', 'elements'].includes(key))) {
      throw new Error('Only name and elements can be updated');
    }
    return true;
  }),
  ...canvasFields,
  sendValidationErrors,
];

const mongoIdValidation = [
  param('id').isMongoId().withMessage('Invalid canvas id'),
  sendValidationErrors,
];

const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('A valid email is required'),
  body('password').isString().isLength({ min: 6, max: 128 }).withMessage('Password must be 6 to 128 characters'),
  sendValidationErrors,
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('A valid email is required'),
  body('password').isString().notEmpty().withMessage('Password is required'),
  sendValidationErrors,
];

module.exports = {
  createCanvasValidation,
  updateCanvasValidation,
  mongoIdValidation,
  registerValidation,
  loginValidation,
};
