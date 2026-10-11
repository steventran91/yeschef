"use client"

export default function Modal({isOpen, onClose, children}: {isOpen: boolean, onClose: () => void, children: React.ReactNode}) {
    if (isOpen === false) return null;

    return <div>
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    </div>
}