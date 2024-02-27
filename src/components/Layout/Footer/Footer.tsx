function Footer() {
  return (
    <div className="bg-gray-200 text-gray-700 body-font bottom-0 left-0 w-full">
      <div className="container mx-auto pt-4 px-5 flex flex-wrap flex-col sm:flex-row">
        <p className="text-gray-500 text-sm text-center sm:text-left">
          © {new Date().getFullYear()} 파충KING
        </p>
        <span className="sm:ml-auto sm:mt-0 mt-2 sm:w-auto w-full sm:text-left text-center text-gray-500 text-sm">
          대구광역시 북구 복현로 35, 영진전문대학교
        </span>
      </div>
      <div className="container mx-auto pb-4 px-5 flex flex-wrap flex-col sm:flex-row">
        <span className="sm:ml-auto sm:mt-0 mt-2 sm:w-auto w-full sm:text-left text-center text-gray-500 text-sm">
          Developed by 김일곤, 하현진, 박수헌, 조현준, 유재경, 배석민
        </span>
      </div>
    </div>
  );
}

export default Footer;
