import { NavLink } from "react-router-dom";

interface CategoryProps {
  categories: {
    title: string;
    subCategories?: string[];
    link: string;
  }[];
}

const Category: React.FC<CategoryProps> = ({ categories }) => {
  return (
    <div className="flex flex-col items-center">
      {categories.map((category) => (
        <div key={category.title} className="w-full p-2">
          <div className="border-b-2 pb-2">
            <NavLink
              to={`/community/${category.link}`}
              className={({ isActive }) =>
                isActive
                  ? "text-lg font-bold text-yellow-300"
                  : "text-lg font-bold text-white hover:text-yellow-300"
              }
            >
              {category.title}
            </NavLink>
          </div>
          <ul className="mt-2 w-full">
            {category.subCategories && category.subCategories.map((subCategory) => (
              <li key={subCategory}>
                <NavLink
                  to={`/community/${subCategory}`}
                  className="py-2 text-white hover:text-yellow-300"
                >
                  {subCategory}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};




export default Category;
