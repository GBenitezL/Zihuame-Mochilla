const db = require('../public/js/db');
module.exports = {
    async insert(id_beneficiario, id_grupo) {
        let result = await db.query(`insert into "Beneficiaciarios_Grupos"
        ("id_beneficiario", "id_grupo")
        values
        ($1, $2)`, [id_beneficiario, id_grupo]);
        return result;
    },
    async get() {
        const result = await db.query(`select * from "Beneficiarios_Grupos"`);
        return result;
    },
    async getById(id_beneficiario, id_grupo) {
        const result = await db.query(`select * from "Beneficiarios_Grupos" 
        where id_beneficiario = $1
        and id_grupo = $2`, [id_beneficiario, id_grupo]);
        return result.rows[0];
    },
    async delete(id_beneficiario, id_grupo) {
        const result = db.query(`delete from "Beneficiarios_Grupos"
        where id_beneficiario = $1
        and id_grupo = $2`, [id_beneficiario, id_grupo]);
        return result;
    }
}