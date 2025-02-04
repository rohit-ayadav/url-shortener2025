import { Button } from '@/components/ui/button';
import { UrlData } from '@/types/types';
import { Download, MoreVertical, Printer, RefreshCw, Share2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UrlTableHeaderProps {
    refresh: () => void;
    onPrint: () => void;
    onDownloadCSV: () => void;
    selectedCount: number;
    handleShare: () => void;
}

export const UrlTableHeader = ({
    refresh,
    onPrint,
    onDownloadCSV,
    selectedCount,
    handleShare
}: UrlTableHeaderProps) => {
    return (
        <div className="bg-white sticky top-0 z-10 p-4 border-b mb-4">
            <div className="flex flex-col gap-4">
                {/* Header with Title and Selected Count */}
                <div className="flex items-center justify-between">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                        My URLs
                        {selectedCount > 0 && (
                            <span className="ml-2 text-sm font-normal text-gray-500">
                                ({selectedCount} selected)
                            </span>
                        )}
                    </h1>
                    
                    {/* Mobile Menu */}
                    <div className="sm:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={refresh}>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Refresh
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onPrint}>
                                    <Printer className="h-4 w-4 mr-2" />
                                    Print
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onDownloadCSV}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Export CSV
                                </DropdownMenuItem>
                                {selectedCount > 0 && (
                                    <DropdownMenuItem onClick={handleShare}>
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share Selected
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Desktop Buttons */}
                    <div className="hidden sm:flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={refresh}
                            className="transition-all hover:bg-gray-100"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            <span className="hidden md:inline">Refresh</span>
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={onPrint}
                            className="transition-all hover:bg-gray-100"
                        >
                            <Printer className="h-4 w-4 mr-2" />
                            <span className="hidden md:inline">Print</span>
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={onDownloadCSV}
                            className="transition-all hover:bg-gray-100"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            <span className="hidden md:inline">Export</span>
                        </Button>
                        {selectedCount > 0 && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleShare}
                                className="transition-all hover:bg-gray-100"
                            >
                                <Share2 className="h-4 w-4 mr-2" />
                                <span className="hidden md:inline">Share</span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};