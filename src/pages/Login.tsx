function Login() {
    /* 공통 요소 디자인 */
    const inputBaseClasses = "bg-white p-3 border-2 rounded-[8px] border-green-600"
    const textTagBaseClasses = "transition text-green-700 hover:border-b"
    const socialButtonBaseClasses = "flex justify-center items-center gap-4 px-3 py-3 rounded-[8px] text-black transition border-2 cursor-pointer duration-400"
    const logoContainerClasses = "w-8 h-8 flex items-center justify-baseline flex-shrink-0"
    const logoImgClasses = "max-w-full max-h-full object-contain"

    const onLogin = () => {
        
    }

    return(
        <div className="min-h-screen flex flex-col p-6 justify-center">
            <div className="flex flex-row justify-center items-center mb-6">
                <img src="/logo.png" width={80}/>
                <span className="text-2xl font-bold mt-3">Login</span>
            </div>
            <div className="flex flex-col gap-2">
                <input 
                    type="text" 
                    placeholder="아이디를 입력해주세요"
                    className={inputBaseClasses}
                />
                <input 
                    type="password" 
                    placeholder="비밀번호를 입력해주세요."
                    className={inputBaseClasses}
                />
            </div>
            <div className="flex mt-2">
                <input type="checkbox" />
                <span>로그인 상태 유지</span>
            </div>
            <div className="flex mt-2">
                <button 
                    type="submit" 
                    className="flex-1 p-4 rounded-[8px] bg-green-600 text-white transition-colors hover:bg-green-700 cursor-pointer"
                    onClick={onLogin}
                >
                    로그인
                </button> 
            </div>
            <div className="flex justify-between mt-2 mb-4">
                <span className={textTagBaseClasses}>회원가입</span>
                <div className="flex gap-2">
                    <a href="/" className={textTagBaseClasses}>아이디찾기</a> 
                    <a href="/" className={textTagBaseClasses}> 비밀번호찾기</a>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className={`${socialButtonBaseClasses} hover:border-yellow-200 hover:text-yellow-600`}>
                    <div className={logoContainerClasses}>
                        <img src="/KAKAO_LOGO.png" className={logoImgClasses}/>
                    </div>
                    <span className="font-bold">카카오로 시작하기</span>
                </div>
                <div className={`${socialButtonBaseClasses} hover:border-green-200 hover:text-green-600`}>
                    <div className={logoContainerClasses}>
                        <img src="/NAVER_LOGO.png" className={logoImgClasses}/>
                    </div>
                    <span className="font-bold">네이버로 시작하기</span>
                </div>
                <div className={`${socialButtonBaseClasses} pr-6 hover:border-gray-200 hover:text-gray-600`}>
                    <div className={logoContainerClasses}>
                        <img src="/GOOGLE_LOGO.png" className={logoImgClasses}/>
                    </div>
                    <span className="font-bold">구글로 시작하기</span>
                </div>
            </div>
        </div>
    )
}

export default Login