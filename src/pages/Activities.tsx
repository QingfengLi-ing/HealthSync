import { motion } from 'framer-motion';
import { Bike, Swim, Dumbbell, MapPin, Clock, Flame } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'running',
    title: '晨跑',
    date: '2024-03-19 06:30',
    distance: 5.2,
    duration: 28,
    calories: 320,
    heartRate: 142,
  },
  {
    id: 2,
    type: 'cycling',
    title: '骑行',
    date: '2024-03-18 17:00',
    distance: 15.5,
    duration: 45,
    calories: 380,
    heartRate: 128,
  },
  {
    id: 3,
    type: 'swimming',
    title: '游泳',
    date: '2024-03-17 19:00',
    distance: 1.2,
    duration: 35,
    calories: 450,
    heartRate: 135,
  },
  {
    id: 4,
    type: 'strength',
    title: '力量训练',
    date: '2024-03-16 18:30',
    distance: 0,
    duration: 60,
    calories: 280,
    heartRate: 118,
  },
];

const activityIcons: Record<string, React.ElementType> = {
  running: MapPin,
  cycling: Bike,
  swimming: Swim,
  strength: Dumbbell,
};

const activityColors: Record<string, string> = {
  running: 'bg-blue-500',
  cycling: 'bg-green-500',
  swimming: 'bg-cyan-500',
  strength: 'bg-orange-500',
};

export default function Activities() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">运动记录</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">查看所有运动活动</p>
      </div>

      {/* 统计概览 */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">本周运动次数</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">4 次</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">本周总距离</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">21.9 km</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">本周消耗</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">1,430 kcal</p>
        </motion.div>
      </div>

      {/* 活动列表 */}
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activityIcons[activity.type] || MapPin;
          const color = activityColors[activity.type] || 'bg-gray-500';

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800"
            >
              <div className={`rounded-xl p-3 ${color}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{activity.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{activity.date}</p>
              </div>
              <div className="flex gap-6 text-sm">
                {activity.distance > 0 && (
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">距离</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {activity.distance} km
                    </p>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">时长</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {activity.duration} 分钟
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">消耗</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {activity.calories} kcal
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">心率</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {activity.heartRate} bpm
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}