import PostService from "../services/post.service.js";

class PostController {
  async createPost(request, response, next) {
    try {
      const { authorId, title, skills, description, imageUrl, stats } = request.body;
      console.log(request.body);
      const result = await PostService.createPost(
        authorId,
        title,
        skills,
        description,
        imageUrl,
        stats
      );
      response.status(200).send({
        status: "success",
        data: result,
        message: "Post created",
      });
    } catch (e) {
      next(e);
    }
  }

  async getPostByAuthorId(request, response, next) {
    try {
      const { authorId } = request.params;
      const result = await PostService.getPostsByAuthorId(authorId);
      response.status(200).send({
        status: "success",
        data: result,
        message: "Posts retrieved",
      });
    } catch (e) {
      next(e);
    }
  }

  async getPostById(request, response, next) {
    try {
      const { postId } = request.params;
      const result = await PostService.getPostById(postId);
      response.status(200).send({
        status: "success",
        data: result,
        message: "Post retrieved",
      });
    } catch (e) {
      next(e);
    }
  }

  async getAllPosts(request, response, next) {
    try {
      const result = await PostService.getAllPosts();
      response.status(200).send({
        status: "success",
        data: result,
        message: "All posts retrieved",
      });
    } catch (e) {
      next(e);
    }
  }

  async updateStats(request, response, next) {
    try {
      const { postId } = request.params;
      const { views, likes } = request.body;

      if (typeof views !== "number" || typeof likes !== "number") {
        return response.status(400).send({
          status: "error",
          message: "Views and likes must be numbers",
        });
      }

      const result = await PostService.updateStats(postId, { views, likes });
      response.status(200).send({
        status: "success",
        data: result,
        message: "Post stats updated",
      });
    } catch (e) {
      next(e);
    }
  }

  async updatePost(request, response, next) {
    try {
      const { postId } = request.params;
      const { title, skills, description, imageUrl, stats } = request.body;
      const result = await PostService.updatePost(
        postId,
        title,
        skills,
        description,
        imageUrl,
        stats
      );
      response.status(200).send({
        status: "success",
        data: result,
        message: "Post updated",
      });
    } catch (e) {
      next(e);
    }
  }

  async deletePost(request, response, next) {
    try {
      const { postId } = request.params;
      const result = await PostService.deletePost(postId);
      response.status(200).send({
        status: "success",
        data: result,
        message: "Post deleted",
      });
    } catch (e) {
      next(e);
    }
  }

  async addMemberToProject(request, response, next) {
    try {
      const { projectId, userId, role } = request.body;
      const result = await PostService.addMemberToProject(projectId, userId, role);
      response.status(200).send({
        status: "success",
        data: result,
        message: "Member added to project",
      });
    } catch (e) {
      next(e);
    }
  }

  async removeMemberFromProject(request, response, next) {
    try {
      const { projectId, userId } = request.params;
      const result = await PostService.removeMemberFromProject(projectId, userId);
      response.status(200).send({
        status: "success",
        data: result,
        message: "Member removed from project",
      });
    } catch (e) {
      next(e);
    }
  }

  async updateMemberInProject(request, response, next) {
    try {
      const { projectId, userId } = request.params;
      const { role, status } = request.body;
      const result = await PostService.updateMemberInProject(projectId, userId, { role, status });
      response.status(200).send({
        status: "success",
        data: result,
        message: "Member info updated in project",
      });
    } catch (e) {
      next(e);
    }
  }
}

export default new PostController();
