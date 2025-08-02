import { BsChevronLeft, BsSearch } from "react-icons/bs"
import { BsList } from "react-icons/bs"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

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
        navigate('/main')
    }

    // 브라우저 상단 바 처리
    useEffect(() => {
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        window.addEventListener('orientationchange', setViewportHeight);

        return () => {
            window.removeEventListener('resize', setViewportHeight);
            window.removeEventListener('orientationchange', setViewportHeight);
        };
    }, []);

    return (
        <div className="flex flex-row h-12 w-full items-center border-b-2 px-4 gap-2 flex-shrink-0 bg-white relative z-10">
            {isHome ? (
                <>
                    <div className="flex-shrink-0">
                        <img
                            src="/logo/logo.png"
                            width={40}
                            height={40}
                            alt="로고"
                            onClick={handleHomeClick}
                            className="cursor-pointer"
                        />
                    </div>
                    <div className="flex flex-1 justify-center">
                        <div className="relative w-full max-w-xs">
                            <input
                                type="text"
                                placeholder="어디로 갈까?"
                                className="w-full border rounded-[20px] px-6 py-1 bg-gray-100 text-center text-xs"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <BsSearch size={12} className="shrink-0"/>
                            </div>
                        </div>
                    </div>
                    <div className="flex shrink-0">
                        <div className="flex cursor-pointer">
                            <BsList size={20} onClick={handleToggleClick}/>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="shrink-0">
                        <div className="flex cursor-pointer">
                            <BsChevronLeft size={20} onClick={onClick} />
                        </div>
                    </div>
                    <div className="flex flex-1 justify-center flex-nowrap">
                        <div className="text-base text-center font-medium">{children}</div>
                    </div>
                    <div className="shrink-0">
                        <div className="flex cursor-pointer">
                            <BsList size={20} onClick={handleToggleClick}/>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Header