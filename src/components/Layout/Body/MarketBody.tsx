import { Outlet } from "react-router-dom";

function MarketBody() {
  return (
    <div className="bg-bgGreen mt-16">
      <Outlet />
    </div>
  );
}
export default MarketBody