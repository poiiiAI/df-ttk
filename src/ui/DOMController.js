import { WeaponManager } from '../core/WeaponManager.js';
import { ViewRenderer } from './ViewRenderer.js';

/**
 * DOM控制器
 * 负责DOM操作、数据读取和协调其他组件
 */
export class DOMController {
  constructor() {
    this.weaponManager = new WeaponManager();
    this.viewRenderer = new ViewRenderer();
  }

  /**
   * 读取页面参数
   * @returns {Object} 页面参数对象
   */
  readPageParams() {
    const toNum = id => Number(document.getElementById(id).value);
    const params = {
      bulletLevel: toNum('bulletLevel'),
      armorLevel: toNum('armorLevel'),
      armorValue: toNum('armorValue'),
      helmetLevel: toNum('helmetLevel'),
      helmetValue: toNum('helmetValue'),
      distance: toNum('distance'),
      hitProb: {},
      hitRate: toNum('hitRate'),
      triggerDelayEnable: document.getElementById('triggerDelayEnable').checked,
      muzzlePrecisionEnable: document.getElementById('muzzlePrecisionEnable').checked
    };
    
    // 读取命中概率
    const hitKeys = ['head', 'chest', 'stomach', 'limbs'];
    hitKeys.forEach(key => {
      const el = document.getElementById('p' + key.charAt(0).toUpperCase() + key.slice(1));
      params.hitProb[key] = Number(el.value);
    });
    
    return params;
  }

  /**
   * 读取每把枪的子弹类型选择
   * @returns {Array} 每把枪的子弹类型（未选为null）
   */
  readWeaponBullets() {
    const bulletSelects = document.querySelectorAll('.bulletSel');
    return Array.from(bulletSelects).map(sel => sel.value || null);
  }

  /**
   * 收集附件选择数据
   * @returns {Object} 包含 barrelValues, muzzleValues, hitRateValues 的对象
   */
  collectAttachmentData() {
    const barrelValues = Array.from(document.querySelectorAll('.barrelSel')).map(el => el.value);
    const muzzleValues = Array.from(document.querySelectorAll('.muzzleSel')).map(el => el.value);
    const hitRateValues = Array.from(document.querySelectorAll('.hitRateInput')).map(el => el.value || '');
    
    return { barrelValues, muzzleValues, hitRateValues };
  }

  /**
   * 渲染附件选择表格
   */
  renderAttachmentTable() {
    const weapons = this.weaponManager.getWeapons();
    const muzzles = this.weaponManager.getMuzzles();
    
    this.viewRenderer.renderAttachmentTable(weapons, muzzles, () => {
      this.updateWeaponStats();
    });
  }

  /**
   * 更新武器统计数据（当附件选择变化时调用）
   */
  updateWeaponStats() {
    // 获取当前选中的附件配置，包括子弹类型选择
    const bulletTypes = this.readWeaponBullets();
    const { barrelValues, muzzleValues, hitRateValues } = this.collectAttachmentData();
    
    // 构建完整的附件数据对象
    const attachments = {
      barrelValues,
      muzzleValues,
      hitRateValues,
      bulletTypes
    };
    
    // 获取页面参数
    const params = this.readPageParams();
    
    // 使用WeaponManager计算武器统计数据
    const attachmentConfigs = this.weaponManager.readAttachmentsWithBullet(
      barrelValues, 
      muzzleValues, 
      hitRateValues, 
      bulletTypes
    );
    const updatedWeapons = this.weaponManager.applyAttachments(attachmentConfigs, params);
    
    // 使用ViewRenderer更新视图
    this.viewRenderer.updateWeaponStats(updatedWeapons);
  }

  /**
   * 显示错误信息
   * @param {string} message - 错误信息
   */
  showError(message) {
    alert(message);
  }

  /**
   * 获取图表上下文
   * @param {string} chartId - 图表ID
   * @returns {CanvasRenderingContext2D} 图表上下文
   */
  getChartContext(chartId) {
    return document.getElementById(chartId).getContext('2d');
  }
}
