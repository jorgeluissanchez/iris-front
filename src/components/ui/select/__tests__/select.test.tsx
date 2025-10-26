import { rtlRender, screen, userEvent } from '@/testing/test-utils';

import { Select, SelectItem } from '../select';

describe('Select', () => {
  it('should render select correctly', () => {
    rtlRender(
      <Select placeholder="Select an option" data-testid="select">
        <SelectItem key="option1">Option 1</SelectItem>
        <SelectItem key="option2">Option 2</SelectItem>
      </Select>
    );
    
    const select = screen.getByTestId('select');
    expect(select).toBeInTheDocument();
  });

  it('should render with label', () => {
    rtlRender(
      <Select label="Choose an option" placeholder="Select an option">
        <SelectItem key="option1">Option 1</SelectItem>
        <SelectItem key="option2">Option 2</SelectItem>
      </Select>
    );
    
    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('should render with description', () => {
    rtlRender(
      <Select
        label="Choose an option"
        placeholder="Select an option"
        description="This is a description"
      >
        <SelectItem key="option1">Option 1</SelectItem>
        <SelectItem key="option2">Option 2</SelectItem>
      </Select>
    );
    
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  it('should render with error message', () => {
    rtlRender(
      <Select
        label="Choose an option"
        placeholder="Select an option"
        isInvalid
        errorMessage="Please select an option"
      >
        <SelectItem key="option1">Option 1</SelectItem>
        <SelectItem key="option2">Option 2</SelectItem>
      </Select>
    );
    
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  it('should be disabled when isDisabled is true', () => {
    rtlRender(
      <Select label="Choose an option" placeholder="Select an option" isDisabled>
        <SelectItem key="option1">Option 1</SelectItem>
        <SelectItem key="option2">Option 2</SelectItem>
      </Select>
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  it('should be required when isRequired is true', () => {
    rtlRender(
      <Select label="Choose an option" placeholder="Select an option" isRequired>
        <SelectItem key="option1">Option 1</SelectItem>
        <SelectItem key="option2">Option 2</SelectItem>
      </Select>
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-required', 'true');
  });

  it('should open dropdown when clicked', async () => {
    const user = userEvent.setup();
    rtlRender(
      <Select placeholder="Select an option">
        <SelectItem key="option1">Option 1</SelectItem>
        <SelectItem key="option2">Option 2</SelectItem>
      </Select>
    );
    
    const select = screen.getByRole('combobox');
    await user.click(select);
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('should support multiple selection', async () => {
    const user = userEvent.setup();
    rtlRender(
      <Select
        label="Choose options"
        selectionMode="multiple"
        placeholder="Select multiple options"
      >
        <SelectItem key="option1">Option 1</SelectItem>
        <SelectItem key="option2">Option 2</SelectItem>
        <SelectItem key="option3">Option 3</SelectItem>
      </Select>
    );
    
    const select = screen.getByRole('combobox');
    await user.click(select);
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });
});
