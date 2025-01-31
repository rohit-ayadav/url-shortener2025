"use server";
import { connectDB } from "@/utils/db";
import Contact from "@/models/Contact";

interface Contact {
    name: string;
    email: string;
    category: string;
    message: string;
}

export const storeContactData = async (contact: Contact) => {
    try {
        await connectDB();
        const newContact = new Contact(contact);
        await newContact.save();
        const response = {
            message: "Contact form submitted successfully",
            success: true,
            error: "",
        };
        return response;
    } catch (error) {
        console.log(error);
        return {
            message: "An error occurred while submitting the contact form",
            success: false,
            error: (error as Error).message,
        };
    }
};