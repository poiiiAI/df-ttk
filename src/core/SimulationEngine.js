import { bulletData } from '../data/bullets.js';
import { SIMULATION_CONFIG } from '../constants/config.js';
import { DistanceDecayCalculator } from './CombatUtils.js';
import { BulletStrategyFactory } from './BulletStrategy.js';
import { seededRandom } from '../utils/rng.js';

/**
 * 模拟引擎 - 负责计算击杀所需时间（TTK）
 */
export class SimulationEngine {
  /**
   * 模拟一次击杀过程
   * 
   * 核心逻辑：
   * 1. 循环射击直到目标死亡
   * 2. 每次射击有命中率判断
   * 3. 命中后根据部位计算伤害
   * 4. 连发模式下需要计算连发间隔
   * 
   * @param {Object} weapon - 武器对象
   * @param {Object} params - 游戏参数（距离、命中率、护甲等级等）
   * @param {Object} bulletStrategy - 子弹策略（控制伤害计算）
   * @returns {Object} { time: 总时间(秒), shots: 总射击数, hits: 命中数, burstIntervalTime: 连发间隔时间 }
   */
  static simulateOneTTK(weapon, params, bulletStrategy) {
    // 初始化状态
    let health = params.healthValue || 100;
    let armorState = {
      armorVal: params.armorValue,
      helmetVal: params.helmetValue
    };
    
    // 获取参数和配置
    const { bulletLevel, distance, hitProb } = params;
    const hitRate = (typeof weapon.hitRate === 'number') ? weapon.hitRate : params.hitRate;
    const bData = bulletData[bulletLevel];
    
    // 计算射击间隔（连发模式使用内部射速，全自动模式使用平均射速）
    const isBurstMode = weapon.fireMode === 'burst' && weapon.burstCount && weapon.burstInternalROF;
    const shotInterval = this._calculateShotInterval(weapon, isBurstMode);
    const decay = DistanceDecayCalculator.calculate(distance, weapon);
    
    // 统计变量
    let shots = 0;  // 总射击次数
    let hits = 0;   // 命中次数
    let burstStats = { count: 0, totalTime: 0 };  // 连发统计
    
    // 主循环：射击直到目标死亡
    while (health > 0) {
      shots++;
      
      // 连发模式：检查是否需要添加连发间隔
      if (isBurstMode) {
        this._updateBurstInterval(weapon, shots, burstStats);
      }
      
      // 命中率判断
      if (seededRandom() > hitRate) {
        // 未命中：消耗时间但继续下一发
        continue;
      }
      
      // 命中：计算伤害
      hits++;
      const { damage, newArmorState } = bulletStrategy.calculateHitDamage(
        weapon, params, bData, decay, hitProb, armorState
      );
      
      health -= damage;
      armorState = newArmorState;
    }
    
    // 计算总时间
    const flightTime = distance / weapon.velocity;
    const totalTime = this._calculateTotalTime(
      flightTime, 
      shotInterval, 
      shots, 
      isBurstMode, 
      burstStats
    );
    
    return { 
      time: totalTime, 
      shots, 
      hits, 
      burstIntervalTime: burstStats.totalTime 
    };
  }

  /**
   * 计算射击间隔（秒）
   * @private
   */
  static _calculateShotInterval(weapon, isBurstMode) {
    if (isBurstMode) {
      // 连发模式：使用内部射速（连发内部的射速）
      return 60 / weapon.burstInternalROF;
    } else {
      // 全自动模式：使用平均射速
      return 60 / weapon.rof;
    }
  }

  /**
   * 更新连发间隔统计
   * 
   * 连发间隔只在开始新连发时计算。
   * 例如三连发：第1-3发是第一个连发，第4发开始第二个连发时需要加上第一个连发的间隔。
   * 
   * @private
   */
  static _updateBurstInterval(weapon, currentShot, burstStats) {
    // 第一个连发不需要间隔
    if (currentShot <= weapon.burstCount) {
      return;
    }
    
    // 检查是否开始新连发：shots % burstCount === 1 表示开始新连发
    // 例如：三连发，第4发时 4 % 3 = 1，说明开始第二个连发
    if (currentShot % weapon.burstCount === 1) {
      burstStats.count += 1;
      burstStats.totalTime += weapon.burstInterval;
    }
  }

