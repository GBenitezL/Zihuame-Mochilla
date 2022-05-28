const httpError = (res, err) => {
    res.status(500);
    res.send({message: 'Hubo un error', error: err})
}

module.exports = { httpError }