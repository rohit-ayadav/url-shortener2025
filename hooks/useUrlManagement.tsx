import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UrlData } from '@/types/types';

const useUrlManagement = () => {
    const [urls, setUrls] = useState<UrlData[]>([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const fetchUrls = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/my-urls?limit=5');
            if (!response.ok) throw new Error('Failed to fetch URLs');
            const data = await response.json();
            setUrls(data.urls);
            return data.user;
        } catch (error) {
            toast.toast({
                title: "Error",
                description: "Failed to fetch URLs",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return { urls, loading, fetchUrls };
};

export default useUrlManagement;