import { Button } from "./ui/button";
import { CircleX } from "lucide-react";

interface QRCodeModalProps {
    url: string;
    onClose: () => void;
}

export const QRCodeModal = ({ url, onClose }: QRCodeModalProps) => (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-700">QR Code</h3>
                <Button
                    onClick={onClose}
                    variant="ghost"
                    size="icon"
                    className="text-blue-600"
                >
                    <CircleX className="h-5 w-5" />
                </Button>
            </div>
            <div className="flex justify-center">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`} alt="QR Code" />
            </div>
        </div>
    </div>
);
