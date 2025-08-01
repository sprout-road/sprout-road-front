import { BsChevronLeft, BsSearch } from "react-icons/bs"
import { BsList } from "react-icons/bs"
import { useNavigate } from "react-router-dom"


interface HeaderProps {
    children?: React.ReactNode
    isHome?: boolean
    onClick?: () => void
}

function Header({ children, isHome = false, onClick }: HeaderProps) {
    const navigate = useNavigate()

    const handleToggleClick = () => {
        console.log('토글 버튼 이벤트 생성 해야 함')
    }

    const handleHomeClick = () => {
        navigate('/')
    }

    return (
        <div className="flex flex-row min-h-12 w-full z-20 absolute items-center border-b-2">
            {isHome ? (
                <>
                    <div className="flex-shrink-0">
                        <img 
                            src="/logo/logo.png" width={50}
                            alt="로고" 
                            onClick={handleHomeClick}
                            className="cursor-pointer"
                        />
                    </div>
                    <div className="flex flex-1 justify-center">
                        <div className="relative max-w-xs w-full">
                            <input 
                                type="text"
                                placeholder="어디로 갈까?" 
                                className="border rounded-[20px] px-8 py-2 bg-gray-100 text-center max-h-8"
                            />
                            <div 
                                className="absolute right-3 top-2 transform -translate-y-0 cursor-pointer"
                            >
                                <BsSearch size={16} />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="shrink-0">
                        <div className="flex cursor-pointer">
                            <BsChevronLeft size={24} onClick={onClick} />
                        </div>
                    </div>
                    <div className="flex flex-1 justify-center flex-nowrap">
                        <div className="text-xl text-center">{children}</div>
                    </div>  
                </>
            )}
            <div className="shrink-0">
                <div className="flex cursor-pointer">
                    <BsList size={24} onClick={handleToggleClick}/>
                </div>
            </div>
        </div>
    )
}

export default Header