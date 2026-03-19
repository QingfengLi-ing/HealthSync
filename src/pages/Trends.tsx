import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';

// 模拟7天数据
const weeklyStepsData = [
  { day: '周一', steps: 6500, goal: 10000 },
  { day: '周二', steps: 8200, goal: 10000 },
  { day: '周三', steps: 7800, goal: 10000 },
  { day: '周四', steps: 9100, goal: 10000 },
  { day: '周五', steps: 8432, goal: 10000 },
  { day: '周六', steps: 0, goal: 10000 },
  { day: '周日', steps: 0, goal: 10000 },
];

const weeklySleepData = [
  { day: '周一', hours: 7.2, deep: 1.5 },
  { day: '周二', hours: 6.8, deep: 1.2 },
  { day: '周三', hours: 7.5, deep: 1.8 },
  { day: '周四', hours: 8.1, deep: 2.0 },
  { day: '周五', hours: 7.5, deep: 1.8 },
  { day: '周六', hours: 0, deep: 0 },
  { day: '周日', hours: 0, deep: 0 },
];

const heartRateData = [
  { time: '00:00', hr: 62 },
  { time: '04:00', hr: 58 },
  { time: '08:00', hr: 72 },
  { time: '12:00', hr: 85 },
  { time: '16:00', hr: 78 },
  { time: '20:00', hr: 75 },
  { time: '23:59', hr: 68 },
];

export default function Trends() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">趋势分析</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">查看健康数据变化趋势</p>
      </div>

      {/* 步数趋势 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">步数趋势（最近7天）</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyStepsData}>
              <defs>
                <linearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey="steps"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#stepsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">平均步数: </span>
            <span className="font-semibold text-gray-900 dark:text-white">8,006 步</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">达标天数: </span>
            <span className="font-semibold text-gray-900 dark:text-white">1/5 天</span>
          </div>
        </div>
      </motion.div>

      {/* 睡眠趋势 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">睡眠趋势（最近7天）</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklySleepData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                name="总时长"
              />
              <Line
                type="monotone"
                dataKey="deep"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ fill: '#6366f1', strokeWidth: 2 }}
                name="深度睡眠"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">平均睡眠: </span>
            <span className="font-semibold text-gray-900 dark:text-white">7.4 小时</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">平均深度睡眠: </span>
            <span className="font-semibold text-gray-900 dark:text-white">1.7 小时</span>
          </div>
        </div>
      </motion.div>

      {/* 心率趋势 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">心率趋势（今日）</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={heartRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[50, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Line
                type="monotone"
                dataKey="hr"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">最低</p>
            <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">58 bpm</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">平均</p>
            <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">72 bpm</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">最高</p>
            <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">85 bpm</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}