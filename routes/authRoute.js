const express = require('express');
const db = require('../utils/db');
const router = express.Router();
const { checkAuth, checkRoleAuth } = require('../middlewares/auth');
const { verifyToken } = require('../utils/generateToken');


const { loginCtrl, registerCtrl } = require('../controllers/auth');

router.route('/login').get(async (req, res) => {
    try {
      res
      .cookie('access-token', '')
      .cookie('username', '')
      .render('pages/login.ejs');
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  });

  router.route('/registrar').get(checkAuth, checkRoleAuth(['Administrador']), async (req, res) => {
    try {
      const usuarios = await db.query(`select "Usuario", "Rol" from "Usuarios"`);
      res.render('pages/registrar.ejs', { usuarios: usuarios.rows });
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  });

  router.route('/borrar/:usuario').get(checkAuth, checkRoleAuth(['Administrador']), async (req, res) => {
    try {
      const admins = await db.query(`select * from "Usuarios" where "Rol" = 'Administrador' `);
      const user = await db.query(`select * from "Usuarios" where "Usuario" = $1`, [req.params.usuario]);
      const token = req.cookies['access-token'];
      const tokenData = await verifyToken(token);
      const activeUser = tokenData.username;
      if ((admins.rowCount == 1 && user.rows[0].Rol == 'Administrador') || activeUser == user.rows[0].Usuario ) {
        res.send('<h1>No puedes borrar al único administrador o al usuario activo.</h1>')
      } else {
        await db.query('delete from "Usuarios" where "Usuario" = $1', [req.params.usuario])
        res.redirect('/auth/registrar');
      }
    } catch (err) {
      res.send("Error " + err);
    }
  });

router.post('/login', loginCtrl);

router.post('/registrar',checkAuth, checkRoleAuth(['Administrador']), registerCtrl);

module.exports = router;