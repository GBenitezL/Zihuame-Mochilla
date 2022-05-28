const { verifyToken } = require('../utils/generateToken');

const checkAuth = async (req, res, next) =>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        const tokenData = await verifyToken(token);
            if(tokenData.username) {
                next()
            } else {
                res.status(409).json('No tienes acceso a este recurso');
            }        
    } catch {
        res.send('Debes iniciar sesion')
    }
}

const checkRoleAuth = (roles) => async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const tokenData = await verifyToken(token);
        const userData = await userModel.getByUserName(username);

        if ([].concat(roles).includes(userData.Role)) {
            next();
        } else {
            res.status(409).json('No tienes acceso a este recurso')
        }
    } catch (err) {
        res.json(err);
    }
}

module.exports = { checkAuth, checkRoleAuth }