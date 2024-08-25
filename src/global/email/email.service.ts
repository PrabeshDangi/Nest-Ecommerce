import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import { sendEmailDto } from './dto/sendEmail.dto';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class EmailService {
    constructor(private configService:ConfigService){}

    mailTransport(){
        console.log(this.configService.get<string>('USERNAME'))
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: 465,
            secure: true, 
            auth: {
              user:process.env.USERNAME ,
              pass: process.env.PASSWORD,
            },
          });
        return transporter  
    }

    async sendEmail(dto:sendEmailDto,res:Response){
        const {from,recepients,html,subject,placeholderReplacements}=dto;

        const transport=this.mailTransport()

        const options:MailOptions={
            from:from ?? {   
                
                name: process.env.DEFAULT_ADDRESS,
                address: process.env.DEFAULT_EMAIL,
            },
            to:recepients,
            html,
            subject
        }

        // try {
        //     const result=await transport.sendMail(options)
        //     return result
        // } catch (error) {
        //     console.log("Error",error)
        // }
        transport.sendMail(options, (error, info) => {
            if (error) {
              console.error('Error occurred while sending email:', error);
              return res.status(500).json({ message: 'Error sending email', error });
            }
            console.log('Email sent successfully:', info.response);
            res.status(200).json({ message: 'Email sent successfully', info });
          });
    }

    
}
