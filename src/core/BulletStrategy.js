import { BaseDamageCalculator, HitPartSelector, ArmorDamageCalculator } from './CombatUtils.js';

/**
 * RIP子弹策略 - 命中全部算四肢，命中率用用户/全局设置
 */
export class RIPBulletStrategy {
  /**
   * 计算单次命中伤害
   * @param {Object} weapon - 武器对象
   * @param {Object} params - 游戏参数
   * @param {Object} bulletData - 子弹数据
   * @param {number} decay - 距离衰减
   * @param {Object} hitProb - 命中概率对象（RIP子弹忽略此参数）
   * @param {Object} armorState - 护甲状态 { armorVal, helmetVal }
   * @returns {Object} { damage, newArmorState }
   */
  static calculateHitDamage(weapon, params, bulletData, decay, hitProb, armorState) {
    // 命中全部算四肢
    const { armorLevel } = params;
    const { armorVal } = armorState;
    // 四肢基础伤害
    const pureDamage = BaseDamageCalculator.calculate(weapon, bulletData, 'limbs', decay);
    // 四肢不受护甲影响
    return { damage: pureDamage, newArmorState: { ...armorState } };
  }
}

/**
 * 双头弹策略 - 肉伤固定为74，甲伤固定为11，依然受射程衰减影响
 */
export class DoubleBulletStrategy {
  /**
   * 计算单次命中伤害
   * @param {Object} weapon - 武器对象
   * @param {Object} params - 游戏参数
   * @param {Object} bulletData - 子弹数据
   * @param {number} decay - 距离衰减
   * @param {Object} hitProb - 命中概率对象
   * @param {Object} armorState - 护甲状态 { armorVal, helmetVal }
   * @returns {Object} { damage, newArmorState }
   */
  static calculateHitDamage(weapon, params, bulletData, decay, hitProb, armorState) {
    const { armorLevel, helmetLevel } = params;
    const { armorVal, helmetVal } = armorState;
    
    // 选择命中部位
    const hitPart = HitPartSelector.select(hitProb);
    
    // 双头弹：肉伤固定为74，甲伤固定为11，依然受射程衰减和部位倍率影响
    const fixedFleshDamage = 74;
    const fixedArmorDamage = 11;
    
    // 计算受射程衰减和部位倍率影响后的肉伤
    const mult = weapon.mult[hitPart];
    const pureDamage = fixedFleshDamage * mult * decay;
    
    // 计算穿透伤害（使用子弹数据中的穿透系数）
    const penArmor = bulletData.armor[armorLevel].pen;
    const penHelmet = bulletData.armor[helmetLevel].pen;
    const penF = pureDamage * (hitPart === 'head' ? penHelmet : penArmor);
    
    let finalDamage;
    let newArmorState = { ...armorState };
    
    if (hitPart === 'limbs') {
      // 四肢：直接纯肉伤，无护甲减伤
      finalDamage = pureDamage;
    } else if (hitPart === 'head') {
      // 头部：走头盔减伤逻辑，使用固定的甲伤
      if (helmetVal <= 0) {
        // 头盔已破，直接造成纯肉伤
        finalDamage = pureDamage;
      } else {
        const aMultHelmet = bulletData.armor[helmetLevel].armorMult;
        const helmetD = fixedArmorDamage * aMultHelmet;
        const result = ArmorDamageCalculator.calculate(pureDamage, penF, helmetD, helmetVal);
        finalDamage = result.finalDamage;
        newArmorState.helmetVal = result.remainingArmor;
      }
    } else {
      // 胸部和腹部：走护甲减伤逻辑，使用固定的甲伤
      if (armorVal <= 0) {
        // 护甲已破，直接造成纯肉伤
        finalDamage = pureDamage;
      } else {
        const aMultArmor = bulletData.armor[armorLevel].armorMult;
        const armorD = fixedArmorDamage * aMultArmor;
        const result = ArmorDamageCalculator.calculate(pureDamage, penF, armorD, armorVal);
        finalDamage = result.finalDamage;
        newArmorState.armorVal = result.remainingArmor;
      }
    }
    
    return { damage: finalDamage, newArmorState };
  }
}

/**
 * 标准子弹策略
 */
export class StandardBulletStrategy {
  /**
   * 计算单次命中伤害
   * @param {Object} weapon - 武器对象
   * @param {Object} params - 游戏参数
   * @param {Object} bulletData - 子弹数据
   * @param {number} decay - 距离衰减
   * @param {Object} hitProb - 命中概率对象
   * @param {Object} armorState - 护甲状态 { armorVal, helmetVal }
   * @returns {Object} { damage, newArmorState }
   */
  static calculateHitDamage(weapon, params, bulletData, decay, hitProb, armorState) {
    const { armorLevel, helmetLevel } = params;
    const { armorVal, helmetVal } = armorState;
    
    // 选择命中部位
    const hitPart = HitPartSelector.select(hitProb);
    
    // 计算基础伤害
    const pureDamage = BaseDamageCalculator.calculate(weapon, bulletData, hitPart, decay);
    
    // 计算穿透伤害
    const penArmor = bulletData.armor[armorLevel].pen;
    const penHelmet = bulletData.armor[helmetLevel].pen;
    const penF = pureDamage * (hitPart === 'head' ? penHelmet : penArmor);
    
    let finalDamage;
    let newArmorState = { ...armorState };
    
    if (hitPart === 'limbs') {
      // 四肢：直接纯肉伤，无护甲减伤
      finalDamage = pureDamage;
    } else if (hitPart === 'head') {
      // 头部：走头盔减伤逻辑
      const aMultHelmet = bulletData.armor[helmetLevel].armorMult;
      const helmetD = weapon.armor * aMultHelmet;
      const result = ArmorDamageCalculator.calculate(pureDamage, penF, helmetD, helmetVal);
      finalDamage = result.finalDamage;
      newArmorState.helmetVal = result.remainingArmor;
    } else {
      // 胸部和腹部：走护甲减伤逻辑
      const aMultArmor = bulletData.armor[armorLevel].armorMult;
      const armorD = weapon.armor * aMultArmor;
      const result = ArmorDamageCalculator.calculate(pureDamage, penF, armorD, armorVal);
      finalDamage = result.finalDamage;
      newArmorState.armorVal = result.remainingArmor;
    }
    
    return { damage: finalDamage, newArmorState };
  }
}

/**
 * 子弹策略工厂
 */
export class BulletStrategyFactory {
  static getStrategy(bulletType) {
    // 检查是否为RIP子弹
    if (bulletType && /RIP/i.test(bulletType)) {
      return RIPBulletStrategy;
    }
    // 检查是否为双头弹
    if (bulletType === 'Double') {
      return DoubleBulletStrategy;
    }
    // 默认使用标准策略
    return StandardBulletStrategy;
  }
}
