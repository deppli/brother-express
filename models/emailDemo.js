/**
 * Created by virgo on 2015/3/13.
 */
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp.annlover.com',
    port: 25,
    auth: {
        user: 'zhanghuan@annlover.com',
        pass: 'Ann870113'
    }
}));
transporter.sendMail({
    from: 'zhanghuan@annlover.com',
    to: 'm13818239270@163.com',
    subject: 'hello',
    text: 'hello world!'
});