import nodemailer from 'nodemailer'

export async function sendEmail(to: string, html: string) {

    // const testAccount = await nodemailer.createTestAccount()
    // console.log('testAccount: ',testAccount)

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: 'krpfikrqvljnw46z@ethereal.email',
            pass: 'AR3DCYj3yuP8GVRrWr',
        },
    })

    const info = await transporter.sendMail({
        from: '"Forgot Password 👻" <forgotpassword@example.com>',
        to,
        subject: "Change Password",
        html,
    })

    console.log("Message sent: %s", info.messageId)
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
}