import { BsChevronLeft, BsSearch } from "react-icons/bs"
import { BsList } from "react-icons/bs"
import { useNavigate } from "react-router-dom"


interface HeaderProps {
    children?: React.ReactNode
    isHome: boolean
    onClick?: () => void
}

function Header({ children, isHome, onClick }: HeaderProps) {
    const navigate = useNavigate()

    const handleToggleClick = () => {
        console.log('토글 버튼 이벤트 생성 해야 함')
    }

    const handleHomeClick = () => {
        navigate('/')
    }

    return (
        <div className="flex flex-row justify-between min-h-[50px] w-full items-center p-4">
            {isHome ? (
                <>
                    <img 
                        src="/logo.png" width={50} 
                        onClick={handleHomeClick}
                        className="cursor-pointer"
                    />
                    <div className="relative">
                        <input 
                            type="text"
                            placeholder="어디로 갈까?" 
                            className="border rounded-[20px] px-8 py-2 bg-gray-100 text-center"
                        />
                        <div 
                            className="absolute right-3 top-3 transform -translate-y-0 cursor-pointer"
                        >
                            <BsSearch size={16} />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex cursor-pointer hover:scale-120">
                        <BsChevronLeft size={24} onClick={onClick} />
                    </div>
                    <div className="flex shrink-0 text-xl">{children}</div>
                </>
            )}
            <div className="flex cursor-pointer hover:scale-120">
                <BsList size={24} onClick={handleToggleClick}/>
            </div>
        </div>
    )
}

export default Header