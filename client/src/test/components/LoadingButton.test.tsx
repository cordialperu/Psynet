import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingButton } from '@/components/ui/loading-button';

describe('LoadingButton', () => {
  it('renders button with children', () => {
    render(<LoadingButton>Click me</LoadingButton>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<LoadingButton loading>Click me</LoadingButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading text when provided', () => {
    render(
      <LoadingButton loading loadingText="Loading...">
        Click me
      </LoadingButton>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('is disabled when loading', () => {
    render(<LoadingButton loading>Click me</LoadingButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
