import Header from "../components/common/Header.tsx";
import {useNavigate} from "react-router-dom";

function Reward() {

    const navigate = useNavigate();
    const navigateBack = () => {
        navigate('/main')
    }

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-white flex flex-col">
            <Header onClick={navigateBack}>트레블 로그</Header>
            <div>리워드 보일 곳</div>
        </div>
    );
}

export default Reward;