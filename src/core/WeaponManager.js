import { weapons, muzzles } from '../data/weapons.js';
import { MUZZLE_PRECISION_BONUS } from '../constants/config.js';

/**
 * 武器管理器
 * 负责武器的附件应用、属性计算和状态管理
 */
export class WeaponManager {
  constructor() {
    this.weapons = weapons;
    this.muzzles = muzzles;
    this.clonedWeapons = []; // 新增：副本武器数组
    this.maxClones = 5; // 新增：最大副本数量
  }

  /**
   * 添加武器副本
   * @param {number} originalIndex - 原始武器索引
   * @param {Object} attachmentConfig - 当前附件配置
   * @param {Object} currentState - 当前武器状态（已应用附件）
   * @returns {boolean} 是否添加成功
   */
  addClone(originalIndex, attachmentConfig, currentState) {
    if (this.clonedWeapons.length >= this.maxClones) {
      return false;
    }

    const originalWeapon = this.weapons[originalIndex];
    const cloneNumber = this.getNextCloneNumber(originalIndex);
    
    // 获取当前武器的精校值
    const slider = document.querySelector(`.velocity-precision-slider[data-weapon="${originalIndex}"]`);
    const currentPrecision = slider ? parseFloat(slider.value) : 0;
    
    // 只保存原始基础属性，不保存已计算状态
    const clonedWeapon = {
      ...originalWeapon,        // 原始基础属性
      name: `${originalWeapon.name} [副本${cloneNumber}]`,
      isClone: true,
      originalIndex: originalIndex,
      cloneNumber: cloneNumber,
      attachmentConfig: { 
        ...attachmentConfig,
        velocityPrecision: currentPrecision
      }
    };

    this.clonedWeapons.push(clonedWeapon);
    return true;
  }

  /**
   * 删除武器副本
   * @param {number} cloneIndex - 副本在clonedWeapons数组中的索引
   */
  removeClone(cloneIndex) {
    if (cloneIndex >= 0 && cloneIndex < this.clonedWeapons.length) {
      // 删除副本
      this.clonedWeapons.splice(cloneIndex, 1);
      // 重新编号副本
      this.renumberClones();
    }
  }

  /**
   * 获取下一个副本编号
   * @param {number} originalIndex - 原始武器索引
   * @returns {number} 下一个副本编号
   */
  getNextCloneNumber(originalIndex) {
    // 获取下一个副本编号
    const existingClones = this.clonedWeapons.filter(
      clone => clone.originalIndex === originalIndex
    );
    return existingClones.length + 1;
  }

  /**
   * 重新编号副本
   */
  renumberClones() {
    const cloneGroups = {};
    // 重新编号副本
    // 按原始武器分组
    this.clonedWeapons.forEach(clone => {
      if (!cloneGroups[clone.originalIndex]) {
        cloneGroups[clone.originalIndex] = [];
      }
      cloneGroups[clone.originalIndex].push(clone);
    });

    // 重新编号
    Object.values(cloneGroups).forEach(clones => {
      clones.forEach((clone, index) => {
        clone.cloneNumber = index + 1;
        clone.name = `${this.weapons[clone.originalIndex].name} [副本${clone.cloneNumber}]`;
      });
    });
  }

  /**
   * 获取所有武器（原始+副本）
   * @returns {Array} 所有武器数组
   */
  getAllWeapons() {
    return [...this.weapons, ...this.clonedWeapons];
  }

  /**
   * 获取武器的枪口初速精校值
   * @param {number} weaponIndex - 武器索引
   * @param {boolean} isClone - 是否为副本
   * @param {Object} params - 游戏参数
   * @returns {number} 精校值（-0.09到0.09）
   */
  getWeaponVelocityPrecision(weaponIndex, isClone, params) {
    // 优先使用武器特定的精校值
    if (isClone) {
      const clone = this.clonedWeapons[weaponIndex];
      if (clone && clone.attachmentConfig && clone.attachmentConfig.velocityPrecision !== undefined) {
        return clone.attachmentConfig.velocityPrecision;
      }
    } else {
      // 从DOM获取原始武器的精校值
      const slider = document.querySelector(`.velocity-precision-slider[data-weapon="${weaponIndex}"]`);
      if (slider) {
        return parseFloat(slider.value);
      }
    }
    
    // 默认返回0（无精校）
    return 0;
  }


