import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <h1 className="font-monte-carlo text-[80px] leading-none text-burgundy mb-8 text-center">
          Photobooth
        </h1>
        
        <div className="mb-12 w-full max-w-[343px]">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/6c56b121cd6e1670168617e5436cdb091ddd2075?width=686"
            alt="Vintage Photobooth"
            className="w-full h-auto"
          />
        </div>

        <div className="flex flex-col gap-4 w-full max-w-[202px]">
          <button
            onClick={() => navigate("/camera")}
            className="w-full h-[53px] rounded-[10px] bg-burgundy text-cream font-playfair text-[22px] shadow-md hover:opacity-90 transition-opacity"
          >
            Use Camera
          </button>
          
          <button
            onClick={() => navigate("/upload")}
            className="w-full h-[53px] rounded-[10px] bg-burgundy text-cream font-playfair text-[22px] shadow-md hover:opacity-90 transition-opacity"
          >
            Upload Photos
          </button>
        </div>
      </div>
    </div>
  );
}
