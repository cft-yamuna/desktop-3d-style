import { useState, useEffect } from 'react';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if it's iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIOSDevice);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return;
        }

        const handler = (e: any) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            if (isIOS) {
                alert("To install on iOS: tap 'Share' -> 'Add to Home Screen'");
            }
            return;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    if (!isVisible && !isIOS) return null;

    // Only show iOS prompt if specifically desired, otherwise for now just handle Android/Desktop via prompt
    // But usually for iOS simpler to just rely on browser UI or a specific hint separately. 
    // For this component I will just return null if not visible (standard PWA flow).
    // If user wants iOS specific hint, they'll ask or we can add it. 
    // Actually, let's keep it simple: only show button if installable (Android/Desktop)
    if (!isVisible) return null;

    return (
        <button
            onClick={handleInstallClick}
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 9999,
                padding: '12px 24px',
                backgroundColor: '#FFFFFF',
                color: '#6366f1', // Indigo 500 to match theme
                border: 'none',
                borderRadius: '50px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
        >
            <span style={{ fontSize: '20px' }}>📱</span>
            Install App
        </button>
    );
};

export default InstallPrompt;
