#!/usr/bin/env python3
"""
华为健康数据自动同步

使用方法:
    python run_page/huawei_sync.py --access-token YOUR_TOKEN

环境变量:
    HUAWEI_ACCESS_TOKEN: 访问令牌
    HUAWEI_REFRESH_TOKEN: 刷新令牌
    HUAWEI_IS_CN: 是否中国区 (true/false)
"""

import argparse
import asyncio
import datetime as dt
import json
import logging
import os
import sys
from pathlib import Path
from typing import Any

import httpx

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# 超时配置
TIMEOUT = httpx.Timeout(240.0, connect=360.0)

# 华为API端点
HUAWEI_API_CN = "https://health-api.hicloud.com"
HUAWEI_API_GLOBAL = "https://health-api.huawei.com"


class HuaweiHealthClient:
    """华为健康API客户端"""

    def __init__(
        self,
        access_token: str,
        refresh_token: str | None = None,
        is_cn: bool = True,
    ):
        self.client = httpx.AsyncClient(timeout=TIMEOUT)
        self.access_token = access_token
        self.refresh_token = refresh_token
        self.base_url = HUAWEI_API_CN if is_cn else HUAWEI_API_GLOBAL
        self.is_cn = is_cn

    def _get_headers(self) -> dict:
        """获取请求头"""
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
            "User-Agent": "HuaweiHealth/12.0.0",
            "Accept-Language": "zh-CN" if self.is_cn else "en-US",
        }

    async def get_steps(
        self,
        start_date: dt.date,
        end_date: dt.date,
    ) -> list[dict[str, Any]]:
        """获取步数数据"""
        url = f"{self.base_url}/openhealth/v1/steps"
        params = {
            "startDate": start_date.isoformat(),
            "endDate": end_date.isoformat(),
        }

        try:
            response = await self.client.get(
                url,
                headers=self._get_headers(),
                params=params,
            )
            response.raise_for_status()
            data = response.json()
            return data.get("data", [])
        except Exception as e:
            logger.error(f"获取步数数据失败: {e}")
            return []

    async def get_heart_rate(
        self,
        start_date: dt.date,
        end_date: dt.date,
    ) -> list[dict[str, Any]]:
        """获取心率数据"""
        url = f"{self.base_url}/openhealth/v1/heartrate"
        params = {
            "startDate": start_date.isoformat(),
            "endDate": end_date.isoformat(),
        }

        try:
            response = await self.client.get(
                url,
                headers=self._get_headers(),
                params=params,
            )
            response.raise_for_status()
            data = response.json()
            return data.get("data", [])
        except Exception as e:
            logger.error(f"获取心率数据失败: {e}")
            return []

    async def get_sleep(
        self,
        start_date: dt.date,
        end_date: dt.date,
    ) -> list[dict[str, Any]]:
        """获取睡眠数据"""
        url = f"{self.base_url}/openhealth/v1/sleep"
        params = {
            "startDate": start_date.isoformat(),
            "endDate": end_date.isoformat(),
        }

        try:
            response = await self.client.get(
                url,
                headers=self._get_headers(),
                params=params,
            )
            response.raise_for_status()
            data = response.json()
            return data.get("data", [])
        except Exception as e:
            logger.error(f"获取睡眠数据失败: {e}")
            return []

    async def get_activities(
        self,
        start: int = 0,
        limit: int = 100,
    ) -> list[dict[str, Any]]:
        """获取运动记录"""
        url = f"{self.base_url}/openhealth/v1/activities"
        params = {"start": start, "limit": limit}

        try:
            response = await self.client.get(
                url,
                headers=self._get_headers(),
                params=params,
            )
            response.raise_for_status()
            data = response.json()
            return data.get("data", [])
        except Exception as e:
            logger.error(f"获取运动记录失败: {e}")
            return []

    async def get_blood_oxygen(
        self,
        start_date: dt.date,
        end_date: dt.date,
    ) -> list[dict[str, Any]]:
        """获取血氧数据"""
        url = f"{self.base_url}/openhealth/v1/bloodoxygen"
        params = {
            "startDate": start_date.isoformat(),
            "endDate": end_date.isoformat(),
        }

        try:
            response = await self.client.get(
                url,
                headers=self._get_headers(),
                params=params,
            )
            response.raise_for_status()
            data = response.json()
            return data.get("data", [])
        except Exception as e:
            logger.error(f"获取血氧数据失败: {e}")
            return []

    async def get_stress(
        self,
        start_date: dt.date,
        end_date: dt.date,
    ) -> list[dict[str, Any]]:
        """获取压力数据"""
        url = f"{self.base_url}/openhealth/v1/stress"
        params = {
            "startDate": start_date.isoformat(),
            "endDate": end_date.isoformat(),
        }

        try:
            response = await self.client.get(
                url,
                headers=self._get_headers(),
                params=params,
            )
            response.raise_for_status()
            data = response.json()
            return data.get("data", [])
        except Exception as e:
            logger.error(f"获取压力数据失败: {e}")
            return []

    async def close(self):
        """关闭客户端"""
        await self.client.aclose()


