"""
数据库操作模块
"""

import json
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Any


def init_db(db_path: str = "run_page/data.db"):
    """初始化数据库"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # 步数表
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS steps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date DATE NOT NULL UNIQUE,
            count INTEGER NOT NULL,
            distance REAL,
            calories INTEGER,
            source TEXT DEFAULT 'huawei',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # 心率表
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS heart_rate (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME NOT NULL,
            value INTEGER NOT NULL,
            source TEXT DEFAULT 'huawei',
            UNIQUE(timestamp, source)
        )
    """)

    # 每日心率统计
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS heart_rate_daily (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date DATE NOT NULL UNIQUE,
            avg_hr INTEGER,
            min_hr INTEGER,
            max_hr INTEGER,
            resting_hr INTEGER,
            source TEXT DEFAULT 'huawei',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # 睡眠表
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sleep (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date DATE NOT NULL UNIQUE,
            start_time DATETIME NOT NULL,
            end_time DATETIME NOT NULL,
            duration_minutes INTEGER NOT NULL,
            deep_sleep_minutes INTEGER DEFAULT 0,
            light_sleep_minutes INTEGER DEFAULT 0,
            rem_sleep_minutes INTEGER DEFAULT 0,
            awake_minutes INTEGER DEFAULT 0,
            score INTEGER,
            source TEXT DEFAULT 'huawei',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # 运动记录表
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            activity_id TEXT UNIQUE,
            type TEXT NOT NULL,
            title TEXT,
            start_time DATETIME NOT NULL,
            end_time DATETIME,
            duration_seconds INTEGER,
            distance REAL,
            calories INTEGER,
            avg_heart_rate INTEGER,
            max_heart_rate INTEGER,
            avg_pace INTEGER,
            elevation_gain REAL,
            polyline TEXT,
            gpx_file TEXT,
            source TEXT DEFAULT 'huawei',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # 血氧表
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS blood_oxygen (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME NOT NULL,
            value REAL NOT NULL,
            source TEXT DEFAULT 'huawei',
            UNIQUE(timestamp, source)
        )
    """)

    # 压力表
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS stress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME NOT NULL,
            value INTEGER NOT NULL,
            level TEXT,
            source TEXT DEFAULT 'huawei',
            UNIQUE(timestamp, source)
        )
    """)

    # 体重表
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS weight (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date DATE NOT NULL UNIQUE,
            weight REAL,
            body_fat REAL,
            muscle_mass REAL,
            bmi REAL,
            source TEXT DEFAULT 'huawei',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # 健康建议表
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS suggestions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date DATE NOT NULL UNIQUE,
            content TEXT NOT NULL,
            category TEXT,
            priority TEXT DEFAULT 'normal',
            is_read BOOLEAN DEFAULT FALSE,
            source TEXT DEFAULT 'ai',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # 创建索引
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_steps_date ON steps(date)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_hr_timestamp ON heart_rate(timestamp)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_sleep_date ON sleep(date)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_activities_start ON activities(start_time)")

    conn.commit()
    conn.close()


def save_health_data(
    db_path: str,
    steps: list[dict[str, Any]] = None,
    heart_rate: list[dict[str, Any]] = None,
    sleep: list[dict[str, Any]] = None,
    activities: list[dict[str, Any]] = None,
    blood_oxygen: list[dict[str, Any]] = None,
    stress: list[dict[str, Any]] = None,
):
    """保存健康数据到数据库"""
    # 确保数据库存在
    if not Path(db_path).exists():
        init_db(db_path)

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # 保存步数
    if steps:
        for item in steps:
            try:
                cursor.execute("""
                    INSERT OR REPLACE INTO steps (date, count, distance, calories, source)
                    VALUES (?, ?, ?, ?, ?)
                """, (
                    item.get("date"),
                    item.get("count", 0),
                    item.get("distance"),
                    item.get("calories"),
                    item.get("source", "huawei"),
                ))
            except Exception as e:
                print(f"保存步数数据失败: {e}")

    # 保存心率
    if heart_rate:
        for item in heart_rate:
            try:
                cursor.execute("""
                    INSERT OR REPLACE INTO heart_rate (timestamp, value, source)
                    VALUES (?, ?, ?)
                """, (
                    item.get("timestamp"),
                    item.get("value", 0),
                    item.get("source", "huawei"),
                ))
            except Exception as e:
                print(f"保存心率数据失败: {e}")

    # 保存睡眠
    if sleep:
        for item in sleep:
            try:
                cursor.execute("""
                    INSERT OR REPLACE INTO sleep (
                        date, start_time, end_time, duration_minutes,
                        deep_sleep_minutes, light_sleep_minutes, rem_sleep_minutes,
                        awake_minutes, score, source
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    item.get("date"),
                    item.get("start_time"),
                    item.get("end_time"),
                    item.get("duration_minutes", 0),
                    item.get("deep_sleep_minutes", 0),
                    item.get("light_sleep_minutes", 0),
                    item.get("rem_sleep_minutes", 0),
                    item.get("awake_minutes", 0),
                    item.get("score"),
                    item.get("source", "huawei"),
                ))
            except Exception as e:
                print(f"保存睡眠数据失败: {e}")

    # 保存运动记录
    if activities:
        for item in activities:
            try:
                cursor.execute("""
                    INSERT OR REPLACE INTO activities (
                        activity_id, type, title, start_time, end_time,
                        duration_seconds, distance, calories, avg_heart_rate,
                        max_heart_rate, avg_pace, elevation_gain, polyline, source
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    item.get("activity_id"),
                    item.get("type", "running"),
                    item.get("title"),
                    item.get("start_time"),
                    item.get("end_time"),
                    item.get("duration_seconds"),
                    item.get("distance"),
                    item.get("calories"),
                    item.get("avg_heart_rate"),
                    item.get("max_heart_rate"),
                    item.get("avg_pace"),
                    item.get("elevation_gain"),
                    item.get("polyline"),
                    item.get("source", "huawei"),
                ))
            except Exception as e:
                print(f"保存运动记录失败: {e}")

    # 保存血氧
    if blood_oxygen:
        for item in blood_oxygen:
            try:
                cursor.execute("""
                    INSERT OR REPLACE INTO blood_oxygen (timestamp, value, source)
                    VALUES (?, ?, ?)
                """, (
                    item.get("timestamp"),
                    item.get("value", 0),
                    item.get("source", "huawei"),
                ))
            except Exception as e:
                print(f"保存血氧数据失败: {e}")

    # 保存压力
    if stress:
        for item in stress:
            try:
                cursor.execute("""
                    INSERT OR REPLACE INTO stress (timestamp, value, level, source)
                    VALUES (?, ?, ?, ?)
                """, (
                    item.get("timestamp"),
                    item.get("value", 0),
                    item.get("level"),
                    item.get("source", "huawei"),
                ))
            except Exception as e:
                print(f"保存压力数据失败: {e}")

    conn.commit()
    conn.close()


def get_health_summary(db_path: str = "run_page/data.db", days: int = 7) -> dict:
    """获取健康数据摘要"""
    if not Path(db_path).exists():
        return {}

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    summary = {}

    # 最近步数
    cursor.execute("""
        SELECT date, count, distance, calories
        FROM steps
        ORDER BY date DESC
        LIMIT ?
    """, (days,))
    summary["steps"] = [
        {"date": row[0], "count": row[1], "distance": row[2], "calories": row[3]}
        for row in cursor.fetchall()
    ]

    # 最近睡眠
    cursor.execute("""
        SELECT date, duration_minutes, deep_sleep_minutes, score
        FROM sleep
        ORDER BY date DESC
        LIMIT ?
    """, (days,))
    summary["sleep"] = [
        {
            "date": row[0],
            "duration_minutes": row[1],
            "deep_sleep_minutes": row[2],
            "score": row[3],
        }
        for row in cursor.fetchall()
    ]

    # 最近运动
    cursor.execute("""
        SELECT type, title, start_time, distance, duration_seconds
        FROM activities
        ORDER BY start_time DESC
        LIMIT 10
    """)
    summary["activities"] = [
        {
            "type": row[0],
            "title": row[1],
            "start_time": row[2],
            "distance": row[3],
            "duration_seconds": row[4],
        }
        for row in cursor.fetchall()
    ]

    conn.close()
    return summary


def export_to_json(db_path: str = "run_page/data.db", output_path: str = "src/static/health-data.json"):
    """导出数据为JSON"""
    if not Path(db_path).exists():
        return

    summary = get_health_summary(db_path, days=30)

    # 确保输出目录存在
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)

    print(f"数据已导出到: {output_path}")


if __name__ == "__main__":
    # 初始化数据库
    init_db()
    print("数据库初始化完成")