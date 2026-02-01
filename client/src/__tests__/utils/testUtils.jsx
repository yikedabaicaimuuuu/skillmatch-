import React from 'react';
import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import userReducer from '../../redux/slices/userSlice';

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: { user: userReducer },
      preloadedState
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export function createMockStore(preloadedState = {}) {
  return configureStore({
    reducer: { user: userReducer },
    preloadedState
  });
}

export const mockUser = {
  id: 1,
  fullName: 'Test User',
  email: 'test@example.com',
  userSkills: [
    { id: 1, skillTitle: 'React', description: 'Frontend framework' },
    { id: 2, skillTitle: 'Node.js', description: 'Backend runtime' }
  ],
  userInterests: [
    { id: 1, interestTitle: 'Web Development', interestLevel: 'High' },
    { id: 2, interestTitle: 'Machine Learning', interestLevel: 'Medium' }
  ],
  recentPosts: []
};

export const mockPost = {
  id: 1,
  title: 'Test Project',
  description: 'A test project for skill matching',
  skills: ['React', 'Node.js', 'PostgreSQL'],
  authorId: 1,
  authorName: 'Test User',
  stats: { views: 100, likes: 25 },
  createdAt: '2024-01-15T10:00:00Z'
};
