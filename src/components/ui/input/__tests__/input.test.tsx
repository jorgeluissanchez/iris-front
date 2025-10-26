import { rtlRender, screen, userEvent } from '@/testing/test-utils';

import { Input } from '../input';

describe('Input', () => {
  it('should render input correctly', () => {
    rtlRender(<Input placeholder="Enter your name" data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Enter your name');
  });

  it('should render with label', () => {
    rtlRender(<Input label="Name" placeholder="Enter your name" />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('should render with description', () => {
    rtlRender(
      <Input
        label="Email"
        placeholder="Enter your email"
        description="We'll never share your email"
      />
    );
    
    expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
  });

  it('should render with error message', () => {
    rtlRender(
      <Input
        label="Email"
        placeholder="Enter your email"
        isInvalid
        errorMessage="Please enter a valid email"
      />
    );
    
    expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
  });

  it('should be disabled when isDisabled is true', () => {
    rtlRender(<Input label="Name" placeholder="Enter your name" isDisabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('should be required when isRequired is true', () => {
    rtlRender(<Input label="Name" placeholder="Enter your name" isRequired />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('should handle value change', async () => {
    const user = userEvent.setup();
    rtlRender(<Input label="Name" placeholder="Enter your name" />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'John Doe');
    
    expect(input).toHaveValue('John Doe');
  });
});
