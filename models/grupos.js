const db = require('../utils/db');
module.exports = {
    async insert(grupo, id_proyecto) {
        let result = await db.query(`insert into "Grupos"
        ("Grupo", "id_proyecto")
        values
        ($1, $2)`, [grupo, id_proyecto]);
        return result;
    },
    async get() {
        const result = await db.query(`select g.*, p."Proyecto"
        from "Grupos" g
        inner join "Proyectos" p
        on g.id_proyecto = p.id_proyecto
        order by "Grupo"`);
        return result;
    },
    async getById(id) {
        const result = await db.query(`select * from "Grupos" where id_grupo = $1`, [id]);
        return result.rows[0];
    },
    async getByUserId(id_beneficiario){
        const result = await db.query(`select g.id_grupo, g."Grupo", p."Proyecto"
        from "Beneficiarios_Grupos" bg
        inner join "Grupos" g
        on bg.id_grupo = g.id_grupo
        inner join "Proyectos" p
        on g.id_proyecto = p.id_proyecto
        where bg.id_beneficiario = $1`, [id_beneficiario]);
        return result;
    },
    async update(id, grupo, id_proyecto) {
        const result = await db.query(`update "Grupos"
        set "Grupo" = $1,
        "id_proyecto" = $2
        where id_grupo = $3`, [grupo, id_proyecto, id]);
        return result;
    },
    async delete(id) {
        const relacion = await db.query(`delete from "Beneficiarios_Grupos"
        where id_grupo = $1`, [id]);
        const result = await db.query(`delete from "Grupos"
        where id_grupo = $1`, [id]);
        return result;
    }
}