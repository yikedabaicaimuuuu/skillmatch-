import errorThrower from "../helper/errorThrower.js";
const authenticateUserMiddleware = (request, response, next) => {
  try {
    const session = request.session;
    const authenticated = session?.isAuthenticated;
    if (authenticated) {
      next();
    } else {
      throw errorThrower(400, "not authenticated");
    }
  } catch (e) {
    next(e);
  }
};
export default authenticateUserMiddleware;
