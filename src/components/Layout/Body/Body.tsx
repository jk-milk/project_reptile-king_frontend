import { Outlet } from "react-router-dom";

function Body() {
  return (<div className="bg-bgGreen h-screen mt-16">
    <Outlet />
  </div>
  );
}

export default Body