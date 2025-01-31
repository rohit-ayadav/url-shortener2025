
import { UserProfile } from "@/types/types";
import { ApiUsageCard } from "./ApiUsageCard";
import { ApiKeyCard } from "./ApiKeyCard";


interface ApiSectionProps {
    profile: UserProfile;
    isLoading: boolean;
    onRegenerateKey: () => void;
}

export function ApiSection({ profile, isLoading, onRegenerateKey }: ApiSectionProps) {
    return (
        <div className="space-y-6">
            <ApiKeyCard
                apiKey={profile.apiKey}
                isLoading={isLoading}
                onRegenerateKey={onRegenerateKey}
            />
            <ApiUsageCard apiUsage={profile.apiUsage} />
        </div>
    );
}