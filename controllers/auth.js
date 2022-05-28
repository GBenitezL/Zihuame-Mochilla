const { encrypt, compare } = require('../utils/handleBcrypt');
const userModel = require('../models/usuario');
const { tokenSign } = require('../utils/generateToken');
const { httpError } = require('../utils/handleError')

const loginCtrl = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await userModel.getByUserName(username);
        if (!user){
            res.status(404)
            res.send({error:'Usuario no encontrado'});
            return
        }
        const checkPassword = await compare(password, user.Password)
        const tokenSession = await tokenSign(user)
        if (checkPassword){
            res.send({data:user, token:tokenSession});
            return;
        }
        if (!checkPassword) {
            res.status(409)
            res.send({error:'Contraseña Invalida'});
            return;
        }
    } catch (err){
        httpError(res, err)
    }
}

const registerCtrl = async(req, res) => {
    const {username, password, role} = req.body;
    const passwordHash = await encrypt(password);
    const registerUser = await userModel.insert(username, passwordHash, role);
    res.send({data: registerUser});
}

module.exports = { loginCtrl, registerCtrl };