// src/components/Sidebar.jsx
import { FaHome, FaUsers, FaTasks, FaCog, FaSignOutAlt } from 'react-icons/fa';

export default function Sidebar() {
  return (
    <div className="w-[250px] bg-[#213448] text-[#ECEFCA] flex flex-col justify-between p-4">
      <div>
        <div className="mb-8">
          <div className="w-16 h-16 bg-gray-400 rounded-full mx-auto" />
          <p className="text-center mt-2">Admin</p>
        </div>
        <nav className="space-y-4">
          <NavItem icon={<FaHome />} label="Dashboard" />
          <NavItem icon={<FaUsers />} label="User Management" />
          <NavItem icon={<FaTasks />} label="Task Overview" />
          <NavItem icon={<FaCog />} label="System Settings" />
        </nav>
      </div>
      <button className="flex items-center gap-2 text-[#ECEFCA] hover:underline">
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
}

function NavItem({ icon, label }) {
  return (
    <div className="flex items-center gap-3 cursor-pointer hover:underline">
      {icon}
      <span>{label}</span>
    </div>
  );
}
