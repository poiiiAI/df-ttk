import { formatRanges, formatMultipliers } from '../utils/formatters.js';

/**
 * 视图渲染器
 * 负责武器表格的渲染和更新
 */
export class ViewRenderer {
  /**
   * 渲染附件选择表格
   * @param {Array} weapons - 武器数据
   * @param {Array} muzzles - 枪口数据
   * @param {Function} onAttachmentChange - 附件变化回调
   * @param {Array} clonedWeapons - 副本武器数据
   * @param {Function} onAddClone - 添加副本回调
   * @param {Function} onRemoveClone - 删除副本回调
   */
  renderAttachmentTable(weapons, muzzles, onAttachmentChange, clonedWeapons = [], onAddClone = null, onRemoveClone = null) {
    const tbody = document.querySelector('#attachmentTable tbody');
    tbody.innerHTML = '';
    
    // 渲染原始武器
    weapons.forEach((w, idx) => {
      // 默认选 rangeMult 最大的枪管
      const defaultBarrelIndex = w.barrels.reduce((best, cur, curIdx) => 
        cur.rangeMult > w.barrels[best].rangeMult ? curIdx : best, 
        0
      );
      const barrelItems = [{ name: '无', rangeMult: 0 }, ...w.barrels];
      const muzzleItems = muzzles;
      const bulletItems = w.allowedBullets || [];

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${w.name}</td>
        <td>${w.type}</td>
        <td class="currentRof" data-weapon="${idx}">${w.rof}</td>
        <td class="currentVelocity" data-weapon="${idx}">${w.velocity}</td>
        <td class="currentRanges" data-weapon="${idx}">${formatRanges(w.ranges)}</td>
        <td class="currentFlesh" data-weapon="${idx}">${w.flesh}</td>
        <td class="currentArmor" data-weapon="${idx}">${w.armor}</td>
        <td class="multipliers">${formatMultipliers(w.mult)}</td>
        <td>${this.createSelectHTML('barrelSel', idx, barrelItems, defaultBarrelIndex + 1)}</td>
        <td>${this.createSelectHTML('muzzleSel', idx, muzzleItems, 0)}</td>
        <td>${this.createSelectHTML('bulletSel', idx, bulletItems, 0)}</td>
        <td><input type="number" data-weapon="${idx}" class="hitRateInput" min="0" max="1" step="0.01" /></td>
        <td>${this.createActionButton(idx, 'add', onAddClone)}</td>
      `;
      tbody.appendChild(tr);
    });
    
    // 渲染副本武器
    clonedWeapons.forEach((clone, cloneIdx) => {
      const tr = document.createElement('tr');
      tr.className = 'clone-row';
      tr.innerHTML = `
        <td>${clone.name}</td>
        <td>${clone.type}</td>
        <td class="currentRof" data-clone="${cloneIdx}">${clone.rof}</td>
        <td class="currentVelocity" data-clone="${cloneIdx}">${clone.velocity}</td>
        <td class="currentRanges" data-clone="${cloneIdx}">${formatRanges(clone.ranges)}</td>
        <td class="currentFlesh" data-clone="${cloneIdx}">${clone.flesh}</td>
        <td class="currentArmor" data-clone="${cloneIdx}">${clone.armor}</td>
        <td class="multipliers" data-clone="${cloneIdx}">${formatMultipliers(clone.mult)}</td>
        <td>${clone.attachmentConfig.barrelIndex > 0 ? clone.barrels[clone.attachmentConfig.barrelIndex - 1].name : '无'}</td>
        <td>${clone.attachmentConfig.muzzleIndex > 0 ? muzzles[clone.attachmentConfig.muzzleIndex].name : '无'}</td>
        <td>${clone.attachmentConfig.bulletType || '全局'}</td>
        <td>${clone.attachmentConfig.hitRate || ''}</td>
        <td>${this.createActionButton(cloneIdx, 'remove', onRemoveClone)}</td>
      `;
      tbody.appendChild(tr);
    });
    
    // 绑定事件监听器
    this.bindAttachmentChangeListeners(onAttachmentChange);
    
    // 绑定副本操作按钮事件
    this.bindCloneActionListeners(onAddClone, onRemoveClone);
  }

  /**
   * 创建操作按钮（加号或减号）
   * @param {number} index - 武器或副本索引
   * @param {string} type - 按钮类型：'add' 或 'remove'
   * @param {Function} callback - 回调函数
   * @returns {string} 按钮HTML
   */
  createActionButton(index, type, callback) {
    if (type === 'add') {
      return `<button class="add-clone-btn" data-weapon="${index}" title="添加副本">+</button>`;
    } else {
      return `<button class="remove-clone-btn" data-clone="${index}" title="删除副本">-</button>`;
    }
  }

  /**
   * 绑定副本操作按钮事件
   * @param {Function} onAddClone - 添加副本回调
   * @param {Function} onRemoveClone - 删除副本回调
   */
  bindCloneActionListeners(onAddClone, onRemoveClone) {
    if (onAddClone) {
      const addButtons = document.querySelectorAll('.add-clone-btn');
      addButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const weaponIndex = parseInt(e.target.dataset.weapon);
          onAddClone(weaponIndex);
        });
      });
    }

    if (onRemoveClone) {
      const removeButtons = document.querySelectorAll('.remove-clone-btn');
      removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const cloneIndex = parseInt(e.target.dataset.clone);
          onRemoveClone(cloneIndex);
        });
      });
    }
  }

  /**
   * 更新武器统计数据（包括副本）
   * @param {Array} allWeapons - 所有武器数据（原始+副本）
   */
  updateWeaponStats(allWeapons) {
    allWeapons.forEach((weapon, idx) => {
      const isClone = weapon.isClone;
      
      if (isClone) {
        // 更新副本武器数据
        const cloneIndex = idx - allWeapons.length + weapon.originalIndex;
        const rofCell = document.querySelector(`.currentRof[data-clone="${cloneIndex}"]`);
        if (rofCell) rofCell.textContent = Math.round(weapon.rof);
        
        const velocityCell = document.querySelector(`.currentVelocity[data-clone="${cloneIndex}"]`);
        if (velocityCell) velocityCell.textContent = Math.round(weapon.velocity);
        
        const rangesCell = document.querySelector(`.currentRanges[data-clone="${cloneIndex}"]`);
        if (rangesCell) rangesCell.textContent = formatRanges(weapon.ranges.map(r => Math.round(r)));
        
        const fleshCell = document.querySelector(`.currentFlesh[data-clone="${cloneIndex}"]`);
        if (fleshCell) fleshCell.textContent = weapon.flesh;
        
        const armorCell = document.querySelector(`.currentArmor[data-clone="${cloneIndex}"]`);
        if (armorCell) armorCell.textContent = weapon.armor;

        const multipliersCell = document.querySelector(`.multipliers[data-clone="${cloneIndex}"]`);
        if (multipliersCell) multipliersCell.textContent = formatMultipliers(weapon.mult);
      } else {
        // 更新原始武器数据
        const rofCell = document.querySelector(`.currentRof[data-weapon="${idx}"]`);
        if (rofCell) rofCell.textContent = Math.round(weapon.rof);
        
        const velocityCell = document.querySelector(`.currentVelocity[data-weapon="${idx}"]`);
        if (velocityCell) velocityCell.textContent = Math.round(weapon.velocity);
        
        const rangesCell = document.querySelector(`.currentRanges[data-weapon="${idx}"]`);
        if (rangesCell) rangesCell.textContent = formatRanges(weapon.ranges.map(r => Math.round(r)));
        
        const fleshCell = document.querySelector(`.currentFlesh[data-weapon="${idx}"]`);
        if (fleshCell) fleshCell.textContent = weapon.flesh;
        
        const armorCell = document.querySelector(`.currentArmor[data-weapon="${idx}"]`);
        if (armorCell) armorCell.textContent = weapon.armor;

        const multipliersCell = document.querySelector(`.multipliers[data-weapon="${idx}"]`);
        if (multipliersCell) multipliersCell.textContent = formatMultipliers(weapon.mult);
      }
    });
  }

  /**
   * 创建下拉框HTML
   */
  createSelectHTML(className, index, items, defaultIndex) {
    let options;
    
    if (className === 'bulletSel') {
      // 子弹类型选择框特殊处理
      options = ['<option value="">全局</option>']
        .concat(items.map(item => `<option value="${item}">${item}</option>`))
        .join('');
    } else {
      // 枪管和枪口选择框
      options = items.map((item, itemIndex) => {
        const selected = itemIndex === defaultIndex ? ' selected' : '';
        // 对于枪管和枪口，特殊处理"无"选项，使用-1表示无附件
        const value = itemIndex === 0 ? 
          `${item.name}|-1` : `${item.name}|${itemIndex}`;
        return `<option value="${value}"${selected}>${item.name}</option>`;
      }).join('');
    }
    
    return `<select data-weapon="${index}" class="${className}">${options}</select>`;
  }

  /**
   * 绑定附件选择变化的事件监听器
   */
  bindAttachmentChangeListeners(onAttachmentChange) {
    // 监听枪管选择变化
    const barrelSelects = document.querySelectorAll('.barrelSel');
    barrelSelects.forEach(select => {
      select.addEventListener('change', () => {
        onAttachmentChange();
      });
    });
    
    // 监听枪口选择变化
    const muzzleSelects = document.querySelectorAll('.muzzleSel');
    muzzleSelects.forEach(select => {
      select.addEventListener('change', () => {
        onAttachmentChange();
      });
    });
    
    // 监听枪口初速满精校复选框变化
    const muzzlePrecisionCheckbox = document.getElementById('muzzlePrecisionEnable');
    if (muzzlePrecisionCheckbox) {
      muzzlePrecisionCheckbox.addEventListener('change', () => {
        onAttachmentChange();
      });
    }
    
    // 监听子弹类型选择变化
    const bulletSelects = document.querySelectorAll('.bulletSel');
    bulletSelects.forEach(select => {
      select.addEventListener('change', () => {
        onAttachmentChange();
      });
    });
  }
}
