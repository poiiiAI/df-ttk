import { WeaponManager } from '../core/WeaponManager.js';
import { ViewRenderer } from './ViewRenderer.js';

/**
 * DOM控制器
 * 负责DOM操作、数据读取和协调其他组件
 */
export class DOMController {
  constructor(weaponManager) { // 接收外部传入的 weaponManager
    this.weaponManager = weaponManager; // 使用外部实例
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
    const clonedWeapons = this.weaponManager.getClonedWeapons();
    
    this.viewRenderer.renderAttachmentTable(
      weapons, 
      muzzles, 
      () => this.updateWeaponStats(),
      clonedWeapons,
      (weaponIndex) => this.handleAddClone(weaponIndex),
      (cloneIndex) => this.handleRemoveClone(cloneIndex)
    );
    
    setTimeout(() => {
      this.updateWeaponStats();
    }, 0);
  }

  /**
   * 处理添加副本
   * @param {number} weaponIndex - 原始武器索引
   */
  handleAddClone(weaponIndex) {
    if (!this.weaponManager.canAddClone()) {
      alert('最多添加5个副本~');
      return;
    }

    // 获取当前武器的附件配置
    const bulletTypes = this.readWeaponBullets();
    const { barrelValues, muzzleValues, hitRateValues } = this.collectAttachmentData();
    
    const attachmentConfig = {
      barrelIndex: this.parseBarrelIndex(barrelValues[weaponIndex]),
      muzzleIndex: this.parseMuzzleIndex(muzzleValues[weaponIndex]),
      hitRate: hitRateValues[weaponIndex] === '' ? null : Number(hitRateValues[weaponIndex]),
      bulletType: bulletTypes[weaponIndex]
    };

    // 直接从页面上读取已经计算好的数据
    const currentWeaponState = this.readCurrentWeaponState(weaponIndex);

    // 添加副本（传入已计算的状态）
    if (this.weaponManager.addClone(weaponIndex, attachmentConfig, currentWeaponState)) {
      // 只添加副本行，不重新渲染整个表格
      this.addCloneRow(weaponIndex, attachmentConfig);
      // 更新统计数据
      this.updateWeaponStats();
    }
  }

  /**
   * 处理删除副本
   * @param {number} cloneIndex - 副本索引
   */
  handleRemoveClone(cloneIndex) {
    this.weaponManager.removeClone(cloneIndex);
    // 只删除对应的副本行
    this.removeCloneRow(cloneIndex);
    // 更新统计数据
    this.updateWeaponStats();
  }

  /**
   * 解析枪管索引
   * @param {string} barrelValue - 枪管选择值
   * @returns {number} 枪管索引
   */
  parseBarrelIndex(barrelValue) {
    if (!barrelValue) return 0;
    const [, index] = barrelValue.split('|').map(Number);
    return index === -1 ? 0 : index;
  }

  /**
   * 解析枪口索引
   * @param {string} muzzleValue - 枪口选择值
   * @returns {number} 枪口索引
   */
  parseMuzzleIndex(muzzleValue) {
    if (!muzzleValue) return 0;
    const [, index] = muzzleValue.split('|').map(Number);
    return index === -1 ? 0 : index;
  }

  /**
   * 从页面上读取当前武器的状态（已经应用了附件）
   * @param {number} weaponIndex - 武器索引
   * @returns {Object} 当前武器状态
   */
  readCurrentWeaponState(weaponIndex) {
    // 直接从页面上读取已经计算好的数据
    const rof = Number(document.querySelector(`.currentRof[data-weapon="${weaponIndex}"]`).textContent);
    const velocity = Number(document.querySelector(`.currentVelocity[data-weapon="${weaponIndex}"]`).textContent);
    const rangesText = document.querySelector(`.currentRanges[data-weapon="${weaponIndex}"]`).textContent;
    const flesh = Number(document.querySelector(`.currentFlesh[data-weapon="${weaponIndex}"]`).textContent);
    const armor = Number(document.querySelector(`.currentArmor[data-weapon="${weaponIndex}"]`).textContent);
    
    // 解析射程文本（格式：59, 100, ∞, ∞）
    const ranges = rangesText.split(',').map(r => {
      const trimmed = r.trim();
      if (trimmed === '∞' || trimmed === 'Infinity') {
        return Infinity;
      }
      const num = Number(trimmed);
      if (isNaN(num)) {
        return 0; 
      }
      return num;
    });
    
    // 获取原始武器作为基础（用于其他属性）
    const weapons = this.weaponManager.getWeapons();
    const originalWeapon = weapons[weaponIndex];
    
    return {
      ...originalWeapon,
      rof: rof,
      velocity: velocity,
      ranges: ranges,
      flesh: flesh,
      armor: armor
    };
  }

