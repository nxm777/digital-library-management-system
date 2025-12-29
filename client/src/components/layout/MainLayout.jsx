import { Outlet } from 'react-router-dom';
import Sidebar from '../layout/Sidebar';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block flex-shrink-0">
        <Sidebar />
      </aside>

      <main className="flex-1 overflow-y-auto p-[50px]">
           <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;