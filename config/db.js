const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    database: 'mongodb://localhost:27017/jvec',
    secret: 'mysecret',
  },
  production: {
    use_env_variable: 'MONGO_URI',
  }
}
