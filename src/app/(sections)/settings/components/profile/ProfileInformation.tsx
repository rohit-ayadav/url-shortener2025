// components/profile/ProfileInformation.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Upload } from "lucide-react";
import { UserProfile } from "@/types/types";
interface ProfileInformationProps {
    profile: UserProfile;
    onNameUpdate: (name: string) => void;
    onAvatarUpdate: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileInformation({ profile, onNameUpdate, onAvatarUpdate }: ProfileInformationProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your profile information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-32 h-32">
                        <AvatarImage src={profile.avatar} />
                        <AvatarFallback><User className="w-16 h-16" /></AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            id="avatar-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={onAvatarUpdate}
                        />
                        <Button
                            variant="outline"
                            onClick={() => document.getElementById('avatar-upload')?.click()}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Change Picture
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) => onNameUpdate(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={profile.email}
                            disabled
                            className="bg-gray-50"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

