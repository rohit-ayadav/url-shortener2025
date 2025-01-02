import { Copy } from "lucide-react";
import { Button } from "./ui/button";
import { CircleX, ClipboardCopy, Loader2 } from "lucide-react";
import { Textarea } from "./ui/textarea";

interface TextModeTabProps {
  text: string;
  processedText: string;
  loading: boolean;
  onTextChange: (value: string) => void;
  onProcess: () => void;
  onPaste: () => void;
  onClear: () => void;
  onCopyProcessed: () => void;
}

export const TextModeTab = ({
  text,
  processedText,
  loading,
  onTextChange,
  onProcess,
  onPaste,
  onClear,
  onCopyProcessed
}: TextModeTabProps) => (
  <div className="space-y-4">
    <Textarea
      value={text}
      onChange={(e) => onTextChange(e.target.value)}
      placeholder="Enter text containing URLs to shorten"
      rows={8}
    />
    <div className="flex justify-between items-center">
      <Button
        onClick={onProcess}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Process Text'}
      </Button>
      <Button variant="ghost" size="sm" onClick={onPaste}>
        <ClipboardCopy className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onClear} className="text-blue-600">
        <CircleX className="h-5 w-5" />
      </Button>
    </div>
    {processedText && (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700">Processed Text</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopyProcessed}
            className="text-blue-600"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
        <p className="text-sm text-gray-600 whitespace-pre-wrap">{processedText}</p>
      </div>
    )}
  </div>
);
