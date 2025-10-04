import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

export default function Customize() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedPhotostrip, setSelectedPhotostrip] = useState("pink");
  const [selectedBackground, setSelectedBackground] = useState("tan");
  const [showDateStamp, setShowDateStamp] = useState(true);

  useEffect(() => {
    const storedPhotos = localStorage.getItem("capturedPhotos");
    if (storedPhotos) {
      setPhotos(JSON.parse(storedPhotos));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const photostripColors = [
    { name: "vanilla", color: "#FFF8F0" },
    { name: "pink", color: "#F7D6D0" },
    { name: "blue", color: "#D6E7FF" },
    { name: "purple", color: "#DEC1FF" },
    { name: "black", color: "#000000" },
  ];

  const backgroundColors = [
    { name: "beige", color: "#EFE8E0" },
    { name: "tan", color: "#E0C0BB" },
    { name: "gray", color: "#DADADE" },
    { name: "lavender", color: "#CEC6D6" },
    { name: "white", color: "#FFFFFF" },
  ];

  const handleContinue = () => {
    localStorage.setItem("photostripColor", selectedPhotostrip);
    localStorage.setItem("backgroundColor", selectedBackground);
    localStorage.setItem("showDateStamp", showDateStamp.toString());
    navigate("/preview");
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <h1 className="font-monte-carlo text-[58px] leading-[60px] text-burgundy text-center mb-12">
          Customize your Photostrip
        </h1>

        <div className="w-full space-y-12 mb-12">
          <div>
            <h3 className="font-playfair text-[30px] text-burgundy mb-6">
              Photostrip
            </h3>
            <div className="flex gap-4 flex-wrap">
              {photostripColors.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setSelectedPhotostrip(item.name)}
                  className="relative w-[50px] h-[50px] rounded-lg border border-black shadow-md transition-transform hover:scale-110"
                  style={{ backgroundColor: item.color }}
                >
                  {selectedPhotostrip === item.name && (
                    <Check className="absolute inset-0 m-auto w-5 h-5" style={{ color: item.color === "#000000" ? "white" : "black" }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-playfair text-[30px] text-burgundy mb-6">
              Background
            </h3>
            <div className="flex gap-4 flex-wrap">
              {backgroundColors.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setSelectedBackground(item.name)}
                  className="relative w-[50px] h-[50px] rounded-lg border border-black shadow-md transition-transform hover:scale-110"
                  style={{ backgroundColor: item.color }}
                >
                  {selectedBackground === item.name && (
                    <Check className="absolute inset-0 m-auto w-5 h-5 text-black" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-playfair text-[30px] text-burgundy mb-6">
              Date stamp
            </h3>
            <button
              type="button"
              onClick={() => setShowDateStamp(!showDateStamp)}
              className={`flex items-center px-2 w-[86px] h-[34px] rounded-[30px] bg-burgundy transition-all duration-200 ${
                showDateStamp ? "justify-end" : "justify-start opacity-70"
              }`}
              aria-pressed={showDateStamp}
            >
              <div
                className={`w-7 h-7 rounded-full bg-cream shadow-md transition-transform ${
                  showDateStamp ? "translate-x-0" : "-translate-x-2"
                }`}
              />
            </button>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="w-[169px] h-[53px] rounded-[10px] bg-burgundy text-cream font-playfair text-[22px] shadow-md hover:opacity-90 transition-opacity"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
