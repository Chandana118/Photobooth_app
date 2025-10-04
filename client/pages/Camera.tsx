import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_COUNTDOWN = 3;

const applyVintageGrayscale = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    const toned = Math.min(255, gray * 1.05);
    data[i] = Math.min(255, toned + 8);
    data[i + 1] = Math.min(255, toned + 4);
    data[i + 2] = Math.min(255, toned);
  }

  ctx.putImageData(imageData, 0, 0);
};

const getPhotoTitle = (index: number) => {
  if (index === 1) return "First";
  if (index === 2) return "Second";
  return "Third";
};

export default function Camera() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const prepareTimeoutRef = useRef<number | null>(null);
  const countdownTimerRef = useRef<number | null>(null);
  const countdownDurationRef = useRef(DEFAULT_COUNTDOWN);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState(1);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        streamRef.current = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Unable to access camera. Please ensure you've granted camera permissions.");
      }
    };

    startCamera();

    return () => {
      if (prepareTimeoutRef.current) {
        window.clearTimeout(prepareTimeoutRef.current);
      }
      if (countdownTimerRef.current) {
        window.clearTimeout(countdownTimerRef.current);
      }
      const activeStream = streamRef.current;
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!stream) return;
    if (capturedPhotos.length >= 3) return;
    if (countdown !== null) return;

    if (prepareTimeoutRef.current) {
      window.clearTimeout(prepareTimeoutRef.current);
    }

    const delay = capturedPhotos.length === 0 ? 1200 : 1600;

    prepareTimeoutRef.current = window.setTimeout(() => {
      setIsCapturing(true);
      setCountdown(countdownDurationRef.current);
      prepareTimeoutRef.current = null;
    }, delay);

    return () => {
      if (prepareTimeoutRef.current) {
        window.clearTimeout(prepareTimeoutRef.current);
        prepareTimeoutRef.current = null;
      }
    };
  }, [stream, capturedPhotos, countdown]);

  useEffect(() => {
    if (countdown === null || countdown < 0) return;

    if (countdown === 0) {
      capturePhoto();
      return;
    }

    const timerId = window.setTimeout(() => {
      setCountdown(prev => (prev ?? 1) - 1);
    }, 1000);

    countdownTimerRef.current = timerId;

    return () => {
      window.clearTimeout(timerId);
      countdownTimerRef.current = null;
    };
  }, [countdown]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    applyVintageGrayscale(ctx, canvas.width, canvas.height);

    const photoData = canvas.toDataURL("image/jpeg");
    const newPhotos = [...capturedPhotos, photoData];

    setCapturedPhotos(newPhotos);
    setCountdown(null);
    setIsCapturing(false);

    if (newPhotos.length < 3) {
      setCurrentPhoto(Math.min(3, newPhotos.length + 1));
    } else {
      const activeStream = streamRef.current;
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      localStorage.setItem("capturedPhotos", JSON.stringify(newPhotos));
      navigate("/customize");
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <h2 className="font-monte-carlo text-[80px] leading-none text-burgundy mb-6 text-center">
          {getPhotoTitle(currentPhoto)}
        </h2>

        <div className="flex items-center gap-4 mb-6">
          <span className="font-playfair text-[22px] text-burgundy">Timer</span>
          <div className="flex gap-3">
            {countdownChoices.map(choice => (
              <button
                key={choice}
                type="button"
                onClick={() => setCountdownDuration(choice)}
                className={`w-[62px] h-[36px] rounded-full border border-burgundy font-playfair text-[18px] transition-all ${
                  countdownDuration === choice
                    ? "bg-burgundy text-cream shadow-md"
                    : "bg-cream text-burgundy"
                }`}
                aria-pressed={countdownDuration === choice}
              >
                {choice}s
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full max-w-[392px] aspect-[392/574] bg-photogray mb-8 overflow-hidden rounded-lg">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          {isCapturing && countdown !== null && countdown >= 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/35">
              <span className="font-playfair text-[32px] text-cream tracking-wide">
                Hold still!
              </span>
              <span className="font-playfair text-[120px] text-cream font-bold">
                {countdown === 0 ? "📸" : countdown}
              </span>
            </div>
          )}
        </div>

        <p className="font-playfair text-[24px] text-burgundy text-center mb-2">
          Capturing photo {capturedPhotos.length + 1} of 3
        </p>
        <p className="font-playfair text-[18px] text-burgundy/80 text-center">
          The shutter will trigger automatically after the timer.
        </p>

        {capturedPhotos.length > 0 && (
          <div className="mt-6 text-burgundy font-playfair text-sm">
            Photos captured: {capturedPhotos.length}/3
          </div>
        )}
      </div>
    </div>
  );
}
