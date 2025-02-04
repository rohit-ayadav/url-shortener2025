"use client";
import React, { } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import { SlidersHorizontal } from 'lucide-react';
import QRCodeModal from '@/components/QRCodeModal';
import UrlContext from './contexts/UrlContext';
import { UrlTableHeader } from './components/UrlTableHeader';
import { UrlFilters } from './components/UrlFilters';
import { BulkActions } from './components/BulkActions';
import { UrlTable } from './components/UrlTable';
import { ShareModal } from './components/ShareModal';
import Analytics from './components/Analytics';

const MyUrlsPage = () => {

    const {
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
        
    } = UrlContext();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" >
                <div className="flex items-center gap-2" >
                    <SlidersHorizontal className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="text-blue-600 font-medium" > Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center" >
                <div className="text-center" >
                    <h2 className="text-2xl font-bold text-red-600 mb-2" > Error </h2>
                    < p className="text-gray-600" > {error} </p>
                    < Button
                    onClick={refetch} className="mt-4" 
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" >
                <UrlTableHeader
                    onPrint={handlePrint}
                    onDownloadCSV={handleDownloadCSV}
                    selectedCount={selectedUrls.length}
                    refresh={refetch}
                    handleShare={handleShare}
                />

                <UrlFilters
                    searchTerm={searchTerm}
                    filterStatus={filterStatus}
                    selectedDate={selectedDate}
                    sortBy={sortBy}
                    onFilterChange={handleFilterChange}
                />

                <BulkActions
                    selectedUrls={selectedUrls}
                    onExtendExpiry={handleExtendExpiry}
                    onDelete={handleDelete}
                />

                <UrlTable
                    urls={filteredUrls}
                    selectedUrls={selectedUrls}
                    onSelectUrl={setSelectedUrls}
                    onEdit={(url) => {
                        setSelectedUrl(url);
                        setShowEditDialog(true);
                    }}
                    onDelete={handleDelete}
                    onShare={handleShare}
                    onViewAnalytics={handleViewAnalytics}
                />

                {showShareModal && selectedUrl && (
                    <ShareModal
                        url={selectedUrl}
                        isOpen={showShareModal}
                        onClose={() => {
                            setShowShareModal(false);
                            setSelectedUrl(undefined);
                        }}
                    />
                )}

                {
                    showAnalytics && selectedUrl && (
                        <Dialog open={showAnalytics} onOpenChange={setShowAnalytics} >
                            <DialogContent className="max-w-4xl" >
                                <DialogHeader>
                                    <DialogTitle>Analytics for {selectedUrl.shortUrl} </DialogTitle>
                                </DialogHeader>
                                < Analytics url={selectedUrl} />
                            </DialogContent>
                        </Dialog>
                    )}
                {/* QR Code Modal */}
                {
                    showQR && (
                        <QRCodeModal
                            url={selectedUrl ? selectedUrl.shortUrl : ''}
                            onClose={() => setShowQR(false)
                            }
                        />
                    )}

                {/* Delete Dialog */}
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete URLs </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription>
                            Are you sure you want to delete {selectedUrls.length} URL(s) ?
                        </AlertDialogDescription>
                        < AlertDialogFooter >
                            <AlertDialogCancel>Cancel </AlertDialogCancel>
                            < AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDelete(selectedUrls)}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Edit Dialog */}
                <Dialog open={showEditDialog} onOpenChange={setShowEditDialog} >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit URL </DialogTitle>
                        </DialogHeader>
                        < div className="p-4" >
                            {user?.subscriptionStatus === 'free' ? (
                                <p className="text-red-600" > You cannot edit the link with a free subscription.</p>
                            ) : (
                                <>
                                    <label>
                                        Original URL
                                        < Input
                                            value={editForm.originalUrl}
                                            onChange={(e) => setEditForm({ ...editForm, originalUrl: e.target.value })}
                                        />
                                    </label>
                                    {
                                        user?.subscriptionStatus === 'premium' && (
                                            <label>
                                                Short URL
                                                < Input
                                                    value={editForm.shortUrl}
                                                    onChange={(e) => setEditForm({ ...editForm, shortUrl: e.target.value })
                                                    }
                                                    disabled={user.subscriptionStatus !== 'premium'}
                                                />
                                            </label>
                                        )}
                                </>
                            )}
                        </div>
                        < DialogFooter >
                            <DialogDescription>
                                You can edit the original URL and short URL here.
                            </DialogDescription>
                            < div className="flex gap-4" >
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowEditDialog(false)}
                                >
                                    Cancel
                                </Button>
                                < Button
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
        </div>
    );
};

export default MyUrlsPage;