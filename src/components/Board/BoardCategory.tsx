import { PostCategory } from '../../types/Board';

type BoardCategoryProps = {
  categories: PostCategory[];
  selectedSubCategory: string;
  setSelectedSubCategory: (value: string) => void;
}

const BoardCategory = ({ categories, selectedSubCategory, setSelectedSubCategory }: BoardCategoryProps) => {
  return (
    <div className="w-44 mr-20">
      <div className="mt-28">
        {categories.map((category) => (
          <div key={category.id} className="w-full p-2">
            <div className="border-b-2 pb-2">
              <p className="text-lg text-white ps-2">
                {category.category}
              </p>
            </div>
            <ul className="w-full">
              {category.subCategories.map((subCategory) => (
                <li key={subCategory.title}>
                  <button
                    className={
                      selectedSubCategory === subCategory.title
                        ? "ps-2 py-0.5 text-white font-bold hover:underline"
                        : "ps-2 py-0.5 text-white hover:font-bold hover:underline"
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
    </div>
  );
}

export default BoardCategory;
