import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UtilsService } from 'src/shared/service/utils.service';

@Injectable()
export class AuthService {
    private adminPasswordHash: string;

    constructor(
        private prisma: PrismaService,
        private utilsService: UtilsService
    ) {
        // Pre-hash the admin password when the service is initialized
        this.initializeAdminPassword();
    }

    private async initializeAdminPassword() {
        this.adminPasswordHash = await this.utilsService.hashPassword('Password123');
    }

    async obtenerUsuario(username: string){
        // Check if it's the default admin user
        if (username === 'Admin') {
            // Ensure admin password is hashed
            if (!this.adminPasswordHash) {
                await this.initializeAdminPassword();
            }
            
            return {
                id_usuario: 0,
                nombre: 'Admin',
                apellido: 'System',
                numero_control: 'ADMIN001',
                usuario: 'Admin',
                email: 'admin@system.com',
                contrasena: this.adminPasswordHash,
                fecha_registro: new Date(),
                created_at: new Date(),
                updated_at: new Date()
            };
        }

        // Check for users in UsuarioApp table
        const usuarioApp = await this.prisma.usuarioApp.findFirst({
            where: {
                usuario: username
            }
        });

        if (usuarioApp) {
            return usuarioApp;
        }

        // Fallback to original Usuario table for backward compatibility
        return await this.prisma.usuario.findFirst({
            where: {
                username: username
            }
        });
    }
}
