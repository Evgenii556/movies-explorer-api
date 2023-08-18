require('dotenv').config();

const { SecretKey } = process.env;

const { NODE_ENV } = process.env;

const { DataBaseUrl = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const linTemplate = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]+\.[a-zA-Z0-9()]+\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;

module.exports = {
  SecretKey,
  linTemplate,
  NODE_ENV,
  DataBaseUrl,
};
