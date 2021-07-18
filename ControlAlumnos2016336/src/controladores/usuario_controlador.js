'use strict'

const bcrypt = require("bcrypt-nodejs");
const { findByIdAndDelete } = require("../modelos/usuario_modelo");
const Usuario = require('../modelos/usuario_modelo');
const jwt = require('../servicios/jwt')
const maestro = 'maestro';


function registrar(req,res){
    if (req.user.rol === maestro){
        var usuario = new Usuario();
    var params = req.body;

    if(params.username && params.contraseña && params.rol && params.nombre && params.apellido){
        usuario.username = params.username;
        usuario.contraseña = params.contraseña;
        usuario.rol = maestro;
        usuario.nombre = params.nombre;
        usuario.apellido = params.apellido;

        Usuario.find({username: usuario.username}).exec((err, usuarioEncontrado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la solicitud de usuario'});

            if(usuarioEncontrado && usuarioEncontrado.length >=1){
                return res.status(200).send({mensaje:'Este usuario ya existe'});
            }else{
                bcrypt.hash(params.contraseña, null, null, (err, contraseñaEncriptada)=>{
                    usuario.contraseña = contraseñaEncriptada;

                    usuario.save((err, usuarioGuardado)=>{
                        if(err) return res.status(500).send({mensaje: 'Error al guardar el usuario'});

                        if (usuarioGuardado){
                           return res.status(200).send(usuarioGuardado);
                        }else{
                           return res.status(404).send({ mensaje: 'No se ha podido registrar el Usuario'});
                        }
                    })
                })
            }
        })
    }
    }else{
        return res.status(404).send({ mensaje: 'No tiene permiso para realizar esta acción'});
    }
    
}


function login(req,res){
    var params = req.body;
    
    Usuario.findOne({$and:[
        { username: params.username},
        { rol: {$regex: params.rol, $options: 'i'}}
    ]}, (err,usuarioEncontrado)=>{
        if(err) return res.status(404).send({mensaje: 'Error en la solicitud de Login'});

        if(usuarioEncontrado){
            bcrypt.compare(params.contraseña, usuarioEncontrado.contraseña, (err, contraVerificada)=>{
                if (err)  return res.status(500).send({ mensaje: 'Error en la contraseña'});

                if(contraVerificada){
                    var constancia = params.rol;
                    
                        return res.status(200).send({
                            token: jwt.createToken({usuarioEncontrado})
                        });
                    
                }else{
                    return res.status(404).send({mensaje: 'El usuario no se ha podido identificar'});
                }
            })
        }else{
            return res.status(404).send({mensaje:'El usuario no se ha encontrado'});
        }
    })


}



module.exports = {
    registrar,
    login
}