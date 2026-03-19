#!/usr/bin/env python3
"""
生成AI健康建议
"""

import argparse
import json
import os
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

import httpx


def get_health_stats(db_path: str) -> dict[str, Any]:
    """获取健康统计数据"""
    if not Path(db_path).exists():
        return {}

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    stats = {}

    # 最近7天平均步数
    cursor.execute("""
        SELECT AVG(count) FROM steps
        WHERE date >= date('now', '-7 days')
    """)
    result = cursor.fetchone()
    stats["avg_steps"] = int(result[0]) if result and result[0] else 0

    # 最近7天平均睡眠
    cursor.execute("""
        SELECT AVG(duration_minutes) FROM sleep
        WHERE date >= date('now', '-7 days')
    """)
    result = cursor.fetchone()
    stats["avg_sleep_hours"] = round((result[0] or 0) / 60, 1)

    # 最近静息心率
    cursor.execute("""
        SELECT resting_hr FROM heart_rate_daily
        ORDER BY date DESC LIMIT 1
    """)
    result = cursor.fetchone()
    stats["resting_hr"] = result[0] if result else None

    # 最近7天运动天数
    cursor.execute("""
        SELECT COUNT(DISTINCT date(start_time)) FROM activities
        WHERE start_time >= date('now', '-7 days')
    """)
    result = cursor.fetchone()
    stats["exercise_days"] = result[0] if result else 0

    # 今日步数
    cursor.execute("""
        SELECT count FROM steps WHERE date = date('now')
    """)
    result = cursor.fetchone()
    stats["today_steps"] = result[0] if result else 0

    # 今日睡眠
    cursor.execute("""
        SELECT duration_minutes, deep_sleep_minutes FROM sleep
        WHERE date = date('now')
    """)
    result = cursor.fetchone()
    if result:
        stats["today_sleep_hours"] = round(result[0] / 60, 1)
        stats["today_deep_sleep_percent"] = round(result[1] / result[0] * 100, 1) if result[0] > 0 else 0
    else:
        stats["today_sleep_hours"] = 0
        stats["today_deep_sleep_percent"] = 0

    conn.close()
    return stats


def generate_ai_suggestion(
    stats: dict[str, Any],
    api_key: str,
    base_url: str = "https://api.openai.com/v1",
    model: str = "gpt-4o-mini",
) -> str:
    """使用AI生成健康建议"""

    prompt = f"""你是一位专业的健康顾问。基于用户最近的健康数据，提供简明、实用的健康建议。

用户最近健康数据：
- 步数：最近7天平均 {stats.get('avg_steps', 0):,} 步，今日 {stats.get('today_steps', 0):,} 步
- 睡眠：最近7天平均 {stats.get('avg_sleep_hours', 0)} 小时，今日 {stats.get('today_sleep_hours', 0)} 小时
- 深度睡眠占比：今日 {stats.get('today_deep_sleep_percent', 0)}%
- 静息心率：{stats.get('resting_hr', '未知')} bpm
- 运动频率：最近7天运动 {stats.get('exercise_days', 0)} 天

请针对以下方面提供建议（每条不超过50字）：
1. 睡眠质量改善
2. 运动计划调整
3. 日常健康习惯

直接输出建议，不要有其他内容。"""

    try:
        with httpx.Client(timeout=30.0) as client:
            response = client.post(
                f"{base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": model,
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 500,
                    "temperature": 0.7,
                },
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"AI生成失败: {e}")
        return generate_rule_based_suggestion(stats)


def generate_rule_based_suggestion(stats: dict[str, Any]) -> str:
    """基于规则生成健康建议"""
    suggestions = []

    # 睡眠建议
    avg_sleep = stats.get("avg_sleep_hours", 0)
    if avg_sleep < 6:
        suggestions.append("⚠️ 睡眠时间不足，建议每晚保证7-8小时睡眠")
    elif avg_sleep < 7:
        suggestions.append("💤 睡眠时间略少，建议适当增加睡眠时长")
    else:
        suggestions.append("✅ 睡眠时间充足，继续保持")

    # 深度睡眠建议
    deep_sleep_percent = stats.get("today_deep_sleep_percent", 0)
    if deep_sleep_percent < 15:
        suggestions.append("🌙 深度睡眠占比偏低，建议睡前避免使用电子设备")
    elif deep_sleep_percent > 25:
        suggestions.append("🌙 深度睡眠质量良好")

    # 步数建议
    today_steps = stats.get("today_steps", 0)
    if today_steps < 5000:
        suggestions.append("🚶 今日步数较少，建议适当增加步行")
    elif today_steps >= 10000:
        suggestions.append("🎉 今日步数达标，继续保持！")

    # 运动频率建议
    exercise_days = stats.get("exercise_days", 0)
    if exercise_days < 3:
        suggestions.append("🏃 最近运动较少，建议每周运动3-4次")
    elif exercise_days >= 4:
        suggestions.append("💪 运动频率良好，继续保持！")

    return "\n".join(suggestions)


def save_suggestion(db_path: str, content: str, category: str = "general"):
    """保存建议到数据库"""
    from db import init_db

    if not Path(db_path).exists():
        init_db(db_path)

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    today = datetime.now().date().isoformat()

    cursor.execute("""
        INSERT OR REPLACE INTO suggestions (date, content, category, source)
        VALUES (?, ?, ?, ?)
    """, (today, content, category, "ai" if "api_key" in os.environ else "rule"))

    conn.commit()
    conn.close()


def main():
    parser = argparse.ArgumentParser(description="生成健康建议")
    parser.add_argument(
        "--db",
        dest="db_path",
        default="run_page/data.db",
        help="数据库路径",
    )

    args = parser.parse_args()

    # 获取健康数据
    stats = get_health_stats(args.db_path)
    if not stats:
        print("没有健康数据")
        return

    # 获取AI配置
    api_key = os.environ.get("AI_API_KEY")
    base_url = os.environ.get("AI_BASE_URL", "https://api.openai.com/v1")
    model = os.environ.get("AI_MODEL", "gpt-4o-mini")

    # 生成建议
    if api_key:
        print("使用AI生成健康建议...")
        suggestion = generate_ai_suggestion(stats, api_key, base_url, model)
    else:
        print("使用规则生成健康建议...")
        suggestion = generate_rule_based_suggestion(stats)

    # 保存建议
    save_suggestion(args.db_path, suggestion)

    print()
    print("今日健康建议:")
    print("-" * 40)
    print(suggestion)
    print("-" * 40)


if __name__ == "__main__":
    main()