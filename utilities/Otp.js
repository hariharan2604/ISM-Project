const nodemailer = require('nodemailer');
const logger = require("./Logger");
async function sendOTP(email, otp, address) {
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
    let htmlContent = `<html>
  <head>
    <style>
      /* Add your CSS styles for email here */
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h2 {
        text-align: center;
        color: #007bff;
      }
      p {
        text-align: center;
        font-size: 18px;
        color: #333333;
        line-height: 1.5;
      }
      .otp {
        font-size: 36px;
        color: #007bff;
        font-weight: bold;
      }
      .highlight {
        background-color: #f0f0f0;
        padding: 5px 10px;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>IP Whitelisting</h2>
      <p>Your OTP for Whitelisting IP <span class="highlight">${address}</span> is: <span class="otp">${otp}</span></p>
      <p>Please use this OTP to proceed with the verification process.</p>
    </div>
  </body>
</html>
`;
    // Email options
    const mailOptions = {
      from: 'weathermonitor@gmail.com', // Sender address
      to: email, // Recipient address
      subject: `IP Whitelisting Authorisation`, // Subject line
      html: htmlContent // Plain text body
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log('OTP sent successfully to:', email);
  } catch (error) {
    logger.error('Error sending OTP:', error);
  }
}

module.exports = { sendOTP };