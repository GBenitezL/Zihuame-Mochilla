const { user } = require('pg/lib/defaults');
const db = require('../utils/db');
module.exports = {
    async insert(username, password, role) {
        let result = await db.query(`insert into "Usuarios"
        ("Usuario", "Password", "Rol")
        values
        ($1, $2, $3)`, 
        [username, password, role]);
        return result;
    },
    async get() {
        const result = await db.query(`select * from "Usuarios"`);
        return result;
    },
    async getByUserName(username) {
        const result = await db.query(`select * from "Usuarios" where "Usuario" = $1`, [username]);
        return result.rows[0];
    },
    async delete(id) {
        const result = await db.query(`delete from "Usuarios"
        where "Usuario" = $1`, [username]);
        return result;
    }
}