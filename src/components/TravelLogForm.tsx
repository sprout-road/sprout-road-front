import { useState, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { TravelLogFormData, TravelLogContent } from '../pages/TravelLogEditor';

interface TravelLogFormProps {
    onSubmit: (data: TravelLogFormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

interface ImageData {
    url: string;
    caption: string;
    id: string;
}

const TravelLogForm = ({ onSubmit, onCancel, isSubmitting }: TravelLogFormProps) => {
    const [title, setTitle] = useState('');
    const [sigunguCode, setSigunguCode] = useState('');
    const [traveledAt, setTraveledAt] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState<ImageData[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [currentCursorPosition, setCurrentCursorPosition] = useState<number>(0);
    const quillRef = useRef<ReactQuill>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const generateImageId = () => `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 커서 위치 추적
    const handleSelectionChange = () => {
        if (quillRef.current) {
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection();
            if (range) {
                setCurrentCursorPosition(range.index);
            }
        }
    };

    const handleImageUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드할 수 있습니다.');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('파일 크기는 10MB 이하여야 합니다.');
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('imageFile', file);

            const response = await fetch('http://localhost:8080/api/travel-logs/images/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('이미지 업로드에 실패했습니다.');
            }

            const imageUrl = await response.text();

            if (imageUrl && quillRef.current) {
                const quill = quillRef.current.getEditor();
                const imageId = generateImageId();

                // 새 이미지 데이터 추가
                const newImage: ImageData = {
                    url: imageUrl,
                    caption: '',
                    id: imageId
                };
                setImages(prev => [...prev, newImage]);

                // 현재 커서 위치에 이미지 삽입
                quill.insertEmbed(currentCursorPosition, 'image', imageUrl);

                // 이미지 다음에 줄바꿈 추가 (자연스러운 텍스트 입력을 위해)
                quill.insertText(currentCursorPosition + 1, '\n\n');

                // 이미지에 ID 속성 추가
                setTimeout(() => {
                    const imgs = quill.root.querySelectorAll('img');
                    imgs.forEach((img: HTMLImageElement) => {
                        if (img.src === imageUrl && !img.getAttribute('data-image-id')) {
                            img.setAttribute('data-image-id', imageId);
                            img.style.maxWidth = '100%';
                            img.style.height = 'auto';
                            img.style.borderRadius = '8px';
                            img.style.display = 'block';
                            img.style.margin = '16px auto';
                        }
                    });
                }, 100);

                // 커서를 이미지 다음 줄바꿈 이후로 이동 (텍스트 입력 준비)
                quill.setSelection(currentCursorPosition + 2);
            }

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsUploading(false);
        }
    };

    // 툴바 없는 설정
    const quillModules = {
        toolbar: false
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
        e.target.value = '';
    };

    const updateImageCaption = (imageId: string, caption: string) => {
        setImages(prev => prev.map(img =>
            img.id === imageId ? { ...img, caption } : img
        ));
    };

    const parseContentToStructured = (htmlContent: string): TravelLogContent[] => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const contents: TravelLogContent[] = [];
        let order = 1;

        // Quill 에디터의 실제 DOM 구조를 순회
        const editorContent = doc.querySelector('.ql-editor') || doc.body;

        // 모든 자식 노드를 순회하면서 텍스트와 이미지를 순서대로 처리
        const processNode = (node: Node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;

                if (element.tagName === 'P') {
                    // p 태그 내부를 확인
                    let hasImage = false;
                    const childNodes = Array.from(element.childNodes);

                    childNodes.forEach(child => {
                        if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName === 'IMG') {
                            hasImage = true;
                            const img = child as HTMLImageElement;
                            const imageId = img.getAttribute('data-image-id');
                            const imageData = images.find(image => image.id === imageId);

                            if (imageData) {
                                contents.push({
                                    type: 'image',
                                    order: order++,
                                    content: {
                                        url: imageData.url,
                                        caption: imageData.caption
                                    }
                                });
                            }
                        }
                    });

                    // 이미지가 없는 p 태그의 텍스트 처리
                    if (!hasImage) {
                        const text = element.textContent || ''; // trim() 제거로 공백도 유지
                        // 완전히 비어있지 않거나, br 태그가 있는 경우 (줄바꿈 의도)
                        if (text.length > 0 || element.querySelector('br')) {
                            contents.push({
                                type: 'text',
                                order: order++,
                                content: {
                                    text: text // 원본 텍스트 그대로 (공백 포함)
                                }
                            });
                        }
                    }
                } else if (element.tagName === 'IMG') {
                    // 직접적인 img 태그 (p 태그 밖에 있는 경우)
                    const imageId = element.getAttribute('data-image-id');
                    const imageData = images.find(image => image.id === imageId);

                    if (imageData) {
                        contents.push({
                            type: 'image',
                            order: order++,
                            content: {
                                url: imageData.url,
                                caption: imageData.caption
                            }
                        });
                    }
                }
            } else if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent || ''; // trim() 제거
                if (text.length > 0) {
                    contents.push({
                        type: 'text',
                        order: order++,
                        content: {
                            text: text
                        }
                    });
                }
            }
        };

        Array.from(editorContent.childNodes).forEach(processNode);

        return contents;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !sigunguCode.trim() || !traveledAt) {
            alert('제목, 시군구 코드, 날짜를 입력해주세요.');
            return;
        }

        if (isUploading) {
            alert('이미지 업로드가 진행 중입니다. 잠시만 기다려주세요.');
            return;
        }

        const structuredContents = parseContentToStructured(content);

        const formData: TravelLogFormData = {
            title: title.trim(),
            sigunguCode: sigunguCode.trim(),
            traveledAt,
            contents: structuredContents
        };

        await onSubmit(formData);
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    제목 <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="여행 제목을 입력하세요"
                    required
                />
            </div>

            <div>
                <label htmlFor="sigunguCode" className="block text-sm font-medium text-gray-700 mb-2">
                    시군구 코드 <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="sigunguCode"
                    value={sigunguCode}
                    onChange={(e) => setSigunguCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="시군구 코드를 입력하세요 (예: 26110)"
                    required
                />
            </div>

            <div>
                <label htmlFor="traveledAt" className="block text-sm font-medium text-gray-700 mb-2">
                    여행 날짜 <span className="text-red-500">*</span>
                </label>
                <input
                    type="date"
                    id="traveledAt"
                    value={traveledAt}
                    onChange={(e) => setTraveledAt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    max={today}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    내용
                </label>
                <div className="border border-gray-300 rounded-md">
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        onChangeSelection={handleSelectionChange}
                        modules={quillModules}
                        placeholder="여행 경험을 자유롭게 작성해보세요. 원하는 위치에 커서를 두고 아래 버튼으로 이미지를 추가할 수 있습니다."
                        style={{ minHeight: '300px' }}
                    />
                </div>

                {/* 이미지 업로드 버튼 */}
                <div className="mt-3">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isUploading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                업로드 중...
                            </>
                        ) : (
                            <>
                                📷 현재 커서 위치에 사진 삽입
                            </>
                        )}
                    </button>
                    <p className="text-sm text-gray-500 mt-1">
                        에디터에서 원하는 위치에 커서를 두고 버튼을 클릭하면 해당 위치에 이미지가 삽입됩니다.
                    </p>
                </div>

                {/* 업로드된 이미지 캡션 편집 */}
                {images.length > 0 && (
                    <div className="mt-4 space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">이미지 캡션 편집</h4>
                        {images.map((image) => (
                            <div key={image.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-md">
                                <img
                                    src={image.url}
                                    alt="업로드된 이미지"
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={image.caption}
                                        onChange={(e) => updateImageCaption(image.id, e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="이미지에 대한 설명을 입력하세요"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            <div className="flex justify-end space-x-4 pt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting || isUploading}
                >
                    취소
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? '저장 중...' : '저장'}
                </button>
            </div>
        </form>
    );
};

export default TravelLogForm;