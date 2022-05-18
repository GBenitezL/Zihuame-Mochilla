// Dependencias
const express = require("express");
var path = require('path');
const db = require("./public/js/db");
const ejs = require("ejs");

const beneficiariosRouter = require('./routes/beneficiariosRoute');

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

app.use('/beneficiarios', beneficiariosRouter);

//Configuracion EJS
app.set('view engine', 'ejs');
ejs.delimiter = '/';
ejs.openDelimiter = '[';
ejs.closeDelimiter = ']';

app.get('/formulario', async (req, res) => {
  try {
    const client = await db.connect();
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
        const client = await db.connect();
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
