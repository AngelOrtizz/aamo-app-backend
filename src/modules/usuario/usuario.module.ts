import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from '../../controllers/usuario.controller';
import { PrismaService } from '../../prisma.service';
import { UtilsService } from '../../shared/service/utils.service';
import { jwtConstants } from '../../constants/jwt.contants';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService, PrismaService, UtilsService],
  exports: [UsuarioService], // Export for use in other modules
})
export class UsuarioModule {}
