// DashboardHeader.tsx
import { Button } from '@/components/ui/button';
import { Settings, User as UserIcon, List } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
    userName: string;
}

export const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
    const router = useRouter();

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome back, {userName}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none justify-center"
                    onClick={() => router.push('/settings')}
                >
                    <UserIcon className="w-4 h-4 mr-2" />
                    Account
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none justify-center"
                    onClick={() => router.push('/settings')}
                >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none justify-center"
                    onClick={() => router.push('/my-urls')}
                >
                    <List className="w-4 h-4 mr-2" />
                    All URLs
                </Button>
            </div>
        </div>
    );
};

