import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  async listar() {
    return this.prisma.usuarioApp.findMany({
      where: {
        // Exclude the admin user from the listing
        usuario: {
          not: 'Admin'
        }
      },
      orderBy: {
        fecha_registro: 'desc'
      }
    });
  }

  async insertar(createUsuarioDto: CreateUsuarioDto) {
    return this.prisma.usuarioApp.create({
      data: createUsuarioDto
    });
  }

  async actualizar(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return this.prisma.usuarioApp.update({
      where: { id_usuario: id },
      data: updateUsuarioDto
    });
  }

  async eliminar(id: number) {
    return this.prisma.usuarioApp.delete({
      where: { id_usuario: id }
    });
  }

  async findOne(id: number) {
    return this.prisma.usuarioApp.findUnique({
      where: { id_usuario: id }
    });
  }
}