async def sync_huawei_health(
    access_token: str,
    refresh_token: str | None,
    is_cn: bool,
    days: int,
    db_path: str,
) -> dict[str, int]:
    """
    同步华为健康数据

    Args:
        access_token: 访问令牌
        refresh_token: 刷新令牌
        is_cn: 是否中国区
        days: 同步天数
        db_path: 数据库路径

    Returns:
        各类数据同步数量统计
    """
    client = HuaweiHealthClient(access_token, refresh_token, is_cn)

    end_date = dt.date.today()
    start_date = end_date - dt.timedelta(days=days)

    logger.info(f"开始同步华为健康数据: {start_date} ~ {end_date}")

    # 获取各类数据
    steps_data = await client.get_steps(start_date, end_date)
    logger.info(f"步数数据: {len(steps_data)} 条")

    heart_rate_data = await client.get_heart_rate(start_date, end_date)
    logger.info(f"心率数据: {len(heart_rate_data)} 条")

    sleep_data = await client.get_sleep(start_date, end_date)
    logger.info(f"睡眠数据: {len(sleep_data)} 条")

    activities_data = await client.get_activities()
    logger.info(f"运动记录: {len(activities_data)} 条")

    blood_oxygen_data = await client.get_blood_oxygen(start_date, end_date)
    logger.info(f"血氧数据: {len(blood_oxygen_data)} 条")

    stress_data = await client.get_stress(start_date, end_date)
    logger.info(f"压力数据: {len(stress_data)} 条")

    # 存入数据库
    from db import save_health_data

    save_health_data(
        db_path=db_path,
        steps=steps_data,
        heart_rate=heart_rate_data,
        sleep=sleep_data,
        activities=activities_data,
        blood_oxygen=blood_oxygen_data,
        stress=stress_data,
    )

    await client.close()

    logger.info("华为健康数据同步完成！")

    return {
        "steps": len(steps_data),
        "heart_rate": len(heart_rate_data),
        "sleep": len(sleep_data),
        "activities": len(activities_data),
        "blood_oxygen": len(blood_oxygen_data),
        "stress": len(stress_data),
    }


def main():
    parser = argparse.ArgumentParser(description="华为健康数据同步")
    parser.add_argument(
        "--access-token",
        dest="access_token",
        help="华为健康访问令牌",
    )
    parser.add_argument(
        "--refresh-token",
        dest="refresh_token",
        help="华为健康刷新令牌",
    )
    parser.add_argument(
        "--is-cn",
        dest="is_cn",
        action="store_true",
        default=True,
        help="是否为中国区账号",
    )
    parser.add_argument(
        "--days",
        dest="days",
        type=int,
        default=30,
        help="同步最近多少天的数据",
    )
    parser.add_argument(
        "--db",
        dest="db_path",
        default="run_page/data.db",
        help="数据库路径",
    )

    args = parser.parse_args()

    # 从环境变量或参数获取token
    access_token = args.access_token or os.environ.get("HUAWEI_ACCESS_TOKEN")
    refresh_token = args.refresh_token or os.environ.get("HUAWEI_REFRESH_TOKEN")
    is_cn = os.environ.get("HUAWEI_IS_CN", "true").lower() == "true"

    if not access_token:
        print("错误: 请提供访问令牌")
        print()
        print("使用方法:")
        print("  python run_page/huawei_sync.py --access-token YOUR_TOKEN")
        print("  或设置环境变量 HUAWEI_ACCESS_TOKEN")
        print()
        print("获取Token方法:")
        print("  1. 华为开发者平台: https://developer.huawei.com")
        print("  2. 抓包获取: 参考 docs/huawei-token.md")
        sys.exit(1)

    # 确保数据库目录存在
    db_path = Path(args.db_path)
    db_path.parent.mkdir(parents=True, exist_ok=True)

    # 执行同步
    result = asyncio.run(sync_huawei_health(
        access_token=access_token,
        refresh_token=refresh_token,
        is_cn=is_cn,
        days=args.days,
        db_path=str(db_path),
    ))

    print()
    print("同步结果:")
    for key, value in result.items():
        print(f"  {key}: {value} 条")


if __name__ == "__main__":
    main()