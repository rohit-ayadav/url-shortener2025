
import { Progress } from '@/components/ui/progress';

// Usage Meter Component
const UsageMeter = ({ used, total }: { used: number; total: number }) => {
    const percentage = Math.floor((used / total) * 100);
    const isNearLimit = percentage >= 80;

    return (
        <div className="space-y-4">
            <Progress
                value={percentage}
                className={`h-2 ${isNearLimit ? 'bg-red-100' : 'bg-blue-100'}`}
            />
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                    {used} of {total} URLs shortened
                </p>
                <p className={`text-sm font-medium ${isNearLimit ? 'text-red-600' : 'text-blue-600'}`}>
                    {percentage}%
                </p>
            </div>
            {isNearLimit && (
                <p className="text-sm text-red-600">
                    You're approaching your daily limit. Consider upgrading your plan!
                </p>
            )}
        </div>
    );
};


export { UsageMeter };