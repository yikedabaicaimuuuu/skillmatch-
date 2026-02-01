import PostModel from "../models/post.model.js";

class PostService {
  async createPost(authorId, title, skills, description, imageUrl, stats) {
    const result = await PostModel.createPost(
      authorId,
      title,
      skills,
      description,
      imageUrl,
      stats
    );

    return result;
  }

  async getPostById(postId) {
    const result = await PostModel.getPostById(postId);

    return result;
  }

  async getPostsByAuthorId(authorId) {
    const result = await PostModel.getPostByAuthorId(authorId);

    return result;
  }

  async getAllPosts() {
    const result = await PostModel.getAllPosts();

    return result;
  }

  async updatePost(postId, title, skills, description, imageUrl, stats) {
    const result = await PostModel.updatePost(
      postId,
      title,
      skills,
      description,
      imageUrl,
      stats
    );

    return result;
  }

  async deletePost(postId) {
    const result = await PostModel.deletePost(postId);

    return result;
  }

  async updateStats(postId, { views, likes }) {
    try {
      const result = await PostModel.updateStats(postId, { views, likes });
  
      return result;
    } catch (error) {
      throw new Error("Error while updating post stats");
    }
  }

  async addMemberToProject(projectId, userId, role = 'member') {
    try {
      const result = await PostModel.addMemberToProject(projectId, userId, role);
      return result;
    } catch (error) {
      throw new Error("Error while adding member to the project");
    }
  }

  async removeMemberFromProject(projectId, userId) {
    try {
      const result = await PostModel.removeMemberFromProject(projectId, userId);
      return result;
    } catch (error) {
      throw new Error("Error while removing member from the project");
    }
  }

  async updateMemberInProject(projectId, userId, { role, status }) {
    try {
      const result = await PostModel.updateMemberInProject(projectId, userId, { role, status });
      return result;
    } catch (error) {
      throw new Error("Error while updating member in the project");
    }
  }
}

export default new PostService();
