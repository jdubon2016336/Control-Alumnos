'use strict'

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    username: String,
    contraseña: String,
    rol:String,
    nombre: String,
    apellido: String,
    carnet: String,
    cursos:[{type: Schema.Types.ObjectId, ref:'Cursos'}]
})

module.exports = mongoose.model('Usuarios', UsuarioSchema);