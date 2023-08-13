const mongoose = require('mongoose');
const { linTemplate } = require('../utils/constants');

const { ObjectId } = mongoose.Schema.Types;
const { Schema } = mongoose;

const movieSchema = new Schema(
  {
    country: {
      type: String,
      required: true,
    },

    director: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    year: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
      validate: {
        validator: (url) => linTemplate.test(url),
        message: 'Введите URL',
      },
    },

    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator: (url) => linTemplate.test(url),
        message: 'Введите URL',
      },
    },

    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: (url) => linTemplate.test(url),
        message: 'Введите URL',
      },
    },

    owner: {
      type: ObjectId,
      ref: 'user',
      required: true,
    },

    movieId: {
      type: Number,
      required: true,
    },

    nameRU: {
      type: String,
      required: true,
    },

    nameEN: {
      type: String,
      required: true,
    },
  },
);

module.exports = mongoose.model('movie', movieSchema);
