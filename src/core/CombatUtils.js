/**
 * 战斗工具类
 * 包含所有战斗相关的计算公式和工具方法
 */

/**
 * 距离衰减计算器
 */
export class DistanceDecayCalculator {
  /**
   * 计算距离对应的衰减倍率
   * @param {number} distance - 距离
   * @param {Object} weapon - 武器对象
   * @returns {number} 衰减倍率
   */
  static calculate(distance, weapon) {
    const { ranges, decays } = weapon;
    // ranges: [r1, r2, r3, r4]
    // 正确的射程段划分：[0, r1), [r1, r2), [r2, r3), [r3, r4), [r4, Infinity)
    // 使用 < 而不是 <= 来确保边界正确
    if (distance < ranges[0]) return decays[0];
    if (distance < ranges[1]) return decays[1];
    if (distance < ranges[2]) return decays[2];
    if (distance < ranges[3]) return decays[3];
    return decays[4];
  }
}

/**
 * 基础伤害计算器
 */
export class BaseDamageCalculator {
  /**
   * 计算基础肉伤
   * @param {Object} weapon - 武器对象
   * @param {Object} bulletData - 子弹数据
   * @param {string} hitPart - 命中部位
   * @param {number} decay - 距离衰减
   * @returns {number} 基础肉伤
   */
  static calculate(weapon, bulletData, hitPart, decay) {
    const mult = weapon.mult[hitPart];
    const baseF = weapon.flesh * bulletData.base * mult;
    return baseF * decay;
  }
}

/**
 * 护甲减伤计算器
 */
export class ArmorDamageCalculator {
  /**
   * 计算护甲减伤后的伤害
   * @param {number} pureDamage - 纯肉伤
   * @param {number} penDamage - 穿透伤害
   * @param {number} armorDamage - 护甲伤害
   * @param {number} armorValue - 护甲值
   * @returns {Object} { finalDamage, remainingArmor }
   */
  static calculate(pureDamage, penDamage, armorDamage, armorValue) {
    if (armorDamage >= armorValue) {
      const frac = armorValue / armorDamage;
      const finalDamage = frac * penDamage + (1 - frac) * pureDamage;
      return { finalDamage, remainingArmor: 0 };
    } else {
      return { finalDamage: penDamage, remainingArmor: armorValue - armorDamage };
    }
  }
}

import { seededRandom } from '../utils/rng.js';

/**
 * 命中部位选择器
 */
export class HitPartSelector {
  /**
   * 根据命中概率随机选择命中部位
   * @param {Object} hitProb - 命中概率对象
   * @returns {string} 命中部位
   */
  static select(hitProb) {
    const rnd = seededRandom();
    let sum = 0;
    for (let key of ['head', 'chest', 'stomach', 'limbs']) {
      sum += hitProb[key];
      if (rnd <= sum) return key;
    }
    return 'chest'; // 默认值
  }
}
