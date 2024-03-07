import { Outlet } from "react-router-dom";

function Body() {
  return (
    <div className="bg-bgGreen">
      <Outlet />
    </div>
  );
}

export default Body