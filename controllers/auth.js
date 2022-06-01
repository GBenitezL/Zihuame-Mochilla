const { encrypt, compare } = require('../utils/handleBcrypt');
const userModel = require('../models/usuario');
const { tokenSign } = require('../utils/generateToken');
const { httpError } = require('../utils/handleError');

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
            res
                .cookie('access-token', tokenSession)
                .redirect('/beneficiarios')
            return;
        }
        if (!checkPassword) {
            res
            .status(409)
            .cookie('access-token', '')
            .send('<h1>Error: Contraseña Invalida</h1>');
            return;
        }
    } catch (err){
        res.send(err)
    }
}

const registerCtrl = async(req, res) => {
    const {username, password, role} = req.body;
    const passwordHash = await encrypt(password);
    const registerUser = await userModel.insert(username, passwordHash, role);
    res.send({data: registerUser});
}

module.exports = { loginCtrl, registerCtrl };