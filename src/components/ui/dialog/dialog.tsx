'use client';

import {
  Modal as HeroUIModal,
  ModalContent as HeroUIModalContent,
  ModalHeader as HeroUIModalHeader,
  ModalBody as HeroUIModalBody,
  ModalFooter as HeroUIModalFooter,
  ModalProps as HeroUIModalProps,
} from '@heroui/modal';
import { forwardRef } from 'react';

export interface DialogProps extends Omit<HeroUIModalProps, 'children'> {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    { title, description, children, footer, showCloseButton = true, ...props },
    ref,
  ) => {
    return (
      <HeroUIModal ref={ref} {...props}>
        <HeroUIModalContent>
          {(onClose) => (
            <>
              {title && (
                <HeroUIModalHeader className="flex flex-col gap-1">
                  {title}
                </HeroUIModalHeader>
              )}
              <HeroUIModalBody>
                {description && <p className="text-gray-500">{description}</p>}
                {children}
              </HeroUIModalBody>
              {footer && <HeroUIModalFooter>{footer}</HeroUIModalFooter>}
              {showCloseButton && (
                <button
                  className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                  onClick={onClose}
                >
                  <svg
                    className="size-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </>
          )}
        </HeroUIModalContent>
      </HeroUIModal>
    );
  },
);

Dialog.displayName = 'Dialog';
