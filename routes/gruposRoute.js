const express = require('express');
const db = require('../public/js/db');
const gruposModel = require('../models/grupos');
const router = express.Router();

router.route('/').get(async (req, res) => {
    try {
        const grupos = await gruposModel.get();
        const beneficiarios = await db.query(
          `select b."id_beneficiario", b."Nombre", b."Fecha de Nacimiento", g."Grupo"
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

router.route('/:id').get(async (req, res)=>{
  const result = await gruposModel.getById(req.params.id)
    .catch(err => res.status(400).json('Error: ' + err));
    res.json(result);
})

router.route('/').post((req, res)=>{
  const {nombre, fechaNacimiento, sede} = req.body;
  gruposModel.insert(nombre, fechaNacimiento, sede)
    .then(()=> res.json("Beneficiario Insertado"))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/:id').delete((req, res)=>{
  gruposModel.delete(req.params.id)
    .then(()=> res.json("Beneficiario Borrado"))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/:id').post((req, res)=>{
  const {nombre, fechaNacimiento, sede} = req.body;
  gruposModel.update(req.params.id, nombre, fechaNacimiento, sede)
    .then(()=> res.json("Beneficiario Actualizado"))
    .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;