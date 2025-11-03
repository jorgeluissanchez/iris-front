import { rtlRender, screen } from '@/testing/test-utils';
import { parseDate } from '@internationalized/date';

import { DatePicker } from '../date-picker';

describe('DatePicker', () => {
  it('should render date picker correctly', () => {
    rtlRender(<DatePicker label="Event Date" data-testid="date-picker" />);
    
    expect(screen.getByText('Event Date')).toBeInTheDocument();
  });

  it('should render with default value', () => {
    rtlRender(
      <DatePicker 
        label="Event Date" 
        defaultValue={parseDate('2025-11-15')}
        data-testid="date-picker"
      />
    );
    
    expect(screen.getByText('Event Date')).toBeInTheDocument();
  });

  it('should render with description', () => {
    rtlRender(
      <DatePicker
        label="Event Date"
        description="Select the date for the event"
      />
    );
    
    expect(screen.getByText('Select the date for the event')).toBeInTheDocument();
  });

  it('should render with error message', () => {
    rtlRender(
      <DatePicker
        label="Event Date"
        isInvalid
        errorMessage="Please select a valid date"
      />
    );
    
    expect(screen.getByText('Please select a valid date')).toBeInTheDocument();
  });

  it('should be disabled when isDisabled is true', () => {
    rtlRender(
      <DatePicker 
        label="Event Date" 
        isDisabled 
        data-testid="date-picker"
      />
    );
    
    const inputs = screen.getAllByRole('spinbutton');
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('aria-disabled', 'true');
    });
  });

  it('should be required when isRequired is true', () => {
    rtlRender(
      <DatePicker 
        label="Event Date" 
        isRequired
        data-testid="date-picker"
      />
    );
    
    expect(screen.getByText('Event Date')).toBeInTheDocument();
    const inputs = screen.getAllByRole('spinbutton');
    inputs.forEach((input) => {
      expect(input).toBeRequired();
    });
  });
});

