import { useNavigate } from 'react-router-dom';

type MypageCategoryProps = {
  selectedSubCategory: string;
  setSelectedSubCategory: (value: string) => void;
}

const categories = [
  {
    id: 1,
    category: 'プロフィール',
    subCategories: [
      {
        title: '会員情報の管理',
        link: '/mypage',
      },
      {
        title: 'お支払い方法',
        link: '/mypage/payment',
      },
      {
        title: 'アドレス',
        link: '/mypage/address',
      },
    ],
  },
  {
    id: 2,
    category: 'ショッピング',
    subCategories: [
      {
        title: '注文履歴',
        link: '/mypage/order',
      },
      {
        title: 'キャンセル・返品・交換・返金履歴',
        link: '/mypage/order/contact',
      },
      {
        title: 'レビュー管理',
        link: '/mypage/order/review',
      },
      {
        title: 'お問い合わせ',
        link: '/mypage/help',
      },
    ],
  },
  {
    id: 3,
    category: 'コミュニティ',
    subCategories: [
      {
        title: 'マイポスト',
        link: '/mypage/posts',
      },
      {
        title: 'マイコメント',
        link: '/mypage/comments',
      },
    ],
  },
];

const MypageCategory = ({ selectedSubCategory, setSelectedSubCategory }: MypageCategoryProps) => {
  const navigate = useNavigate();

  const handleClick = (subCategory: { title: string; link: string }) => {
    setSelectedSubCategory(subCategory.title);
    navigate(subCategory.link);
  };

  return (
    <div className="w-52 mr-28 mt-9">
      {categories.map((category) => (
        <div key={category.id} className="w-full p-2">
          <div className="border-b-2 pb-2">
            <p className="text-lg ps-2">
              {category.category}
            </p>
          </div>
          <ul className="w-full pt-2 pb-4">
            {category.subCategories.map((subCategory) => (
              <li key={subCategory.title}>
                <button
                  className={
                    selectedSubCategory === subCategory.title
                      ? "ps-2 py-0.5 font-bold hover:underline"
                      : "ps-2 py-0.5 hover:font-bold hover:underline text-left"
                  }
                  onClick={() => handleClick(subCategory)}
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
