import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin"
import { useState } from "react";

function Login() {
    const[userId, setUserId] = useState<string>('')
    const[password, setPassword] = useState<string>('')

    const { login, loading, error } = useLogin();
    const navigate = useNavigate();

    /* 공통 요소 디자인 */
    const inputBaseClasses = "bg-white p-3 border-2 rounded-[8px] border-green-600"
    const textTagBaseClasses = "transition text-xs text-green-700 hover:border-b"
    const socialButtonBaseClasses = "flex items-center gap-10 px-2 py-2 mx-2 rounded-[8px] text-black transition border-2 cursor-pointer"
    const logoContainerClasses = "w-8 h-8 flex items-center justify-baseline flex-shrink-0"
    const logoImgClasses = "max-w-full max-h-full object-contain"

    const onLogin = async () => {
        try {
            await login();
            navigate('/main');
        } catch(error) {
            console.log(`로그인 실패: ${error}`);
        }
    }

    return(
        <div className="min-h-screen flex flex-col p-6 mx-4 justify-center">
            <div className="flex flex-row justify-baseline items-center pl-12 mb-8">
                <img src="/logo.png" width={80}/>
                <span className="text-2xl font-bold mt-3">Login</span>
            </div>
            <div className="flex flex-col gap-2 px-4">
                <input 
                    type="text" 
                    placeholder="아이디를 입력해주세요"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className={inputBaseClasses}
                />
                <input 
                    type="password" 
                    placeholder="비밀번호를 입력해주세요."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputBaseClasses}
                />
            </div>
            <div className="flex mt-2 mb-6 px-4">
                <input type="checkbox" />
                <span>로그인 상태 유지</span>
            </div>
            <div className="flex mt-4 px-4">
                <button 
                    type="submit" 
                    className="flex-1 px-4 py-2 rounded-[8px] font-bold text-xl bg-green-600 text-white transition-colors hover:bg-green-700 cursor-pointer"
                    onClick={onLogin}
                    disabled={loading}
                >
                    로그인
                </button> 
            </div>
            <div className="flex justify-between px-4 mt-2 mb-8">
                <span className={textTagBaseClasses}>회원가입</span>
                <div className="flex gap-2">
                    <a href="/" className={textTagBaseClasses}>아이디찾기</a> 
                    <a href="/" className={textTagBaseClasses}> 비밀번호찾기</a>
                </div>
            </div>
            <div className="flex flex-col gap-3 mt-12">
                <div 
                    className={`${socialButtonBaseClasses} hover:border-yellow-200 hover:text-yellow-600`}
                    onClick={onLogin}
                >
                    <div className={logoContainerClasses}>
                        <img src="/logo/KAKAO_LOGO.png" className={logoImgClasses}/>
                    </div>
                    <span className="font-bold">카카오로 시작하기</span>
                </div>
                <div 
                    className={`${socialButtonBaseClasses} hover:border-green-200 hover:text-green-600`}
                    onClick={onLogin}
                >
                    <div className={logoContainerClasses}>
                        <img src="/logo/NAVER_LOGO.png" className={logoImgClasses}/>
                    </div>
                    <span className="font-bold">네이버로 시작하기</span>
                </div>
                <div 
                    className={`${socialButtonBaseClasses} pr-6 hover:border-gray-200 hover:text-gray-600`}
                    onClick={onLogin}
                >
                    <div className={logoContainerClasses}>
                        <img src="/logo/GOOGLE_LOGO.png" className={logoImgClasses}/>
                    </div>
                    <span className="font-bold mx-2">구글로 시작하기</span>
                </div>
            </div>
        </div>
    )
}

export default Login