import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface ApiKeyCardProps {
    apiKey?: string;
    isLoading: boolean;
    onRegenerateKey: () => void;
}

export function ApiKeyCard({ apiKey, isLoading, onRegenerateKey }: ApiKeyCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>API Key</CardTitle>
                <CardDescription>
                    Manage your API key for programmatic access
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input
                        id="api-key"
                        value={apiKey}
                        readOnly
                        className="bg-gray-50"
                    />
                </div>
                <Button onClick={onRegenerateKey} disabled={isLoading}>
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Regenerate API Key
                </Button>
                {/* note that api feature will coming soon */}
                <CardDescription className="text-sm text-gray-500">
                    This feature will be available soon
                </CardDescription>
            </CardContent>
        </Card>
    );
}
