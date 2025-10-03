import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Camera() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState(1);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" },
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera. Please ensure you've granted camera permissions.");
    }
  };

  const startCountdown = () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null || countdown < 0) return;

    if (countdown === 0) {
      capturePhoto();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const photoData = canvas.toDataURL("image/jpeg");
      
      const newPhotos = [...capturedPhotos, photoData];
      setCapturedPhotos(newPhotos);
      
      if (currentPhoto < 3) {
        setCurrentPhoto(currentPhoto + 1);
        setCountdown(null);
        setIsCapturing(false);
      } else {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        localStorage.setItem("capturedPhotos", JSON.stringify(newPhotos));
        navigate("/customize");
      }
    }
  };

  const getPhotoTitle = () => {
    if (currentPhoto === 1) return "First";
    if (currentPhoto === 2) return "Second";
    return "Third";
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <h2 className="font-monte-carlo text-[80px] leading-none text-burgundy mb-8 text-center">
          {getPhotoTitle()}
        </h2>

        <div className="relative w-full max-w-[392px] aspect-[392/574] bg-photogray mb-8 overflow-hidden rounded-lg">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {countdown !== null && countdown >= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <span className="font-playfair text-[120px] text-cream font-bold">
                {countdown === 0 ? "📸" : countdown}
              </span>
            </div>
          )}
        </div>

        <p className="font-playfair text-[30px] text-burgundy text-center mb-4">
          get ready for photo in....
        </p>

        {countdown === null && !isCapturing && (
          <button
            onClick={startCountdown}
            className="font-playfair text-[100px] text-burgundy hover:scale-110 transition-transform"
          >
            {currentPhoto}
          </button>
        )}

        {capturedPhotos.length > 0 && (
          <div className="mt-4 text-burgundy font-playfair text-sm">
            Photos captured: {capturedPhotos.length}/3
          </div>
        )}
      </div>
    </div>
  );
}
