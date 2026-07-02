import { Outlet } from "react-router-dom";
import { BottomNav } from "../components/BottomNav";

export default function AppLayout() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-gray-50">
      <div className="no-scrollbar flex-1 overflow-y-auto">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
