import React from 'react'
import { SlidersHorizontal } from 'lucide-react';

interface LoadingProps {
    text: string;
}


const Loading: React.FC<LoadingProps> = ({ text }) => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-8 w-8 animate-spin text-blue-600" />
                <span className="text-blue-600 font-medium">{text}</span>
            </div>
        </div>
    );
};

export default Loading
