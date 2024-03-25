const nodemailer = require('nodemailer');
const logger = require("./Logger");
async function sendOTP(email, otp) {
    try {
        // Create a transporter object using SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL, // Your email address
                pass: process.env.PASSWORD // Your email password
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL, // Sender address
            to: email, // Recipient address
            subject: 'Your OTP for IP Whitelisting', // Subject line
            text: `Your OTP for IP Whitelisting is: ${otp}` // Plain text body
        };

        // Send email
        await transporter.sendMail(mailOptions);

        logger.info('OTP sent successfully to:', email);
    } catch (error) {
        logger.error('Error sending OTP:', error);
    }
}

module.exports = { sendOTP };