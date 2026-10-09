"use client"

export default function Modal({isOpen, onClose, children}: {isOpen: boolean, onClose: () => void, children: React.ReactNode}) {
    if (isOpen === false) return null;

    return <div>
        <div
            className="fixed inset-0"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    </div>
}