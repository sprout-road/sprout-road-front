import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin"
import { useState } from "react";

function Login() {
    const[userId, setUserId] = useState<string>('')
    const[password, setPassword] = useState<string>('')

    const { login, loading, error } = useLogin();
    const navigate = useNavigate();

    /* 공통 요소 디자인 */
    const inputBaseClasses = "bg-white p-3 border-2 rounded-[8px] border-green-600 w-full"
    const textTagBaseClasses = "transition text-xs text-green-700 hover:border-b cursor-pointer"
    const socialButtonBaseClasses = "flex items-center justify-center gap-3 px-4 py-3 rounded-[8px] text-black transition border-2 cursor-pointer w-full"
    const logoContainerClasses = "w-6 h-6 flex items-center justify-center flex-shrink-0"
    const logoImgClasses = "max-w-full max-h-full object-contain"

    const onLogin = async () => {
        try {
            await login();
            navigate('/main');
        } catch(error) {
            console.log(`로그인 실패: ${error}`);
        }
    }

    if (error) {
        console.log("에러 발생 !!!");
    }

    return(
        <div className="fixed inset-0 w-screen h-screen overflow-auto bg-gray-50 flex flex-col">
            <div className="flex-1 flex flex-col justify-center min-h-0 p-6">
                <div className="w-full max-w-md mx-auto">
                    {/* 로고 및 타이틀 */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <img src="/logo/logo.png" className="w-16 h-16" alt="로고"/>
                            <span className="text-3xl font-bold text-gray-800">Login</span>
                        </div>
                    </div>

                    {/* 입력 폼 */}
                    <div className="flex flex-col gap-4 mb-4">
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

                    {/* 로그인 상태 유지 */}
                    <div className="flex items-center gap-2 mb-6">
                        <input type="checkbox" id="keepLogin" className="w-4 h-4"/>
                        <label htmlFor="keepLogin" className="text-sm text-gray-600 cursor-pointer">
                            로그인 상태 유지
                        </label>
                    </div>

                    {/* 로그인 버튼 */}
                    <button
                        type="submit"
                        className="w-full py-3 rounded-[8px] font-bold text-lg bg-green-600 text-white transition-colors hover:bg-green-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                        onClick={onLogin}
                        disabled={loading}
                    >
                        {loading ? '로그인 중...' : '로그인'}
                    </button>

                    {/* 회원가입, 찾기 링크 */}
                    <div className="flex justify-between mb-8">
                        <span className={textTagBaseClasses}>회원가입</span>
                        <div className="flex gap-4">
                            <a href="/" className={textTagBaseClasses}>아이디찾기</a>
                            <a href="/" className={textTagBaseClasses}>비밀번호찾기</a>
                        </div>
                    </div>

                    {/* 구분선 */}
                    <div className="flex items-center gap-4 mb-6">
                        <hr className="flex-1 border-gray-300"/>
                        <span className="text-sm text-gray-500">또는</span>
                        <hr className="flex-1 border-gray-300"/>
                    </div>

                    {/* 소셜 로그인 */}
                    <div className="flex flex-col gap-3">
                        <div
                            className={`${socialButtonBaseClasses} hover:border-yellow-400 hover:bg-yellow-50`}
                            onClick={onLogin}
                        >
                            <div className={logoContainerClasses}>
                                <img src="/logo/KAKAO_LOGO.png" className={logoImgClasses} alt="카카오"/>
                            </div>
                            <span className="font-medium">카카오로 시작하기</span>
                        </div>

                        <div
                            className={`${socialButtonBaseClasses} hover:border-green-400 hover:bg-green-50`}
                            onClick={onLogin}
                        >
                            <div className={logoContainerClasses}>
                                <img src="/logo/NAVER_LOGO.png" className={logoImgClasses} alt="네이버"/>
                            </div>
                            <span className="font-medium">네이버로 시작하기</span>
                        </div>

                        <div
                            className={`${socialButtonBaseClasses} hover:border-gray-400 hover:bg-gray-50`}
                            onClick={onLogin}
                        >
                            <div className={logoContainerClasses}>
                                <img src="/logo/GOOGLE_LOGO.png" className={logoImgClasses} alt="구글"/>
                            </div>
                            <span className="font-medium">구글로 시작하기</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login