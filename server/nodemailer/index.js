const nodemailer = require("nodemailer");
const ics = require("ics");
const logger = require("../winston/logger"); // logger.js 가져오기

const config = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GOOGLE_MAIL,
    pass: process.env.GOOGLE_PASSWORD,
  },
};

const send = async (data) => {
  const transporter = nodemailer.createTransport(config);
  transporter.sendMail(data, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      return info.response;
    }
  });
};

const sendWithIcs = async (data, event) => {
  ics.createEvent(event, async (err, value) => {
    if (err) {
      logger.error(err);
      return;
    }

    const message = {
      ...data,
      icalEvent: {
        filename: "invitation.ics", // iCalendar 파일
        method: "REQUEST",
        content: value,
      },
    };

    await send(message);
  });
};

module.exports = {
  send,
  sendWithIcs,
};
