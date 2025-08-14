import { Module } from '@nestjs/common';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsuarioModule,
    AuthModule, // Add the Auth module for authentication endpoints
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
