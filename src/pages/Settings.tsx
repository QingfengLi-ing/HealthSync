import { motion } from 'framer-motion';
import { Save, RefreshCw, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    siteTitle: '我的健康数据',
    author: 'HealthSync User',
    stepsGoal: 10000,
    sleepGoal: 7.5,
    aiEnabled: true,
    aiProvider: 'openai',
    aiModel: 'gpt-4o-mini',
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">设置</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">自定义你的健康数据展示</p>
      </div>

      {/* 站点设置 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">站点设置</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              站点标题
            </label>
            <input
              type="text"
              value={settings.siteTitle}
              onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              作者名称
            </label>
            <input
              type="text"
              value={settings.author}
              onChange={(e) => setSettings({ ...settings, author: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </motion.div>

      {/* 健康目标 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">健康目标</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              每日步数目标
            </label>
            <input
              type="number"
              value={settings.stepsGoal}
              onChange={(e) => setSettings({ ...settings, stepsGoal: Number(e.target.value) })}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              每日睡眠目标（小时）
            </label>
            <input
              type="number"
              step="0.5"
              value={settings.sleepGoal}
              onChange={(e) => setSettings({ ...settings, sleepGoal: Number(e.target.value) })}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </motion.div>

      {/* AI 设置 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI 健康建议</h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">启用 AI 建议</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                使用 AI 生成个性化健康建议
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.aiEnabled}
                onChange={(e) => setSettings({ ...settings, aiEnabled: e.target.checked })}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700"></div>
            </label>
          </div>

          {settings.aiEnabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  AI 提供商
                </label>
                <select
                  value={settings.aiProvider}
                  onChange={(e) => setSettings({ ...settings, aiProvider: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="openai">OpenAI</option>
                  <option value="aliyun">阿里云百炼</option>
                  <option value="volcengine">火山引擎</option>
                  <option value="custom">自定义</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  模型名称
                </label>
                <input
                  type="text"
                  value={settings.aiModel}
                  onChange={(e) => setSettings({ ...settings, aiModel: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                API Key 请在 GitHub Secrets 中配置，不要直接写在代码中。
              </p>
            </>
          )}
        </div>
      </motion.div>

      {/* 数据源配置 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">数据源配置</h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">华为健康</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">自动同步华为手表数据</p>
            </div>
            <a
              href="https://developer.huawei.com/consumer/cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
            >
              获取 Token
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Apple Health</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">导入 iPhone 健康数据</p>
            </div>
            <span className="text-sm text-gray-400">手动导入</span>
          </div>
        </div>
      </motion.div>

      {/* 保存按钮 */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600"
      >
        <Save className="h-5 w-5" />
        保存设置
      </motion.button>
    </div>
  );
}