require('dotenv').config();

module.exports = {
    PORT: 8000,
    MONGODB_URI: 'mongodb://localhost:27017/shopit',
    DOMAIN: process.env.DOMAIN,
    DOMAIN_GOOGLE_STORAGE: process.env.DOMAIN_GOOGLE_STORAGE,
    JWT_SECRET: '123456'
}