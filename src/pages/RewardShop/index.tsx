import { useNavigate } from "react-router-dom"
import Header from "../../components/common/Header"

function RewardShop() {
    const navigate = useNavigate()

    const handleBackClick = () => {
        navigate('/main')
    }

    return (
        <>
            <Header onClick={handleBackClick}>리워드 상점</Header>
            <div className="w-full h-full">
                <img src="/reward-shop.png" alt="리워드 상점" className="w-150 h-150 object-contain"/>
            </div>
        </>
    )
}

export default RewardShop