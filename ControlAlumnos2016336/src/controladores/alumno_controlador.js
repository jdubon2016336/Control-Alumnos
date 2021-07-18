'use strict'

const alumno = 'alumno';
const bcrypt = require("bcrypt-nodejs");
const jwt = require('../servicios/jwt');
const Usuario = require('../modelos/usuario_modelo');

function registrar(req,res){
    var usuario = new Usuario();
    var params = req.body;

    if(params.nombre && params.apellido && params.carnet){
        usuario.nombre = params.nombre;
        usuario.apellido = params.apellido;
        usuario.carnet = params.carnet;
        usuario.username = params.username;
        usuario.rol= alumno;

        Usuario.find({carnet: params.carnet}).exec((err, alumnoEncontrado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la solicitud de alumno'});
            if(alumnoEncontrado && alumnoEncontrado.length >= 1){
                return res.status(404).send({mensaje:'El alumno ya existe'});
            }else{
                bcrypt.hash(params.contraseña, null, null,(err,contraseñaEncriptada)=>{
                    usuario.contraseña = contraseñaEncriptada;
                    usuario.save(); 
                    return res.status(200).send({mensaje: 'Se creo el usuario del alumno '});
                })
            }
        })        
    }
}

function asignar(req,res){
    var idCurso1 = req.params.idCurso1;
    var idAlumno = req.user.sub;
    var usuario = new Usuario();
    var rol = req.user.rol;
    if(rol == alumno){
        Usuario.findOne({_id : idAlumno}).exec((err,alumnoEncontrado)=>{
            if(alumnoEncontrado.cursos.length < 3){
                for (let i = 0; i < alumnoEncontrado.cursos.length; i++) {
                   if(alumnoEncontrado.cursos[i] == idCurso1){
                    return res.status(500).send({mensaje:'Ya esta asignado a este curso'});
                   }
                }
                Usuario.findOneAndUpdate({
                    _id: idAlumno
                    },{
                    $push:{
                    cursos: idCurso1
                    }
                    },(err,alumnoActualizado)=>{
                    return res.status(500).send(alumnoActualizado);
                    })
            }else{
                return res.status(404).send({mensaje:'No se puede asignar a más de 3 cursos'});
            }
        })
    } else{
        return res.status(404).send({mensaje:'No se puede asignar a los cursos'});
    }  
}

function obtener(req,res){
    var idAlumno = req.user.sub;
    var rol = req.user.rol;
    if(rol === alumno){
        Usuario.find({_id : idAlumno}).populate('cursos').exec((err,cursosAsignados)=>{
            return res.status(200).send({cursosAsignados});
     })
    }else{
        return res.status(404).send({mensaje:'No esta asignado a los cursos'});
    }
    
}


function editar(req,res){
    var idAlumno = req.user.sub;
    var params = req.body;
    var rol = req.user.rol;
    delete params.username;
    delete params.contraseña;
    delete params.rol;
    if(rol===alumno){
        Usuario.findByIdAndUpdate(idAlumno, params ,{new:true},(err,alumnoActualizado)=>{
            if(err) return res.status(500).send({mensaje: 'error en la solicitud'})
            if(!alumnoActualizado) return res.status(500).send({mensaje: 'No se ha podido actualizar el Alumno'});
            return res.status(200).send({alumnoActualizado})
        })
    }else{
        return res.status(404).send({mensaje:'Usted no es un alumno'});
    }
}

function eliminar(req,res){
    var idAlumno = req.user.sub;
    if(req.user.rol==alumno){
        Usuario.findByIdAndDelete(idAlumno,(err, alumnoEncontrado)=>{
            if(alumnoEncontrado) return res.status(200).send({mensaje: 'Alumno Eliminado'});
        })
    }else{
        return res.status(404).send({mensaje:'Usted no es un alumno'});
    }
    
}



module.exports = {
    registrar,
    asignar,
    obtener,
    editar,
    eliminar
}
