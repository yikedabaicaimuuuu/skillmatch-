import errorThrower from "../helper/errorThrower.js";

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

const passwordUserMiddleware = (request, response, next) => {
  try {
    const { password } = request.body;

    if (!password || !passwordRegex.test(password)) {
      throw errorThrower(
        400,
        "Password must be at least 6 characters long and include at least one letter, one number, and one special character."
      );
    }

    next();
  } catch (e) {
    next(e);
  }
};

export default passwordUserMiddleware;