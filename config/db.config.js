module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "7232",
    DB: "serv_appointments",
    dialect: "postgres",
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};