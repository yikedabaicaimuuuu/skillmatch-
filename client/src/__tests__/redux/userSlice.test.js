import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import userReducer, {
  login,
  logout,
  setStatus,
  addInterest,
  removeInterest,
  addSkill,
  removeSkill,
  setSelectedProject,
  clearSelectedProject,
  addPost,
  setUsername
} from '../../redux/slices/userSlice';

describe('userSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer
      }
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().user;

      expect(state.isAuthenticated).toBe(false);
      expect(state.status).toBe('idle');
      expect(state.username).toBe('');
      expect(state.data.userInterests).toEqual([]);
      expect(state.data.userSkills).toEqual([]);
      expect(state.data.recentPosts).toEqual([]);
      expect(state.selectedProject).toBeNull();
    });
  });

  describe('login action', () => {
    it('should set isAuthenticated to true and update data', () => {
      const userData = {
        id: 1,
        fullName: 'Test User',
        email: 'test@example.com',
        userSkills: [{ id: 1, skillTitle: 'React' }],
        userInterests: [{ id: 1, interestTitle: 'Web Development' }]
      };

      store.dispatch(login(userData));
      const state = store.getState().user;

      expect(state.isAuthenticated).toBe(true);
      expect(state.data).toEqual(userData);
    });
  });

  describe('logout action', () => {
    it('should set isAuthenticated to false and clear data', () => {
      // First login
      store.dispatch(login({ id: 1, fullName: 'Test' }));

      // Then logout
      store.dispatch(logout());
      const state = store.getState().user;

      expect(state.isAuthenticated).toBe(false);
      expect(state.data).toEqual({ interests: [], skills: [] });
    });
  });

  describe('setStatus action', () => {
    it('should update status', () => {
      store.dispatch(setStatus('loading'));
      expect(store.getState().user.status).toBe('loading');

      store.dispatch(setStatus('success'));
      expect(store.getState().user.status).toBe('success');

      store.dispatch(setStatus('error'));
      expect(store.getState().user.status).toBe('error');
    });
  });

  describe('setUsername action', () => {
    it('should update username', () => {
      store.dispatch(setUsername('John Doe'));
      expect(store.getState().user.username).toBe('John Doe');
    });
  });

  describe('interest actions', () => {
    it('should add interest', () => {
      const interest = { id: 1, interestTitle: 'Machine Learning' };
      store.dispatch(addInterest(interest));

      const state = store.getState().user;
      expect(state.data.userInterests).toHaveLength(1);
      expect(state.data.userInterests[0]).toEqual(interest);
    });

    it('should add multiple interests', () => {
      store.dispatch(addInterest({ id: 1, interestTitle: 'AI' }));
      store.dispatch(addInterest({ id: 2, interestTitle: 'Web Dev' }));

      const state = store.getState().user;
      expect(state.data.userInterests).toHaveLength(2);
    });

    it('should remove interest by title', () => {
      store.dispatch(addInterest({ id: 1, interestTitle: 'AI' }));
      store.dispatch(addInterest({ id: 2, interestTitle: 'Web Dev' }));
      store.dispatch(removeInterest('AI'));

      const state = store.getState().user;
      expect(state.data.userInterests).toHaveLength(1);
      expect(state.data.userInterests[0].interestTitle).toBe('Web Dev');
    });
  });

  describe('skill actions', () => {
    it('should add skill', () => {
      const skill = { id: 1, skillTitle: 'React' };
      store.dispatch(addSkill(skill));

      const state = store.getState().user;
      expect(state.data.userSkills).toHaveLength(1);
      expect(state.data.userSkills[0]).toEqual(skill);
    });

    it('should remove skill by skillTitle', () => {
      store.dispatch(addSkill({ id: 1, skillTitle: 'React' }));
      store.dispatch(addSkill({ id: 2, skillTitle: 'Node.js' }));
      store.dispatch(removeSkill({ skillTitle: 'React' }));

      const state = store.getState().user;
      expect(state.data.userSkills).toHaveLength(1);
      expect(state.data.userSkills[0].skillTitle).toBe('Node.js');
    });
  });

  describe('project actions', () => {
    it('should set selected project', () => {
      const project = { id: 1, title: 'Test Project' };
      store.dispatch(setSelectedProject(project));

      expect(store.getState().user.selectedProject).toEqual(project);
    });

    it('should clear selected project', () => {
      store.dispatch(setSelectedProject({ id: 1, title: 'Test' }));
      store.dispatch(clearSelectedProject());

      expect(store.getState().user.selectedProject).toBeNull();
    });
  });

  describe('post actions', () => {
    it('should add post to beginning of recentPosts', () => {
      const post1 = { id: 1, title: 'First Post' };
      const post2 = { id: 2, title: 'Second Post' };

      store.dispatch(addPost(post1));
      store.dispatch(addPost(post2));

      const state = store.getState().user;
      expect(state.data.recentPosts).toHaveLength(2);
      expect(state.data.recentPosts[0]).toEqual(post2); // Most recent first
      expect(state.data.recentPosts[1]).toEqual(post1);
    });
  });
});
