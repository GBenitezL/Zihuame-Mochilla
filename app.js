const express = require("express");
const Pool = require("pg").Pool;
require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/', (req, res) => {
    res.render('pages/index.ejs');
});

app.get('/db', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(
        `select "Beneficiarios"."id_beneficiario", "Beneficiarios"."Nombre", 
        "Beneficiarios"."Fecha de Nacimiento", "Grupos"."Grupo", "Grupos"."Sede"
        from "Beneficiarios"
        inner join "Beneficiarios_Grupos"
        on "Beneficiarios".id_beneficiario = "Beneficiarios_Grupos".id_beneficiario
        inner join "Grupos"
        on "Grupos".id_grupo = "Beneficiarios_Grupos".id_grupo`);
        console.log(result.rows[0]);
        res.render('pages/db.ejs', { beneficiarios: result.rows } );
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

app.listen(port);
console.log('Server running on Port:' + port)
