import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity, BarChart3, Calendar, Lightbulb, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/', label: '仪表盘', icon: Activity },
  { path: '/trends', label: '趋势分析', icon: BarChart3 },
  { path: '/activities', label: '运动记录', icon: Calendar },
  { path: '/suggestions', label: '健康建议', icon: Lightbulb },
  { path: '/settings', label: '设置', icon: Settings },
];

export default function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 移动端侧边栏遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 transform bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4">
          <Link to="/" className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">HealthSync</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 导航菜单 */}
        <nav className="mt-4 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 mb-1 transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 主内容区 */}
      <div className="lg:ml-64">
        {/* 顶部栏 */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </span>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}