  /**
   * 获取副本武器
   * @returns {Array} 副本武器数组
   */
  getClonedWeapons() {
    // 获取副本武器
    return this.clonedWeapons;
  }

  /**
   * 检查是否可以添加更多副本
   * @returns {boolean} 是否可以添加
   */
  canAddClone() {
    return this.clonedWeapons.length < this.maxClones;
  }

  readAttachmentsWithBullet(barrelValues, muzzleValues, hitRateValues, bulletTypes) {
    // 只处理原始武器的附件配置
    return this.weapons.map((w, i) => {
      // 添加安全检查，防止数组越界或undefined值
      const barrelValue = barrelValues[i] || '';
      const muzzleValue = muzzleValues[i] || '';
      
      const [, barrelIndex] = barrelValue.split('|').map(Number);
      const [, muzzleIndex] = muzzleValue.split('|').map(Number);
      const hitRate = hitRateValues[i] === '' ? null : Number(hitRateValues[i]);
      const bulletType = bulletTypes ? bulletTypes[i] : null;
      
      const normalizedBarrelIndex = barrelIndex === -1 ? 0 : barrelIndex;
      const normalizedMuzzleIndex = muzzleIndex === -1 ? 0 : muzzleIndex;
      
      return { barrelIndex: normalizedBarrelIndex, muzzleIndex: normalizedMuzzleIndex, hitRate, bulletType };
    });
  }

