// controller folder is responsible to write the main logic, use the database model function etc

import { generateHash, compareHash } from "../helper/bcrypt.js";
import errorThrower from "../helper/errorThrower.js";
import UserModel from "../models/user.model.js";
import createOTP from "../helper/createOTP.js";
import { changePasswordMail, generatedOtpMail } from "../helper/mails.js";
import OTPService from "../services/redis.service.js";
import PostService from "./post.service.js";
const otpStore = new Map();

class AuthService {
  async signup(fullName, email, password) {
    const alreadyExist = await UserModel.getUserByEmail(email);
    if (alreadyExist) {
      throw errorThrower(400, "this email is already registered");
    }
    password = await generateHash(password);
    await UserModel.createUser(fullName, email, password);

    const otp = await OTPService.storeOTP(email);

    await generatedOtpMail(email, fullName, otp);
    return true;
  }

  async login(email, password) {
    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      throw errorThrower(400, "invalid email ");
    }
    const authenticated = await compareHash(password, user.password);
    if (!authenticated) {
      throw errorThrower(400, "invalid password");
    }
    return { userId: user.id, isAuthenticated: true };
  }

  async getLoginDetail(userId) {
    let userDetail = await UserModel.getUserById(userId);
    const allSkills = await UserModel.getAllSkill();
    const allInterests = await UserModel.getAllInterest();
    const userSkills = await UserModel.getUserSkill(userId);
    const userInterest = await UserModel.getUserInterest(userId);
    const recentPosts = await PostService.getAllPosts();
    console.log("========>");
    console.log(userInterest);
    userDetail.allSkills = allSkills;
    userDetail.allInterests = allInterests;
    userDetail.userSkills = userSkills;
    userDetail.userInterests = userInterest;
    userDetail.recentPosts = recentPosts;
    return userDetail;
  }

  async generateOtp(email) {
    const newOtp = createOTP();
    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      throw errorThrower(400, "no user found with this email");
    }

    //store the otp to redis for now i have stroe in variable
    otpStore.set(user.id, newOtp);

    await generatedOtpMail(email, user.fullName, newOtp);
    return true;
  }

  async changePassword(otp, email, newPassword) {
    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      throw errorThrower(400, "invalid email");
    }

    // user redis here
    if (!otpStore.has(user.id) || otpStore.get(user.id) != otp) {
      throw errorThrower(400, "invalid otp");
    }

    const hashPassword = await generateHash(newPassword);
    const result = await UserModel.updatePassword(hashPassword, user.id);
    await changePasswordMail(email, user.fullName);
    otpStore.delete(user.id);
    return true;
  }
}

export default new AuthService();
