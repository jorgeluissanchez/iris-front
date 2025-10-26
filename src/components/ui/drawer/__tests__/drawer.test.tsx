import { useState } from 'react';
import { rtlRender, screen, userEvent, waitFor } from '@/testing/test-utils';

import { Button } from '@/components/ui/button';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerBody, 
  DrawerFooter 
} from '../drawer';

const titleText = 'Drawer Title';
const cancelButtonText = 'Cancel';
const drawerContentText = 'Hello From Drawer';
const openButtonText = 'Open Drawer';

const TestDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onPress={() => setIsOpen(true)}>{openButtonText}</Button>
      <Drawer isOpen={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <h2 className="text-lg font-semibold">{titleText}</h2>
          </DrawerHeader>
          <DrawerBody>
            <div>{drawerContentText}</div>
          </DrawerBody>
          <DrawerFooter>
            <Button onPress={() => setIsOpen(false)}>{cancelButtonText}</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

test('should handle basic drawer flow', async () => {
  await rtlRender(<TestDrawer />);

  // Initially drawer should not be visible
  expect(screen.queryByText(titleText)).not.toBeInTheDocument();

  // Click to open drawer
  await userEvent.click(screen.getByRole('button', { name: openButtonText }));

  // Drawer content should be visible
  expect(await screen.findByText(titleText)).toBeInTheDocument();
  expect(screen.getByText(drawerContentText)).toBeInTheDocument();
  expect(screen.getByText(cancelButtonText)).toBeInTheDocument();

  // Click close button to close drawer
  await userEvent.click(screen.getByRole('button', { name: cancelButtonText }));

  // Drawer should be closed
  await waitFor(() =>
    expect(screen.queryByText(titleText)).not.toBeInTheDocument(),
  );
});

test('should close drawer when clicking outside', async () => {
  await rtlRender(<TestDrawer />);

  // Open drawer
  await userEvent.click(screen.getByRole('button', { name: openButtonText }));
  expect(await screen.findByText(titleText)).toBeInTheDocument();

  // Click outside the drawer (on the backdrop)
  const backdrop = screen.getByRole('dialog').parentElement;
  await userEvent.click(backdrop!);

  // Drawer should be closed
  await waitFor(() =>
    expect(screen.queryByText(titleText)).not.toBeInTheDocument(),
  );
});

test('should render drawer with different placement', async () => {
  const TestDrawerLeft = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <Button onPress={() => setIsOpen(true)}>Open Left Drawer</Button>
        <Drawer isOpen={isOpen} onOpenChange={setIsOpen} placement="left">
          <DrawerContent>
            <DrawerHeader>
              <h2 className="text-lg font-semibold">Left Drawer</h2>
            </DrawerHeader>
            <DrawerBody>
              <div>Content from left</div>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </div>
    );
  };

  await rtlRender(<TestDrawerLeft />);

  // Open drawer
  await userEvent.click(screen.getByRole('button', { name: 'Open Left Drawer' }));
  
  // Drawer should be visible
  expect(await screen.findByText('Left Drawer')).toBeInTheDocument();
  expect(screen.getByText('Content from left')).toBeInTheDocument();
});
