// controller folder is responsible for extract the data from request
//do validation ,send response and  handler error

import errorThrower from "../helper/errorThrower.js";
import AuthService from "../services/auth.service.js";
class AuthController {
  async signup(request, response, next) {
    try {
      const { email, fullName, password } = request.body;
      if (!email || !fullName || !password) {
        throw errorThrower(400, "please provide all the fields");
      }

      const result = await AuthService.signup(fullName, email, password);
      if (result) {
        response.status(201).send({
          status: "success",
          message: "user registered successfully",
        });
      } else {
        response.status(404).send({
          status: "error",
          message: "user registered failed",
        });
      }
    } catch (e) {
      next(e);
    }
  }

  async login(request, response, next) {
    try {
      const { email, password } = request.body;
      var session = request.session;
      if (!email || !password) {
        throw errorThrower(400, "please provide all the fields");
      }

      const result = await AuthService.login(email, password);
      session.userId = result?.userId;
      session.isAuthenticated = result.isAuthenticated;
      response.status(201).send({
        status: "success",
        message: "login successfully",
      });
    } catch (e) {
      next(e);
    }
  }

  async getLoginDetail(request, response, next) {
    try {
      const session = request.session;
      const result = await AuthService.getLoginDetail(session.userId);
      response.status(201).send({
        status: "success",
        data: result,
        message: "fetched login detail successfully",
      });
    } catch (e) {
      next(e);
    }
  }

  async logout(request, response, next) {
    try {
      const session = request.session;
      session.destroy(() => {
        response
          .status(200)
          .send({ status: "success", message: "logout successfully" });
      });
    } catch (e) {
      next(e);
    }
  }

  async generateOtp(request, response, next) {
    try {
      const { email } = request.body;
      if (!email) {
        throw errorThrower(400, "email address is required");
      }
      const result = await AuthService.generateOtp(email);
      return response.send({
        status: "success",
        message: "OTP is send to registered email",
      });
    } catch (e) {
      next(e);
    }
  }

  async changePassword(request, response, next) {
    try {
      const { newPassword, otp, email } = request.body;
      if (!newPassword || !otp || !email) {
        throw errorThrower(400, "please provide all the field");
      }
      const result = await AuthService.changePassword(otp, email, newPassword);
      response.status(200).send({
        status: "success",
        message: "password changed successfully",
      });
    } catch (e) {
      next(e);
    }
  }
}

export default new AuthController();
