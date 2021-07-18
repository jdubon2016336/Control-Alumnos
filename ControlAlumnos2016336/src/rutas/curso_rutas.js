'use strict'

const express = require("express");
const cursoControlador = require('../controladores/curso_controlador');
const md_autenticacion = require('../middlewares/authenticated');

var api = express.Router();
api.post('/agregarCurso', md_autenticacion.ensureAuth, cursoControlador.agregarCurso);
api.put('/editarCurso/:idCurso', md_autenticacion.ensureAuth, cursoControlador.editar);
api.put('/eliminarCurso/:idCurso', md_autenticacion.ensureAuth, cursoControlador.eliminar);
api.get('/listarCursos',md_autenticacion.ensureAuth ,cursoControlador.listarCursos);


module.exports = api;