  applyAttachments(attachments, params) {
    // === applyAttachments 开始 ===
    // 当前 clonedWeapons 数量和内容
    
    // 处理原始武器
    const armedOriginalWeapons = this.weapons.map((w, idx) => {
      const { barrelIndex, muzzleIndex, hitRate } = attachments[idx];
      
      const barrel = barrelIndex > 0 ? w.barrels[barrelIndex - 1] : null;
      const muzzle = muzzleIndex > 0 ? this.muzzles[muzzleIndex] : null;
      
      // 射程倍率：若枪管提供 rangeAdd，则忽略枪管倍率，仅应用枪口倍率
      let rangeMult = 1.0;
      {
        const hasRangeAdd = barrel && typeof barrel.rangeAdd === 'number';
        const barrelRange = hasRangeAdd ? 1.0 : (barrel ? barrel.rangeMult : 1.0);
        const muzzleAdd = muzzle ? muzzle.mult : 0.0;
        rangeMult *= (barrelRange + muzzleAdd);
      }
      
      let velocityMult = rangeMult;
      // 获取武器特定的精校值（不管是否安装枪管都应用）
      const precisionValue = this.getWeaponVelocityPrecision(idx, false, params);
      velocityMult *= (1 + precisionValue);
      
      let rofMult = barrel ? barrel.rofMult : 1.0;
      let damageBonus = barrel ? barrel.damageBonus : 0;
      let armorDamageBonus = barrel ? barrel.armorDamageBonus : 0;
      
      // 仅加法：部位倍率与扳机延迟
      const partAdd = barrel && barrel.partMultAdd ? barrel.partMultAdd : null;
      const newMult = { ...w.mult };
      if (partAdd) {
        for (const k in partAdd) newMult[k] = (newMult[k] ?? 1) + partAdd[k];
      }
      const baseTrigger = w.triggerDelay || 0;
      const delayDelta = barrel && typeof barrel.triggerDelayDelta === 'number' ? barrel.triggerDelayDelta : 0;
      const newTriggerDelay = Math.max(0, Math.round(baseTrigger + delayDelta));
      
      // 按加法或倍率计算射程与初速
      const hasRangeAdd = barrel && typeof barrel.rangeAdd === 'number';
      const hasVelocityAdd = barrel && typeof barrel.velocityAdd === 'number';
      const newRanges = hasRangeAdd
        ? w.ranges.map(r => (r === Infinity ? Infinity : Math.round(r * rangeMult + barrel.rangeAdd)))
        : w.ranges.map(r => r * rangeMult);
      const newVelocity = hasVelocityAdd
        ? Math.round((w.velocity + barrel.velocityAdd) * velocityMult)
        : w.velocity * velocityMult;

      return {
        ...w,
        velocity: newVelocity,
        ranges: newRanges,
        rof: w.rof * rofMult,
        flesh: w.flesh + damageBonus,
        armor: w.armor + armorDamageBonus,
        hitRate: hitRate != null ? hitRate : w.hitRate,
        triggerDelay: newTriggerDelay,
        mult: newMult
      };
    });

    // 处理副本武器（使用保存的配置快照）
    const armedClonedWeapons = this.clonedWeapons.map((clone, cloneIdx) => {   
      const { barrelIndex, muzzleIndex, hitRate } = clone.attachmentConfig;
      
      const barrel = barrelIndex > 0 ? clone.barrels[barrelIndex - 1] : null;
      const muzzle = muzzleIndex > 0 ? this.muzzles[muzzleIndex] : null;
      
      // 射程倍率：若枪管提供 rangeAdd，则忽略枪管倍率，仅应用枪口倍率
      let rangeMult = 1.0;
      {
        const hasRangeAdd = barrel && typeof barrel.rangeAdd === 'number';
        const barrelRange = hasRangeAdd ? 1.0 : (barrel ? barrel.rangeMult : 1.0);
        const muzzleAdd = muzzle ? muzzle.mult : 0.0;
        rangeMult *= (barrelRange + muzzleAdd);
      }
      
      let velocityMult = rangeMult;
      // 获取武器特定的精校值（不管是否安装枪管都应用）
      const precisionValue = this.getWeaponVelocityPrecision(cloneIdx, true, params);
      velocityMult *= (1 + precisionValue);
      
      let rofMult = barrel ? barrel.rofMult : 1.0;
      let damageBonus = barrel ? barrel.damageBonus : 0;
      let armorDamageBonus = barrel ? barrel.armorDamageBonus : 0;
      
      // 仅加法：部位倍率与扳机延迟（副本）
      const partAdd = barrel && barrel.partMultAdd ? barrel.partMultAdd : null;
      const newMult = { ...clone.mult };
      if (partAdd) {
        for (const k in partAdd) newMult[k] = (newMult[k] ?? 1) + partAdd[k];
      }
      const baseTrigger = clone.triggerDelay || 0;
      const delayDelta = barrel && typeof barrel.triggerDelayDelta === 'number' ? barrel.triggerDelayDelta : 0;
      const newTriggerDelay = Math.max(0, Math.round(baseTrigger + delayDelta));
      
      // 按加法或倍率计算射程与初速（副本）
      const hasRangeAdd = barrel && typeof barrel.rangeAdd === 'number';
      const hasVelocityAdd = barrel && typeof barrel.velocityAdd === 'number';
      const newRanges = hasRangeAdd
        ? clone.ranges.map(r => (r === Infinity ? Infinity : Math.round(r * rangeMult + barrel.rangeAdd)))
        : clone.ranges.map(r => r * rangeMult);
      const newVelocity = hasVelocityAdd
        ? Math.round((clone.velocity + barrel.velocityAdd) * velocityMult)
        : clone.velocity * velocityMult;

      const result = {
        ...clone,
        velocity: newVelocity,
        ranges: newRanges,
        rof: clone.rof * rofMult,
        flesh: clone.flesh + damageBonus,
        armor: clone.armor + armorDamageBonus,
        hitRate: hitRate != null ? hitRate : clone.hitRate,
        triggerDelay: newTriggerDelay,
        mult: newMult
      };
      
      return result;
    });
    
    // armedClonedWeapons 和长度

    // 返回合并后的武器数组
    const finalResult = [...armedOriginalWeapons, ...armedClonedWeapons];
    // 最终合并结果和长度
    
    return finalResult;
  }

