import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDTO } from './dto/create-usuario.dto';
import { UtilsService } from 'src/shared/service/utils.service';
import { AuthGuard } from 'src/shared/guard/auth/auth.guard';

@Controller('usuarios')
@UseGuards(AuthGuard)

//@UsePipes(new ValidationPipe)
export class UsuariosController {

    constructor(private usuarioSvc: UsuariosService, private  UtilSvc:UtilsService){}

    @Get()
    
    listar(){
         return this.usuarioSvc.listar();
    }

    @Get("clave")
    getUsuarioById(clave: number){
        return `Usuarios: ${clave}` ;
    }

    @Post()
    async crear(@Body() usuario: CreateUsuarioDTO ){
        // encriptalar la contraseña
        var encrypted = await this.UtilSvc.hashPassword(usuario.password);
        usuario.password = encrypted;
       return this.usuarioSvc.crear(usuario);
    }

    @Put()
    actualizar (){
        return this.usuarioSvc.actualizar();
    }

    @Delete(':cveUsuario')
    eliminar (@Param('cveUsuario',ParseIntPipe) cveUsuario: number){
        return this.usuarioSvc.eliminar(cveUsuario

        );
    }
}
