import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { promises } from 'dns';
import { jwtConstants } from 'src/constants/jwt.contants';

@Injectable()
export class UtilsService {

    constructor(private jwtScv: JwtService){}

    async hashPassword(password: string ): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async checkPassword(password: string, encryptedPassword: string): Promise<boolean>{
        return await bcrypt.compareSync(password, encryptedPassword);
    }


    async generateJWT(payload: any ): Promise<string>{

        var jwt = await this.jwtScv.signAsync(payload, {secret: jwtConstants.secret})
        return jwt;
    }

    async getPayload( jwt: string): Promise<any> {
        var payload = await this.jwtScv.verifyAsync(jwt, {secret: jwtConstants.secret})
        const {iat, exp, ...data } = payload;

        return data;
    }

}
