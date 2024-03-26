const nodemailer = require('nodemailer');
const logger = require("./Logger");
async function sendOTP(email, otp) {
    try {
        // Create a transporter object using SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD // replace with actual password
            }
        });
        let htmlContent = `
  <html>
    <head>
      <style>
        /* Add your CSS styles for email here */
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .otp {
          font-size: 24px;
          color: #007bff;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>IP Whitelisting</h2>
        <p>Your OTP for Whitelisting IP is: <span class="otp">${otp}</span></p>
        <p>Please use this OTP to proceed with the verification process.</p>
      </div>
    </body>
  </html>
`;
        // Email options
        const mailOptions = {
            from: 'weathermonitor@gmail.com', // Sender address
            to: email, // Recipient address
            subject: 'Your OTP for IP Whitelisting', // Subject line
            html: htmlContent // Plain text body
        };

        // Send email
        await transporter.sendMail(mailOptions);

        logger.info('OTP sent successfully to:', email);
    } catch (error) {
        logger.error('Error sending OTP:', error);
    }
}

module.exports = { sendOTP };