/**
 * 事件处理器
 * 负责绑定和管理所有UI事件
 */
export class EventHandler {
  constructor() {
    this.handlers = new Map();
  }

  /**
   * 绑定事件处理器
   * @param {Function} calcHandler - 计算按钮事件处理器
   * @param {Function} distChartHandler - 距离图表按钮事件处理器
   */
  bindEventHandlers(calcHandler, distChartHandler) {
    // 存储处理器引用
    this.handlers.set('calc', calcHandler);
    this.handlers.set('distChart', distChartHandler);

    // 绑定计算按钮事件
    const calcBtn = document.getElementById('calcBtn');
    if (calcBtn) {
      calcBtn.addEventListener('click', () => {
        try {
          calcHandler();
        } catch (error) {
          console.error('计算按钮事件处理错误:', error);
        }
      });
    }

    // 绑定距离图表按钮事件
    const distChartBtn = document.getElementById('distChartBtn');
    if (distChartBtn) {
      distChartBtn.addEventListener('click', () => {
        try {
          distChartHandler();
        } catch (error) {
          console.error('距离图表按钮事件处理错误:', error);
        }
      });
    }
  }

  /**
   * 解绑事件处理器
   */
  unbindEventHandlers() {
    const calcBtn = document.getElementById('calcBtn');
    const distChartBtn = document.getElementById('distChartBtn');

    if (calcBtn) {
      calcBtn.removeEventListener('click', this.handlers.get('calc'));
    }

    if (distChartBtn) {
      distChartBtn.removeEventListener('click', this.handlers.get('distChart'));
    }

    this.handlers.clear();
  }

  /**
   * 获取处理器
   * @param {string} type - 处理器类型
   * @returns {Function} 事件处理器函数
   */
  getHandler(type) {
    return this.handlers.get(type);
  }

  /**
   * 检查处理器是否已绑定
   * @param {string} type - 处理器类型
   * @returns {boolean} 是否已绑定
   */
  hasHandler(type) {
    return this.handlers.has(type);
  }
}
