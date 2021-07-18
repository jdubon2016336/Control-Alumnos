'use strict'

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CursoSchema = Schema({
    nombreCurso: String,
    profesor: {type:Schema.Types.ObjectId, ref:'Usuarios'}
})

module.exports = mongoose.model('Cursos', CursoSchema);