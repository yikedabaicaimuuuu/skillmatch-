import UserService from "../services/user.service.js";

class UserController {
  async addSkill(request, response, next) {
    try {
      const session = request.session;
      const { skillTitle, description, portfolio } = request.body;
      const result = await UserService.addSkill(
        session.userId,
        skillTitle,
        description,
        portfolio
      );
      response.status(200).send({
        status: "success",
        data: result,
        message: "skill added",
      });
    } catch (e) {
      next(e);
    }
  }

  async removeSkill(request, response, next) {
    try {
      const session = request.session;
      const { id } = request.body;

      const result = await UserService.removeSkill(session.userId, id);
      response.status(200).send({
        data: result,
        status: "success",
        message: "skill removed",
      });
    } catch (e) {
      next(e);
    }
  }

  async addInterest(request, response, next) {
    try {
      const session = request.session;
      const { interestTitle, description, interestLevel } = request.body;
      console.log(`adding interest: ${request.body}`);
      const result = await UserService.addInterest(
        session.userId,
        interestTitle,
        description,
        interestLevel
      );
      response.status(200).send({
        status: "success",
        data: result,
        message: "Interest added",
      });
    } catch (e) {
      next(e);
    }
  }

  async removeInterest(request, response, next) {
    try {
      const session = request.session;
      const { id } = request.body;
      const result = await UserService.removeInterest(session.userId, id);
      response.status(200).send({
        status: "success",
        message: "Interest removed",
      });
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
