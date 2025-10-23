import { bulletData } from '../data/bullets.js';
import { SIMULATION_CONFIG } from '../constants/config.js';
import { DistanceDecayCalculator } from './CombatUtils.js';
import { BulletStrategyFactory } from './BulletStrategy.js';
import { seededRandom } from '../utils/rng.js';

/**
 * 模拟引擎
 */
export class SimulationEngine {
  /**
   * 模拟一次击杀
   * @param {Object} weapon - 武器对象
   * @param {Object} params - 游戏参数
   * @param {Object} bulletStrategy - 子弹策略（默认为标准策略）
   * @returns {Object} 包含 time, shots, hits 的结果对象
   */
  static simulateOneTTK(weapon, params, bulletStrategy) {
    let health = params.healthValue || 100;
    let armorState = {
      armorVal: params.armorValue,
      helmetVal: params.helmetValue
    };
    
    const { bulletLevel, distance, hitProb } = params;
    const globalHitRate = params.hitRate;
    const hitRate = (typeof weapon.hitRate === 'number') ? weapon.hitRate : globalHitRate;
    const bData = bulletData[bulletLevel];
    const interval = 60 / weapon.rof;
    const decay = DistanceDecayCalculator.calculate(distance, weapon);
    
    let shots = 0, hits = 0;
    
    while (health > 0) {
      shots++;
      if (seededRandom() > hitRate) {
        // 未命中：只消耗一次间隔，继续下一发
        continue;
      }
      hits++;
      
      // 由子弹策略完全控制命中部位选择和伤害计算
      const { damage, newArmorState } = bulletStrategy.calculateHitDamage(
        weapon, params, bData, decay, hitProb, armorState
      );
      
      health -= damage;
      armorState = newArmorState;
    }
    
    const flight = distance / weapon.velocity;
    const time = flight + interval * (shots - 1);
    return { time, shots, hits };
  }
  
  /**
   * 计算平均 TTK 统计
   * @param {Object} weapon - 武器对象
   * @param {Object} params - 游戏参数
   * @param {number} times - 模拟次数
   * @param {Object} bulletStrategy - 子弹策略
   * @returns {Object} 包含 avgTime, avgShots, avgMisses 的统计结果
   */
  static calculateAvgStats(weapon, params, times = SIMULATION_CONFIG.DEFAULT_SIM_COUNT, bulletStrategy) {
    let totalTime = 0, totalShots = 0, totalMisses = 0;
    for (let i = 0; i < times; i++) {
      const { time, shots, hits } = this.simulateOneTTK(weapon, params, bulletStrategy);
      totalTime += time;
      totalShots += shots;
      totalMisses += (shots - hits);
    }
    return {
      weapon: { ...weapon },
      avgTime: totalTime / times,
      avgShots: totalShots / times,
      avgMisses: totalMisses / times
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
