const db = require('../utils/db');
module.exports = {
    async insert(proyecto) {
        let result = await db.query(`insert into "Proyectos"
        ("Proyecto")
        values
        ($1)`, [proyecto]);
        return result;
    },
    async get() {
        const result = await db.query(`select * from "Proyectos"`);
        return result;
    },
    async getById(id) {
        const result = await db.query(`select * from "Proyectos" where id_proyecto = $1`, [id]);
        return result.rows[0];
    },
    async update(id, grupo, id_proyecto) {
        const result = db.query(`update "Proyectos"
        set "Proyecto" = $1
        where id_proyecto = $2`, [grupo, id]);
        return result;
    },
    async delete(id) {
        const borrarRelacion = await db.query(`delete from "Beneficiarios_Grupos" bg 
        where "id_grupo" in 
        (select "id_grupo" from "Grupos" 
        where id_proyecto = $1)`, [id]);
        const borrarGrupos = await db.query(`delete from "Grupos"
        where id_proyecto = $1`, [id]);
        const result = await db.query(`delete from "Proyectos"
        where id_proyecto = $1`, [id]);
        return result;
    }
}