import { useRef, useState } from "react";
import axios from "axios";

import CustomVoiceRecorder from "./CustomVoiceRecorder";

type UploadFormProps = {
  onNext: () => void;
};

const UploadForm = ({ onNext }: UploadFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<File[]>([]);
  const [audio, setAudio] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    const mergedFiles = [...images, ...imageFiles];

    if (mergedFiles.length < 8) {
      setError("Please select at least 8 images.");
    } else {
      setError(null);
    }

    setImages(mergedFiles);
  };

  const handleDelete = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (images.length < 8) {
      setError("Please select at least 8 images.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();

      images.forEach((img) => formData.append("files", img));
      if (audio) {
        formData.append("audio", audio);
      }

      await axios.post("http://192.168.0.151:8000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onNext();
    } catch (err: any) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Select Your Photos</h2>

      <div
        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition"
        onClick={triggerFileInput}
      >
        <p className="text-gray-600">Click to select images</p>
        <p className="text-sm text-gray-400 mt-1">
          JPG, PNG (at least 8 images)
        </p>
      </div>

      <input
        type="file"
        accept="image/*"
        multiple
        // capture="environment"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(image)}
                alt={`Selected ${index}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => handleDelete(index)}
                className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-500">
        {images.length} image{images.length !== 1 && "s"} selected
      </p>

      <CustomVoiceRecorder onAudioRecorded={setAudio} />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="button"
        className={`bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default UploadForm;
