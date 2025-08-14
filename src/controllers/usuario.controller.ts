import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  HttpException,
  HttpStatus 
} from '@nestjs/common';
import { UsuarioService } from '../modules/usuario/usuario.service';
import { CreateUsuarioDto } from '../modules/usuario/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../modules/usuario/dto/update-usuario.dto';
import { UtilsService } from '../shared/service/utils.service';

@Controller('usuarios')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly utilsService: UtilsService
  ) {}

  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    try {
      // Hash the password before saving
      const hashedPassword = await this.utilsService.hashPassword(createUsuarioDto.contrasena);
      createUsuarioDto.contrasena = hashedPassword;
      
      const usuario = await this.usuarioService.insertar(createUsuarioDto);
      return {
        mensaje: 'Usuario creado exitosamente',
        data: usuario
      };
    } catch (error: any) {
      console.error('Error creating usuario:', error);
      if (error.code === 'P2002') {
        throw new HttpException(
          'El número de control, usuario o email ya existe',
          HttpStatus.CONFLICT
        );
      }
      throw new HttpException(
        'Error al crear el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.usuarioService.listar();
    } catch (error: any) {
      throw new HttpException(
        'Error al obtener los usuarios',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const usuario = await this.usuarioService.findOne(+id);
      if (!usuario) {
        throw new HttpException(
          'Usuario no encontrado',
          HttpStatus.NOT_FOUND
        );
      }
      return usuario;
    } catch (error: any) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    try {
      // Hash the password if it's being updated
      if (updateUsuarioDto.contrasena) {
        const hashedPassword = await this.utilsService.hashPassword(updateUsuarioDto.contrasena);
        updateUsuarioDto.contrasena = hashedPassword;
      }
      
      const usuario = await this.usuarioService.actualizar(+id, updateUsuarioDto);
      return {
        mensaje: 'Usuario actualizado exitosamente',
        data: usuario
      };
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new HttpException(
          'Usuario no encontrado',
          HttpStatus.NOT_FOUND
        );
      }
      if (error.code === 'P2002') {
        throw new HttpException(
          'El número de control, usuario o email ya existe',
          HttpStatus.CONFLICT
        );
      }
      throw new HttpException(
        'Error al actualizar el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.usuarioService.eliminar(+id);
      return {
        mensaje: 'Usuario eliminado exitosamente'
      };
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new HttpException(
          'Usuario no encontrado',
          HttpStatus.NOT_FOUND
        );
      }
      throw new HttpException(
        'Error al eliminar el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
