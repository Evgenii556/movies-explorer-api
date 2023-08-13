const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

mongoose.set('strictQuery', true);

const app = express();

const allowedCors = ['https://films-and-movies.me.nomoreparties.co', 'http://localhost:3000'];

const corsOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose
  .connect('mongodb://127.0.0.1:27017/bitfilmsdb')
  .then(() => {
    console.log('Успешное подключение');
  })
  .catch(() => {
    console.log('Ошибка подключения');
  });

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
