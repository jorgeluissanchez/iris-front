import * as React from 'react';

import { Button } from '@/components/ui/button';
import { useDisclosure } from '@/hooks/use-disclosure';
import { rtlRender, screen, userEvent, waitFor } from '@/testing/test-utils';

import { Dialog } from '../dialog';

const openButtonText = 'Open Modal';
const cancelButtonText = 'Cancel';
const titleText = 'Modal Title';

const TestDialog = () => {
  const { close, open, isOpen } = useDisclosure();

  return (
    <div>
      <Button onClick={open}>{openButtonText}</Button>
      <Dialog
        title={titleText}
        isOpen={isOpen}
        onOpenChange={(isOpen) => (isOpen ? open() : close())}
        className="sm:max-w-[425px]"
        footer={
          <div className="flex gap-2">
            <Button type="submit">Submit</Button>
            <Button onClick={close}>{cancelButtonText}</Button>
          </div>
        }
      >
        <div>Dialog content goes here</div>
      </Dialog>
    </div>
  );
};

test('should handle basic dialog flow', async () => {
  rtlRender(<TestDialog />);

  expect(screen.queryByText(titleText)).not.toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: openButtonText }));

  expect(await screen.findByText(titleText)).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: cancelButtonText }));

  await waitFor(() =>
    expect(screen.queryByText(titleText)).not.toBeInTheDocument(),
  );
});
