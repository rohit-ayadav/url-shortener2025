import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpContent } from './HelpContent';

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpDialog = ({ open, onOpenChange }: HelpDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Help & Information</DialogTitle>
      </DialogHeader>
      <Tabs defaultValue="howTo" className="mt-4">
        <TabsList className="grid grid-cols-4">
          {Object.entries(HelpContent).map(([key, { title }]) => (
            <TabsTrigger key={key} value={key}>{title}</TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(HelpContent).map(([key, { content: Content }]) => (
          <TabsContent key={key} value={key}>
            <Content />
          </TabsContent>
        ))}
      </Tabs>
    </DialogContent>
  </Dialog>
);
