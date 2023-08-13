const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AuthError = require('../errors/AuthError');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => /.+@.+\..+/.test(email),
        message: 'Введите электронный адрес',
      },
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
  },

  {
    versionKey: false,
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email })
          .select('+password')
          .then((user) => {
            if (user) {
              return bcrypt.compare(password, user.password).then((matched) => {
                if (matched) return user;
                throw new AuthError('Некорректные почта или пароль');
              });
            }
            throw new AuthError('Некорректные почта или пароль');
          });
      },
    },
  },
);

module.exports = mongoose.model('user', userSchema);
