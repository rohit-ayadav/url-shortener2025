
// src/components/help/FloatingHelpButton.tsx
import { HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FloatingHelpButtonProps {
  onClick: () => void;
}

export const FloatingHelpButton = ({ onClick }: FloatingHelpButtonProps) => (
  <Button
    variant="outline"
    size="icon"
    className="fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-white dark:bg-gray-800"
    onClick={onClick}
  >
    <HelpCircle className="h-6 w-6" />
  </Button>
);