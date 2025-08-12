
import { TTKChart } from './charts/TTKChart.js';
import { DistanceChart } from './charts/DistanceChart.js';

/**
 * 图表管理器
 * 轻量级协调器，负责协调不同类型的图表
 */
export class ChartManager {
  constructor() {
    this.ttkChart = new TTKChart();
    this.distanceChart = new DistanceChart();
  }

  /**
   * 更新TTK图表
   */
  updateTtkChart(stats, params) {
    this.ttkChart.update(stats, params);
  }

  /**
   * 更新距离图表
   */
  updateDistanceChart(armed, attachments, params) {
    this.distanceChart.update(armed, attachments, params);
  }
}
