#!/usr/bin/env python3
"""
生成健康数据可视化SVG
"""

import argparse
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path


def generate_github_style_svg(db_path: str, output_path: str, days: int = 365):
    """生成类似GitHub贡献图的SVG"""
    if not Path(db_path).exists():
        print(f"数据库不存在: {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # 获取最近一年的步数数据
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days)

    cursor.execute("""
        SELECT date, count FROM steps
        WHERE date >= ?
        ORDER BY date
    """, (start_date.isoformat(),))

    data = {row[0]: row[1] for row in cursor.fetchall()}
    conn.close()

    if not data:
        print("没有步数数据")
        return

    max_steps = max(data.values()) if data else 10000

    # 生成SVG
    cell_size = 10
    cell_gap = 3
    width = 52 * (cell_size + cell_gap) + 50
    height = 7 * (cell_size + cell_gap) + 50

    svg_parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}">',
        '<style>',
        '.cell { stroke: #e1e4e8; stroke-width: 1px; }',
        '.legend { font-size: 10px; fill: #586069; }',
        '</style>',
    ]

    # 计算每个日期的位置
    current_date = start_date
    week = 0

    while current_date <= end_date:
        day_of_week = current_date.weekday()
        x = 30 + week * (cell_size + cell_gap)
        y = 20 + day_of_week * (cell_size + cell_gap)

        steps = data.get(current_date.isoformat(), 0)

        # 根据步数确定颜色
        if steps == 0:
            color = "#ebedf0"
        elif steps < max_steps * 0.25:
            color = "#9be9a8"
        elif steps < max_steps * 0.5:
            color = "#40c463"
        elif steps < max_steps * 0.75:
            color = "#30a14e"
        else:
            color = "#216e39"

        svg_parts.append(
            f'<rect class="cell" x="{x}" y="{y}" width="{cell_size}" height="{cell_size}" '
            f'fill="{color}" rx="2" ry="2">'
            f'<title>{current_date}: {steps:,} 步</title></rect>'
        )

        current_date += timedelta(days=1)
        if day_of_week == 6:
            week += 1

    svg_parts.append('</svg>')

    # 确保输出目录存在
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(svg_parts))

    print(f"SVG已生成: {output_path}")


def main():
    parser = argparse.ArgumentParser(description="生成健康数据可视化")
    parser.add_argument(
        "--from-db",
        dest="db_path",
        default="run_page/data.db",
        help="数据库路径",
    )
    parser.add_argument(
        "--output",
        dest="output_path",
        default="assets/health-calendar.svg",
        help="输出路径",
    )
    parser.add_argument(
        "--days",
        dest="days",
        type=int,
        default=365,
        help="生成多少天的数据",
    )

    args = parser.parse_args()

    generate_github_style_svg(args.db_path, args.output_path, args.days)


if __name__ == "__main__":
    main()