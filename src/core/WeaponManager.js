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
  }

  readAttachmentsWithBullet(barrelValues, muzzleValues, hitRateValues, bulletTypes) {
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
    return this.weapons.map((w, idx) => {
      const { barrelIndex, muzzleIndex, hitRate } = attachments[idx];
      
      const barrel = barrelIndex > 0 ? w.barrels[barrelIndex - 1] : null;
      const muzzle = muzzleIndex > 0 ? this.muzzles[muzzleIndex] : null;
      
      let rangeMult = 1.0;
      if (barrel) {
        rangeMult *= barrel.rangeMult;
      }
      if (muzzle) {
        rangeMult *= (1 + muzzle.mult);
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
}
