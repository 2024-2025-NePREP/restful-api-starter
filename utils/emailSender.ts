import nodemailer from 'nodemailer'
import { GMAIL_AUTH_APP_WORD, GMAIL_AUTH_EMAIL } from '../constants/envVars';
import { EMAIL_CONTEXT } from '../constants/common';
import { validateEnums } from './checkValidEnum';

interface EmailSenderOptions {
    signInEmail?: string,
    verificationCode?: string,
    passwordResetLink?: string,
    emailContext: EMAIL_CONTEXT,
    resettingEmail?:string,
}
export const emailSender = ({
    signInEmail,
    verificationCode,
    passwordResetLink,
    emailContext,
    resettingEmail
}: EmailSenderOptions

) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: GMAIL_AUTH_EMAIL,
            pass: GMAIL_AUTH_APP_WORD,
        },
    });

    const senderEmail = GMAIL_AUTH_EMAIL;
    let mailOptions;
    console.log('link ', passwordResetLink);
    // Check valid email context is passed
    validateEnums({
        emailContext: {value: emailContext, enumType:EMAIL_CONTEXT}
    })

    if(emailContext === EMAIL_CONTEXT.OTP){

        mailOptions = {
            from: senderEmail,
            to: signInEmail,
            subject: "OTP Verfication",
            text: `Your verification code is ${verificationCode}`,
        };
    }else if(emailContext === EMAIL_CONTEXT.PASSWORD_RESET){
        mailOptions = {
            from: senderEmail,
            to: resettingEmail,
            subject: "Password Reset",
            text: `Reset your password ${passwordResetLink}`,
        };
    }

// Send the OTP
     transporter.sendMail(mailOptions!, (err, result) => {
       
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        console.log("successfully email sent");
    });
};
