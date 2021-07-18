'use strict'

const mongoose = require("mongoose");
const Usuario = require('./src/modelos/usuario_modelo');
const Curso = require('./src/modelos/curso_modelo');
const bcrypt = require("bcrypt-nodejs");
const app = require('./app')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ControlAlumnos', {useNewUrlParser:true, useUnifiedTopology:true}).then(()=>{
    console.log('Esta conectado a la base de datos');

    var username = 'Maestro';
    var contraseña = '123456';
    var rol = 'ROL_MAESTRO';
    var defecto = 'default';
    var usuario = new Usuario();
    var curso = new Curso();

    curso.nombreCurso = defecto;
    usuario.username = username;
    usuario.contraseña = contraseña;
    usuario.rol = rol;


    Usuario.find({username: usuario.username}).exec((err, usuarioEncontrado)=>{
        if(usuarioEncontrado && usuarioEncontrado.length >=1){
            console.log('Este usuario ya existe'); 
        }else{
            bcrypt.hash(usuario.contraseña, null, null, (err, contraseñaEncriptada)=>{
                usuario.contraseña = contraseñaEncriptada;
                
                usuario.save((err, usuarioGuardado)=>{
                    if(err)  console.log('Error en la solicitud de guardado');
                    
                    if (usuarioGuardado){
                          console.log({usuarioGuardado});
                    }else{
                          console.log('No se ha guardado el usuario');
                        }
                })
                }) 
        }
        Curso.find({nombreCurso: curso.nombreCurso}).exec((err, cursoEncontrado)=>{
            if(cursoEncontrado && cursoEncontrado.length >=1){
                  console.log('El curso ya existe');    
            }else{ 
                curso.save((err, cursoGuardado)=>{
                    if(cursoGuardado) {
                        console.log({cursoGuardado}); 
                    } 
                });
            }
        })
    })
    app.listen(3000,function(){
        console.log('La aplicacion esta corriendo en el puerto 3000');
    })     
}).catch(err => console.log(err))