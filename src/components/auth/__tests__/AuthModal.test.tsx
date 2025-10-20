import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthModal } from '../AuthModal';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
    },
    from: vi.fn(() => ({
      upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: {}, error: null }),
        })),
      })),
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ data: { path: 'test-path' }, error: null }),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://example.com/avatar.jpg' } })),
      })),
    },
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  },
}));

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('AuthModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when open is true', () => {
    const { container } = render(<AuthModal open={true} onClose={mockOnClose} />);
    expect(container).toBeTruthy();
  });

  it('renders both login and signup tabs', () => {
    const { getByText } = render(<AuthModal open={true} onClose={mockOnClose} />);
    expect(getByText(/connexion/i)).toBeTruthy();
    expect(getByText(/inscription/i)).toBeTruthy();
  });

  it('displays welcome message', () => {
    const { getByText } = render(<AuthModal open={true} onClose={mockOnClose} />);
    expect(getByText(/bienvenue/i)).toBeTruthy();
  });

  it('does not render when open is false', () => {
    const { queryByText } = render(<AuthModal open={false} onClose={mockOnClose} />);
    expect(queryByText(/bienvenue/i)).toBeFalsy();
  });
});

