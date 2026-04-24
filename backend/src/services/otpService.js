// For now we just generate and "send" OTP by logging it.

function generateOtp(length = 4) {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}

async function sendOtpSms(phone, otp) {
  // TODO: integrate real SMS here
  console.log(`Sending OTP ${otp} to phone ${phone}`);
  return true;
}

module.exports = { generateOtp, sendOtpSms };