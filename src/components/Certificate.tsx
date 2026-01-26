import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Share2, Download, Award } from 'lucide-react';
import { translations } from '../translations';
import QRCode from 'qrcode';

interface CertificateProps {
    userName: string;
    courseName: string;
    language?: string;
    certificateId?: string;
    date?: string;
    userEmail?: string;
}

const Certificate: React.FC<CertificateProps> = ({
    userName,
    courseName,
    language = 'ENGLISH',
    certificateId,
    date = new Date().toLocaleDateString(),
    userEmail
}) => {
    const certificateRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const t = translations[language as keyof typeof translations] || translations.ENGLISH;

    // --- ID STABILITY LOGIC ---
    // Create a key bound to user and course to persist ID
    const storageKey = userEmail ? `cert_id_${userEmail.replace(/[^a-zA-Z0-9]/g, '')}_${courseName.replace(/[^a-zA-Z0-9]/g, '')}` : null;

    // 1. Initialize stableId from localStorage (if exists) or generate new fallback
    const [stableId] = useState(() => {
        if (certificateId) return certificateId;
        if (storageKey) {
            const cached = localStorage.getItem(storageKey);
            if (cached) return cached;
        }
        return 'QX-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    });

    const [backendCertId, setBackendCertId] = useState<string | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    // Prioritize Backend ID > Stable Local ID
    const finalCertificateId = backendCertId || stableId;

    // Persist fallback stableId immediately to prevent regeneration on refresh
    useEffect(() => {
        if (storageKey && !localStorage.getItem(storageKey)) {
            localStorage.setItem(storageKey, stableId);
        }
    }, [stableId, storageKey]);

    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const [scale, setScale] = useState(1);

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://quantxai.com';
    // Use the verification URL pointing to our frontend route
    const verificationUrl = `${origin}/verify/${finalCertificateId}`;

    useEffect(() => {
        const createOrFetchCertificate = async () => {
            // If ID is explicitly passed (e.g. from verification view), use it.
            if (certificateId) return;
            if (!userEmail) return;

            setIsSyncing(true);
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'https://lms-backend-vzds.onrender.com';
                console.log(`Fetching certificate for ${userEmail}...`);

                const response = await fetch(`${API_URL}/api/certificate/issue`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: userEmail,
                        courseName: courseName
                    })
                });

                const data = await response.json();

                if (data.success && data.certificate) {
                    const realId = data.certificate.certificateId;
                    setBackendCertId(realId);

                    // Update localStorage with real ID to ensure future consistency
                    if (storageKey) {
                        localStorage.setItem(storageKey, realId);
                    }
                }
            } catch (error) {
                console.error("Failed to issue/fetch certificate:", error);
            } finally {
                setIsSyncing(false);
            }
        };

        createOrFetchCertificate();
    }, [userEmail, courseName, certificateId, storageKey, stableId]);

    useEffect(() => {
        // Generate QR code as data URL for reliable rendering in html2canvas
        QRCode.toDataURL(verificationUrl, { margin: 0, width: 80, color: { dark: '#000000', light: '#ffffff' } })
            .then(url => setQrCodeUrl(url))
            .catch(err => console.error('Error generating QR code', err));
    }, [verificationUrl]);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const parentWidth = containerRef.current.parentElement?.clientWidth || window.innerWidth;
                const certificateWidth = 1123;
                // Add some padding/margin consideration
                const availableWidth = parentWidth - 40;

                if (availableWidth < certificateWidth) {
                    setScale(availableWidth / certificateWidth);
                } else {
                    setScale(1);
                }
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const downloadCertificate = async () => {
        if (certificateRef.current) {
            try {
                // Temporarily reset scale and centering to ensure clean capture
                const originalTransform = certificateRef.current.style.transform;
                const originalMargin = certificateRef.current.style.margin;
                const originalLeft = certificateRef.current.style.left;
                const originalOrigin = certificateRef.current.style.transformOrigin;

                // Force reset for capture
                certificateRef.current.style.transform = 'scale(1)';
                certificateRef.current.style.margin = '0 auto'; // Center horizontally if needed
                certificateRef.current.style.left = '0';
                certificateRef.current.style.transformOrigin = 'top left';

                // Small delay to let browser reflow
                await new Promise(resolve => setTimeout(resolve, 200));

                const canvas = await html2canvas(certificateRef.current, {
                    scale: 3, // High resolution
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff', // Force white background
                    width: 1123,
                    height: 794,
                    windowWidth: 1123,
                    windowHeight: 794,
                    x: 0,
                    y: 0
                });

                // Restore styles
                certificateRef.current.style.transform = originalTransform;
                certificateRef.current.style.margin = originalMargin;
                certificateRef.current.style.left = originalLeft;
                certificateRef.current.style.transformOrigin = originalOrigin || 'top center';

                const dataUrl = canvas.toDataURL('image/png', 1.0);
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `${userName.replace(/\s+/g, '_')}_Certificate.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error("Certificate download failed:", error);
                alert("Failed to download certificate. Please try again.");
            }
        }
    };

    const shareOnLinkedIn = async () => {
        if (certificateRef.current) {
            // Temporarily reset scale
            const currentTransform = certificateRef.current.style.transform;
            certificateRef.current.style.transform = 'scale(1)';

            const canvas = await html2canvas(certificateRef.current, {
                scale: 2,
                useCORS: true,
                windowWidth: 1123,
                windowHeight: 794
            });

            // Restore scale
            certificateRef.current.style.transform = currentTransform;

            const text = `I am proud to announce that I have successfully completed the "${courseName}" course! 🎓\n\nVerified Certificate ID: ${finalCertificateId}\n\n#AIForAll #DigitalIndia #Learning #QuantXAI`;
            const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
        }
    };

    return (
        <div className="flex flex-col items-center justify-start p-4 md:p-8 w-full" ref={containerRef}>
            <div className="mb-8 text-center w-full max-w-2xl">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{t.congrats}</h2>
                <p className="text-sm md:text-base text-gray-600">{t.congratsMsg}</p>
            </div>

            <div
                className="relative mb-8 flex justify-center overflow-visible"
                style={{
                    width: '100%',
                    height: `${794 * scale}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {/* Certificate Container */}
                <div
                    ref={certificateRef}
                    className="relative bg-white text-gray-800 shadow-2xl flex flex-col box-border origin-top"
                    style={{
                        width: '1123px',
                        height: '794px',
                        minWidth: '1123px',
                        minHeight: '794px',
                        padding: '0', // Full bleed for borders
                        transform: `scale(${scale})`,
                    }}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(#1e3a8a 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}
                    ></div>

                    {/* Main Border Container */}
                    <div className="w-full h-full p-8 flex flex-col">
                        <div className="w-full h-full border-[4px] border-[#1e3a8a] relative flex flex-col bg-white">
                            {/* Inner Gold Border */}
                            <div className="absolute inset-1 border-[2px] border-[#b45309]"></div>
                            {/* Second Inner Blue Border */}
                            <div className="absolute inset-3 border-[1px] border-[#1e3a8a]"></div>

                            {/* Corner Ornaments */}
                            <div className="absolute top-0 left-0 w-24 h-24 border-t-[8px] border-l-[8px] border-[#1e3a8a] m-1"></div>
                            <div className="absolute top-0 right-0 w-24 h-24 border-t-[8px] border-r-[8px] border-[#1e3a8a] m-1"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-[8px] border-l-[8px] border-[#1e3a8a] m-1"></div>
                            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-[8px] border-r-[8px] border-[#1e3a8a] m-1"></div>

                            {/* Gold Corner Accents */}
                            <div className="absolute top-0 left-0 w-16 h-16 border-t-[2px] border-l-[2px] border-[#b45309] m-4"></div>
                            <div className="absolute top-0 right-0 w-16 h-16 border-t-[2px] border-r-[2px] border-[#b45309] m-4"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-[2px] border-l-[2px] border-[#b45309] m-4"></div>
                            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-[2px] border-r-[2px] border-[#b45309] m-4"></div>

                            {/* Header Section */}
                            <div className="flex justify-between items-start px-10 pt-8 pb-4 relative z-10">
                                {/* Authenticity Badge */}
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Authenticity ID</span>
                                    <span className="font-mono text-sm font-bold text-[#1e3a8a] bg-blue-50 px-2 py-1 border border-blue-100 rounded inline-block">
                                        {finalCertificateId}
                                    </span>
                                </div>

                                {/* QR Code */}
                                <div className="flex flex-col items-center">
                                    <div className="bg-white p-1 border border-gray-200 rounded-lg shadow-sm">
                                        {qrCodeUrl ? (
                                            <img src={qrCodeUrl} alt="Verify" className="w-14 h-14" />
                                        ) : (
                                            <div className="w-14 h-14 bg-gray-100"></div>
                                        )}
                                    </div>
                                    <span className="text-[9px] uppercase tracking-wider text-gray-400 mt-1">Scan to Verify</span>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 flex flex-col items-center justify-start text-center relative z-10 -mt-2">
                                {/* Logo */}
                                <div className="mb-4">
                                    <img src="/logo1.png" alt="Quant X AI" className="h-12 object-contain" />
                                </div>

                                <h1 className="text-5xl font-serif font-bold text-[#1e3a8a] tracking-[0.15em] uppercase mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
                                    Certificate
                                </h1>

                                {/* Table layout for stability in html2canvas - Fixed Spacing */}
                                <table className="w-full max-w-lg mb-6" style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ verticalAlign: 'middle', width: '35%', padding: '0 10px', lineHeight: '0' }}>
                                                <div style={{ height: '2px', backgroundColor: '#b45309', opacity: 0.6, width: '100%' }}></div>
                                            </td>
                                            <td style={{ verticalAlign: 'middle', width: '30%', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                <span className="text-xl font-serif italic text-[#b45309]">of Completion</span>
                                            </td>
                                            <td style={{ verticalAlign: 'middle', width: '35%', padding: '0 10px', lineHeight: '0' }}>
                                                <div style={{ height: '2px', backgroundColor: '#b45309', opacity: 0.6, width: '100%' }}></div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <p className="text-gray-500 italic mb-1 text-sm">This successfully certifies that</p>

                                {/* Student Name */}
                                <div className="mb-6 relative px-12 py-2">
                                    <h2 className="text-4xl font-serif font-bold text-gray-900 italic relative z-10 mb-0">
                                        {userName}
                                    </h2>
                                    {/* Decorative Underline - Pushed down to avoid overlap */}
                                    <div style={{
                                        height: '2px',
                                        width: '200px',
                                        backgroundColor: '#1e3a8a',
                                        margin: '12px auto 0 auto' // Explicit top margin
                                    }}></div>
                                </div>

                                <p className="text-gray-500 italic mb-2 text-sm">has demonstrated proficiency and completed the course</p>

                                <h3 className="text-2xl font-bold text-[#1e3a8a] max-w-3xl leading-snug mb-4 uppercase tracking-wide">
                                    {courseName}
                                </h3>

                                <div className="inline-flex items-center gap-2 bg-[#f8fafc] px-6 py-1.5 rounded-full border border-gray-200 mb-2">
                                    <span className="text-gray-400 text-xs uppercase tracking-wide">Issued On</span>
                                    <span className="font-bold text-[#1e3a8a] text-sm">{date}</span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-end px-16 pb-8 relative z-10 mt-auto">
                                {/* Signature Left */}
                                <div className="w-48 text-center group">
                                    <div className="h-12 flex items-end justify-center mb-1">
                                        <img src="/Rahul.png" alt="Signature" className="max-h-full object-contain filter contrast-125" />
                                    </div>
                                    <div className="h-[2px] w-full bg-gray-800 mb-1"></div>
                                    <p className="font-bold text-[#1e3a8a] font-serif text-sm">Rahul Varma</p>
                                    <p className="text-[9px] uppercase tracking-widest text-gray-500">Program Manager & COO</p>
                                </div>

                                {/* Central Seal */}
                                <div className="relative bottom-4">
                                    {/* Outer Glow */}
                                    <div className="absolute inset-0 rounded-full bg-yellow-400 blur-xl opacity-20"></div>
                                    <div className="relative w-24 h-24 bg-gradient-to-br from-[#1e3a8a] to-[#172554] rounded-full flex items-center justify-center border-[6px] border-[#fcd34d] shadow-2xl">
                                        <div className="w-20 h-20 border border-blue-400/30 rounded-full flex items-center justify-center text-[#fcd34d]">
                                            <Award size={48} />
                                        </div>
                                    </div>
                                    {/* Ribbon */}
                                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 -z-10 w-16 h-12 flex justify-between px-1">
                                        <div className="w-5 h-full bg-[#1e3a8a] border-l-[1px] border-[#fcd34d]"></div>
                                        <div className="w-5 h-full bg-[#1e3a8a] border-r-[1px] border-[#fcd34d]"></div>
                                    </div>
                                </div>

                                {/* Signature Right */}
                                <div className="w-48 text-center group">
                                    <div className="h-12 flex items-end justify-center mb-1">
                                        <img src="/Ananya.png" alt="Signature" className="max-h-full object-contain filter contrast-125" />
                                    </div>
                                    <div className="h-[2px] w-full bg-gray-800 mb-1"></div>
                                    <p className="font-bold text-[#1e3a8a] font-serif text-sm">Ananya Parikibandla</p>
                                    <p className="text-[9px] uppercase tracking-widest text-gray-500">CEO, ANVRiksh Tech Solutions</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Watermark Big */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden">
                        <span className="text-[80px] font-bold uppercase text-gray-900 tracking-widest transform -rotate-12 select-none whitespace-nowrap">
                            ANVRiksh Tech Solutions
                        </span>
                    </div>
                </div>
            </div>

            {/* Sync Status / Retry */}
            {!backendCertId && userEmail && (
                <div className="mb-4 text-center">
                    <p className="text-amber-600 text-sm mb-2">Certificate not yet verified with database.</p>
                    <button
                        onClick={() => {
                            // Force re-run of effect by invalidating or calling directly
                            window.location.reload();
                        }}
                        className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded hover:bg-amber-200"
                    >
                        Retry Verification Status
                    </button>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6 w-full max-w-md md:max-w-none">
                <button onClick={downloadCertificate} className="flex items-center justify-center space-x-2 bg-[#1e3a8a] text-white px-8 py-3 rounded-full hover:bg-[#172554] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    <Download size={20} />
                    <span>{t.downloadCert}</span>
                </button>
                <button onClick={shareOnLinkedIn} className="flex items-center justify-center space-x-2 bg-[#0077b5] text-white px-8 py-3 rounded-full hover:bg-[#006097] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    <Share2 size={20} />
                    <span>{t.shareLinkedIn}</span>
                </button>
            </div>
        </div>
    );
};

export default Certificate;
