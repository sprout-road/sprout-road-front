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

    // 툴바 완전 제거
    const modules = {
        toolbar: false,
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
        <div className="flex flex-col h-full">
            {/* 에디터 영역 - 전체 높이에서 버튼 영역 제외 */}
            <div className="flex-1 mb-4">
                <ReactQuill
                    ref={quillRef}
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder="여행한 곳에 대해 자유롭게 글과 사진을 남겨보세요"
                    className="h-full"
                    theme="snow"
                />
            </div>

            {/* 사진 첨부 버튼 - 하단 고정 */}
            <div className="flex-shrink-0 flex items-center gap-3">
                <button
                    type="button"
                    onClick={handleImageClick}
                    className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg border transition-colors"
                >
                    <FaCamera size={16} className="text-gray-600" />
                </button>
                <span className="text-sm text-gray-600">사진첨부</span>
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