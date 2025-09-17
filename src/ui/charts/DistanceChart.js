import { 
  TIME_UNITS, 
  CHART_CONFIG, 
  SIMULATION_CONFIG 
} from '../../constants/config.js';
import { SimulationEngine } from '../../core/SimulationEngine.js';
import { BulletStrategyFactory } from '../../core/BulletStrategy.js';
import { formatTime } from '../../utils/formatters.js';

/**
 * 垂直线插件
 * 在距离图表上绘制垂直参考线
 */
const verticalLinePlugin = {
  id: 'verticalLine',
  afterDraw(chart) {
    const ctx = chart.ctx;
    const tooltip = chart.tooltip;
    if (!tooltip._active || !tooltip._active.length) return;

    // 当前激活点的 x 坐标
    const x = tooltip._active[0].element.x;
    const yTop = chart.scales.y.top;
    const yBottom = chart.scales.y.bottom;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, yTop);
    ctx.lineTo(x, yBottom);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(33, 15, 199, 0.89)';
    ctx.stroke();
    ctx.restore();
  }
};

/**
 * 距离折线图专用类
 */
export class DistanceChart {
  constructor() {
    this.chart = null;
  }

  /**
   * 更新距离图表
   */
  update(armed, attachments, params) {
    // 生成1米精度的距离点 [0, 1, 2, ..., 100]
    const distances = Array.from({ length: 101 }, (_, i) => i);
    
    // 计算每个武器在不同距离下的TTK
    const stats = this.calculateDistanceStats(armed, attachments, params, distances);
    stats.sort((a, b) => a.avg35 - b.avg35);

    this.renderChart(distances, stats);
  }

  /**
   * 计算距离统计数据
   */
  calculateDistanceStats(armed, attachments, params, distances) {
    return armed.map((w, idx) => {
      // 获取子弹类型和命中率
      const selectedBulletType = attachments[idx].bulletType;
      let realBulletKey = SimulationEngine.getRealBulletKey(selectedBulletType, w, params);
      
      if (!realBulletKey) return null;
      
      const hitRate = attachments[idx].hitRate != null ? attachments[idx].hitRate : params.hitRate;
      const strategy = BulletStrategyFactory.getStrategy(realBulletKey);
      
      // 获取武器的关键射程点
      const validRanges = w.ranges.filter(r => r !== Infinity && r <= CHART_CONFIG.MAX_DISTANCE);
      const keyDistances = [0, ...validRanges];
      
      // 创建模拟结果缓存
      const simulationCache = new Map();
      
      // 先在关键射程点进行模拟
      keyDistances.forEach(distance => {
        const simParams = { ...params, distance, hitRate, bulletLevel: realBulletKey };
        const { avgTime } = SimulationEngine.calculateAvgStats(w, simParams, SIMULATION_CONFIG.DISTANCE_SIM_COUNT, strategy);
        const trigger = params.triggerDelayEnable ? w.triggerDelay / TIME_UNITS.SECONDS_TO_MS : 0;
        simulationCache.set(distance, avgTime + trigger);
      });
      
      // 然后计算所有距离点的TTK
      const times = distances.map(d => {
        if (simulationCache.has(d)) {
          return simulationCache.get(d);
        } else {
          return this.calculateTTKByFormula(w, d, params, strategy, simulationCache);
        }
      });
      
      const cutoff = distances.findIndex(d => d > CHART_CONFIG.CUTOFF_DISTANCE);
      const slice = cutoff === -1 ? times : times.slice(0, cutoff);
      const avg35 = slice.reduce((s, t) => s + t, 0) / slice.length;
      
      return { weapon: w, times, avg35 };
    }).filter(Boolean);
  }

  /**
   * 渲染距离图表
   */
  renderChart(distances, stats) {
    const datasets = stats.map((s, i) => ({
      label: s.weapon.name,
      data: s.times,
      fill: false,
      tension: 0,
      hidden: i >= CHART_CONFIG.TOP_WEAPONS_COUNT,
      pointRadius: 0,
      pointHoverRadius: 3,
    }));

    if (this.chart) this.chart.destroy();
    
    const distCtx = this.getChartContext('distanceChart');
    this.chart = new Chart(distCtx, {
      type: 'line',
      data: { labels: distances, datasets },
      options: {
        scales: {
          x: { title: { display: true, text: '距离 (m)' } },
          y: { 
            beginAtZero: true, 
            title: { display: true, text: '平均 TTK' }, 
            ticks: { callback: v => formatTime(v, 'ms_raw') } 
          }
        },
        plugins: {
          datalabels: { display: false },
          tooltip: {
            mode: 'index', 
            intersect: false, 
            itemSort: (a, b) => a.parsed.y - b.parsed.y, 
            callbacks: {
              title: items => `${items[0].label}m`,
              label: i => `${i.dataset.label}: ${formatTime(i.raw, 'ms')}`
            }
          },
          legend: { position: 'bottom', labels: { usePointStyle: true } }
        },
        hover: {
          mode: 'index',
          intersect: false
        },
        interaction: {
          mode: 'index',
          intersect: false
        }
      },
      plugins: [ChartDataLabels, verticalLinePlugin]
    });
  }

  /**
   * 使用公式计算TTK
   */
  calculateTTKByFormula(weapon, distance, params, strategy, simulationCache) {
    // 使用缓存中的关键点，选择不大于当前距离的最近关键点作为段起点
    const keys = Array.from(simulationCache.keys()).filter(k => k <= distance);
    const startDistance = keys.length ? Math.max(...keys) : 0;
    const startTTK = simulationCache.get(startDistance);
    
    if (!startTTK) {
      console.error('缓存中缺少关键点数据:', { startDistance, startTTK });
      return 0;
    }
    
    if (distance === startDistance) {
      return startTTK;
    }
    
    const flightTimeDiff = (distance - startDistance) / weapon.velocity;
    return startTTK + flightTimeDiff;
  }

  /**
   * 获取图表上下文
   */
  getChartContext(chartId) {
    return document.getElementById(chartId).getContext('2d');
  }

  /**
   * 销毁图表
   */
  destroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}
