import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';
import { DialogClose } from '@radix-ui/react-dialog';

const termsAndConditions = `
  TERMS OF SERVICE

  Last updated: July 27, 2024

  1. Introduction
  Welcome to Gneeraic Company. These Terms of Service govern your use of our website located at www.gneeraic.com (the "Site").

  2. Acceptance of Terms
  By accessing or using the Site, you agree to be bound by these Terms. If you disagree with any part of the terms, then you do not have permission to access the Site.

  3. Changes to Terms
  We reserve the right to modify these terms at any time. It is your responsibility to review the terms periodically. Your continued use of the Site after any changes signifies your acceptance of the new terms.

  4. Use of the Site
  You agree to use the Site only for lawful purposes and in a manner that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the Site.

  5. Intellectual Property
  The content on the Site, including text, graphics, images, and software, is the property of Gneeraic Company and is protected by intellectual property laws.

  6. Termination
  We may terminate or suspend your access to the Site immediately, without prior notice or liability, for any reason, including if you breach the Terms.

  7. Governing Law
  These Terms are governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.

  8. Contact Us
  If you have any questions about these Terms, please contact us at support@gneeraic.com.
`;

const TermsAndService = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="text-primary font-medium hover:underline cursor-pointer">
          Terms of Services
        </p>
      </DialogTrigger>
      <DialogContent className="max-w-full sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] mx-auto p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Please review the terms and conditions before proceeding.
          </DialogDescription>
        </DialogHeader>
        <div className="whitespace-pre-line">
          <ScrollArea className="h-80 overflow-y-auto px-4 border rounded-lg">
            {termsAndConditions}
          </ScrollArea>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button type="button">I Agree</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsAndService;
