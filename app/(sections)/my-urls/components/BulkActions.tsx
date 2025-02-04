import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogHeader, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ObjectId } from "mongoose";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Calendar as CalendarIcon, Trash2, Clock } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BulkActionsProps {
    selectedUrls: ObjectId[];
    onExtendExpiry: (Ids: ObjectId[], expiryDate: Date) => void;
    onDelete: (urls: ObjectId[]) => void;
}

export const BulkActions = ({ selectedUrls, onExtendExpiry, onDelete }: BulkActionsProps) => {
    const [expiryDate, setExpiryDate] = useState<Date>();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("expiry");
    const [loading, setLoading] = useState(false);

    const handleExtendExpiry = async () => {
        if (!expiryDate) return;

        setLoading(true);
        try {
            await onExtendExpiry(selectedUrls, expiryDate);
            setIsOpen(false);
            setExpiryDate(undefined);
        } catch (error) {
            console.error("Failed to extend expiry:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await onDelete(selectedUrls);
            setIsDeleteDialogOpen(false);
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to delete URLs:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    {/* <Button 
                        disabled={selectedUrls.length === 0}
                        className={cn(
                            "transition-all",
                            selectedUrls.length > 0 && "animate-pulse",
                        )}
                    >
                        <span className="flex items-center gap-2">
                            Bulk Actions
                            {selectedUrls.length > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                    {selectedUrls.length}
                                </Badge>
                            )}
                        </span>
                    </Button> */}
                    {selectedUrls.length > 0 ? (
                        <Button className="animate-pulse">
                            <span className="flex items-center gap-2">
                                Bulk Actions
                                <Badge variant="secondary" className="ml-2">
                                    {selectedUrls.length}
                                </Badge>
                            </span>
                        </Button>
                    ) : null}

                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            Bulk Actions
                            <Badge variant="secondary">
                                {selectedUrls.length} selected
                            </Badge>
                        </DialogTitle>
                    </DialogHeader>

                    <Tabs defaultValue="expiry" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="expiry" className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Set Expiry
                            </TabsTrigger>
                            <TabsTrigger value="delete" className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="expiry" className="space-y-4 mt-4">
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium">Set Expiration Date</label>
                                    {expiryDate && (
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            <CalendarIcon className="h-3 w-3" />
                                            {format(expiryDate, "PPP")}
                                        </Badge>
                                    )}
                                </div>
                                <Calendar
                                    mode="single"
                                    selected={expiryDate}
                                    onSelect={setExpiryDate}
                                    disabled={(date) => date < new Date()}
                                    className="rounded-md border"
                                />
                                <Button
                                    onClick={handleExtendExpiry}
                                    disabled={!expiryDate || loading}
                                    className="w-full"
                                >
                                    {loading ? "Applying..." : "Apply to Selected"}
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="delete" className="space-y-4 mt-4">
                            <div className="flex flex-col gap-4">
                                <div className="text-center space-y-2">
                                    <Trash2 className="h-12 w-12 mx-auto text-red-500" />
                                    <p className="text-sm text-gray-500">
                                        Are you sure you want to delete {selectedUrls.length} URLs?
                                        This action cannot be undone.
                                    </p>
                                </div>
                                <Button
                                    variant="destructive"
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                    className="w-full"
                                >
                                    Delete {selectedUrls.length} URLs
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete URLs</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete {selectedUrls.length} URLs.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={loading}
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};