  /**
   * 添加副本行到表格
   * @param {number} weaponIndex - 原始武器索引
   * @param {Object} attachmentConfig - 附件配置
   */
  addCloneRow(weaponIndex, attachmentConfig) {
    const weapons = this.weaponManager.getWeapons();
    const muzzles = this.weaponManager.getMuzzles();
    const clonedWeapons = this.weaponManager.getClonedWeapons();
    
    // 找到刚添加的副本
    const newClone = clonedWeapons[clonedWeapons.length - 1];
    const cloneIndex = clonedWeapons.length - 1;
    
    // 获取页面参数，用于初速精校计算
    const params = this.readPageParams();
    
    // 计算显示数据，传入参数
    const displayData = this.weaponManager.calculateCloneDisplayData(newClone, params);
    
    const tbody = document.querySelector('#attachmentTable tbody');
    const tr = document.createElement('tr');
    tr.className = 'clone-row';
    tr.innerHTML = `
      <td>${newClone.name}</td>
      <td>${newClone.type}</td>
      <td class="currentRof" data-clone="${cloneIndex}">${displayData.rof}</td>
      <td class="currentVelocity" data-clone="${cloneIndex}">${displayData.velocity}</td>
      <td class="currentRanges" data-clone="${cloneIndex}">${this.formatRanges(displayData.ranges)}</td>
      <td class="currentFlesh" data-clone="${cloneIndex}">${displayData.flesh}</td>
      <td class="currentArmor" data-clone="${cloneIndex}">${displayData.armor}</td>
      <td>${attachmentConfig.barrelIndex > 0 ? weapons[weaponIndex].barrels[attachmentConfig.barrelIndex - 1].name : '无'}</td>
      <td>${attachmentConfig.muzzleIndex > 0 ? muzzles[attachmentConfig.muzzleIndex].name : '无'}</td>
      <td>${attachmentConfig.bulletType || '全局'}</td>
      <td>${attachmentConfig.hitRate || ''}</td>
      <td><button class="remove-clone-btn" data-clone="${cloneIndex}" title="删除副本">-</button></td>
    `;
    tbody.appendChild(tr);
    
    // 绑定删除按钮事件
    const removeBtn = tr.querySelector('.remove-clone-btn');
    removeBtn.addEventListener('click', () => this.handleRemoveClone(cloneIndex));
  }

  /**
   * 删除副本行
   * @param {number} cloneIndex - 副本索引
   */
  removeCloneRow(cloneIndex) {
    // 找到对应的副本行并删除
    const cloneRows = document.querySelectorAll('.clone-row');
    if (cloneRows[cloneIndex]) {
      cloneRows[cloneIndex].remove();
    }
    
    // 重新编号剩余的副本行
    this.renumberCloneRows();
  }

  /**
   * 重新编号副本行
   */
  renumberCloneRows() {
    const cloneRows = document.querySelectorAll('.clone-row');
    cloneRows.forEach((row, index) => {
      // 更新data-clone属性
      const cells = row.querySelectorAll('[data-clone]');
      cells.forEach(cell => {
        cell.setAttribute('data-clone', index);
      });
      
      // 更新删除按钮的data-clone属性
      const removeBtn = row.querySelector('.remove-clone-btn');
      if (removeBtn) {
        removeBtn.setAttribute('data-clone', index);
        // 重新绑定事件
        removeBtn.onclick = () => this.handleRemoveClone(index);
      }
    });
  }

  /**
   * 格式化射程显示
   */
  formatRanges(ranges) {
    return ranges.map(r => r === Infinity ? '∞' : Math.round(r)).join(', ');
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
