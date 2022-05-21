const express = require('express');
const beneficiariosModel = require('../models/beneficiarios');
const gruposModel = require('../models/grupos');
const router = express.Router();

router.route('/').get(async (req, res) => {
  try {
      const result = await beneficiariosModel.get();
      res.render('pages/index.ejs', { beneficiarios: result.rows } );
  } catch (err) {
      console.error(err);
      res.send("Error " + err);
  }
});

router.route('/agregar').get(async (req, res) =>{
    try {
      const result = await gruposModel.get();
      res.render('pages/agregar.ejs', { grupos: result.rows } );
  } catch (err) {
      console.error(err);
      res.send("Error " + err);
  }
  })

router.route('/:id').get(async (req, res)=>{
  const result = await beneficiariosModel.getById(req.params.id)
    .catch(err => res.status(400).json('Error: ' + err));
    res.json(result);
})

router.route('/agregar').post((req, res)=>{
  const {nombre, apellidoP, apellidoM, sexo, fechaNacimiento, calle, noExt, colonia, municipio, etnia, grado} = req.body;
  beneficiariosModel.insert(nombre, apellidoP, apellidoM, sexo, fechaNacimiento, calle, noExt, colonia, municipio, etnia, grado)
    .then(()=> res.redirect('/beneficiarios'))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/borrar/:id').get((req, res)=>{
  beneficiariosModel.delete(req.params.id)
    .then(()=> res.redirect('/beneficiarios'))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/:id').post((req, res)=>{
  const {nombre, apellidoP, apellidoM, sexo, fechaNacimiento, calle, noExt, colonia, municipio, etnia, grado} = req.body;
  beneficiariosModel.update(req.params.id, nombre, apellidoP, apellidoM, sexo, fechaNacimiento, calle, noExt, colonia, municipio, etnia, grado)
    .then(()=> res.json("Beneficiario Actualizado"))
    .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;