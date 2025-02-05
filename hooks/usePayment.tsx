"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

const usePayment = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState("");
    const toast = useToast();
    const route = useRouter();
    const { data: session, status } = useSession();


    const handlePayment = async (id: string, price: number) => {
        if (status === 'loading') {
            return;
        }
        if (status === 'unauthenticated') {
            window.location.href = "/auth";
            return;
        }
        setIsProcessing(true);
        setPaymentError("");

        try {
            const body = {
                amount: price,
                currency: "INR",
                paymentMethod: "razorpay",
                email: session?.user?.email,
                paymentFor: id,
            };
            console.log(`Creating order for ${id} plan...:`, body);

            const res = await fetch("/api/payments/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (data.success) {
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: data.amount,
                    currency: "INR",
                    name: "RUShort",
                    description: `Payment for ${id} Plan`,
                    image: "/android-chrome-512x512.png",
                    order_id: data.orderId,
                    handler: async function (response: any) {
                        // Verify the payment
                        console.log("Payment response:", response);
                        const paymentData = {
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            plan: id,
                            email: session?.user?.email,
                        };
                        console.log("Verifying payment...", paymentData);
                        const result = await fetch("/api/payments/verify-payment", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(paymentData),
                        });
                        const dataVerify = await result.json();
                        if (!result.ok) {
                            setPaymentError(data.message);
                            toast.toast({
                                title: "Payment Verification Failed...",
                                description: dataVerify.message,
                                variant: 'destructive'
                            })
                        } else {
                            toast.toast({
                                title: "Payment Verified Successfully",
                                description: `You have successfully subscribed to ${id} plan.`,
                                variant: 'default'
                            })
                            route.push("/my-purchase");
                        }
                    },
                    prefill: {
                        name: session?.user?.name,
                        email: session?.user?.email,
                    },
                    theme: {
                        color: "#2563EB", // primary color
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                setPaymentError("Failed to create order. Please try again.");
                toast.toast({
                    title: "Payment Error",
                    description: data.message,
                    variant: 'destructive'
                })
            }
        } catch (error) {
            console.error("Payment Error:", error);
            setPaymentError("An error occurred. Please try again later.");
        }

        setIsProcessing(false);
    };
    <Script src="https://checkout.razorpay.com/v1/checkout.js" />

    return {
        isProcessing,
        paymentError,
        handlePayment,
    }
}

export default usePayment;
