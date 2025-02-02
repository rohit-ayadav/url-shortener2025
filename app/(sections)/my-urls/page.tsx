"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Copy, Edit, QrCode, ExternalLink, Search, SlidersHorizontal, CalendarIcon, X, Delete, DeleteIcon, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import QRCodeModal from '@/components/QRCodeModal';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ObjectId } from 'mongoose';

interface Url {
    _id: ObjectId;
    originalUrl: string;
    shortUrl: string;
    clicks: number;
    created: Date;
    lastClicked: Date;
    status: 'active' | 'expired' | 'archived';
}

interface User {
    _id: ObjectId;
    name: string;
    email: string;
    role: 'user' | 'admin';
    subscriptionStatus: 'free' | 'basic' | 'premium';
    subscriptionExpiration: Date | null;
    monthlyQuotaUsed: number;
    monthlyQuotaLimit: number;
    createdAt: Date;
}

const MyUrlsPage = () => {
    const [urls, setUrls] = useState<Url[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedUrl, setSelectedUrl] = useState<Url>();
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedUrls, setSelectedUrls] = useState<ObjectId[]>([]);
    const [editForm, setEditForm] = useState({ originalUrl: '', shortUrl: '' });
    const router = useRouter();
    const [filteredUrls, setFilteredUrls] = useState<Url[]>([]);
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUrls = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/my-urls');
                if (!response.ok) throw new Error('Failed to fetch URLs');

                const data = await response.json();
                setUrls(data.urls);
                if (data.user) setUser(data.user);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch URLs",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUrls();
    }, []);



    useEffect(() => {
        if (urls && urls.length > 0) {
            let filtered = [...urls];

            // Apply search filter
            if (searchTerm) {
                filtered = filtered.filter(url =>
                    url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    url.shortUrl.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Apply status filter
            if (filterStatus !== 'all') {
                filtered = filtered.filter(url => url.status === filterStatus);
            }

            // Apply date filter
            if (selectedDate) {
                filtered = filtered.filter(url =>
                    format(url.created, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                );
            }

            setFilteredUrls(filtered);
        }
    }, [searchTerm, filterStatus, selectedDate, urls]);

    const handleCopy = async (url: string) => {
        await navigator.clipboard.writeText(url);
        toast({
            title: "Copied!",
            description: "URL has been copied to clipboard",
        });
    };

    const handleDelete = async (ids: ObjectId[]) => {
        try {
            const response = await fetch(`/api/url/batch-delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids }),
            });

            if (!response.ok) throw new Error('Failed to delete URLs');

            setUrls(prevUrls => prevUrls.filter(url => !ids.includes(url._id)));
            setSelectedUrls([]);

            toast({
                title: "Success",
                description: `${ids.length} URL(s) deleted successfully`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete URLs",
                variant: "destructive",
            });
        }
    };

    const handleEdit = async (_id: ObjectId, data: { originalUrl: string, shortUrl: string }) => {
        try {
            const response = await fetch(`/api/url/${_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to update URL');

            const updatedUrl = await response.json();
            setUrls(prevUrls =>
                prevUrls.map(url =>
                    url._id === _id ? { ...url, ...updatedUrl } : url
                )
            );

            toast({
                title: "Success",
                description: "URL updated successfully",
            });

            setShowEditDialog(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update URL",
                variant: "destructive",
            });
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="text-blue-600 font-medium">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My URLs</h1>
                    <div className="flex gap-2 w-full sm:w-auto">
                        {selectedUrls.length > 0 && (
                            <Button
                                onClick={() => setShowDeleteDialog(true)}
                                className="w-full sm:w-auto"
                            >
                                Delete Selected ({selectedUrls.length})
                            </Button>
                        )}
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                            onClick={() => router.push('/dashboard')}
                        >
                            Create New URL
                        </Button>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search URLs..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="w-full sm:w-[140px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="expired">Expired</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full sm:w-[240px] justify-start text-left font-normal",
                                                !selectedDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={setSelectedDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {selectedDate && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelectedDate(undefined)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* URL Table */}
                {filteredUrls.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <p className="text-gray-500">No URLs found.</p>
                            <p className="text-gray-500">Try changing the search query or filter.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">
                                                <Checkbox
                                                    checked={selectedUrls.length === filteredUrls.length}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedUrls(filteredUrls.map(url => url._id));
                                                        } else {
                                                            setSelectedUrls([]);
                                                        }
                                                    }}
                                                />
                                            </TableHead>
                                            <TableHead className="w-[50px]">#</TableHead>
                                            <TableHead>Original URL</TableHead>
                                            <TableHead>Short URL</TableHead>
                                            <TableHead>Clicks</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUrls.map((url, index) => (
                                            <TableRow key={url._id.toString()}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedUrls.includes(url._id)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setSelectedUrls([...selectedUrls, url._id]);
                                                            } else {
                                                                setSelectedUrls(selectedUrls.filter(id => id.toString() !== url._id.toString()));
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell className="max-w-[200px] truncate">
                                                    {url.originalUrl}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-blue-600 font-medium">{url.shortUrl}</span>
                                                </TableCell>
                                                <TableCell>{url.clicks}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                                                        <span>{formatDistanceToNow(url.created, { addSuffix: true })}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={url.status === 'active' ? 'default' : 'secondary'}>
                                                        {url.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleCopy(url.shortUrl)}
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedUrl(url);
                                                                setShowQR(true);
                                                            }}
                                                        >
                                                            <QrCode className="h-4 w-4" />
                                                        </Button>
                                                        <Dialog key={`dialog-${url._id}`}>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                >
                                                                    <ExternalLink className="h-4 w-4" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-3xl">
                                                                <DialogHeader>
                                                                    <DialogTitle>Analytics for {url.shortUrl}</DialogTitle>
                                                                </DialogHeader>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                                                    <Card>
                                                                        <CardContent>
                                                                            <h3 className="text-lg font-semibold text-gray-900">Clicks</h3>
                                                                            <p className="text-3xl font-bold text-blue-600">{url.clicks}</p>
                                                                        </CardContent>
                                                                    </Card>
                                                                    <Card>
                                                                        <CardContent>
                                                                            <h3 className="text-lg font-semibold text-gray-900">Created</h3>
                                                                            <p className="text-lg text-gray-600">{format(url.created, 'PPP')}</p>
                                                                        </CardContent>
                                                                    </Card>
                                                                    <Card>
                                                                        <CardContent>
                                                                            <h3 className="text-lg font-semibold text-gray-900">Last Clicked</h3>
                                                                            <p className="text-lg text-gray-600">{url.lastClicked ? format(url.lastClicked, 'PPP') : 'Never'}</p>
                                                                        </CardContent>
                                                                    </Card>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                        {/* <Button
                                                            variant={'destructive'}
                                                            size="sm"
                                                            onClick={() => handleDelete([url._id])}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button> */}
                                                        <Dialog key={`delete-dialog-${url._id}`}>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant={'destructive'}
                                                                    size="sm"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Delete URL</DialogTitle>
                                                                </DialogHeader>
                                                                <DialogDescription>
                                                                    Are you sure you want to delete this URL?
                                                                </DialogDescription>
                                                                <DialogFooter>
                                                                    <div className="flex gap-4">
                                                                        <Button
                                                                            variant="ghost"
                                                                            onClick={() => setShowDeleteDialog(false)}
                                                                        >
                                                                            Cancel
                                                                        </Button>
                                                                        <Button
                                                                            onClick={() => handleDelete([url._id])}
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    </div>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedUrl(url);
                                                                setEditForm({ originalUrl: url.originalUrl, shortUrl: url.shortUrl });
                                                                setShowEditDialog(true);
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4" />
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
                )}
            </div>

            {/* QR Code Modal */}
            {showQR && (
                <QRCodeModal
                    url={selectedUrl ? selectedUrl.shortUrl : ''}
                    onClose={() => setShowQR(false)}
                />
            )}

            {/* Delete Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete URLs</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                        Are you sure you want to delete {selectedUrls.length} URL(s)?
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleDelete(selectedUrls)}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit URL</DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                        {user?.subscriptionStatus === 'free' ? (
                            <p className="text-red-600">You cannot edit the link with a free subscription.</p>
                        ) : (
                            <>
                                <label>
                                    Original URL
                                    <Input
                                        value={editForm.originalUrl}
                                        onChange={(e) => setEditForm({ ...editForm, originalUrl: e.target.value })}
                                    />
                                </label>
                                {user?.subscriptionStatus === 'premium' && (
                                    <label>
                                        Short URL
                                        <Input
                                            value={editForm.shortUrl}
                                            onChange={(e) => setEditForm({ ...editForm, shortUrl: e.target.value })}
                                            disabled={user.subscriptionStatus !== 'premium'}
                                        />
                                    </label>
                                )}
                            </>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogDescription>
                            You can edit the original URL and short URL here.
                        </DialogDescription>
                        <div className="flex gap-4">
                            <Button
                                variant="ghost"
                                onClick={() => setShowEditDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => selectedUrl && handleEdit(selectedUrl._id, editForm)}
                                disabled={user?.subscriptionStatus === 'free'}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}


export default MyUrlsPage;