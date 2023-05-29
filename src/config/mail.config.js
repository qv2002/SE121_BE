require("dotenv").config();

const MailConfig = {
    MAILER_CLIENT_ID : process.env.CLIENT_ID,
    MAILER_CLIENT_SECRET : process.env.CLIENT_SECRET,
    MAILER_REFRESH_TOKEN : process.env.REFRESH_TOKEN,
    ADMIN_EMAIL_ADDRESS : process.env.ADMIN_EMAIL_ADDRESS,
}

module.exports = MailConfig;