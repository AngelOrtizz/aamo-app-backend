import { Injectable } from '@nestjs/common';
import { CreateUsuarioDTO } from './dto/create-usuario.dto';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class UsuariosService {
    constructor (private prisma: PrismaService) {}


    listar(){
        return this.prisma.usuario.findMany({
            select:{
                cveUsuario: true,
                nombre: true,
                apellidos: true,
                username: true,
                fechaRegistro: true,
                correo: true,
                password: false
            }
        });
    }

    crear(usuario:CreateUsuarioDTO){
        return this.prisma.usuario.create({ 
            data: usuario,
                select:{
                cveUsuario: true,
                nombre: true,
                apellidos: true,
                username: true,
                fechaRegistro: true,
                correo: true,
                password: false
            }
         });
    }

    actualizar(){
        return"Actualizar Usuario"
    }

    async eliminar(cveUsuario: number){

        return await this.prisma.usuario.delete({
            where: {
                cveUsuario: cveUsuario
            },
                select:{
                cveUsuario: true,
                nombre: true,
                apellidos: true,
                username: true,
                fechaRegistro: true,
                correo: true,
                password: false
            }
        })
    }

}
