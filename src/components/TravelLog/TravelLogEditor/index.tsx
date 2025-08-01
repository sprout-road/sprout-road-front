import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useRef } from 'react';
import { FaCamera } from "react-icons/fa6";
import { TravelLogApi } from '../../../services/TravelLogApi';

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
}

function TravelLogEditor({ 
    value, 
    onChange 
}: EditorProps) {
    const quillRef = useRef<ReactQuill>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 이미지 버튼 제외한 툴바 설정
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['blockquote'],
            ['link']  // 'image' 제거
        ],
    };

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'color', 'background', 'list', 'bullet',
        'blockquote', 'link', 'image'
    ];

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드할 수 있습니다.');
            return;
        }

        const maxSize = 5 * 1024 * 1024; 
        if (file.size > maxSize) {
            alert('파일 크기는 5MB 이하여야 합니다.');
            return;
        }

        try {
            const imageUrl = await TravelLogApi.TravelLogImgUpdload(file);
            insertImageAtCursor(imageUrl);
        } catch (error) {
            console.error("이미지 업로드 실패: ", error);
        } finally {
            event.target.value = '';
        }
    };

    const insertImageAtCursor = (imageUrl: string) => {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        const range = quill.getSelection();
        const index = range ? range.index : quill.getLength();

        // 이미지 삽입
        quill.insertEmbed(index, 'image', imageUrl);
        
        // 타입 구분용 속성 추가
        setTimeout(() => {
            const imgElement = quill.root.querySelector(`img[src="${imageUrl}"]`);
            if (imgElement) {
                imgElement.setAttribute('data-type', 'uploaded-image');
                imgElement.setAttribute('data-timestamp', Date.now().toString());
            }
        }, 100);

        quill.setSelection(index + 1, 0);
    };

    return (
        <div className="w-full">
            <div className="mt-4 mx-2 my-2" style={{ width: '96%', height: '60%' }}>
                <ReactQuill
                    ref={quillRef}
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder="여행한 곳에 대해 자유롭게 글과 사진을 남겨보세요"
                    style={{ height: '360px' }}
                />
            </div>

            <div className="flex flex-row justify-baseline items-center mt-20 mb-4 ml-2 gap-4">
                <button
                    type="button"
                    onClick={handleImageClick}
                    className="flex items-center px-2 py-2 bg-white rounded-[8px] border"
                >
                    <FaCamera size={16} color='gray' />
                </button>
                <span className="text-sm">사진첨부</span>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />
        </div>
    );
}

export default TravelLogEditor;