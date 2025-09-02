/**
 * 缓存管理器
 * 负责用户参数配置的自动保存和加载
 */
export class CacheManager {
  constructor() {
    this.storageKey = 'ttk_calculator_config';
    this.defaultConfig = this.getDefaultConfig();
  }

  /**
   * 获取默认配置
   * @returns {Object} 默认配置对象
   */
  getDefaultConfig() {
    return {
      bulletLevel: 4,
      armorLevel: 4,
      armorValue: 80,
      helmetLevel: 4,
      helmetValue: 35,
      distance: 30,
      hitProb: {
        head: 0.18,
        chest: 0.3,
        stomach: 0.22,
        limbs: 0.3
      },
      hitRate: 0.85,
      triggerDelayEnable: true,
      muzzlePrecisionEnable: true,
      globalBarrelType: 'longest'
    };
  }

  /**
   * 保存配置到本地存储
   * @param {Object} config - 要保存的配置对象
   */
  saveConfig(config) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(config));
    } catch (error) {
      console.error('保存配置失败:', error);
    }
  }

  /**
   * 从本地存储加载配置
   * @returns {Object} 加载的配置对象，如果失败则返回默认配置
   */
  loadConfig() {
    try {
      const savedConfig = localStorage.getItem(this.storageKey);
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        // 合并默认配置和保存的配置，确保新字段有默认值
        return { ...this.defaultConfig, ...parsedConfig };
      }
    } catch (error) {
      console.error('加载配置失败:', error);
    }
    return this.defaultConfig;
  }
}
