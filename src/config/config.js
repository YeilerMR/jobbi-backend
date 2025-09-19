// config.js
require('dotenv').config();

module.exports = {
  bknd_port:              process.env.BKND_PORT                    || 3000,
  jwtSecret:              process.env.JWT_SECRET                   || '2dc5a07a14f3efd87399bc11f2cca0ae77db736e76d0ac2dxx2929fcf37ca048',
  bd_port:                process.env.DB_PORT                      || 1433,
  database:               process.env.DB_NAME                      || 'jobbi_bd',
  user:                   process.env.DB_USER                      || 'sa',
  password:               process.env.DB_PASSWORD                  || '1234',
  encrypt:                process.env.DB_ENCRYPT                  === 'true',
  trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'
};
