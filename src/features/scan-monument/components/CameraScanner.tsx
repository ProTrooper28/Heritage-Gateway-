import { useState, useEffect, useRef } from "react";
import { Camera, AlertTriangle, Minimize2 } from "lucide-react";

type Props = {
  onImageCaptured: (dataUrl: string) => void;
  onClose: () => void;
};

export function CameraScanner({ onImageCaptured, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [permission, setPermission] = useState<"prompt" | "granted" | "denied">("prompt");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startCamera = async () => {
    setErrorMessage(null);
    try {
      if (streamRef.current) {
        stopCamera();
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setPermission("granted");
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setPermission("denied");
      setErrorMessage(err.message || "Unable to access device camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        stopCamera();
        onImageCaptured(dataUrl);
      }
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="relative h-[320px] rounded-2xl border border-parchment/15 bg-black overflow-hidden flex flex-col items-center justify-center">
      {permission === "granted" && (
        <>
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          
          {/* Laser scanning line */}
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gold/60 shadow-[0_0_12px_var(--color-gold)] animate-[scan-line_4s_ease-in-out_infinite]" />

          {/* Framing Target */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-56 rounded-full border border-dashed border-gold/40 flex items-center justify-center">
              <div className="w-52 h-52 rounded-full border-2 border-gold/25 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 px-2 py-0.5 bg-black/75 rounded text-[0.5rem] tracking-[0.2em] uppercase text-gold border border-gold/20 font-sans">
                  Target Reticle
                </div>
              </div>
            </div>
          </div>

          {/* Capture Actions Bar */}
          <div className="absolute bottom-4 inset-x-0 flex justify-center items-center gap-4 z-10">
            <button
              onClick={capturePhoto}
              className="rounded-full bg-gold hover:bg-gold/90 text-ink w-14 h-14 border-4 border-black/50 shadow-lg flex items-center justify-center transition hover:scale-105 active:scale-95 cursor-pointer"
              title="Capture Photo"
            >
              <Camera size={22} strokeWidth={2.5} />
            </button>

            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="absolute right-4 rounded-lg bg-black/60 border border-parchment/15 px-3 py-1.5 font-sans text-[0.62rem] uppercase tracking-wider text-parchment/70 hover:bg-black/90 hover:text-gold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Minimize2 size={11} />
              Close
            </button>
          </div>
        </>
      )}

      {permission === "prompt" && (
        <div className="p-8 text-center flex flex-col items-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-4">
            <Camera size={18} />
          </div>
          <h4 className="font-serif text-lg text-parchment mb-1 font-light">Camera Permission Required</h4>
          <p className="font-sans text-xs text-parchment/50 font-light mb-5 leading-normal">
            Grant permission to use your camera for real-time monument scanning.
          </p>
          <button
            onClick={startCamera}
            className="rounded-xl border border-gold/30 bg-gold/10 px-6 py-2.5 font-sans text-[0.7rem] uppercase tracking-widest text-gold hover:bg-gold/20 transition cursor-pointer"
          >
            Grant Access
          </button>
        </div>
      )}

      {permission === "denied" && (
        <div className="p-8 text-center flex flex-col items-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mb-4">
            <AlertTriangle size={18} />
          </div>
          <h4 className="font-serif text-lg text-parchment mb-1 font-light">Camera Access Blocked</h4>
          <p className="font-sans text-xs text-parchment/50 font-light mb-5 leading-normal">
            {errorMessage || "Camera access was denied. Please update browser permissions and retry."}
          </p>
          <button
            onClick={startCamera}
            className="rounded-xl border border-parchment/15 bg-parchment/5 px-6 py-2.5 font-sans text-[0.7rem] uppercase tracking-widest text-parchment/75 hover:bg-parchment/10 transition cursor-pointer"
          >
            Retry Access
          </button>
        </div>
      )}

      <style>{`
        @keyframes scan-line {
          0%, 100% { top: 0%; opacity: 0.2; }
          50% { top: 100%; opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
