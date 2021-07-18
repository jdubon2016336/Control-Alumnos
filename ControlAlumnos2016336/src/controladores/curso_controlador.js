'use strict'

const { deleteOne } = require('../modelos/curso_modelo');
const Curso = require('../modelos/curso_modelo');
const Alumno = require('../modelos/usuario_modelo')
const maestro = 'maestro';


function agregarCurso(req,res){
    var curso = new Curso();
    var params = req.body;

    if(req.user.rol ===maestro){
            if (params.nombreCurso){
                curso.nombreCurso = params.nombreCurso;
                curso.profesor = req.user.sub;
                curso.save((err,cursoGuardado)=>{
                    if(err) return res.status(404).send({mensaje: 'Error en la solicitud de guardar'});

                        if(cursoGuardado){
                            return res.status(200).send(cursoGuardado)
                        }else{
                            return res.status(404).send({mensaje:'No se pudo guardar el curso'});
                        }
                })
            }
    }else{
        res.status(404).send({mensaje: 'Usted no tiene los permisos necesarios'});
    }
}


function editar(req,res){
    var idCurso = req.params.idCurso;
    var params = req.body;
    Cursos.findById(idCurso, (err,cursoEncontrado)=>{
        if(err) return res.status(400).send({mensaje: 'Error en la solicitud de busqueda'});
        if(cursoEncontrado){
            if(cursoEncontrado.profesor == req.user.sub){
                Cursos.update(cursoEncontrado, params, {new:true}, (err,cursoActualizado)=>{
                    if(err) return res.status(501).send({mensaje: 'Error en la solicitud'});
                    if(!cursoActualizado) return res.status(500).send({mensaje: 'No se pudo actualizar el curso'});
                    return res.status(500).send({mensaje: 'El Curso '+ cursoEncontrado.nombreCurso + ' fue actualizado'});
                })
            }else{
                return res.status(500).send({mensaje:'El curso no le pertenece'})
            }
        }
    })
}

function eliminar(req,res){
    var idCurso = req.params.idCurso;
    var posicion
    Cursos.findOne({nombre:"defecto"},(err,defectoEncontrado)=>{
    Cursos.findById(idCurso, (err,cursoEncontrado)=>{
        if(cursoEncontrado){
            
        if(cursoEncontrado.maestro == req.user.sub){
            Cursos.deleteOne(cursoEncontrado, (err,cursoEliminado)=>{
                Alumnos.find({cursos:idCurso}).exec((err,alumnosEncontrados)=>{
                    alumnosEncontrados.forEach((nuevoCurso)=>{
                        posicion = nuevoCurso.cursos.indexOf(idCurso);
                        nuevoCurso.cursos[posicion] = defectoEncontrado._id;
                        let data = nuevoCurso.cursos;
                        defaultUsuario(nuevoCurso._id, data).then((arrayEliminado)=>{
                        })
                        
                    })
            
                })   
                if(err) return res.status(501).send({mensaje: 'Error en la solicitud'});
                return res.status(200).send({
                    cursoEncontrado,
                    mensaje: 'Curso Eliminado'
                })                
            })
        }else{
            return res.status(500).send({mensaje:'El curso no le pertenece'})
        }
        }else{
            
            
                return res.status(500).send({mensaje:'No se encontro el curso'})
            
        }
    })
})
}


function listarCursos(req,res){
    var idMaestro = req.user.sub;

    Cursos.find({profesor:idMaestro}, (err,cursosEncontrados)=>{
        if(err) return res.status(404).send({mensaje:'Error en la solicitud Listar'})
        return res.status(200).send(cursosEncontrados);
        
    })
  
    
}

module.exports = {
    agregarCurso,
    editar,
    eliminar,
    listarCursos
}
