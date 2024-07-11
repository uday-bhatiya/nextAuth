import User from '@/models/user.model';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {

        const hashedToken = await bcrypt.hash(userId.toString(), 10)

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, { 
                $set: {
                    varifyToken: hashedToken, varifyTokenExpiry: Date.now() + 3400000
                }
             })
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, { 
                $set: {
                    forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3400000
                }
             })
        }
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASSWORD
            }
        });

        const mailOptions = {
            from: 'temp.mail@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "Verify your email" : "Reset your password"} or copy and paste the link below in your browser. <br>${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`
        }

        const mailResponse = await transporter.sendMail(mailOptions)
        return mailResponse

    } catch (error: any) {
        throw new Error(error.message)
    }
}