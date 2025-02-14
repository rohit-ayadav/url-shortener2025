import { format, differenceInDays } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Copy, Edit, Share2, Trash2 } from 'lucide-react';
import { ObjectId } from 'mongoose';
import { UrlData } from '@/types/types';
import { formatUrl } from '@/utils/formatUrl';

interface UrlTableProps {
    urls: UrlData[];
    selectedUrls: ObjectId[];
    onSelectUrl: (ids: ObjectId[]) => void;
    onEdit: (url: UrlData) => void;
    onDelete: (ids: ObjectId[]) => void;
    onShare: (url: UrlData) => void;
    onViewAnalytics: (url: any) => void;
}
export const UrlTable = ({ urls, selectedUrls, onSelectUrl, onEdit, onDelete, onShare, onViewAnalytics }: UrlTableProps) => {
    if (urls.length === 0) {
        return (
            <Card className="flex flex-col items-center justify-center mt-5 p-6">
                <CardContent className="p-8 text-center text-muted-foreground">
                    No URLs found
                </CardContent>
                <CardDescription>
                    <p className="text-center text-muted-foreground">
                        Create a new URL to get started or try to change your search or filter criteria.
                    </p>
                </CardDescription>
            </Card>
        );
    }
    return (
        <Card>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={selectedUrls.length === urls.length}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                onSelectUrl(urls.map(url => url._id));
                                            } else {
                                                onSelectUrl([]);
                                            }
                                        }}
                                    />
                                </TableHead>
                                <TableHead>Original URL</TableHead>
                                <TableHead>Short URL</TableHead>
                                <TableHead>Clicks</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Expires</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {urls.map((url) => (
                                <TableRow key={url._id.toString()}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedUrls.includes(url._id)}
                                            onCheckedChange={(checked) => {
                                                onSelectUrl(checked ?
                                                    [...selectedUrls, url._id] :
                                                    selectedUrls.filter(id => id !== url._id)
                                                );
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        {url.originalUrl}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-600 font-medium cursor-pointer"
                                                onClick={() => window.open(formatUrl(url.shortUrl), '_blank')}
                                            >{url.shortUrl}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => navigator.clipboard.writeText(formatUrl(url.shortUrl))}
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>{url.clicks}</TableCell>
                                    <TableCell>{format(url.created, 'PPP')}</TableCell>
                                    <TableCell>
                                        {url.expireAt ? (
                                            <div className="flex flex-col">
                                                <span>{format(url.expireAt, 'PPP')}</span>
                                                {differenceInDays(url.expireAt, new Date()) <= 7 && (
                                                    <span className="text-red-500 text-sm">Expiring soon!</span>
                                                )}
                                            </div>
                                        ) : (
                                            'Never'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={url.status === 'active' ? 'default' : 'secondary'}>
                                            {url.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => onEdit(url)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => onShare(url)}>
                                                <Share2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => onDelete([url._id])}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};
