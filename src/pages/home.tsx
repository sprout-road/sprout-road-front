import { useNavigate } from "react-router-dom"
import Header from "../components/common/Header";

type MenuType = '지역 컬러링' | '트레블 로그' | '리워드 보기' | '미션' | '디지털 포트폴리오' | '나만의 여행 기록' 
// type MenuRoutes = `/region-coloring` | `/travel-log` | `/reword` | `/mission` | `/portfolio` | `/my-travel`


function Home() {
  const navigate = useNavigate()

  const menuItems: MenuType[] = [
    '지역 컬러링',
    '트레블 로그',
    '리워드 보기',
    '미션',
    '디지털 포트폴리오',
    '나만의 여행 기록',
  ] as const;

  const handleMenuClick = (index: number) => {
    switch(index) {
      case 0:
        navigate(`/region-coloring`)
        return
      case 1:
        navigate(`/travel-log`)
        return
      case 2:
        navigate(`/reword`)
        return
      case 3:
        navigate(`/mission`)
        return
      case 4:
        navigate(`/portfolio`)
        return
      case 5:
        navigate(`/my-travel`)
        return
      default:
        return 
    }
  }

  return (
    <div className="bg-white text-black w-full p-6">
      <Header isHome={true} ></Header>
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-3 grid-rows-2 gap-4 mt-80 justify-center items-center">
          {menuItems.map((menu, index) => {
            return (
              <div
                key={index}
                onClick={() => handleMenuClick(index)}
                className="bg-green-300 rounded-[8px] text-center px-1 py-10 min-w-[100px] cursor-pointer" 
              >
                {menu}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )   
}

export default Home