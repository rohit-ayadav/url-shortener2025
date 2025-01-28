import React, { useState } from 'react';
import { AlertCircle, Link as LinkIcon, Loader2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SingleURLTabProps {
  url: string;
  alias: string;
  aliasError: string;
  loading: boolean;
  onUrlChange: (value: string) => void;
  onAliasChange: (value: string) => void;
  onShorten: () => void;
  length: number;
  onLengthChange: (value: number) => void;
  prefix: string;
  onPrefixChange: (value: string) => void;
  expirationDate: Date | null;
  onExpirationDateChange: (value: Date | null) => void;
}

export const SingleURLTab = ({
  url,
  alias,
  aliasError,
  loading,
  onUrlChange,
  onAliasChange,
  onShorten,
  length,
  onLengthChange,
  prefix,
  onPrefixChange,
  expirationDate,
  onExpirationDateChange,
}: SingleURLTabProps) => {
  const [expiryType, setExpiryType] = useState<'calendar' | 'duration'>('duration');

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onShorten();
  };

  const isUrlValid = url.length === 0 || isValidUrl(url);

  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 5);

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (!dateValue) {
      onExpirationDateChange(null);
      return;
    }
    const newDate = new Date(dateValue);
    newDate.setHours(23, 59, 59, 999);
    onExpirationDateChange(newDate);
  };

  const handleDurationChange = (value: string) => {
    const now = new Date();
    let expiryDate: Date | null = new Date();

    switch (value) {
      case '1day':
        expiryDate.setDate(now.getDate() + 1);
        break;
      case '2days':
        expiryDate.setDate(now.getDate() + 2);
        break;
      case '5days':
        expiryDate.setDate(now.getDate() + 5);
        break;
      case '1week':
        expiryDate.setDate(now.getDate() + 7);
        break;
      case '1month':
        expiryDate.setMonth(now.getMonth() + 1);
        break;
      case '6months':
        expiryDate.setMonth(now.getMonth() + 6);
        break;
      case '1year':
        expiryDate.setFullYear(now.getFullYear() + 1);
        break;
      default:
        expiryDate = null;
        break;
    }

    if (expiryDate) {
      expiryDate.setHours(23, 59, 59, 999);
    }
    onExpirationDateChange(expiryDate);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="url" className="text-base font-medium">
            URL to Shorten
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <LinkIcon className="h-4 w-4 text-gray-500" />
            </div>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              className="pl-10"
              required
              aria-invalid={!isUrlValid}
              aria-describedby={!isUrlValid ? "url-error" : undefined}
            />
          </div>
          {!isUrlValid && (
            <p id="url-error" className="text-sm text-red-500 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Please enter a valid URL</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TooltipProvider>
            <div className="space-y-2">
              <Label htmlFor="length" className="text-base font-medium">
                Length
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    id="length"
                    type="number"
                    value={length || ''}
                    onChange={(e) => {
                      const val = Math.min(Math.max(Number(e.target.value), 1), 32);
                      onLengthChange(val);
                    }}
                    min={1}
                    max={32}
                    className="w-full"
                    aria-describedby="length-hint"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  Choose a length between 1 and 32 characters
                </TooltipContent>
              </Tooltip>
              <p id="length-hint" className="text-sm text-gray-500">
                Default: 4 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prefix" className="text-base font-medium">
                Prefix
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    id="prefix"
                    value={prefix}
                    onChange={(e) => onPrefixChange(e.target.value)}
                    className="w-full"
                    maxLength={10}
                    aria-describedby="prefix-hint"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  Add a custom prefix (max 10 characters)
                </TooltipContent>
              </Tooltip>
              <p id="prefix-hint" className="text-sm text-gray-500">
                Maximum 10 characters
              </p>
            </div>
          </TooltipProvider>
        </div>

        <div className="space-y-2">
          <Label htmlFor="alias" className="text-base font-medium">
            Custom Alias
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <span className="text-gray-500">rushort.site/</span>
            </div>
            <Input
              id="alias"
              value={alias}
              onChange={(e) => onAliasChange(e.target.value)}
              className="pl-28"
              aria-invalid={!!aliasError}
              aria-describedby={aliasError ? "alias-error" : undefined}
            />
          </div>
          {aliasError && (
            <p id="alias-error" className="text-sm text-red-500 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{aliasError}</span>
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">
            Expiration Date
          </Label>

          <RadioGroup
            className="grid grid-cols-2 gap-4"
            defaultValue="duration"
            onValueChange={(value) => setExpiryType(value as 'calendar' | 'duration')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="duration" id="duration" />
              <Label htmlFor="duration">Preset Duration</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="calendar" id="calendar" />
              <Label htmlFor="calendar">Custom Date</Label>
            </div>
          </RadioGroup>

          {expiryType === 'duration' ? (
            <Select onValueChange={handleDurationChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1day">1 Day</SelectItem>
                <SelectItem value="2days">2 Days</SelectItem>
                <SelectItem value="5days">5 Days</SelectItem>
                <SelectItem value="1week">1 Week</SelectItem>
                <SelectItem value="1month">1 Month</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-500" />
              </div>
              {/* take date and time input */}
              <Input
                type="date"
                value={formatDateForInput(expirationDate)}
                onChange={handleDateChange}
                min={formatDateForInput(minDate)}
                max={formatDateForInput(maxDate)}
                className="pl-10"
              />
              <Input  
                type="time"
                value={expirationDate?.toLocaleTimeString()}
                onChange={(e) => {
                  const time = e.target.value;
                  if (!expirationDate) return;
                  const [hours, minutes] = time.split(':').map(Number);
                  const newDate = new Date(expirationDate);
                  newDate.setHours(hours, minutes);
                  onExpirationDateChange(newDate);
                }}
                className="pl-10"
              />
            </div>
          )}

          <p className="text-sm text-gray-500">
            Links can expire up to 5 years from today (optional)
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading || !url || !isUrlValid}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          aria-busy={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Shortening...
            </span>
          ) : (
            'Shorten URL'
          )}
        </Button>
      </form>
    </Card>
  );
};

export default SingleURLTab;