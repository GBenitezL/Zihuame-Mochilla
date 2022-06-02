const express = require('express');
const db = require('../utils/db');
const proyectosModel = require('../models/proyectos');
const router = express.Router();
const { checkAuth, checkRoleAuth } = require('../middlewares/auth');

router.use(checkAuth);

router.route('/').get(async (req, res) => {
    try {
        const proyectos = await proyectosModel.get();
        const beneficiarios = await db.query(
          `select b.*, g."Grupo", p."Proyecto"
            from "Beneficiarios" b
            inner join "Beneficiarios_Grupos" bg
            on b."id_beneficiario" = bg."id_beneficiario"
            inner join "Grupos" g
            on bg."id_grupo" = g."id_grupo"
            inner join "Proyectos" p
            on g."id_proyecto" = p."id_proyecto"
            order by "id_beneficiario" asc`);
        res.render('pages/programas.ejs', 
          { proyectos: proyectos.rows, beneficiarios: beneficiarios.rows } );
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
  });
  
  router.route('/editar').get(checkRoleAuth(['Administrador']), async (req, res) => {
    try {
      const proyectos = await proyectosModel.get();
      res.render('pages/editarProgramas.ejs', {proyectos:proyectos.rows});
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  router.route('/').post(checkRoleAuth(['Administrador']), async (req, res)=>{
    const {proyecto} = req.body;
    if (proyecto.replace(/\s/g, '') == ''){
      res.redirect('/programas/editar');
    } else {
    proyectosModel.insert(proyecto)
      .then(()=> res.redirect('/programas/editar'))
      .catch(err => res.status(400).json('Error: ' + err));
    }
  })

  module.exports = router;