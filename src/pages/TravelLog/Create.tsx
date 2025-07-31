import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-quill-new/dist/quill.snow.css';
import Header from '../../components/common/Header';
import { useState } from 'react';
import { LuCalendarMinus2 } from "react-icons/lu";
import { useNavigate, useParams } from 'react-router-dom';
import { parseTagToBlocks } from '../../helper/parseTagToBlocks';
import { TravelLogApi, TravelLogForm } from '../../services/TravelLogApi';
import TravelLogEditor from '../../components/TravelLog/TravelLogEditor';


function TravelLogCreate() {
    const [date, setDate] = useState<Date | null>(null)
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')

    const navigate = useNavigate()
    const params = useParams();
    const sigunguCode = params.id;

    const handleBackClick = () => {
        navigate(-1)
    }

    const transformToApiFormat = (): TravelLogForm => {
        const contents = parseTagToBlocks(content);

        return {
            title: title.trim(),
            sigunguCode: sigunguCode!,
            traveledAt: date ? date.toISOString().split('T')[0] : '',
            contents: contents
        };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!date || !title.trim() || !content.trim()) {
            alert("날짜, 제목, 내용을 모두 입력해주세요")
            return 
        }

        const apiFormData = transformToApiFormat()
        console.log('API 형태 데이터:', apiFormData)
        
        TravelLogApi.writeTravelLog(apiFormData)
    }

    return (
        <>
            <Header onClick={handleBackClick}>트레블 로그</Header>
            <div className="flex flex-col p-2 mt-2 mb-4 items-center justify-center">
                <div className="flex relative mb-2">
                    <DatePicker 
                        selected={date}
                        onChange={setDate}
                        className="border-2 rounded-[8px] py-2 pl-2 caret-transparent text-center font-bold focus:outline-lime-500"
                        placeholderText="YYYY-MM-DD"
                        dateFormat={"yyyy-MM-dd"}
                    />
                    <LuCalendarMinus2 size={32} className="absolute top-1 left-2"/>
                </div>
                
                <div className="flex mx-8 w-full">
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            placeholder="제목을 입력해주세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-4 p-2 border-b focus:outline-0 w-full text-xl font-bold text-black" 
                        />
                        <TravelLogEditor
                            value={content}
                            onChange={setContent}
                        />
                        <div className="flex items-center justify-center px-4 mt-16">
                            <button 
                                type="submit"
                                className="bg-lime-500 text-white rounded-[10px] px-4 py-2 my-10 w-full"
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

export default TravelLogCreate
