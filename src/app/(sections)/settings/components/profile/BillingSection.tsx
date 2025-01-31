
// components/profile/BillingSection.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserProfile, PaymentHistory } from "@/types/types";
import { SubscriptionCard } from "./SubscriptionCard";
import { PaymentHistoryCard } from "./PaymentHistoryCard";

interface BillingSectionProps {
    profile: UserProfile;
    payments: PaymentHistory[];
}

export function BillingSection({ profile, payments }: BillingSectionProps) {
    return (
        <div className="space-y-6">
            <SubscriptionCard profile={profile} />
            <PaymentHistoryCard payments={payments} />
        </div>
    );
}