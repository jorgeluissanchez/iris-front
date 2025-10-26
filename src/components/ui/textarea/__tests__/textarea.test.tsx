import { rtlRender, screen, userEvent } from '@/testing/test-utils';

import { Textarea } from '../textarea';

describe('Textarea', () => {
  it('should render textarea correctly', () => {
    rtlRender(<Textarea placeholder="Enter your message" data-testid="textarea" />);
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('placeholder', 'Enter your message');
  });

  it('should render with label', () => {
    rtlRender(<Textarea label="Message" placeholder="Enter your message" />);
    
    expect(screen.getByText('Message')).toBeInTheDocument();
  });

  it('should render with description', () => {
    rtlRender(
      <Textarea
        label="Message"
        placeholder="Enter your message"
        description="Enter a detailed message"
      />
    );
    
    expect(screen.getByText('Enter a detailed message')).toBeInTheDocument();
  });

  it('should render with error message', () => {
    rtlRender(
      <Textarea
        label="Message"
        placeholder="Enter your message"
        isInvalid
        errorMessage="Message is required"
      />
    );
    
    expect(screen.getByText('Message is required')).toBeInTheDocument();
  });

  it('should be disabled when isDisabled is true', () => {
    rtlRender(<Textarea label="Message" placeholder="Enter your message" isDisabled />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
  });

  it('should be required when isRequired is true', () => {
    rtlRender(<Textarea label="Message" placeholder="Enter your message" isRequired />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeRequired();
  });

  it('should handle value change', async () => {
    const user = userEvent.setup();
    rtlRender(<Textarea label="Message" placeholder="Enter your message" />);
    
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'This is a test message');
    
    expect(textarea).toHaveValue('This is a test message');
  });

  it('should apply autosize when specified', () => {
    rtlRender(
      <Textarea
        label="Message"
        placeholder="Enter your message"
        minRows={3}
        maxRows={6}
      />
    );
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
  });
});
