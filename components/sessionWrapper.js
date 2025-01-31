"use client";
import { SessionProvider } from 'next-auth/react'
// import SubscriptionPopup from '../../components/SubscriptionPopup';
import { Toaster } from "@/components/ui/toaster"

const SessionWrapper = ({ children }) => {
    return (
        <SessionProvider>
            <Toaster />
            {/* <SubscriptionPopup /> */}
            {children}
        </SessionProvider>
    )
}; 

export default SessionWrapper;