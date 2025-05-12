
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ContactForm from '@/components/ui/ContactForm';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Contact Our Agent</DialogTitle>
          <DialogDescription>
            Fill out the form below and our agent will get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ContactForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
