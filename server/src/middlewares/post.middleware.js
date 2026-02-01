const postValidationMiddleware = (request, response, next) => {
    try {
      const { title, description, skills } = request.body;
  
      if (title.length > 30) {
        throw new Error("Title must be 30 characters or less.");
      }
  
      if (description.length > 200) {
        throw new Error("Description must be 200 characters or less.");
      }
  
      if (!skills || !skills.techSkill || !skills.softSkill) {
        throw new Error("Skills must be provided and contain both techSkill and softSkill.");
      }
  
      if (skills.techSkill.length === 0 || skills.softSkill.length === 0) {
        throw new Error("Tech skills and soft skills cannot be empty.");
      }
  
      next();
  
    } catch (error) {
      response.status(400).send({
        status: "error",
        message: error.message,
      });
    }
  };
  
  export default postValidationMiddleware;