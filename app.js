const express = require("express");
const Pool = require("pg").Pool;
require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './views')
app.use(express.static('public'))

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/', async (req, res) => {
  try {
      const client = await pool.connect();
      const result = await client.query(
      `select * from "Beneficiarios"`);
      res.render('pages/index.ejs', { beneficiarios: result.rows } );
      client.release();
  } catch (err) {
      console.error(err);
      res.send("Error " + err);
  }
});

app.get('/grupos', async (req, res) => {
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
        res.render('pages/grupos.ejs', { beneficiarios: result.rows } );
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

app.listen(port);
console.log('Server running on Port:' + port)