  /**
   * 计算总击杀时间
   * 
   * 公式：总时间 = 飞行时间 + 射击间隔时间 + 连发间隔时间
   * 
   * @private
   */
  static _calculateTotalTime(flightTime, shotInterval, totalShots, isBurstMode, burstStats) {
    // 射击间隔时间 = 间隔 × (总射击数 - 1 - 连发间隔数)
    // 说明：最后一发不需要等待间隔，连发间隔已单独计算
    const burstIntervalCount = burstStats.count;
    const shootingIntervalTime = shotInterval * (totalShots - 1 - burstIntervalCount);
    
    return flightTime + shootingIntervalTime + burstStats.totalTime;
  }
  
  /**
   * 计算平均TTK统计
   * 
   * 通过多次模拟计算平均值，以获得更稳定的TTK估算值。
   * 
   * @param {Object} weapon - 武器对象
   * @param {Object} params - 游戏参数
   * @param {number} times - 模拟次数（默认使用配置值）
   * @param {Object} bulletStrategy - 子弹策略
   * @returns {Object} {
   *   weapon: 武器对象,
   *   avgTime: 平均击杀时间(秒),
   *   avgShots: 平均射击次数,
   *   avgMisses: 平均未命中次数,
   *   avgBurstInterval: 平均连发间隔时间(秒)
   * }
   */
  static calculateAvgStats(weapon, params, times = SIMULATION_CONFIG.DEFAULT_SIM_COUNT, bulletStrategy) {
    // 累计所有模拟结果
    let totalTime = 0;
    let totalShots = 0;
    let totalMisses = 0;
    let totalBurstInterval = 0;
    
    // 执行多次模拟
    for (let i = 0; i < times; i++) {
      const result = this.simulateOneTTK(weapon, params, bulletStrategy);
      
      totalTime += result.time;
      totalShots += result.shots;
      totalMisses += (result.shots - result.hits);
      totalBurstInterval += (result.burstIntervalTime || 0);
    }
    
    // 计算平均值
    return {
      weapon: { ...weapon },
      avgTime: totalTime / times,
      avgShots: totalShots / times,
      avgMisses: totalMisses / times,
      avgBurstInterval: totalBurstInterval / times
    };
  }

  /**
   * 批量计算多个武器的TTK
   * @param {Array} weapons - 武器数组
   * @param {Array} attachments - 附件配置数组
   * @param {Object} params - 游戏参数
   * @returns {Array} 按TTK排序的结果数组
   */
  static calculateWeaponsTTK(weapons, attachments, params) {
    const results = weapons
      .map((weapon, idx) => {
        const attachment = attachments[idx];
        const realBulletKey = this.getRealBulletKey(attachment.bulletType, weapon, params);
        
        if (!realBulletKey) return null;
        
        const hitRate = attachment.hitRate ?? params.hitRate;
        const simParams = { ...params, hitRate, bulletLevel: realBulletKey };
        const strategy = BulletStrategyFactory.getStrategy(realBulletKey);
        
        const stat = this.calculateAvgStats(weapon, simParams, undefined, strategy);
        return { ...stat, weapon, name: weapon.name };
      })
      .filter(Boolean)
      .sort((a, b) => a.avgTime - b.avgTime);
    
    return results;
  }

  /**
   * 获取真实子弹类型
   * @param {string|null} selectedBulletType - 用户选择的子弹类型
   * @param {Object} weapon - 武器对象
   * @param {Object} params - 游戏参数
   * @returns {string|null} 真实子弹类型
   */
  static getRealBulletKey(selectedBulletType, weapon, params) {
    if (selectedBulletType) return selectedBulletType;
    
    const allowed = weapon.allowedBullets || [];
    return allowed.includes(params.bulletLevel) ? params.bulletLevel : null;
  }
}

// 向后兼容的导出
export const getDecay = DistanceDecayCalculator.calculate;
export const simulateOneTTK = SimulationEngine.simulateOneTTK.bind(SimulationEngine);
