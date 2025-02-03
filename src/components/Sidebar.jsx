import React, { useState } from "react";
import { FaHome, FaUser, FaBook, FaCog } from "react-icons/fa";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`h-screen bg-blue-900 text-white p-4 ${collapsed ? "w-16" : "w-64"} transition-all duration-300`}>
      <button onClick={() => setCollapsed(!collapsed)} className="text-white mb-4">
        {collapsed ? "➡️" : "⬅️"}
      </button>
      <ul className="space-y-4">
        <li className="flex items-center space-x-3 hover:text-yellow-400 cursor-pointer">
          <FaHome /> {!collapsed && <span>Explore</span>}
        </li>
        <li className="flex items-center space-x-3 hover:text-yellow-400 cursor-pointer">
          <FaUser /> {!collapsed && <span>Learning Profile</span>}
        </li>
        <li className="flex items-center space-x-3 hover:text-yellow-400 cursor-pointer">
          <FaBook /> {!collapsed && <span>Library</span>}
        </li>
        <li className="flex items-center space-x-3 hover:text-yellow-400 cursor-pointer">
          <FaCog /> {!collapsed && <span>Settings</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
