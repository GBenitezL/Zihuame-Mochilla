const { verifyToken } = require('../utils/generateToken');
const userModel = require('../models/usuario');

const checkAuth = async (req, res, next) =>{
    try {
        // const token = req.headers.authorization.split(' ')[1];
        const token = req.cookies['access-token'];
        const tokenData = await verifyToken(token);
            if(tokenData.username) {
                next()
            } else {
                res.status(409).json('No tienes acceso a este recurso');
            }        
    } catch {
        res.send('<h1>Debes <a href="/auth/login">iniciar sesión</a></hi>')
    }
}

const checkRoleAuth = (roles) => async (req, res, next) => {
    try {
        //const token = req.headers.authorization.split(' ')[1];
        const token = req.cookies['access-token'];
        const tokenData = await verifyToken(token);
        const userData = await userModel.getByUserName(tokenData.username);
        if ([].concat(roles).includes(userData.Rol)) {
            next();
        } else {
            res
                .status(409)
                .send('<h1>Debes <a href="/auth/login">iniciar sesión</a> con una cuenta de Administrador</hi>')
        }
    } catch (err) {
        res.json('Ocurrio un error');
    }
}

module.exports = { checkAuth, checkRoleAuth }