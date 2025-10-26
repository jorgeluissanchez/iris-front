import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Pagination } from '../pagination';

describe('Pagination', () => {
  it('renders pagination with basic props', () => {
    render(
      <Pagination
        total={10}
        page={1}
      />
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders with controls when showControls is true', () => {
    render(
      <Pagination
        total={10}
        page={1}
        showControls
      />
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders with shadow when showShadow is true', () => {
    render(
      <Pagination
        total={10}
        page={1}
        showShadow
      />
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('handles page changes', async () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        total={10}
        page={1}
        onChange={onPageChange}
        showControls
      />
    );

    const nextButton = screen.getByLabelText('next page button');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(onPageChange).toHaveBeenCalledWith(2);
    });
  });

  it('handles previous page navigation', async () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        total={10}
        page={2}
        onChange={onPageChange}
        showControls
      />
    );

    const prevButton = screen.getByLabelText('previous page button');
    fireEvent.click(prevButton);

    await waitFor(() => {
      expect(onPageChange).toHaveBeenCalledWith(1);
    });
  });

  it('disables previous button on first page', () => {
    render(
      <Pagination
        total={10}
        page={1}
        showControls
      />
    );

    const prevButton = screen.getByLabelText('previous page button');
    expect(prevButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('disables next button on last page', () => {
    render(
      <Pagination
        total={10}
        page={10}
        showControls
      />
    );

    const nextButton = screen.getByLabelText('next page button');
    expect(nextButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders correct page numbers', () => {
    render(
      <Pagination
        total={10}
        page={5}
        showControls
      />
    );

    // Should show current page
    expect(screen.getByLabelText('pagination item 5 active')).toBeInTheDocument();
  });

  it('renders with custom class name', () => {
    const { container } = render(
      <Pagination
        total={10}
        page={1}
        className="custom-pagination"
      />
    );

    expect(container.querySelector('.custom-pagination')).toBeInTheDocument();
  });

  it('renders without controls by default', () => {
    render(
      <Pagination
        total={10}
        page={1}
      />
    );

    // Should not have next/previous buttons when showControls is not set
    expect(screen.queryByLabelText('next page button')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('previous page button')).not.toBeInTheDocument();
  });

  it('handles page click navigation', async () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        total={10}
        page={1}
        onChange={onPageChange}
        showControls
      />
    );

    // Click on page 3
    const page3Button = screen.getByText('3');
    fireEvent.click(page3Button);

    await waitFor(() => {
      expect(onPageChange).toHaveBeenCalledWith(3);
    });
  });
});
