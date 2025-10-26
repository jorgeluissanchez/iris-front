import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from './drawer';

import { Button } from '../button';

const meta: Meta<typeof Drawer> = {
  component: Drawer,
  title: 'UI/Drawer',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Open Drawer</Button>
        <Drawer isOpen={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <h2 className="text-lg font-semibold">Drawer Title</h2>
            </DrawerHeader>
            <DrawerBody>
              <p>This is the drawer content. You can put any content here.</p>
              <p className="mt-2">The drawer slides in from the right by default.</p>
            </DrawerBody>
            <DrawerFooter>
              <Button onPress={() => setIsOpen(false)}>Close</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  },
};

export const LeftPlacement: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Open Left Drawer</Button>
        <Drawer isOpen={isOpen} onOpenChange={setIsOpen} placement="left">
          <DrawerContent>
            <DrawerHeader>
              <h2 className="text-lg font-semibold">Left Drawer</h2>
            </DrawerHeader>
            <DrawerBody>
              <p>This drawer slides in from the left side.</p>
            </DrawerBody>
            <DrawerFooter>
              <Button onPress={() => setIsOpen(false)}>Close</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  },
};

export const WithForm: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Open Form Drawer</Button>
        <Drawer isOpen={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <h2 className="text-lg font-semibold">Contact Form</h2>
            </DrawerHeader>
            <DrawerBody>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-md"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea 
                    className="w-full p-2 border rounded-md h-20"
                  />
                </div>
              </form>
            </DrawerBody>
            <DrawerFooter>
              <Button onPress={() => setIsOpen(false)}>Cancel</Button>
              <Button color="primary" onPress={() => setIsOpen(false)}>Send</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  },
};
