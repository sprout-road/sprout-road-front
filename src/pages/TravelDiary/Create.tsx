import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../../components/common/Header';
import { useRef, useState } from 'react';
import { LuCalendarMinus2 } from "react-icons/lu";
import { BsFillCameraFill } from "react-icons/bs";
import { MdRemoveCircle } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

type ImgContent = {
    imgUrl: string
    description: string
}

type diaryForm = {
    date: string
    title: string
    content: string
    fictures: ImgContent[]
}

function TravelDiaryCreate() {
    const [date, setDate] = useState<Date | null>(null)
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [images, setImages] = useState<ImgContent[]>([])

    const fileInputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    const handleBackClick = () => {
        navigate(-1)
    }

    const handleAddFicture = () => {
        fileInputRef.current?.click()
    }

    /* file input 함수 - 상세 설명을 일단 파일이름으로 세팅 */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        Array.from(files).forEach(file => {
            const reader = new FileReader()
            reader.onload = (e) => {
                const newImage: ImgContent = {
                    imgUrl: e.target?.result as string,
                    description: file.name
                }
                setImages(prev => [...prev, newImage])
            }
            reader.readAsDataURL(file)
        })

        e.target.value = ''
    }

    const handleRemoveImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const onDescriptionChange = (index: number, description: string) => {
        setImages(prev => prev.map((img, idx) => idx === index ? {...img, description} : img))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!date || !title.trim() || !content.trim()) {
            alert("날짜, 제목, 내용을 모두 입력해주세요")
            return 
        }

        const formData: diaryForm = {
            date: date.toISOString().split('T')[0], // yyyy-MM-dd 형식
            title: title.trim(),
            content: content.trim(),
            fictures: images
        }

        /* api 호출추가 - 기록일지 작성 */
        console.log(`기록일지 : ${formData}`)
    }

    return (
        <>
            <Header onClick={handleBackClick}>트레블 로그</Header>
            <div className="flex flex-col p-2 mt-2 mb-4 items-center justify-center">
                <div className="relative mb-2">
                    <DatePicker 
                        selected={date}
                        onChange={setDate}
                        className="border-2 rounded-[8px] py-2 pl-2 caret-transparent text-center font-bold"
                        placeholderText=""
                        dateFormat={"yyyy-MM-dd"}
                    />
                    <LuCalendarMinus2 size={32} className="absolute top-1 left-2"/>
                </div>
                <div className="mx-8">
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            placeholder="제목을 입력해주세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-4 p-2 border-b focus:outline-0 w-75 text-xl font-bold text-black" 
                        />
                        <textarea
                            placeholder="여행한 곳에 대해 자유롭게 글과 사진을 남겨보세요"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="mt-4 text-start w-75 h-40 outline-lime-400"                            
                        />
                        <div className="h-60 w-75 overflow-y-scroll scrollbar-hide">
                            {images.map((image, index) => (
                                <div key={index} className="flex flex-row gap-4 mt-2">
                                    <div className="relative">
                                        <img 
                                            src={image.imgUrl} 
                                            alt={`추가된 사진${index}`} 
                                            className="w-35 h-30 object-cover mb-2"
                                        />
                                        <div 
                                            className="absolute top-2 right-2 opacity-50"
                                            onClick={() => handleRemoveImage(index)}
                                        >
                                            <MdRemoveCircle 
                                                size={24}
                                                color="gray"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <textarea
                                            placeholder="사진에 대한 설명을 남겨주세요"
                                            value={image.description}
                                            onChange={(e) => onDescriptionChange(index, e.target.value)}
                                            className="h-30 focus:outline-lime-400"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <input 
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            multiple
                            className="hidden"
                        />
                        <div 
                            className="flex flex-row mt-4 mb-8 items-center gap-4"
                            onClick={handleAddFicture}
                        >
                            <div className="border-1 p-2 rounded-[10px]">
                                <BsFillCameraFill size={24} />
                            </div>
                            <span>사진 첨부</span>
                        </div>
                        <div className="flex items-center justify-center px-4">
                            <button 
                                type="submit"
                                className="bg-lime-500 text-white rounded-[10px] px-4 py-2 w-full"
                            >
                                작성 완료
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default TravelDiaryCreate