const express = require('express');
const db = require('../utils/db');
const router = express.Router();
const { checkAuth, checkRoleAuth } = require('../middlewares/auth');

router.use(checkAuth);

router.route('/').get(checkRoleAuth(['Administrador']), async (req, res) => {
    try {
        const etnias = await db.query(`select * from "Etnias" order by "Etnia" desc`);
        const municipios = await db.query(`select * from "Municipios" order by "Municipio"`);
        res.render('pages/atributos.ejs',
            { etnias: etnias.rows, municipios: municipios.rows });
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

router.route('/etnias').post(checkRoleAuth(['Administrador']), async (req, res) => {
    try {
        const { etnia } = req.body;
        if (etnia.replace(/\s/g, '') == '') {
            res.redirect('/atributos');
        } else {
            await db.query(`insert into "Etnias" values ($1)`, [etnia]);
            res.redirect('/atributos');
        }
    } catch (err){
        res.send(err)
    }
});

router.route('/etnias/borrar/:nombreEtnia').get(checkRoleAuth(['Administrador']), async (req, res) => {
    try {
        await db.query(`delete from "Etnias" where "Etnia" = $1`, [req.params.nombreEtnia]);
        res.redirect('/atributos');
    } catch (err){
        res.send(err)
    }
});

router.route('/municipios').post(checkRoleAuth(['Administrador']), async (req, res) => {
    try {
        const { municipio } = req.body;
        if (municipio.replace(/\s/g, '') == '') {
            res.redirect('/atributos');
        } else {
            await db.query(`insert into "Municipios" values ($1)`, [municipio]);
            res.redirect('/atributos');
        }
    } catch (err){
        res.send(err)
    }
});

router.route('/municipios/borrar/:nombreMunicipio').get(checkRoleAuth(['Administrador']), async (req, res) => {
    try {
        await db.query(`delete from "Municipios" where "Municipio" = $1`, [req.params.nombreMunicipio]);
        res.redirect('/atributos');
    } catch (err){
        res.send(err)
    }
});

module.exports = router;