import React, { useState, useRef } from "react";
import imageCompression from "browser-image-compression";

interface ImageUploaderProps {
  onImageUpload?: (base64: string) => void;
  label: string;
  buttonComponent: React.ComponentType<{
    onClick: () => void;
    uploaded: boolean;
    children: React.ReactNode;
  }>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, label, buttonComponent: ButtonComponent }) => {
  const [uploaded, setUploaded] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          initialQuality: 0.8,
          fileType: "image/webp",
        });

        const base64 = await convertBase64(compressedFile);
        if (onImageUpload) {
          onImageUpload(base64);
          setUploaded(true);
          clearFileInput();
        }
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  const convertBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={uploadImage}
        style={{ display: "none" }}
      />
      <ButtonComponent onClick={handleButtonClick} uploaded={uploaded}>
        {label}
      </ButtonComponent>
    </div>
  );
};

export default ImageUploader;