import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class ProfileService {

    async getMyProfile(req:Request,res:Response){
        const user=req.user
        console.log(user);
    }
}
