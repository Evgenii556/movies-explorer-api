const Movie = require('../models/movie');

const AccessError = require('../errors/AccessError');
const NotFoundError = require('../errors/NotFoundError');
const InvalidError = require('../errors/InvalidError');

function getMovies(req, res, next) {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidError('Некорректный запрос к серверу'));
        return;
      }
      next(err);
    });
}

function addMovie(req, res, next) {
  const {
    director,
    duration,
    country,
    year,
    description,
    thumbnail,
    movieId,
    image,
    trailerLink,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    director,
    duration,
    country,
    year,
    description,
    thumbnail,
    movieId,
    image,
    trailerLink,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidError('Некорректный запрос к серверу'));
        return;
      }
      next(err);
    });
}

function deleteMovie(req, res, next) {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не существует');
      }
      if (!movie.owner.equals(req.user._id)) {
        throw new AccessError('Нет прав доступа');
      }
      return movie.deleteOne();
    })
    .then(() => res.send({ message: 'Фильм удален' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidError('Некорректный запрос к серверу'));
        return;
      }
      next(err);
    });
}

module.exports = {
  getMovies,
  addMovie,
  deleteMovie,
};
