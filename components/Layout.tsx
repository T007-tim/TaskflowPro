
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ICONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: ICONS.DASHBOARD },
    { path: '/tasks', label: 'All Tasks', icon: ICONS.TASKS },
    { path: '/hierarchy', label: 'Hierarchy', icon: ICONS.HIERARCHY },
    { path: '/flow', label: 'Flow Board', icon: ICONS.FLOW },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <div className="bg-indigo-600 text-white p-1 rounded">
              <ICONS.TASKS className="w-5 h-5" />
            </div>
            <span>TaskFlow Pro</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Workspace</p>
            <div className="flex items-center gap-2">
              <img src="https://picsum.photos/seed/user/32/32" className="w-8 h-8 rounded-full" alt="User" />
              <div className="text-sm">
                <p className="font-medium truncate">ZURI</p>
                <p className="text-slate-500 text-xs">Standard Plan</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center px-8 justify-between z-10">
          <h1 className="text-lg font-semibold text-slate-800">
            {navItems.find(n => n.path === location.pathname)?.label || 'Task Management'}
          </h1>
          <div className="flex gap-4 items-center">
            <div className="bg-slate-100 rounded-full h-8 w-8 flex items-center justify-center text-slate-500">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Layout;
