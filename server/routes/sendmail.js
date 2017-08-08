var path = require('path'),
    nodemailer = require('nodemailer'),
	User = require(path.join(__dirname, "..", "/models/user")),
	extend = require('extend'),
	response = require('../include/response'),
	sendErr = response.sendErr,
	sendSuccess = response.sendSuccess;

module.exports = {
    test: (req, res) => {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tanc.dev@gmail.com',
                pass: '1q2w3e4r*'
            }
        });

        var mailOptions = {
            from: 'noreply@gmail.com',
            to: 'tan.chau@waverleysoftware.com',
            subject: 'Sending Email using Node.js',
            html: 'That was easy!'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                sendErr(res, error);
            } else {
                sendSuccess(res, {
					data: 'Email sent: ' + info.response
				});
            }
        }); 
    },
	sendMail: (req, res) => {
		
		User.where('_id').equals(req.params.id).select('id email name dateModified isAdmin').exec((err, user) => {
			// res.json(user);
			// console.log(user);
			if (err) {
				sendErr(res, err);
			} else {
				sendSuccess(res, {
					data: user[0]
				});
			}
		});
    }
}