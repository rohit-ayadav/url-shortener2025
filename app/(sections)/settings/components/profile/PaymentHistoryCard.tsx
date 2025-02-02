import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PaymentHistory } from '@/types/types';

interface PaymentHistoryCardProps {
    payments: PaymentHistory[];
}

export function PaymentHistoryCard({ payments }: PaymentHistoryCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                    View your recent payments and transactions
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Mode</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell>
                                    {new Date(payment.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{payment.description}</TableCell>
                                <TableCell>₹{payment.amount}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        payment.status === 'succeeded' ? 'default' :
                                            payment.status === 'failed' ? 'destructive' : 'secondary'
                                    }>
                                        {payment.status.charAt(0).toUpperCase() +
                                            payment.status.slice(1)}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

