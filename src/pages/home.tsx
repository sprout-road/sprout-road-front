import { useNavigate } from "react-router-dom"
import Header from "../components/common/Header";
import { useUserInfo } from "../hooks/useUserInfo";
import ErrorComponent from "../components/common/Error";

type MenuType = {
  name: string
  description: string
}

function Home() {
  const navigate = useNavigate()

  const { userInfo, loading, error, refetch } = useUserInfo();

  if (error) {
    return <ErrorComponent error={error} refetch={refetch} />
  }

  const menuItems: MenuType[] = [
    {
      name: '리워드 보기',
      description: '현재까지 \n획득한 뱃지를\n 확인해보세요!',
    },
    {
      name: '오늘의 미션',
      description: '오늘의 미션을\n 수행하고 보상을\n 받아주세요!',
    },
    {
      name: '트레블 로그',
      description: '다녀온 장소에\n 대한 기록을\n 남겨보세요!',
    },
    {
      name: '포트폴리오',
      description: '내가 다녀온\n 기록들을 한눈에\n 볼 수 있어요!',
    },
    {
      name:'리워드 상점',
      description: '보유한 리워드를\n 다양한 상품으로\n 교환할 수 있어요!'
    }
  ] as const;

  const handleMenuClick = (index: number) => {
    switch(index) {
      case 0:
        navigate(`/reword`)
        return
      case 1:
        navigate(`/mission`)
        return
      case 2:
        navigate(`/region-coloring`)
        return
      case 3:
        navigate(`/portfolio`)
        return
      case 4:
        navigate(`/reword-shop`)
        return
      default:
        return 
    }
  }

  const mappingImg = (index: number) => {
    switch(index) {
      case 0:
        return "/menu/reword.png"
      case 1:
        return "/menu/daily-mission.png"
      case 2:
        return "/menu/travel-log.png"
      case 3:
        return "/menu/portfolio.png"
      case 4:
        return "/menu/reword-shop.png"
      case 5:
        return "/menu/preparing-service.png"
    }
  }

  if (loading || userInfo === null) return <div className="flex items-center justify-center">유저 정보 가져오는 중...</div>

  return (
    <>
      <Header isHome={true} ></Header>
      <div className="flex flex-col items-center bg-white text-black p-2 mt-4 mx-2">
        <div className="w-full justify-center">
          <div className="relative w-full flex flex-col bg-green-500 border-2 border-black">
            <div className="flex justify-between text-xl text-gray-200 items-baseline font-bold p-4 min-h-55">
              <div className="flex-1">
                <p>{userInfo.nickname}님, 색다른 지역에서</p>
                <p>색다른 체험을 하고</p>
                <p>미션을 수행해 보아요</p>
              </div>
              <div className="flex shrink-0 justify-end">
                <img 
                  src="/logo/logo.png" 
                  className="absolute top-20 left-45 rounded-[100px] opacity-40 bg-white"
                  alt="메인 헤더 이미지"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center mt-8">
          <div className="grid grid-cols-3 grid-rows-2 gap-2 w-full max-w-lg mx-2">
            {menuItems.map((menu, index) => {
              return (
                <div
                  key={index}
                  onClick={() => handleMenuClick(index)}
                  className="flex flex-col row flex-nowrap py-2 min-w-[100px]" 
                >
                  <div className="bg-green-200 rounded-[8px]">
                    <img src={mappingImg(index)} alt={`menu-${index + 1}`} className="w-50 h-25 object-contain"/>
                  </div>
                  <div className="flex flex-col">
                    <p className="py-2 text-md font-bold text-center">{menu.name}</p>
                    <p className="text-xs text-center text-gray-500 whitespace-pre-line">{menu.description}</p>
                  </div> 
                </div>
              )
            })}
            <div className="flex flex-col mt-2">
              <div className="bg-green-200 rounded-lg h-25 w-full">
                <img src="/menu/preparing-service.png" className="w-full h-full p-2 object-contain rounded-lg" alt="준비 중 메뉴" />
              </div>
              <div className="flex flex-col mt-2 text-center justify-center">
                <p className="text-md font-bold">준비 중...</p>
                <p className="text-xs text-gray-500 mt-2">새로운 서비스를<br/>만나보아요!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )   
}

export default Home