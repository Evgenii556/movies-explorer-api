const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const { auth } = require('../middlewares/auth');
const { registrationUser, loginUser } = require('../controllers/users');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30).required(),
    }),
  }),
  registrationUser,
);
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  loginUser,
);
router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);

router.all('*', auth, (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден.')));

module.exports = router;
