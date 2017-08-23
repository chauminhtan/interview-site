
var extend = require('extend'),
    nodemailer = require('nodemailer');

module.exports = {
    send: (obj) => {
        // var transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: 'tanc.dev@gmail.com',
        //         pass: '******'
        //     }
        // });

        var transporter = nodemailer.createTransport({
            host: 'mail.waverleysoftware.com',
            port: 465,
            secure: true,
            auth: {
                user: 'tan.chau@waverleysoftware.com',
                pass: 'minhtan84'
            }
        });

        var mailOptions = {
            from: 'noreply@waverleysoftware.com',
            to: 'tan.chau@waverleysoftware.com',
            subject: 'Sending Email using Node.js',
            html: 'That was easy!'
        };

        var finalMailOptions = extend(true, mailOptions, obj);

        transporter.sendMail(finalMailOptions, (error, info) => {
            if (error) {
                sendErr(res, error);
            } else {
                console.log('Email sent: ', info.response);
                // sendSuccess(res, {
				// 	data: 'Email sent: ' + info.response
				// });
            }
        }); 
    }
}