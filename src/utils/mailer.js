const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const mailConfig = require("../config/mail.config");
const fs = require("fs");
const path = require("path")
const handlebars = require("handlebars")
// Khởi tạo OAuth2Client với Client ID và Client Secret 
const oauth2Client = new google.auth.OAuth2(
  mailConfig.MAILER_CLIENT_ID,
  mailConfig.MAILER_CLIENT_SECRET
);
oauth2Client.setCredentials({
  refresh_token: mailConfig.MAILER_REFRESH_TOKEN
});

const sendEmail = async (sendData) => {
    try {
      const __dirname = path.resolve();
      const filePath = path.join(__dirname, './src/resources/views/mail.handlebars')
      const source = fs.readFileSync(filePath, 'utf-8').toString();
      const template = handlebars.compile(source);
      const replacements = {
        shop: "WEb SO SANH GIA SCALE",
        name: `<strong>${sendData.reciverEmail.split("@")[0]}</strong>`,
        product_name: `<strong>${sendData.product_name}</strong>`,
        product_price: `<strong>${sendData.product_price}</strong>`,
        link_image: `src="${sendData.link_image}"`,
        product_link: `href="${sendData.product_link}"`,
        web_link: `href="http://localhost:8080/v1/products"`
      };
      const htmlToSend = template(replacements);
      const myAccessTokenObject = await oauth2Client.getAccessToken()
      // Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
      const myAccessToken = myAccessTokenObject?.token
      // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: mailConfig.ADMIN_EMAIL_ADDRESS,
          clientId: mailConfig.MAILER_CLIENT_ID,
          clientSecret: mailConfig.MAILER_CLIENT_SECRET,
          refresh_token: mailConfig.MAILER_REFRESH_TOKEN,
          accessToken: myAccessToken
        }
      })
      // mailOption là những thông tin gửi từ phía client lên thông qua API
      const mailOptions = {
        form: mailConfig.ADMIN_EMAIL_ADDRESS,
        to: sendData.reciverEmail, // Gửi đến ai?
        subject: "Báo giá sản phẩm", // Tiêu đề email
        html: htmlToSend // Nội dung email
      }
      // Gọi hành động gửi email
      await transport.sendMail(mailOptions)
      console.log('Email sent successfully.')
    } catch (error) {
      console.log(error)
      throw new Error({error: error.message})
    }
  }
module.exports = sendEmail;