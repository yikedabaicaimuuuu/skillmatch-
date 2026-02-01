const createOTP = () => {
  let otp = "";
  for (var i = 0; i < 10; i++) {
    otp = otp + Math.floor(Math.random() * 10);
  }
  return parseInt(otp);
};
export default createOTP;
