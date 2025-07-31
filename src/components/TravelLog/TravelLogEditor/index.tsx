import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useRef } from 'react';
import { LuImage } from 'react-icons/lu';

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    height?: string;
}

function TravelLogEditor({ 
    value, 
    onChange, 
    placeholder = "내용을 입력해주세요", 
    height = '400px' 
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

        // TODO: 실제 서버 업로드 로직으로 대체
        // const imageUrl = await uploadImageToServer(file);
        
        // 임시: base64 변환
        const reader = new FileReader();
        reader.onload = () => {
            const imageUrl = reader.result as string;
            insertImageAtCursor(imageUrl);
        };
        reader.readAsDataURL(file);

        event.target.value = '';
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
            {/* 에디터 */}
            <div className="mt-4 mx-2 my-2" style={{ width: '96%', height: '60%' }}>
                <ReactQuill
                    ref={quillRef}
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder}
                    style={{ height }}
                />
            </div>

            {/* 커스텀 이미지 추가 버튼 */}
            <div className="flex justify-center mt-16 mb-4">
                <button
                    type="button"
                    onClick={handleImageClick}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border transition-colors"
                >
                    <LuImage size={20} />
                    <span>이미지 추가</span>
                </button>
            </div>

            {/* 숨겨진 파일 input */}
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

// 블록 파싱 유틸리티 함수
export const parseContentToBlocks = (content: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const blocks: Array<{ type: 'text' | 'image', content: string, timestamp?: string }> = [];

    const traverse = (node: Node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            if (element.tagName === 'IMG') {
                blocks.push({
                    type: 'image',
                    content: element.getAttribute('src') || '',
                    timestamp: element.getAttribute('data-timestamp') || undefined
                });
            } else if (element.tagName === 'P' && element.textContent?.trim()) {
                blocks.push({
                    type: 'text',
                    content: element.innerHTML
                });
            } else {
                Array.from(element.childNodes).forEach(traverse);
            }
        }
    };

    Array.from(doc.body.childNodes).forEach(traverse);
    return blocks;
};

export default TravelLogEditor;