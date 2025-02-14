"use client";
import React, { useEffect, useState } from 'react';
import { User, UrlData } from '@/types/types';
import { ObjectId, set } from 'mongoose';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const sortOptions = [
    { value: 'created_desc', label: 'Newest First' },
    { value: 'created_asc', label: 'Oldest First' },
    { value: 'clicks_desc', label: 'Most Clicked' },
    { value: 'expires_asc', label: 'Expiring Soon' },
];

const UrlContext = () => {
    const [user, setUser] = useState<User | null>(null);
    const [urls, setUrls] = useState<UrlData[]>([]);
    const [sortBy, setSortBy] = useState(sortOptions[0].value)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedUrl, setSelectedUrl] = useState<UrlData>();
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedUrls, setSelectedUrls] = useState<ObjectId[]>([]);
    const [editForm, setEditForm] = useState({ originalUrl: '', shortUrl: '' });
    const router = useRouter();
    const [filteredUrls, setFilteredUrls] = useState<UrlData[]>([]);
    const { toast } = useToast();

    const fetchUrls = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/my-urls');
            if (!response.ok) throw new Error('Failed to fetch URLs');
            const data = await response.json();
            setUrls(data.urls);
            if (data.user) setUser(data.user);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
            toast({
                title: "Error",
                description: "Failed to fetch URLs",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchUrls();
        };
        fetchData();
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
            // Apply sort filter
            switch (sortBy) {
                case 'created_desc':
                    filtered.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
                    break;
                case 'created_asc':
                    filtered.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
                    break;
                case 'clicks_desc':
                    filtered.sort((a, b) => b.clicks - a.clicks);
                    break;
                case 'expires_asc':
                    filtered.sort((a, b) => {
                        if (!a.expireAt) return 1;
                        if (!b.expireAt) return -1;
                        return new Date(a.expireAt).getTime() - new Date(b.expireAt).getTime();
                    });
                    break;
                default:
                    break;
            }

            setFilteredUrls(filtered);
        }
    }, [urls, searchTerm, filterStatus, selectedDate, sortBy]);


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

    const handleViewAnalytics = (url: UrlData) => {
        setSelectedUrl(url);
        setShowAnalytics(true);
    };

    const handleExtendExpiry = async (ids: ObjectId[], expiryDate: Date) => {
        try {
            const response = await fetch(`/api/url/batch-extend`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids, expiryDate }),
            });

            if (!response.ok) throw new Error('Failed to extend expiry');

            const updatedUrls = await response.json();
            setUrls((prevUrls: UrlData[]) =>
                prevUrls.map((url: UrlData) =>
                    ids.includes(url._id) ? updatedUrls.find((u: UrlData) => u._id === url._id) : url
                )
            );

            setSelectedUrls([]);
            toast({
                title: "Success",
                description: `${ids.length} URL(s) expiry extended successfully`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to extend expiry",
                variant: "destructive",
            });
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadCSV = () => {
        const headers = ['Original URL', 'Short URL', 'Clicks', 'Created', 'Status', 'Expires'];
        const data = filteredUrls.map(url => [
            url.originalUrl,
            url.shortUrl,
            url.clicks,
            format(url.created, 'PPP'),
            url.status,
            url.expireAt ? format(url.expireAt, 'PPP') : 'Never'
        ]);

        const csvContent = [headers, ...data]
            .map(row => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `urls-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        link.click();
    };

    const handleFilterChange = (sortBy: string, value: string | Date) => {
        console.log(`Filter changed request: ${sortBy} - ${value}`);
        switch (sortBy) {
            case 'searchTerm':
                setSearchTerm(value as string);
                break;
            case 'filterStatus':
                setFilterStatus(value as string);
                break;
            case 'selectedDate':
                setSelectedDate(value ? new Date(value) : undefined);
                break;
            case 'sortBy':
                setSortBy(value as string);
                break;
            default:
                break;
        }
    };

    const refetch = async () => {
        setError('');
        await fetchUrls();
    };

    const handleShareSingle = (url: UrlData) => {
        setSelectedUrl(url);
        setShowShareModal(true);
    };

    const handleShare = () => {
        if (selectedUrls.length === 1) {
            setSelectedUrl(urls.find(url => url._id === selectedUrls[0]));
            setShowShareModal(true);
        } else {
            setShowShareModal(true);
        }
    };

    return {
        user,
        loading,
        error,
        refetch,
        searchTerm,
        filterStatus,
        selectedUrl,
        setSelectedUrl,
        showAnalytics,
        setShowAnalytics,
        showShareModal,
        setShowShareModal,
        showQR,
        setShowQR,
        showDeleteDialog,
        setShowDeleteDialog,
        showEditDialog,
        setShowEditDialog,
        selectedDate,
        selectedUrls,
        setSelectedUrls,
        editForm,
        setEditForm,
        filteredUrls,
        handleDelete,
        handleEdit,
        handleShare,
        handleViewAnalytics,
        handleExtendExpiry,
        handlePrint,
        handleDownloadCSV,
        handleFilterChange,
        sortBy,
        handleShareSingle,
    };

}

export default UrlContext;