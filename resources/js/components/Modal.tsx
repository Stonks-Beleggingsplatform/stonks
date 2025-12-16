import React, { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?:  string;
    children: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'lg' }: ModalProps) {
    if (!isOpen) return null;

    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30"
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`relative bg-white rounded-xl shadow-xl ${maxWidthClasses[maxWidth]} w-full p-6`}>
                {/* Header */}
                {title && (
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    </div>
                )}

                {/* Content */}
                {children}
            </div>
        </div>
    );
}
