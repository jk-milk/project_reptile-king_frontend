type MypageCategoryProps = {
  selectedSubCategory: string;
  setSelectedSubCategory: (value: string) => void;
}

const categories = [
  {
    id: 1,
    category: "정보",
    subCategories: [
      {
        title: "마이페이지"
      },
      {
        title: "프로필 수정"
      },
    ],
  },
  {
    id: 2,
    category: "쇼핑",
    subCategories: [
      {
        title: "주문내역"
      },
      {
        title: "취소/반품/교환/환불내역"
      },
      {
        title: "리뷰관리"
      },
      {
        title: "문의하기"
      },
      {
        title: "문의내역"
      },
    ],
  },
  {
    id: 3,
    category: "커뮤니티",
    subCategories: [
      {
        title: "내 게시글"
      },
      {
        title: "내 댓글"
      },
    ],
  },
]

const MypageCategory = ({ selectedSubCategory, setSelectedSubCategory }: MypageCategoryProps) => {
  return (
    <div className="w-52 mr-28">
      {categories.map((category) => (
        <div key={category.id} className="w-full p-2">
          <div className="border-b-2 pb-2">
            <p className="text-lg text-white ps-2">
              {category.category}
            </p>
          </div>
          <ul className="w-full pt-2 pb-4">
            {category.subCategories.map((subCategory) => (
              <li key={subCategory.title}>
                <button
                  className={
                    selectedSubCategory === subCategory.title
                      ? "ps-2 py-0.5 text-white font-bold hover:underline"
                      : "ps-2 py-0.5 text-white hover:font-bold hover:underline text-left"
                  }
                  onClick={() => setSelectedSubCategory(subCategory.title)}
                >
                  {subCategory.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default MypageCategory;
