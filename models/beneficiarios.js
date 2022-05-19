const db = require('../public/js/db');
module.exports = {
    async insert(nombre, fechaNacimiento, sede) {
        let result = await db.query(`insert into "Beneficiarios"
        ("Nombre", "Fecha de Nacimiento", "Sede")
        values
        ($1, $2, $3)`, [nombre, fechaNacimiento, sede]);
        return result;
    },
    async get() {
        const result = await db.query(`select * from "Beneficiarios"`);
        return result;
    },
    async getById(id) {
        const result = await db.query(`select * from "Beneficiarios" where id_beneficiario = $1`, [id]);
        return result.rows[0];
    },
    async update(id, nombre, fechaNacimiento, sede) {
        const result = db.query(`update "Beneficiarios"
        set "Nombre" = $1,
        "Fecha de Nacimiento" = $2,
        "Sede" = $3
        where id_beneficiario = $4`, [nombre, fechaNacimiento, sede, id]);
        return result;
    },
    async delete(id) {
        const result = db.query(`delete from "Beneficiarios"
        where id_beneficiario = $1`, [id]);
        return result;
    }
}