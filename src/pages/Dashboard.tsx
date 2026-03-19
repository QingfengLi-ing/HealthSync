import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Footprints, Heart, Moon, Flame, TrendingUp, TrendingDown } from 'lucide-react';

// 模拟数据
const mockData = {
  today: {
    steps: { count: 8432, goal: 10000, distance: 5.8, calories: 320 },
    heartRate: { avg: 72, min: 58, max: 125, resting: 65 },
    sleep: { hours: 7.5, deep: 1.8, light: 4.2, rem: 1.5, score: 82 },
    calories: { total: 1842, active: 320, resting: 1522 },
  },
  weekly: {
    steps: [6500, 8200, 7800, 9100, 8432, 0, 0],
    sleep: [7.2, 6.8, 7.5, 8.1, 7.5, 0, 0],
  },
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  trend?: number;
  goal?: number;
}

function StatCard({ title, value, subtitle, icon: Icon, color, trend, goal }: StatCardProps) {
  const progress = goal ? Math.min((Number(value) / goal) * 100, 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>

      {goal && (
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            目标: {goal.toLocaleString()}
          </p>
        </div>
      )}

      {trend !== undefined && (
        <div className={`mt-2 flex items-center gap-1 text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span>{Math.abs(trend)}%</span>
          <span className="text-gray-400">vs 昨日</span>
        </div>
      )}
    </motion.div>
  );
}

export default function Dashboard() {
  const [data] = useState(mockData);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">健康仪表盘</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">今日健康数据概览</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="今日步数"
          value={data.today.steps.count.toLocaleString()}
          subtitle={`${data.today.steps.distance} 公里`}
          icon={Footprints}
          color="bg-blue-500"
          goal={data.today.steps.goal}
          trend={12}
        />
        <StatCard
          title="心率"
          value={`${data.today.heartRate.avg} bpm`}
          subtitle={`静息 ${data.today.heartRate.resting} bpm`}
          icon={Heart}
          color="bg-red-500"
          trend={-2}
        />
        <StatCard
          title="睡眠时长"
          value={`${data.today.sleep.hours}h`}
          subtitle={`深睡 ${data.today.sleep.deep}h`}
          icon={Moon}
          color="bg-purple-500"
          trend={5}
        />
        <StatCard
          title="消耗卡路里"
          value={data.today.calories.total}
          subtitle={`活动 ${data.today.calories.active} kcal`}
          icon={Flame}
          color="bg-orange-500"
          trend={-8}
        />
      </div>

      {/* 睡眠分析 */}
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">昨夜睡眠分析</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-4">
              <div className="relative h-32 w-32">
                <svg className="h-32 w-32 -rotate-90 transform">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(data.today.sleep.score / 100) * 352} 352`}
                    className="text-purple-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.today.sleep.score}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">睡眠质量</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">良好</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-indigo-600" />
                <span className="text-sm text-gray-600 dark:text-gray-300">深度睡眠</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {data.today.sleep.deep}h
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">浅度睡眠</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {data.today.sleep.light}h
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-teal-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">REM睡眠</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {data.today.sleep.rem}h
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 健康建议 */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <TrendingUp className="h-5 w-5" />
          今日健康建议
        </h2>
        <ul className="mt-4 space-y-2">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/80" />
            <span>睡眠时长略低于推荐值，建议今晚提前30分钟入睡</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/80" />
            <span>今日步数还未达标，建议饭后散步20分钟</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/80" />
            <span>心率变异性(HRV)有所下降，建议减少咖啡因摄入</span>
          </li>
        </ul>
      </div>
    </div>
  );
}