const express = require('express');
const db = require('../utils/db');
const beneficiariosModel = require('../models/beneficiarios');
const gruposModel = require('../models/grupos');
const router = express.Router();
const { checkAuth, checkRoleAuth } = require('../middlewares/auth');

router.use(checkAuth);

router.route('/').get(async (req, res) => {
  try {
    const result = await beneficiariosModel.get();
    res.render('pages/index.ejs', { beneficiarios: result.rows });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

router.route('/agregar').get(checkRoleAuth(['Administrador']), async (req, res) => {
  try {
    const etnias = await db.query('select * from "Etnias"');
    const municipios = await db.query('select * from "Municipios"');
    res.render('pages/agregar.ejs', { etnias:etnias.rows, municipios:municipios.rows });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

router.route('/editar/:id').get(checkRoleAuth(['Administrador']), async (req, res) => {
  const etnias = await db.query('select * from "Etnias"');
  const municipios = await db.query('select * from "Municipios"');
  beneficiariosModel
    .getById(req.params.id)
    .then(beneficiario => {
      if (beneficiario) {
        res.render('pages/editar.ejs', { beneficiario: beneficiario, etnias: etnias.rows, municipios:municipios.rows })
      } else {
        res.status(500).send('No existe beneficiario con ese ID');
      }
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send("Error obteniendo beneficiario");
    })
})

router.route('/:id').get(async (req, res) => {
  const result = await beneficiariosModel.getById(req.params.id)
    .then(() => res.json(result))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/grupos/:id').get(async (req, res) => {
  try {
    const beneficiario = await beneficiariosModel.getById(req.params.id);
    const gruposAgregados = await gruposModel.getByUserId(req.params.id);
    const grupos = await gruposModel.get();
    res.render('pages/agregarGrupos', { beneficiario: beneficiario, grupos: grupos.rows, gruposAgregados: gruposAgregados.rows })
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

router.route('/agregar').post(checkRoleAuth(['Administrador']), async (req, res) => {
  const fechaAgregado = new Date().toISOString().split('T')[0];
  const { nombre, apellidoP, apellidoM, sexo, fechaNacimiento, calle, noExt, colonia, municipio, etnia, grado } = req.body;
  beneficiariosModel.insert(nombre, apellidoP, apellidoM, sexo, fechaNacimiento,
    calle, noExt, colonia, municipio, etnia, grado, fechaAgregado)
    .then(() => res.redirect('/beneficiarios'))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/borrar/:id').get(checkRoleAuth(['Administrador']), async (req, res) => {
  beneficiariosModel.deleteFromGroup(req.params.id)
    .then(() => {
      beneficiariosModel.delete(req.params.id)
        .then(() => res.redirect('/beneficiarios'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/editar/:id').post(checkRoleAuth(['Administrador']), async (req, res) => {
  const { nombre, apellidoP, apellidoM, sexo, fechaNacimiento, calle, noExt, colonia, municipio, etnia, grado } = req.body;
  beneficiariosModel.update(req.params.id, nombre, apellidoP, apellidoM, sexo, fechaNacimiento, calle, noExt, colonia, municipio, etnia, grado)
    .then(() => res.redirect('/beneficiarios'))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/grupos/:id').post(checkRoleAuth(['Administrador']), async (req, res) => {
  const id_beneficiario = req.params.id;
  const { id_grupo } = req.body;
  beneficiariosModel.addGroup(id_beneficiario, id_grupo)
    .then(() => res.redirect('/beneficiarios/grupos/' + id_beneficiario))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/grupos/borrar/:id/:grupo').get(checkRoleAuth(['Administrador']), async (req, res) => {
  const id_beneficiario = req.params.id;
  const id_grupo = req.params.grupo;
  beneficiariosModel.deleteGroup(id_beneficiario, id_grupo)
    .then(() => res.redirect('/beneficiarios/grupos/' + id_beneficiario))
    .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;