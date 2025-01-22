"use client";
import React, { useState } from 'react';
import { Clipboard, Copy, Home, Link2, ArrowLeft, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TextFormatPage = () => {
    const [text, setText] = useState('');
    const [notification, setNotification] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    interface FormatterFunctions {
        convertMarkdownToText: () => void;
        replaceDoubleWithSingle: () => void;
        trimWhitespace: () => void;
        normalizeLineEndings: () => void;
        removeEmptyLines: () => void;
        convertToLowerCase: () => void;
        convertToUpperCase: () => void;
        capitalizeWords: () => void;
    }

    const addToHistory = (newText: string) => {
        const newHistory = [...history.slice(0, historyIndex + 1), newText];
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const handlePaste = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            setText(clipboardText);
            addToHistory(clipboardText);
            showNotification('Text pasted successfully!');
        } catch (err) {
            showNotification('Failed to paste text. Please try manually.');
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            showNotification('Text copied to clipboard!');
        } catch (err) {
            showNotification('Failed to copy text.');
        }
    };

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000);
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setText(history[historyIndex - 1]);
            showNotification('Changes undone');
        }
    };

    const formatters = {
        convertMarkdownToText: () => {
            const formatted = text
                .replace(/#{1,6}\s/g, '')
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .replace(/\*(.*?)\*/g, '$1')
                .replace(/```[\s\S]*?```/g, '')
                .replace(/`(.*?)`/g, '$1')
                .replace(/\[(.*?)\]\(.*?\)/g, '$1')
                .replace(/> /g, '')
                .replace(/- /g, '')
                .replace(/\d+\. /g, '');
            setText(formatted);
            addToHistory(formatted);
            showNotification('Markdown converted to plain text!');
        },

        replaceDoubleWithSingle: () => {
            const formatted = text.replace(/\*\*(.*?)\*\*/g, '*$1*');
            setText(formatted);
            addToHistory(formatted);
            showNotification('Double asterisks replaced with single!');
        },

        trimWhitespace: () => {
            const formatted = text
                .split('\n')
                .map(line => line.trim())
                .join('\n')
                .trim();
            setText(formatted);
            addToHistory(formatted);
            showNotification('Extra whitespace removed!');
        },

        normalizeLineEndings: () => {
            const formatted = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            setText(formatted);
            addToHistory(formatted);
            showNotification('Line endings normalized!');
        },

        removeEmptyLines: () => {
            const formatted = text
                .split('\n')
                .filter(line => line.trim().length > 0)
                .join('\n');
            setText(formatted);
            addToHistory(formatted);
            showNotification('Empty lines removed!');
        },

        convertToLowerCase: () => {
            const formatted = text.toLowerCase();
            setText(formatted);
            addToHistory(formatted);
            showNotification('Text converted to lowercase!');
        },

        convertToUpperCase: () => {
            const formatted = text.toUpperCase();
            setText(formatted);
            addToHistory(formatted);
            showNotification('Text converted to uppercase!');
        },

        capitalizeWords: () => {
            const formatted = text
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
            setText(formatted);
            addToHistory(formatted);
            showNotification('Words capitalized!');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Navigation Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.location.href = '/'}
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Home
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.location.href = '/my-url'}
                        >
                            <Link2 className="w-4 h-4 mr-2" />
                            My URLs
                        </Button>
                    </div>
                    <h1 className="text-lg font-semibold">Text Formatter</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 space-y-4">
                <Card className="border-0 shadow-lg">
                    <CardContent className="space-y-4 p-6">
                        <div className="flex gap-2 flex-col sm:flex-row">
                            <div className="flex-grow relative">
                                <textarea
                                    value={text}
                                    onChange={(e) => {
                                        setText(e.target.value);
                                        addToHistory(e.target.value);
                                    }}
                                    className="w-full h-64 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                                    placeholder="Paste or type your text here..."
                                />
                                <div className="absolute bottom-2 right-2 flex gap-2">
                                    <Button
                                        onClick={handlePaste}
                                        size="sm"
                                        variant="ghost"
                                        className="bg-white dark:bg-gray-700"
                                    >
                                        <Clipboard className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        onClick={handleCopy}
                                        size="sm"
                                        variant="ghost"
                                        className="bg-white dark:bg-gray-700"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        onClick={undo}
                                        size="sm"
                                        variant="ghost"
                                        className="bg-white dark:bg-gray-700"
                                        disabled={historyIndex <= 0}
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            <Button
                                onClick={formatters.convertMarkdownToText}
                                variant="outline"
                                className="h-auto py-2"
                            >
                                Convert Markdown to Text
                            </Button>
                            <Button
                                onClick={formatters.replaceDoubleWithSingle}
                                variant="outline"
                                className="h-auto py-2"
                            >
                                Replace ** with *
                            </Button>
                            <Button
                                onClick={formatters.trimWhitespace}
                                variant="outline"
                                className="h-auto py-2"
                            >
                                Trim Whitespace
                            </Button>
                            <Button
                                onClick={formatters.normalizeLineEndings}
                                variant="outline"
                                className="h-auto py-2"
                            >
                                Normalize Line Endings
                            </Button>
                            <Button
                                onClick={formatters.removeEmptyLines}
                                variant="outline"
                                className="h-auto py-2"
                            >
                                Remove Empty Lines
                            </Button>
                            <Button
                                onClick={formatters.convertToLowerCase}
                                variant="outline"
                                className="h-auto py-2"
                            >
                                Convert to Lowercase
                            </Button>
                            <Button
                                onClick={formatters.convertToUpperCase}
                                variant="outline"
                                className="h-auto py-2"
                            >
                                Convert to Uppercase
                            </Button>
                            <Button
                                onClick={formatters.capitalizeWords}
                                variant="outline"
                                className="h-auto py-2"
                            >
                                Capitalize Words
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {notification && (
                    <Alert className="fixed bottom-4 right-4 max-w-sm w-full sm:w-auto animate-fade-in mx-4 sm:mx-0">
                        <AlertDescription>{notification}</AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default TextFormatPage;