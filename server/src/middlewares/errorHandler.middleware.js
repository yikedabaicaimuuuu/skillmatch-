const errorHandlerMiddleware = (error, request, response, next) => {
  if (error) {
    const statusCode = error.status || 500;
    if (statusCode == 500) {
      console.log(error.stack);
      response
        .status(statusCode)
        .send({ status: "error", message: "internal server error" });
    } else {
      response
        .status(statusCode)
        .send({ status: "error", message: error.message });
    }
  } else {
    next();
  }
};
export default errorHandlerMiddleware;
