import UserModel from "../models/user.model.js";
class UserService {
  async addSkill(userId, skillTitle, description, portfolio) {
    const result = await UserModel.addUserSkill(
      userId,
      skillTitle,
      description,
      portfolio
    );

    return result;
  }

  async removeSkill(userId, id) {
    const result = await UserModel.removeUserSkill(userId, id);

    return result;
  }

  async addInterest(userId, interestTitle, description, interestLevel) {
    const result = await UserModel.addUserInterest(
      userId,
      interestTitle,
      description,
      interestLevel
    );

    return result;
  }

  async removeInterest(userId, id) {
    const result = await UserModel.removeUserInterest(userId, id);
    return result;
  }
}

export default new UserService();
