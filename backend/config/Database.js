import { Sequelize } from "sequelize";

const db = new Sequelize('your_db', 'your_user', 'your_password', {
    host: "localhost",
    dialect: "mysql"
});

export default db;
