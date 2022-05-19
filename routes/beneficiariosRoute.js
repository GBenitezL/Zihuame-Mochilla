const express = require('express');
const beneficiariosModel = require('../models/beneficiarios');
const proyectosModel = require('../models/proyectos');
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
      const result = await proyectosModel.get();
      res.render('pages/agregar.ejs', { proyectos: result.rows } );
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
  const {nombre, fechaNacimiento, sede} = req.body;
  beneficiariosModel.insert(nombre, fechaNacimiento, sede)
    .then(()=> res.json("Beneficiario Insertado"))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/:id').delete((req, res)=>{
  beneficiariosModel.delete(req.params.id)
    .then(()=> res.json("Beneficiario Borrado"))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/:id').post((req, res)=>{
  const {nombre, fechaNacimiento, sede} = req.body;
  beneficiariosModel.update(req.params.id, nombre, fechaNacimiento, sede)
    .then(()=> res.json("Beneficiario Actualizado"))
    .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;