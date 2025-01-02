import { AlertCircle, Link} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2 } from 'lucide-react';

interface SingleURLTabProps {
    url: string;
    alias: string;
    aliasError: string;
    loading: boolean;
    onUrlChange: (value: string) => void;
    onAliasChange: (value: string) => void;
    onShorten: () => void;
  }
  
  export const SingleURLTab = ({
    url,
    alias,
    aliasError,
    loading,
    onUrlChange,
    onAliasChange,
    onShorten
  }: SingleURLTabProps) => (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center">
          <Link className="h-4 w-4 text-gray-500" />
        </div>
        <Input
          type="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="Enter URL to shorten"
          className="pl-10"
        />
      </div>
      <Input
        value={alias}
        onChange={(e) => onAliasChange(e.target.value)}
        placeholder="Custom alias (optional)"
        className="focus:ring-2 focus:ring-blue-500"
      />
      {aliasError && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {aliasError}
        </p>
      )}
      <Button
        onClick={onShorten}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Shorten URL'}
      </Button>
    </div>
  );
  