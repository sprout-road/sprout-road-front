import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-quill-new/dist/quill.snow.css';
import Header from '../../components/common/Header';
import {useState} from 'react';
import {LuCalendarMinus2} from "react-icons/lu";
import {useNavigate} from 'react-router-dom';
import {parseTagToBlocks} from '../../helper/parseTagToBlocks';
import {TravelLogApi, TravelLogForm} from '../../services/TravelLogApi';
import TravelLogEditor from '../../components/TravelLog/TravelLogEditor';
import {useLocationContext} from '../../contexts/LocationContext';

function TravelLogCreate() {
    const [date, setDate] = useState<Date | null>(null)
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const {currentLocation} = useLocationContext()

    const navigate = useNavigate()
    const regionCode = currentLocation?.regionCode;

    const handleBackClick = () => {
        navigate(-1)
    }

    const transformToApiFormat = (): TravelLogForm => {
        const contents = parseTagToBlocks(content);

        return {
            title: title.trim(),
            regionCode: regionCode!,
            traveledAt: date ? date.toISOString().split('T')[0] : '',
            contents: contents
        };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!date || !title.trim() || !content) {
            alert("날짜, 제목, 내용을 모두 입력해주세요")
            return
        }

        const apiFormData = transformToApiFormat()
        console.log('API 형태 데이터:', apiFormData)

        TravelLogApi.writeTravelLog(apiFormData)
        navigate(-1)
    }

    return (
        <div className="fixed inset-0 w-screen viewport-height overflow-hidden bg-white flex flex-col">
            <Header onClick={handleBackClick}>트레블 로그</Header>

            <div className="flex-1 flex flex-col min-h-0 overflow-auto">
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                    {/* 날짜 선택 섹션 */}
                    <div className="flex-shrink-0 p-4 flex justify-center">
                        <div className="relative">
                            <DatePicker
                                selected={date}
                                onChange={setDate}
                                className="border-2 rounded-lg py-3 pl-10 pr-4 text-center font-bold focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-sm w-44"
                                placeholderText="YYYY-MM-DD"
                                dateFormat={"yyyy-MM-dd"}
                            />
                            <LuCalendarMinus2
                                size={20}
                                className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                            />
                        </div>
                    </div>

                    {/* 제목 입력 섹션 */}
                    <div className="flex-shrink-0 px-4 mb-4">
                        <input
                            type="text"
                            placeholder="제목을 입력해주세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-lime-500 text-lg font-bold text-black bg-transparent transition-colors"
                        />
                    </div>

                    {/* 에디터 섹션 - 남은 공간 모두 사용 */}
                    <div className="flex-1 px-4 min-h-0 flex flex-col">
                        <div className="flex-1 min-h-0">
                            <TravelLogEditor
                                value={content}
                                onChange={setContent}
                            />
                        </div>
                    </div>

                    {/* 버튼 섹션 - 하단 고정 */}
                    <div className="flex-shrink-0 p-4">
                        <button
                            type="submit"
                            className="w-full bg-lime-500 hover:bg-lime-600 text-white rounded-lg py-3 text-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!date || !title.trim() || !content.trim()}
                        >
                            작성 완료
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TravelLogCreate