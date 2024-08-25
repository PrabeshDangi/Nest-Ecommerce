import { Address } from "nodemailer/lib/mailer"

export class sendEmailDto{
    from?:Address
    recepients:Address[]
    subject:string
    html:string
    text?:string
    placeholderReplacements?:Record<string,string>
}