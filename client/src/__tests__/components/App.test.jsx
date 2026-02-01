import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../utils/testUtils';
import App from '../../App';

// Mock the routes to simplify testing
vi.mock('../../AppRoutes', () => ({
  default: () => <div data-testid="app-routes">App Routes</div>
}));

describe('App Component', () => {
  it('should render without crashing', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('app-routes')).toBeInTheDocument();
  });

  it('should wrap content with Redux Provider', () => {
    const { store } = renderWithProviders(<App />);
    expect(store).toBeDefined();
    expect(store.getState().user).toBeDefined();
  });
});
