import { useState } from 'react';
import { FloatingHelpButton } from './FloatingHelpButton';
import { HelpDialog } from './HelpDialog';

export const Help = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <FloatingHelpButton onClick={() => setIsOpen(true)} />
      <HelpDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};

export default Help;