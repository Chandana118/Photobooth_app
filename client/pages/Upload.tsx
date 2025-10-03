import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus } from "lucide-react";

export default function Upload() {
  const navigate = useNavigate();
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  const handleFileUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPhotos = [...uploadedPhotos];
      newPhotos[index] = reader.result as string;
      setUploadedPhotos(newPhotos);
    };
    reader.readAsDataURL(file);
  };

  const handleContinue = () => {
    if (uploadedPhotos.filter(Boolean).length < 3) {
      alert("Please upload all 3 photos before continuing");
      return;
    }
    localStorage.setItem("capturedPhotos", JSON.stringify(uploadedPhotos));
    navigate("/customize");
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <h1 className="font-monte-carlo text-[60px] leading-[60px] text-burgundy text-center mb-12">
          Upload your Photos
        </h1>

        <div className="space-y-6 mb-12">
          {[0, 1, 2].map((index) => (
            <label
              key={index}
              className="relative block w-[182px] h-[181px] rounded-[10px] border border-black bg-photogray cursor-pointer shadow-md hover:opacity-90 transition-opacity overflow-hidden"
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(index, e)}
                className="hidden"
              />
              {uploadedPhotos[index] ? (
                <img
                  src={uploadedPhotos[index]}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImagePlus className="w-8 h-8 text-cream" />
                </div>
              )}
            </label>
          ))}
        </div>

        <button
          onClick={handleContinue}
          className="w-[294px] h-[56px] rounded-[10px] bg-burgundy text-cream font-playfair text-[22px] shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
          disabled={uploadedPhotos.filter(Boolean).length < 3}
        >
          Continue with photos
        </button>
      </div>
    </div>
  );
}
