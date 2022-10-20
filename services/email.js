import nodeoutlook from 'nodejs-nodemailer-outlook'
export function myEmail(dest, subject, message, filename, path) {
    nodeoutlook.sendEmail({
        auth: {
            user: process.env.SenderEmail,
            pass:process.env.SenderPassword
        },
        from: process.env.SenderEmail,
        to: dest,
        subject,
        html: message,
        tls : {
            rejectUnauthorized : false,
        },
        attachments : [{   
            filename,
            path, 
            contentType: 'application/pdf'
        }],
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i)
    }
    );
}