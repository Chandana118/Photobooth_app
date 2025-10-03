import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Preview() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<string[]>([]);
  const [photostripColor, setPhotostripColor] = useState("#F7D6D0");
  const [backgroundColor, setBackgroundColor] = useState("#E0C0BB");
  const [showDateStamp, setShowDateStamp] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const storedPhotos = localStorage.getItem("capturedPhotos");
    const storedPhotostrip = localStorage.getItem("photostripColor");
    const storedBackground = localStorage.getItem("backgroundColor");
    const storedDateStamp = localStorage.getItem("showDateStamp");

    if (!storedPhotos) {
      navigate("/");
      return;
    }

    setPhotos(JSON.parse(storedPhotos));

    const colorMap: Record<string, string> = {
      vanilla: "#FFF8F0",
      pink: "#F7D6D0",
      blue: "#D6E7FF",
      purple: "#DEC1FF",
      black: "#000000",
      beige: "#EFE8E0",
      tan: "#E0C0BB",
      gray: "#DADADE",
      lavender: "#CEC6D6",
      white: "#FFFFFF",
    };

    if (storedPhotostrip) setPhotostripColor(colorMap[storedPhotostrip] || "#F7D6D0");
    if (storedBackground) setBackgroundColor(colorMap[storedBackground] || "#E0C0BB");
    if (storedDateStamp) setShowDateStamp(storedDateStamp === "true");
  }, [navigate]);

  const downloadPhotostrip = async () => {
    if (!canvasRef.current || photos.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 400;
    const height = 900;
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = photostripColor;
    const stripX = 20;
    const stripY = 20;
    const stripWidth = width - 40;
    const stripHeight = height - 40;
    ctx.fillRect(stripX, stripY, stripWidth, stripHeight);

    const photoWidth = stripWidth - 30;
    const photoHeight = 250;
    const photoX = stripX + 15;

    for (let i = 0; i < 3; i++) {
      const img = new Image();
      img.src = photos[i];
      await new Promise((resolve) => {
        img.onload = () => {
          const photoY = stripY + 15 + i * (photoHeight + 15);
          ctx.drawImage(img, photoX, photoY, photoWidth, photoHeight);
          resolve(null);
        };
      });
    }

    if (showDateStamp) {
      ctx.fillStyle = "#800020";
      ctx.font = "24px 'MonteCarlo', cursive";
      ctx.textAlign = "center";
      const date = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      ctx.fillText(date, width / 2, height - 100);
    }

    const link = document.createElement("a");
    link.download = `photostrip-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <h1 className="font-monte-carlo text-[60px] leading-tight text-burgundy text-center mb-8">
          Collect your Photo
        </h1>

        <div 
          className="relative w-[326px] h-[730px] rounded-[10px] shadow-lg mb-8"
          style={{ backgroundColor }}
        >
          <div 
            className="absolute left-[17px] top-[10px] w-[292px] h-[710px] rounded-[10px] border border-black"
            style={{ backgroundColor: photostripColor }}
          >
            {photos.map((photo, index) => (
              <div
                key={index}
                className="absolute left-[11px] w-[271px] h-[202px] border border-black overflow-hidden"
                style={{ top: `${9 + index * 217}px` }}
              >
                <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}

            {showDateStamp && (
              <p className="absolute bottom-12 left-0 right-0 text-center font-monte-carlo text-[25px] text-burgundy">
                {currentDate}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={downloadPhotostrip}
          className="w-[315px] h-[56px] rounded-[10px] bg-burgundy text-cream font-playfair text-[22px] shadow-md hover:opacity-90 transition-opacity"
        >
          Download Photostrip
        </button>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
