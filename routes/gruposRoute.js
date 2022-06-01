const express = require('express');
const db = require('../utils/db');
const beneficiariosModel = require('../models/beneficiarios')
const gruposModel = require('../models/grupos');
const proyectosModel = require('../models/proyectos');
const router = express.Router();
const { checkAuth, checkRoleAuth } = require('../middlewares/auth');

router.use(checkAuth);

router.route('/').get(async (req, res) => {
    try {
        const grupos = await gruposModel.get();
        const beneficiarios = await db.query(
          `select b.*, g.*
            from "Beneficiarios" b
            inner join "Beneficiarios_Grupos" bg
            on b."id_beneficiario" = bg."id_beneficiario"
            inner join "Grupos" g
            on bg."id_grupo" = g."id_grupo"`);
        res.render('pages/grupos.ejs', 
          { grupos: grupos.rows, beneficiarios: beneficiarios.rows } );
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

router.route('/editar').get(checkRoleAuth(['Administrador']), async (req, res) => {
  try {
    const proyectos = await proyectosModel.get();
    const grupos = await gruposModel.get();
    res.render('pages/editarGrupos.ejs', {proyectos:proyectos.rows, grupos:grupos.rows});
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

router.route('/proyectos').get(async (req, res) => {
  try {
    const proyectos = await proyectosModel.get();
    res.render('pages/proyectos.ejs', {proyectos:proyectos.rows});
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

router.route('/:id').get(async (req, res)=>{
  const result = await gruposModel.getById(req.params.id)
    .then(() =>res.json(result))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/editar').post(checkRoleAuth(['Administrador']), async (req, res)=>{
  const {grupo, id_proyecto} = req.body;
  if (grupo.replace(/\s/g, '') == ''){
    res.redirect('/grupos/editar');
  } else {
  gruposModel.insert(grupo, id_proyecto)
    .then(()=> res.redirect('/grupos/editar'))
    .catch(err => res.status(400).json('Error: ' + err));
  }
})

router.route('/proyectos').post(checkRoleAuth(['Administrador']), async (req, res)=>{
  const {proyecto} = req.body;
  if (proyecto.replace(/\s/g, '') == ''){
    res.redirect('/grupos/proyectos');
  } else {
  proyectosModel.insert(proyecto)
    .then(()=> res.redirect('/grupos/proyectos'))
    .catch(err => res.status(400).json('Error: ' + err));
  }
})

router.route('/').post(checkRoleAuth(['Administrador']), (req, res)=>{
  const {grupo, id_proyecto} = req.body;
  gruposModel.insert(grupo, id_proyecto)
    .then(()=> res.json("Grupo Insertado Insertado"))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/borrar/:id').get(checkRoleAuth(['Administrador']), (req, res)=>{
  gruposModel.delete(req.params.id)
    .then(()=> res.redirect('/grupos/editar'))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/proyectos/borrar/:id').get(checkRoleAuth(['Administrador']), (req, res)=>{
  proyectosModel.delete(req.params.id)
    .then(()=> res.redirect('/grupos/proyectos'))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/:id').post(checkRoleAuth(['Administrador']), (req, res)=>{
  const {grupo, id_proyecto} = req.body;
  gruposModel.update(req.params.id, grupo, id_proyecto)
    .then(()=> res.json("Beneficiario Actualizado"))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/borrar/:id/:grupo').get(checkRoleAuth(['Administrador']), async (req, res) =>{
  const id_beneficiario = req.params.id;
  const id_grupo = req.params.grupo;
  beneficiariosModel.deleteGroup(id_beneficiario, id_grupo)
    .then(()=> res.redirect('/grupos'))
    .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;