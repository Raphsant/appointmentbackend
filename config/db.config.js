module.exports = {
    HOST: process.env.HOST,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    DB: process.env.DATABASE,
    dialect: "postgres",
    host: "5432",
    URL: process.env.DATABASE_URL,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};