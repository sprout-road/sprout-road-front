import { ChangeEvent, useRef } from "react";
import { BsCameraFill } from "react-icons/bs";
import { missionApi } from "../../services/missionApi";

interface ImageMissionContentProps {
    uploadedImageUrl: string | null;
    setUploadedImageUrl: (url: string | null) => void;
}

function ImageMissionContent({ uploadedImageUrl, setUploadedImageUrl }: ImageMissionContentProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddPicture = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            if (file.size > 10 * 1024 * 1024) {
                throw new Error("파일 크기가 너무 큽니다 (10MB 이하만 가능)");
            }

            const result = await missionApi.missionImageUpload(file);
            setUploadedImageUrl(result);
        } catch (error) {
            console.error('파일 업로드 에러:', error);
            
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            alert("이미지 업로드에 실패했습니다.");
        }
    };

    const handleImageChange = () => {
        setUploadedImageUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div>
            {uploadedImageUrl ? (
                <div className="flex flex-col items-center">
                    <img 
                        src={uploadedImageUrl} 
                        alt="업로드된 이미지" 
                        className="max-w-full max-h-60 rounded-lg mb-4"
                    />
                    <button 
                        onClick={handleImageChange}
                        className="text-sm text-gray-600 underline"
                    >
                        이미지 변경
                    </button>
                </div>
            ) : (
                <div 
                    className="flex flex-col justify-center rounded-lg w-75 bg-white border-2 p-10 h-40 cursor-pointer"
                    onClick={handleAddPicture}
                >
                    <div className="flex justify-center p-2">
                        <BsCameraFill size={36} color="black" />
                    </div>
                    <p className="text-center pb-4 font-bold">사진을 첨부해주세요.</p>
                </div>
            )}
            
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
        </div>
    );
}

export default ImageMissionContent;