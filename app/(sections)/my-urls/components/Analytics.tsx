import { Card, CardContent } from "@/components/ui/card";
import { LineChart, XAxis, YAxis, Tooltip, Line } from 'recharts';
import { differenceInDays } from 'date-fns';
import { UrlData } from "@/types/types";

export const Analytics = ({ url }: { url: UrlData }) => {
    const clicksData = [
        { name: 'Mon', clicks: 10 },
        { name: 'Tue', clicks: 15 },
        { name: 'Wed', clicks: 8 },
        { name: 'Thu', clicks: 12 },
        { name: 'Fri', clicks: 20 },
        { name: 'Sat', clicks: 17 },
        { name: 'Sun', clicks: 14 }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-500">Total Clicks</h3>
                            <p className="text-3xl font-bold">{url.clicks}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-500">Average Daily Clicks</h3>
                            <p className="text-3xl font-bold">
                                {Math.round(url.clicks / differenceInDays(new Date(), url.created))}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-500">Days Active</h3>
                            <p className="text-3xl font-bold">
                                {differenceInDays(new Date(), url.created)}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Weekly Click Distribution</h3>
                    <LineChart width={600} height={300} data={clicksData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="clicks" stroke="#2563eb" />
                    </LineChart>
                </CardContent>
            </Card>
        </div>
    );
};

export default Analytics;