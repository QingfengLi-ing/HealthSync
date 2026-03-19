import { motion } from 'framer-motion';
import { Lightbulb, CheckCircle, AlertTriangle, Info, Moon, Activity, Heart } from 'lucide-react';

const suggestions = [
  {
    id: 1,
    category: 'sleep',
    priority: 'high',
    content: '睡眠时长略低于推荐值，建议今晚提前30分钟入睡，保持规律的作息时间。',
    date: '2024-03-19',
  },
  {
    id: 2,
    category: 'exercise',
    priority: 'normal',
    content: '今日步数还未达标，建议饭后散步20分钟，有助于消化和保持健康。',
    date: '2024-03-19',
  },
  {
    id: 3,
    category: 'heart',
    priority: 'normal',
    content: '心率变异性(HRV)有所下降，建议减少咖啡因摄入，保持充足休息。',
    date: '2024-03-19',
  },
  {
    id: 4,
    category: 'general',
    priority: 'low',
    content: '本周运动频率良好，继续保持每周3-4次的运动习惯！',
    date: '2024-03-18',
  },
];

const categoryIcons: Record<string, React.ElementType> = {
  sleep: Moon,
  exercise: Activity,
  heart: Heart,
  general: Lightbulb,
};

const priorityColors: Record<string, string> = {
  high: 'text-red-500 bg-red-50 dark:bg-red-900/20',
  normal: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  low: 'text-green-500 bg-green-50 dark:bg-green-900/20',
};

export default function Suggestions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">健康建议</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">基于健康数据生成的个性化建议</p>
      </div>

      {/* AI状态 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white"
      >
        <div className="flex items-center gap-3">
          <Lightbulb className="h-8 w-8" />
          <div>
            <h2 className="text-lg font-semibold">AI健康助手</h2>
            <p className="text-sm opacity-80">已启用 · 上次更新: 今日 08:00</p>
          </div>
        </div>
      </motion.div>

      {/* 建议列表 */}
      <div className="space-y-4">
        {suggestions.map((suggestion, index) => {
          const Icon = categoryIcons[suggestion.category] || Lightbulb;
          const priorityClass = priorityColors[suggestion.priority];

          return (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800"
            >
              <div className="flex items-start gap-4">
                <div className={`rounded-xl p-2 ${priorityClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {suggestion.date}
                    </span>
                    {suggestion.priority === 'high' && (
                      <span className="flex items-center gap-1 text-xs text-red-500">
                        <AlertTriangle className="h-3 w-3" />
                        需要关注
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-gray-900 dark:text-white">{suggestion.content}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}