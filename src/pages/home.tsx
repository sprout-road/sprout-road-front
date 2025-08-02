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
        navigate(`/reward`)
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
        navigate(`/reward-shop`)
        return
      default:
        return
    }
  }

  const mappingImg = (index: number) => {
    switch(index) {
      case 0:
        return "/menu/reward.png"
      case 1:
        return "/menu/daily-mission.png"
      case 2:
        return "/menu/travel-log.png"
      case 3:
        return "/menu/portfolio.png"
      case 4:
        return "/menu/reward-shop.png"
      case 5:
        return "/menu/preparing-service.png"
    }
  }

  if (loading || userInfo === null) {
    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-white flex flex-col">
          <Header isHome={true} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-500">유저 정보 가져오는 중...</div>
          </div>
        </div>
    )
  }

  return (
      <div className="fixed inset-0 w-screen viewport-height overflow-hidden bg-white flex flex-col">
        <Header isHome={true} />

        <div className="flex-1 flex flex-col min-h-0">
          {/* 상단 프로필 섹션 - 35% */}
          <div className="flex-[3.5] p-4 flex items-center">
            <div className="relative w-full flex flex-col bg-green-500 border-2 border-black rounded-lg overflow-hidden h-full">
              <div className="flex justify-between text-xl text-gray-200 items-center font-bold p-6 h-full">
                <div className="flex-1 z-10 flex flex-col justify-center">
                  <p>{userInfo.nickname}님, 색다른 지역에서</p>
                  <p>색다른 체험을 하고</p>
                  <p>미션을 수행해 보아요</p>
                </div>
                <div className="flex-shrink-0">
                  <img
                      src="/logo/logo.png"
                      className="w-20 h-20 rounded-full opacity-40 bg-white"
                      alt="메인 헤더 이미지"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 메뉴 그리드 섹션 - 65% */}
          <div className="flex-[6.5] px-4 pb-4 min-h-0">
            <div className="grid grid-cols-3 grid-rows-2 gap-3 h-full">
              {menuItems.map((menu, index) => {
                return (
                    <div
                        key={index}
                        onClick={() => handleMenuClick(index)}
                        className="flex flex-col cursor-pointer min-h-0"
                    >
                      {/* 이미지 영역 - 정사각형에 가깝게 */}
                      <div className="bg-green-200 rounded-lg flex-1 flex items-center justify-center min-h-0 mb-2">
                        <img
                            src={mappingImg(index)}
                            alt={`menu-${index + 1}`}
                            className="w-full h-full object-contain p-2"
                        />
                      </div>

                      {/* 텍스트 영역 - 고정 높이 */}
                      <div className="flex-shrink-0 px-1">
                        <p className="text-sm font-bold text-center leading-tight mb-1">{menu.name}</p>
                        <p className="text-[10px] text-center text-gray-500 whitespace-pre-line leading-tight">
                          {menu.description}
                        </p>
                      </div>
                    </div>
                )
              })}

              {/* 준비 중 메뉴 */}
              <div className="flex flex-col min-h-0">
                <div className="bg-green-200 rounded-lg flex-1 flex items-center justify-center min-h-0 mb-2">
                  <img
                      src="/menu/preparing-service.png"
                      className="w-full h-full object-contain p-2"
                      alt="준비 중 메뉴"
                  />
                </div>
                <div className="flex-shrink-0 px-1">
                  <p className="text-sm font-bold text-center leading-tight mb-1">준비 중...</p>
                  <p className="text-[10px] text-center text-gray-500 leading-tight">
                    새로운 서비스를<br/>만나보아요!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Home