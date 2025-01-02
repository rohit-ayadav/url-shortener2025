import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface MultipleURLsTabProps {
    urls: string;
    loading: boolean;
    onUrlsChange: (value: string) => void;
    onShorten: () => void;
  }
  
  export const MultipleURLsTab = ({
    urls,
    loading,
    onUrlsChange,
    onShorten
  }: MultipleURLsTabProps) => (
    <div className="space-y-4">
      <Textarea
        value={urls}
        onChange={(e) => onUrlsChange(e.target.value)}
        placeholder="Enter URLs (one per line)"
        rows={6}
      />
      <Button
        onClick={onShorten}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Shorten All URLs'}
      </Button>
    </div>
  );
  