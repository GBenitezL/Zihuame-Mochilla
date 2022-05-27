const express = require('express');
const db = require('../public/js/db');
const gruposModel = require('../models/grupos');
const proyectosModel = require('../models/proyectos');
const router = express.Router();