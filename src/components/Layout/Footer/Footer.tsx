function Footer() {
  return (
    <div className="bg-gray-200 text-gray-700 body-font bottom-0 left-0 w-full">
      <div className="container mx-auto pt-4 px-5 flex flex-wrap flex-col sm:flex-row">
        <p className="text-gray-500 text-sm text-center sm:text-left">
          © {new Date().getFullYear()} ハチュウキング
        </p>
        <span className="sm:ml-auto sm:mt-0 mt-2 sm:w-auto w-full sm:text-left text-center text-gray-500 text-sm">
        大邱広域市北区福峴路35、永進専門大学
        </span>
      </div>
      <div className="container mx-auto pb-4 px-5 flex flex-wrap flex-col sm:flex-row">
        <span className="sm:ml-auto sm:mt-0 mt-2 sm:w-auto w-full sm:text-left text-center text-gray-500 text-sm">
          Developed by キム・イルゴン パク・スホン ハ・ヒョンジン ョ・ヒョンジュン ユ・ジェギョン べ・ソクミン
        </span>
      </div>
    </div>
  );
}

export default Footer;
