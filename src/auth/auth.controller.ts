import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UtilsService } from 'src/shared/service/utils.service';
import { AuthDto } from 'src/shared/dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authSvc: AuthService,
                private utilSvc: UtilsService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    async iniciarSesion(@Body() data: AuthDto) {
        // TODO : Obtener el usarname y password de la varible "data"
        const {username, password} = data;
        //  verificar si el usarname existe
        const usuario = await this.authSvc.obtenerUsuario(username);
        // En caso de que el usaurio no exista devorlver un mensaje NotAuthorixed
        if(!usuario) {
            throw new UnauthorizedException('El usuario y/o contraseña incorrecto')
    
        }

        // Si el usuario existe verificar la contraseña
        let passwordMatch = false;
        
        if ('contrasena' in usuario && usuario.contrasena) {
            // For UsuarioApp users (including Admin), check contrasena field
            passwordMatch = await this.utilSvc.checkPassword(password, usuario.contrasena);
        } else if ('password' in usuario && usuario.password) {
            // For Usuario table users, check password field
            passwordMatch = await this.utilSvc.checkPassword(password, usuario.password);
        }

        if (passwordMatch){
            // Si la contraseña es correcta generar un JWT 
            // Remove sensitive fields before creating JWT
            const payload = { ...usuario };
            delete (payload as any).password;
            delete (payload as any).contrasena;
            delete (payload as any).fechaRegistro;
            delete (payload as any).created_at;
            delete (payload as any).updated_at;
            
            const jwt = await this.utilSvc.generateJWT(payload);

            return {token : jwt};

        }else{
            //  En caso contrario devolver un NotAuthorized
            throw new UnauthorizedException('El usuario y/o contraseña incorrecto')
        }

        

    }
                
}
