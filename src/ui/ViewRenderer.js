import { formatRanges } from '../utils/formatters.js';

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
   */
  renderAttachmentTable(weapons, muzzles, onAttachmentChange) {
    const tbody = document.querySelector('#attachmentTable tbody');
    tbody.innerHTML = '';
    
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
        <td>${this.createSelectHTML('barrelSel', idx, barrelItems, defaultBarrelIndex + 1)}</td>
        <td>${this.createSelectHTML('muzzleSel', idx, muzzleItems, 0)}</td>
        <td>${this.createSelectHTML('bulletSel', idx, bulletItems, 0)}</td>
        <td><input type="number" data-weapon="${idx}" class="hitRateInput" min="0" max="1" step="0.01" /></td>
      `;
      tbody.appendChild(tr);
    });
    
    // 绑定事件监听器
    this.bindAttachmentChangeListeners(onAttachmentChange);
  }

  /**
   * 更新武器统计数据
   * @param {Array} weapons - 更新后的武器数据
   */
  updateWeaponStats(weapons) {
    weapons.forEach((weapon, idx) => {
      // 更新射速
      const rofCell = document.querySelector(`.currentRof[data-weapon="${idx}"]`);
      if (rofCell) rofCell.textContent = Math.round(weapon.rof);
      
      // 更新初速
      const velocityCell = document.querySelector(`.currentVelocity[data-weapon="${idx}"]`);
      if (velocityCell) velocityCell.textContent = Math.round(weapon.velocity);
      
      // 更新射程
      const rangesCell = document.querySelector(`.currentRanges[data-weapon="${idx}"]`);
      if (rangesCell) rangesCell.textContent = formatRanges(weapon.ranges.map(r => Math.round(r)));
      
      // 更新基础伤害
      const fleshCell = document.querySelector(`.currentFlesh[data-weapon="${idx}"]`);
      if (fleshCell) fleshCell.textContent = weapon.flesh;
      
      // 更新护甲伤害
      const armorCell = document.querySelector(`.currentArmor[data-weapon="${idx}"]`);
      if (armorCell) armorCell.textContent = weapon.armor;
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
    console.log('Binding attachment change listeners...');
    
    // 监听枪管选择变化
    const barrelSelects = document.querySelectorAll('.barrelSel');
    barrelSelects.forEach(select => {
      select.addEventListener('change', () => {
        console.log('Barrel selection changed:', select.value);
        onAttachmentChange();
      });
    });
    
    // 监听枪口选择变化
    const muzzleSelects = document.querySelectorAll('.muzzleSel');
    muzzleSelects.forEach(select => {
      select.addEventListener('change', () => {
        console.log('Muzzle selection changed:', select.value);
        onAttachmentChange();
      });
    });
    
    // 监听枪口初速满精校复选框变化
    const muzzlePrecisionCheckbox = document.getElementById('muzzlePrecisionEnable');
    if (muzzlePrecisionCheckbox) {
      muzzlePrecisionCheckbox.addEventListener('change', () => {
        console.log('Muzzle precision checkbox changed:', muzzlePrecisionCheckbox.checked);
        onAttachmentChange();
      });
    }
    
    // 监听子弹类型选择变化
    const bulletSelects = document.querySelectorAll('.bulletSel');
    bulletSelects.forEach(select => {
      select.addEventListener('change', () => {
        console.log('Bullet selection changed:', select.value);
        onAttachmentChange();
      });
    });
  }
}
