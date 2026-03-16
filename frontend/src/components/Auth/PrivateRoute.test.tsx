import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { useAuthStore } from '../../store/authStore';

vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn()
}));

describe('PrivateRoute Compoment', () => {
  it('should render children when user is authenticated', () => {
    // Mock the authenticated state
    vi.mocked(useAuthStore).mockReturnValue({ 
      isAuthenticated: true, 
      user: { role: { code: 'ADMIN' } } 
    } as any);

    render(
      <MemoryRouter>
        <PrivateRoute>
          <div data-testid="protected-content">Protected Content</div>
        </PrivateRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
