'use strict'

const express = require("express");
const usuarioControlado = require('../controladores/usuario_controlador');
const alumnoControlado = require('../controladores/alumno_controlador');
const md_autenticacion = require('../middlewares/authenticated');


var api = express.Router();


api.post('/registrarAlumno', alumnoControlado.registrar);
api.put('/asignarCursos/:idCurso1', md_autenticacion.ensureAuth, alumnoControlado.asignar);
api.put('/editarAlumno', md_autenticacion.ensureAuth, alumnoControlado.editar);
api.get('/obtenerCursos', md_autenticacion.ensureAuth, alumnoControlado.obtener);
api.delete('/eliminarAlumno', md_autenticacion.ensureAuth, alumnoControlado.eliminar);


api.post('/login', usuarioControlado.login);
api.post('/registrarUsuario', md_autenticacion.ensureAuth, usuarioControlado.registrar);






module.exports = api;