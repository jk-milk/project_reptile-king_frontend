import Category from "../components/common/BoardCategory"

function Community() {
  const categories = [
    {
      title: "홈",
      subCategories: ["home", "rules", "hot"],
      link: "home",
    },
    {
      title: "잡담 & 꿀팁",
      subCategories: ["사육", "핫딜", "주의점", "사육"],
      link: "talk",
    },
    {
      title: "분양",
      link: "adoption",
    },
  ];

  return (
    <div className="flex">
      <div className="flex-1 ml-auto">
        Search
        <Category categories={categories} />
      </div>
      <div className="flex-[2_2_0%]">
        메인컨텐츠
      </div>
      <div  className="flex-1">
        우측 사이드바
      </div>
    </div>
  )
}

export default Community