import { PostCategory, SelectedCategory } from "../../types/Board";

interface BoardCategoryProps {
  categories: PostCategory[];
  selectedCategory: SelectedCategory;
  onSelectCategory: (id: number) => void;
}

function BoardCategory({ categories, selectedCategory, onSelectCategory }: BoardCategoryProps) {
  return (
    <div className="w-52 mr-20">
      <div className="mt-4">
        {categories.map((mainCategory) => (
          <div key={mainCategory.id} className="w-full p-2">
            <div className="border-b-2 pb-2">
              <p className="text-lg text-white ps-2">
                {mainCategory.name}
              </p>
            </div>
            <ul className="w-full pt-2 pb-4">
              {mainCategory.subPosts && mainCategory.subPosts.map((subCategory) => (
                <li key={subCategory.name}>
                  <button
                    className={
                      selectedCategory.id === subCategory.id
                        ? "ps-2 py-0.5 text-white font-bold hover:underline"
                        : "ps-2 py-0.5 text-white hover:font-bold hover:underline"
                    }
                    onClick={() => onSelectCategory(subCategory.id)}
                  >
                    {subCategory.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardCategory;
