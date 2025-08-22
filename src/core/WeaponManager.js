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
    
    // 只保存原始基础属性，不保存已计算状态
    const clonedWeapon = {
      ...originalWeapon,        // 原始基础属性
      name: `${originalWeapon.name} [副本${cloneNumber}]`,
      isClone: true,
      originalIndex: originalIndex,
      cloneNumber: cloneNumber,
      attachmentConfig: { ...attachmentConfig }
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
      
      let rangeMult = 1.0;
      {
        const barrelRange = barrel ? barrel.rangeMult : 1.0;
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
      
      return {
        ...w,
        velocity: w.velocity * velocityMult,
        ranges: w.ranges.map(r => r * rangeMult),
        rof: w.rof * rofMult,
        flesh: w.flesh + damageBonus,
        armor: w.armor + armorDamageBonus,
        hitRate: hitRate != null ? hitRate : w.hitRate
      };
    });

    // 处理副本武器（使用保存的配置快照）
    const armedClonedWeapons = this.clonedWeapons.map(clone => {   
      const { barrelIndex, muzzleIndex, hitRate } = clone.attachmentConfig;
      
      const barrel = barrelIndex > 0 ? clone.barrels[barrelIndex - 1] : null;
      const muzzle = muzzleIndex > 0 ? this.muzzles[muzzleIndex] : null;
      
      let rangeMult = 1.0;
      {
        const barrelRange = barrel ? barrel.rangeMult : 1.0;
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
      
      const result = {
        ...clone,
        velocity: clone.velocity * velocityMult,
        ranges: clone.ranges.map(r => r * rangeMult),
        rof: clone.rof * rofMult,
        flesh: clone.flesh + damageBonus,
        armor: clone.armor + armorDamageBonus,
        hitRate: hitRate != null ? hitRate : clone.hitRate
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
    
    let rangeMult = 1.0;
    {
      const barrelRange = barrel ? barrel.rangeMult : 1.0;
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
    
    const calculatedData = {
      velocity: Math.round(clone.velocity * velocityMult),
      ranges: clone.ranges.map(r => Math.round(r * rangeMult)),
      rof: Math.round(clone.rof * rofMult * 100) / 100, 
      flesh: Math.round(clone.flesh + damageBonus),
      armor: Math.round(clone.armor + armorDamageBonus),
      hitRate: hitRate != null ? hitRate : clone.hitRate
    };
        
    return calculatedData;
  }
}
