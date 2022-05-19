const db = require('../public/js/db');
module.exports = {
    async insert(grupo, id_proyecto) {
        let result = await db.query(`insert into "Grupos"
        ("Grupo", "id_proyecto")
        values
        ($1, $2)`, [grupo, id_proyecto]);
        return result;
    },
    async get() {
        const result = await db.query(`select * from "Grupos"`);
        return result;
    },
    async getById(id) {
        const result = await db.query(`select * from "Grupos" where id_grupo = $1`, [id]);
        return result.rows[0];
    },
    async update(id, grupo, id_proyecto) {
        const result = db.query(`update "Grupos"
        set "Grupo" = $1,
        "id_proyecto" = $2
        where id_grupo = $3`, [grupo, id_proyecto, id]);
        return result;
    },
    async delete(id) {
        const result = db.query(`delete from "Grupos"
        where id_grupo = $1`, [id]);
        return result;
    }
}