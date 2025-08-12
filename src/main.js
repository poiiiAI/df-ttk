import { SimulationEngine } from './core/SimulationEngine.js';
import { WeaponManager } from './core/WeaponManager.js';
import { BulletStrategyFactory } from './core/BulletStrategy.js';
import { ChartManager } from './ui/ChartManager.js';
import { DOMController } from './ui/DOMController.js';
import { EventHandler } from './ui/EventHandler.js';
import { validateHitProb, validateWeaponHitRates, validatePageParams } from './utils/validators.js';

/**
 * 应用主控制器
 * 负责协调各个模块，处理用户交互和业务逻辑
 */
class AppController {
  constructor() {
    this.initialize();
  }

  /**
   * 初始化应用
   */
  initialize() {
    try {
      // 初始化各个模块
      this.domController = new DOMController();
      this.chartManager = new ChartManager();
      this.weaponManager = new WeaponManager();
      this.eventHandler = new EventHandler();

      // 初始化 UI
      this.domController.renderAttachmentTable();
      
      // 绑定事件处理器
      this.eventHandler.bindEventHandlers(
        () => this.handleCalculate(),
        () => this.handleDistanceChart()
      );

      console.log('应用初始化完成');
    } catch (error) {
      console.error('应用初始化失败:', error);
      this.domController.showError('应用初始化失败: ' + error.message);
    }
  }

  /**
   * 处理计算按钮点击
   */
  handleCalculate() {
    try {
      const { params, armed, attachments } = this.prepareWeaponData();
      const results = SimulationEngine.calculateWeaponsTTK(armed, attachments, params);
      this.chartManager.updateTtkChart(results, params);
    } catch (error) {
      this.handleError('计算失败', error);
    }
  }

  /**
   * 处理距离图表按钮点击
   */
  handleDistanceChart() {
    try {
      const { params, armed, attachments } = this.prepareWeaponData();
      this.chartManager.updateDistanceChart(armed, attachments, params);
    } catch (error) {
      this.handleError('距离图表生成失败', error);
    }
  }

  /**
   * 准备武器数据的公共方法
   * @returns {Object} { params, armed, attachments }
   */
  prepareWeaponData() {
    // 1. 读取和验证参数
    const params = this.domController.readPageParams();
    validatePageParams(params);
    validateHitProb(params);

    // 2. 读取武器配置
    const bulletTypes = this.domController.readWeaponBullets();
    const { barrelValues, muzzleValues, hitRateValues } = this.domController.collectAttachmentData();
    
    // 3. 应用附件
    const attachmentConfigs = this.weaponManager.readAttachmentsWithBullet(
      barrelValues, 
      muzzleValues, 
      hitRateValues, 
      bulletTypes
    );
    
    // 验证命中率（使用正确的附件配置格式）
    const weapons = this.weaponManager.getWeapons();
    validateWeaponHitRates(attachmentConfigs, weapons);
    
    const armed = this.weaponManager.applyAttachments(attachmentConfigs, params);

    return { params, armed, attachments: attachmentConfigs };
  }

  /**
   * 统一错误处理方法
   * @param {string} operation - 操作名称
   * @param {Error} error - 错误对象
   */
  handleError(operation, error) {
    this.domController.showError(error.message);
    console.error(`${operation}:`, error);
  }


  
}

// 启动应用
const app = new AppController();

// 导出应用实例（用于调试）
window.app = app;
