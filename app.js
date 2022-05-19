// Dependencias
const express = require("express");
var path = require('path');
const db = require("./public/js/db");
const ejs = require("ejs");

const beneficiariosRouter = require('./routes/beneficiariosRoute');
const gruposRouter = require('./routes/gruposRoute');

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

app.use('/beneficiarios', beneficiariosRouter);
app.use('/grupos', gruposRouter);

//Configuracion EJS
app.set('view engine', 'ejs');
ejs.delimiter = '/';
ejs.openDelimiter = '[';
ejs.closeDelimiter = ']';

app.listen(port);
console.log('Server running on Port:' + port)
