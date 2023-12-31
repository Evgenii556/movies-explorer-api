const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SecretKey } = require('../utils/constants');
const { NODE_ENV } = require('../utils/constants');

const NotFoundError = require('../errors/NotFoundError');
const DuplicateError = require('../errors/DuplicateError');
const InvalidError = require('../errors/InvalidError');

function registrationUser(req, res, next) {
  const {
    email, password, name,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.status(201).send({ email: user.email }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new DuplicateError('Пользователь уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new InvalidError('Некорректный запрос к серверу при регистрации пользователя'));
      } else {
        next(err);
      }
    });
}

function loginUser(req, res, next) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      const token = jwt.sign(
        { _id: userId },
        NODE_ENV === 'production' ? SecretKey : 'incredible-difficult-unbreakable-key',
        { expiresIn: '7d' },
      );
      return res.send({ _id: token });
    })
    .catch(next);
}

function getUserInfoId(req, res, next) {
  const id = req.user;

  User.findById(id)
    .then((user) => {
      if (user) return res.send(user);
      throw new NotFoundError('Пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidError('Передача некорректного id'));
      } else {
        next(err);
      }
    });
}

function editUserInfo(req, res, next) {
  const { name, email } = req.body;
  const userId = req.user;
  User.findByIdAndUpdate(
    userId,
    {
      name,
      email,
    },
    {
      new: true,
      runValidators: true,
    },
  ).catch((err) => {
    if (err.code === 11000) {
      next(new DuplicateError('Пользователь уже зарегистрирован'));
    }
  })
    .then((user) => {
      if (user) return res.send(user);
      throw new NotFoundError('Пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidError('Некорректный запрос к серверу при обновления профиля'));
      } else {
        next(err);
      }
    });
}

module.exports = {
  getUserInfoId,
  editUserInfo,
  registrationUser,
  loginUser,
};
