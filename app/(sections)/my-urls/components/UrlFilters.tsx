import { Button } from '@/components/ui/button';
import { CalendarIcon, Cross, Search, X } from 'lucide-react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { PopoverAnchor } from '@radix-ui/react-popover';

interface UrlFiltersProps {
    searchTerm: string;
    filterStatus: string;
    selectedDate: Date | undefined;
    sortBy: string;
    onFilterChange: (filterType: string, value: string | Date) => void;
}

const UrlFilters = ({ searchTerm, filterStatus, selectedDate, sortBy, onFilterChange }: UrlFiltersProps) => {
    return (
        <Card className="mb-6">
            <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search URLs..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => onFilterChange('searchTerm', e.target.value)}
                        />
                    </div>
                    <Select value={filterStatus} onValueChange={(value) => onFilterChange('filterStatus', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem className='hover:bg-gray-100 cursor-pointer'
                                value="all">All Status</SelectItem>
                            <SelectItem className='hover:bg-gray-100 cursor-pointer'
                                value="active">Active</SelectItem>
                            <SelectItem className='hover:bg-gray-100 cursor-pointer'
                                value="expired">Expired</SelectItem>
                            <SelectItem className='hover:bg-gray-100 cursor-pointer'
                                value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={(value) => onFilterChange('sortBy', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem className='cursor-pointer' value="created_desc">Newest First</SelectItem>
                            <SelectItem className='cursor-pointer' value="created_asc">Oldest First</SelectItem>
                            <SelectItem className='cursor-pointer' value="clicks_desc">Most Clicked</SelectItem>
                            <SelectItem className='cursor-pointer' value="expires_asc">Expiring Soon</SelectItem>
                        </SelectContent>
                    </Select>
                    <Popover>
                        <div className="relative">

                            <PopoverTrigger asChild>
                                <Button variant="outline" className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !selectedDate && "text-muted-foreground"
                                )}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            {selectedDate && (
                                <Button
                                    variant="ghost"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    onClick={() => onFilterChange('selectedDate', '')}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <PopoverAnchor />
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={selectedDate || undefined}
                                onSelect={(date) => {
                                    date && onFilterChange('selectedDate', date)
                                }}
                                initialFocus
                            />
                        </PopoverContent>

                    </Popover>
                </div>
            </CardContent>
        </Card >
    );
};

export { UrlFilters };