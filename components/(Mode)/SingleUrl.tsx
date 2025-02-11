import React, { useState, useEffect } from 'react';
import { AlertCircle, Link as LinkIcon, Loader2, Calendar, Clock, Wand2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useSingleShorten from '@/hooks/useSingleShorten';
import { ResultCard } from '@/components/ResultCard';
import QRCodeModal from '@/components/QRCodeModal';
import { FaCross, FaPaste } from 'react-icons/fa';

const SingleURL = () => {
    const [expiryType, setExpiryType] = useState<'calendar' | 'duration'>('duration');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const {
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
        error,
        shortenedURLs,
        showQR,
        selectedURL,
        setShowQR,
        isUrlValid,
        minDate,
        maxDate,
        formatDateForInput,
        handleDateChange,
        handleDurationChange
    } = useSingleShorten();

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        onShorten();
    };

    const handlePasteFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                onUrlChange(text);
            }
        } catch (err) {
            console.error('Failed to read clipboard:', err);
        }
    };

    return (
        <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl border-blue-100">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold text-blue-900">URL Shortener</CardTitle>
                        <CardDescription className="text-blue-600">Create short, memorable links in seconds</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        {/* <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {shortenedURLs.length} URLs shortened
                        </Badge> */}
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            Free
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Main URL Input Section */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="url" className="text-base font-medium text-blue-900">
                                URL to Shorten
                            </Label>

                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <LinkIcon className="h-4 w-4 text-blue-500" />
                            </div>
                            <Input
                                id="url"
                                type="url"
                                value={url}
                                onChange={(e) => onUrlChange(e.target.value)}
                                className="pl-10 pr-24 h-12 border-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                                placeholder="Enter your long URL here..."
                                required
                                aria-invalid={!isUrlValid}
                                aria-describedby={!isUrlValid ? "url-error" : undefined}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700"
                                onClick={handlePasteFromClipboard}
                            >
                                <FaPaste className="h-5 w-5" />
                            </Button>
                        </div>
                        {!isUrlValid && (
                            <p id="url-error" className="text-sm text-red-500 flex items-center gap-2 animate-shake">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <span>Please enter a valid URL</span>
                            </p>
                        )}
                    </div>

                    {/* Usage Tips */}
                    <Alert className="bg-blue-50 border-blue-200">
                        <Info className="h-4 w-4 text-blue-500" />
                        <AlertDescription className="text-blue-700">
                            Pro tip: Use custom aliases for memorable links, or set expiration dates for temporary URLs.
                        </AlertDescription>
                    </Alert>

                    {/* Advanced Options Toggle */}
                    <div className="pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-2"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                        >
                            <Wand2 className="h-4 w-4" />
                            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
                        </Button>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 flex items-center gap-2 animate-shake">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{error}</span>
                        </p>
                    )}
                    {/* Advanced Options Section */}
                    {showAdvanced && (
                        <div className="space-y-6 animate-slideDown">
                            {/* Length and Prefix Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <TooltipProvider>
                                    <div className="space-y-2">
                                        <Label htmlFor="length" className="text-base font-medium text-blue-900">
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
                                                    className="border-blue-100 focus:border-blue-500"
                                                    aria-describedby="length-hint"
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Choose a length between 1 and 32 characters
                                            </TooltipContent>
                                        </Tooltip>
                                        <p id="length-hint" className="text-sm text-blue-600">
                                            Default: 4 characters
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="prefix" className="text-base font-medium text-blue-900">
                                            Prefix
                                        </Label>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Input
                                                    id="prefix"
                                                    value={prefix}
                                                    onChange={(e) => onPrefixChange(e.target.value)}
                                                    className="border-blue-100 focus:border-blue-500"
                                                    maxLength={10}
                                                    placeholder="e.g., blog"
                                                    aria-describedby="prefix-hint"
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Add a custom prefix (max 10 characters)
                                            </TooltipContent>
                                        </Tooltip>
                                        <p id="prefix-hint" className="text-sm text-blue-600">
                                            Maximum 10 characters
                                        </p>
                                    </div>
                                </TooltipProvider>
                            </div>

                            {/* Custom Alias Section */}
                            <div className="space-y-2">
                                <Label htmlFor="alias" className="text-base font-medium text-blue-900">
                                    Custom Alias
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <span className="text-blue-500">rushort.site/</span>
                                    </div>
                                    <Input
                                        id="alias"
                                        value={alias}
                                        onChange={(e) => onAliasChange(e.target.value)}
                                        className="pl-28 border-blue-100 focus:border-blue-500"
                                        placeholder="your-custom-alias"
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

                            {/* Expiration Section */}
                            <div className="space-y-4">
                                <Label className="text-base font-medium text-blue-900">
                                    Expiration Date
                                </Label>

                                <RadioGroup
                                    className="grid grid-cols-2 gap-4"
                                    defaultValue="duration"
                                    onValueChange={(value) => setExpiryType(value as 'calendar' | 'duration')}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="duration" id="duration" />
                                        <Label htmlFor="duration" className="text-blue-900">Preset Duration</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="calendar" id="calendar" />
                                        <Label htmlFor="calendar" className="text-blue-900">Custom Date</Label>
                                    </div>
                                </RadioGroup>

                                {expiryType === 'duration' ? (
                                    <Select onValueChange={handleDurationChange}>
                                        <SelectTrigger className="border-blue-100 focus:border-blue-500">
                                            <SelectValue placeholder="Select duration" />
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
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                <Calendar className="h-4 w-4 text-blue-500" />
                                            </div>
                                            <Input
                                                type="date"
                                                value={formatDateForInput(expirationDate)}
                                                onChange={handleDateChange}
                                                min={formatDateForInput(minDate)}
                                                max={formatDateForInput(maxDate)}
                                                className="pl-10 border-blue-100 focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                <Clock className="h-4 w-4 text-blue-500" />
                                            </div>
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
                                                className="pl-10 border-blue-100 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                )}

                                <p className="text-sm text-blue-600">
                                    Links can expire up to 5 years from today (optional)
                                </p>
                            </div>
                        </div>
                    )}


                    {shortenedURLs.length > 0 && (
                        <div className="space-y-3 animate-in fade-in-50 duration-500">
                            {[...new Map(shortenedURLs.map(item => [item.shortened, item])).values()].map((item, index) => (
                                <ResultCard
                                    key={index}
                                    original={item.original}
                                    shortened={item.shortened}
                                    expiresAt={item.expiresAt || undefined}
                                />
                            ))}
                        </div>
                    )}

                    {/* Submit Button with keyboard shortcut hint */}
                    <div className="space-y-2">
                        <Button
                            type="submit"
                            disabled={loading || !url || !isUrlValid}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-12 text-lg font-medium transition-all duration-200"
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
                        {/* <p className="text-sm text-center text-blue-600">Press Enter ↵ to shorten</p> */}
                    </div>
                </form>
            </CardContent>
            {showQR && selectedURL && (
                <QRCodeModal
                    url={selectedURL}
                    onClose={() => setShowQR(false)}
                />
            )}
        </Card>
    );
};

export default SingleURL;