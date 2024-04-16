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

async function sendAlert(email, spoofedAddress) {
  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    const htmlContent = `<html>
  <head>
    <style>
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
        color: #ff0000;
      }
      p {
        text-align: center;
        font-size: 18px;
        color: #333333;
        line-height: 1.5;
      }
      .spoofed-address {
        font-size: 20px;
        color: #ff0000;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Alert: Spoofed Address Detction</h2>
      <p>A spoofed IP address <span class="spoofed-address">${spoofedAddress}</span> was detected and Blacklisted.</p>
      <p>Please Reverify to Abort Blacklisting.</p>
    </div>
  </body>
</html>`;

    const mailOptions = {
      from: 'weathermonitor@gmail.com',
      to: email,
      subject: 'Alert: Spoofed Address Detection',
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);

    console.log('Alert email sent successfully to:', email);
  } catch (error) {
    logger.error('Error sending alert email:', error);
  }
}

module.exports = { sendOTP, sendAlert };
