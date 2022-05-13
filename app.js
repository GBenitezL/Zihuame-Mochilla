const express = require("express");
const Pool = require("pg").Pool;
require('dotenv').config()

const ejs = require("ejs");
ejs.delimiter = '/';
ejs.openDelimiter = '[';
ejs.closeDelimiter = ']';

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

app.get('/formulario', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(`select "Proyecto" from "Proyectos"`);
    res.render('pages/form.ejs', { proyectos: result.rows } );
    client.release();
} catch (err) {
    console.error(err);
    res.send("Error " + err);
}
});

app.get('/grupos', async (req, res) => {
    try {
        const client = await pool.connect();
        const grupos = await client.query(`select * from "Grupos"`);
        const beneficiarios = await client.query(
          `select b."id_beneficiario", b."Nombre", b."Fecha de Nacimiento", g."Grupo"
            from "Beneficiarios" b
            inner join "Beneficiarios_Grupos" bg
            on b."id_beneficiario" = bg."id_beneficiario"
            inner join "Grupos" g
            on bg."id_grupo" = g."id_grupo"`);
        res.render('pages/grupos.ejs', 
          { grupos: grupos.rows, beneficiarios: beneficiarios.rows } );
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

app.listen(port);
console.log('Server running on Port:' + port)
