import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ApiUsageCardProps {
    apiUsage: {
        total: number;
        limit: number;
    };
}

export function ApiUsageCard({ apiUsage }: ApiUsageCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>API Usage</CardTitle>
                <CardDescription>
                    View your API usage and limits
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Total Requests</TableHead>
                            <TableHead>Limit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>{apiUsage.total}</TableCell>
                            <TableCell>{apiUsage.limit}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}