  /**
   * 获取武器数据
   * @returns {Array} 武器数据数组
   */
  getWeapons() {
    return this.weapons;
  }

  /**
   * 获取枪口数据
   * @returns {Array} 枪口数据数组
   */
  getMuzzles() {
    return this.muzzles;
  }

  /**
   * 验证武器命中率是否在有效范围内
   * @param {Array} attachments - 武器附件配置数组
   * @returns {boolean} 验证是否通过
   * @throws {Error} 当命中率超出范围时抛出错误
   */
  validateWeaponHitRates(attachments) {
    for (let i = 0; i < attachments.length; i++) {
      const { hitRate } = attachments[i];
      if (hitRate != null && (hitRate < 0 || hitRate > 1)) {
        throw new Error(`武器 ${i + 1} 的命中率必须在 0 到 1 之间`);
      }
    }
    return true;
  }

  /**
   * 计算副本武器的显示数据（用于详细列表显示）
   * @param {Object} clone - 副本武器对象
   * @param {Object} params - 游戏参数（包含 muzzlePrecisionEnable）
   * @returns {Object} 计算后的显示数据
   */
  calculateCloneDisplayData(clone, params = {}) {
    const { barrelIndex, muzzleIndex, hitRate } = clone.attachmentConfig;
    
    const barrel = barrelIndex > 0 ? clone.barrels[barrelIndex - 1] : null;
    const muzzle = muzzleIndex > 0 ? this.muzzles[muzzleIndex] : null;
    
    // 展示：若枪管提供 rangeAdd，则忽略枪管倍率，仅应用枪口倍率
    let rangeMult = 1.0;
    {
      const hasRangeAdd = barrel && typeof barrel.rangeAdd === 'number';
      const barrelRange = hasRangeAdd ? 1.0 : (barrel ? barrel.rangeMult : 1.0);
      const muzzleAdd = muzzle ? muzzle.mult : 0.0;
      rangeMult *= (barrelRange + muzzleAdd);
    }
    
    let velocityMult = rangeMult;
    if (params.muzzlePrecisionEnable && barrel) {
      velocityMult *= MUZZLE_PRECISION_BONUS;
    }
    
    let rofMult = barrel ? barrel.rofMult : 1.0;
    let damageBonus = barrel ? barrel.damageBonus : 0;
    let armorDamageBonus = barrel ? barrel.armorDamageBonus : 0;
    
    // 展示用：仅加法的部位倍率与扳机延迟
    const partAdd = barrel && barrel.partMultAdd ? barrel.partMultAdd : null;
    const displayMult = { ...clone.mult };
    if (partAdd) {
      for (const k in partAdd) displayMult[k] = (displayMult[k] ?? 1) + partAdd[k];
    }
    const baseTrigger = clone.triggerDelay || 0;
    const delayDelta = barrel && typeof barrel.triggerDelayDelta === 'number' ? barrel.triggerDelayDelta : 0;
    const displayTriggerDelay = Math.max(0, Math.round(baseTrigger + delayDelta));

    const hasRangeAdd = barrel && typeof barrel.rangeAdd === 'number';
    const hasVelocityAdd = barrel && typeof barrel.velocityAdd === 'number';
    const displayRanges = hasRangeAdd
      ? clone.ranges.map(r => (r === Infinity ? Infinity : Math.round(r * rangeMult + barrel.rangeAdd)))
      : clone.ranges.map(r => Math.round(r * rangeMult));
    const displayVelocity = hasVelocityAdd
      ? Math.round((clone.velocity + barrel.velocityAdd) * velocityMult)
      : Math.round(clone.velocity * velocityMult);

    const calculatedData = {
      velocity: displayVelocity,
      ranges: displayRanges,
      rof: Math.round(clone.rof * rofMult * 100) / 100, 
      flesh: Math.round(clone.flesh + damageBonus),
      armor: Math.round(clone.armor + armorDamageBonus),
      hitRate: hitRate != null ? hitRate : clone.hitRate,
      mult: displayMult,
      triggerDelay: displayTriggerDelay
    };
        
    return calculatedData;
  }
}
