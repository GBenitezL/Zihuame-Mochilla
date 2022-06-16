const db = require('../utils/db');
module.exports = {
    async insert(nombre, apellidoP, apellidoM, sexo, fechaNacimiento,
        calle, noExt, colonia, municipio, etnia, grado, fechaAgregado, agregadoPor) {
        let result = await db.query(`insert into "Beneficiarios"
        ("Nombre", "Apellido Paterno", "Apellido Materno", "Sexo", "Fecha de Nacimiento", "Calle", 
        "NoExt", "Colonia", "Municipio", "Etnia", "Grado Escolar", "Fecha Agregado", "Agregado Por")
        values
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`, 
        [nombre, apellidoP, apellidoM, sexo, fechaNacimiento, calle,
         noExt, colonia, municipio, etnia, grado, fechaAgregado, agregadoPor]);
        return result;
    },
    async get() {
        const result = await db.query(`select * from "Beneficiarios" order by id_beneficiario`);
        return result;
    },
    async getById(id) {
        const result = await db.query(`select * from "Beneficiarios" where id_beneficiario = $1`, [id]);
        return result.rows[0];
    },
    async update(id, nombre, apellidoP, apellidoM, sexo, fechaNacimiento,
        calle, noExt, colonia, municipio, etnia, grado) {
        const result = await db.query(`update "Beneficiarios"
        set "Nombre" = $2,
        "Apellido Paterno" = $3,
        "Apellido Materno" = $4,
        "Sexo" = $5,
        "Fecha de Nacimiento" = $6,
        "Calle" = $7,
        "NoExt" = $8,
        "Colonia" = $9,
        "Municipio" = $10,
        "Etnia" = $11,
        "Grado Escolar" = $12
        where id_beneficiario = $1`,
        [id, nombre, apellidoP, apellidoM, sexo, fechaNacimiento, calle, noExt, colonia, municipio, etnia, grado]);
        return result;
    },
    async delete(id) {
        const result = await db.query(`delete from "Beneficiarios"
        where id_beneficiario = $1`, [id]);
        return result;
    },
    async addGroup(id_beneficiario, id_grupo) {
        const result = await db.query(`insert into "Beneficiarios_Grupos" values ($1, $2)`, [id_beneficiario, id_grupo]);
        return result;
    },
    async deleteGroup(id_beneficiario, id_grupo) {
        const result = await db.query(`delete from "Beneficiarios_Grupos" where id_beneficiario = $1 and id_grupo = $2`, 
        [id_beneficiario, id_grupo]);
        return result;
    },
    async deleteFromGroup(id_beneficiario){
        const result = await db.query(`delete from "Beneficiarios_Grupos"
        where id_beneficiario = $1`, [id_beneficiario]);
        return result;
    } 
}