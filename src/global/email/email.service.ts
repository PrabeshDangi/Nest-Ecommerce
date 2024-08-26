import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { sendEmailDto } from './dto/sendEmail.dto';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  mailTransport() {
    // console.log(
    //   process.env.HOST,
    //   process.env.USERNAME,
    //   process.env.MAILTRAP_PASS,
    // );
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    return transporter;
  }

  async sendEmail(dto: sendEmailDto, res: Response) {
    const { from, recepients, html, subject } = dto;

    const transport = this.mailTransport();

    const options: MailOptions = {
      from: from ?? {
        name: process.env.DEFAULT_ADDRESS,
        address: process.env.DEFAULT_EMAIL,
      },
      to: recepients,
      html,
      subject,
    };

    transport.sendMail(options, (error, info) => {
      if (error) {
        console.error('Error occurred while sending email:', error);
        return res.status(500).json({ message: 'Error sending email', error });
      }
      // console.log('Email sent successfully:', info);
      // return res.status(200).json({ message: 'Email sent successfully', info });
    });
  }
}
