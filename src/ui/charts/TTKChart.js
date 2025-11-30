import { 
  TIME_UNITS, 
  CHART_COLORS, 
  RANK_COLORS, 
  CHART_CONFIG 
} from '../../constants/config.js';
import { formatTime } from '../../utils/formatters.js';

/**
 * TTK柱状图专用类
 */
export class TTKChart {
  constructor() {
    this.lastResults = [];
    this.previousResults = [];
    this.chart = null;
    this.initialize();
  }

  initialize() {
    this.registerPlugins();
    this.createChart();
  }

  registerPlugins() {
    const rankDelayPlugin = {
      id: 'rankDelayPlugin',
      afterDatasetsDraw: (chart) => this.drawRankDelayPlugin(chart)
    };
    Chart.register(rankDelayPlugin);
    
    if (typeof ChartDataLabels === 'undefined') {
      setTimeout(() => this.registerPlugins(), 100);
      return;
    }
    Chart.register(ChartDataLabels);
  }

  createChart() {
    const ttkCtx = this.getChartContext('ttkChart');
    this.chart = new Chart(ttkCtx, {
      type: 'bar',
      data: {
        labels: [], 
      datasets: [
        { label: '无空枪射击延迟', backgroundColor: CHART_COLORS.NO_MISS_FIRE, data: [] },
        { label: '平均连发间隔', backgroundColor: CHART_COLORS.BURST_INTERVAL, data: [] },
        { label: '平均空枪延迟', backgroundColor: CHART_COLORS.EMPTY_DELAY, data: [] },
        { label: '飞行延迟', backgroundColor: CHART_COLORS.FLIGHT_DELAY, data: [] },
        { label: '扳机延迟', backgroundColor: CHART_COLORS.TRIGGER_DELAY, data: [] }
      ]
      },
      options: {
        layout: { padding: { top: CHART_CONFIG.PADDING_TOP } },
        plugins: {
          datalabels: { 
            display: ctx => ctx.datasetIndex === 4, 
            anchor: 'end', 
            align: 'end', 
            color: '#000', 
            formatter: (value, ctx) => this.formatTTKLabel(value, ctx)
          },
          tooltip: { 
            mode: 'index', 
            intersect: false, 
            callbacks: this.getTooltipCallbacks()
          }
        },
        responsive: true,
        scales: {
          x: { stacked: true },
          y: { 
            stacked: true, 
            beginAtZero: true, 
            ticks: { callback: v => formatTime(v, 'ms') } 
          }
        }
      }
    });
  }

  update(stats, params) {
    this.previousResults = this.lastResults.slice();
    const newResults = stats.map(stat => this.calculateDelays(stat, params));
    newResults.sort((a, b) => a.totalTime - b.totalTime);
    this.calculateRankChanges(newResults);
    this.lastResults = newResults;
    this.updateChartData(newResults);
  }

  /**
   * 计算TTK的各个组成部分
   * 
   * 将平均TTK时间分解为：
   * - 飞行延迟：子弹飞行时间
   * - 无空枪射击延迟：命中之间的间隔时间
   * - 连发间隔：连发之间的间隔时间（仅连发模式）
   * - 平均空枪延迟：未命中导致的延迟
   * - 扳机延迟：开火前的延迟
   * 
   * 关键：从 avgTime 反推各部分，确保各部分之和等于 avgTime
   * 
   * @param {Object} stats - 统计结果 { weapon, avgTime, avgShots, avgMisses, avgBurstInterval }
   * @param {Object} params - 参数 { distance, triggerDelayEnable }
   * @returns {Object} 包含各部分延迟的结果对象
   */
  calculateDelays(stats, params) {
    const { weapon, avgTime, avgShots, avgMisses, avgBurstInterval } = stats;
    
    // 基础延迟计算
    const flight = params.distance / weapon.velocity;
    const triggerDelay = params.triggerDelayEnable ? weapon.triggerDelay / 1000 : 0;
    const burstInterval = avgBurstInterval || 0;
    
    // 判断是否为连发模式
    const isBurstMode = weapon.fireMode === 'burst' && weapon.burstCount && weapon.burstInternalROF;
    
    // 计算射击延迟（命中延迟 + 空枪延迟）
    const { noMissFireDelay, emptyDelay } = this._calculateShootingDelays(
      weapon, avgTime, avgShots, avgMisses, flight, burstInterval, isBurstMode
    );
    
    return { 
      name: weapon.name, 
      weapon, 
      noMissFireDelay, 
      flight, 
      emptyDelay, 
      burstInterval,
      triggerDelay, 
      avgShots, 
      totalTime: avgTime + triggerDelay
    };
  }

  /**
   * 计算射击延迟（命中间隔 + 空枪间隔）
   * 
   * 核心思路：
   * 1. 从 avgTime 反推所有间隔时间：allIntervalTime = avgTime - flight - burstInterval
   * 2. 将所有间隔时间按命中/空枪比例分配
   * 
   * @private
   */
  _calculateShootingDelays(weapon, avgTime, avgShots, avgMisses, flight, burstInterval, isBurstMode) {
    // 从总时间中减去已知部分，得到所有间隔时间
    const allIntervalTime = isBurstMode 
      ? avgTime - flight - burstInterval
      : avgTime - flight;
    
    // 无空枪时，所有间隔时间都是命中间隔
    if (avgMisses === 0) {
      return { noMissFireDelay: allIntervalTime, emptyDelay: 0 };
    }
    
    // 有空枪时，按比例分配
    if (isBurstMode) {
      return this._calculateBurstModeDelays(weapon, avgShots, avgMisses, allIntervalTime);
    } else {
      return this._calculateAutoModeDelays(avgShots, avgMisses, allIntervalTime);
    }
  }

  /**
   * 计算连发模式下的射击延迟
   * @private
   */
  _calculateBurstModeDelays(weapon, avgShots, avgMisses, allIntervalTime) {
    // 计算连发间隔数量
    const burstIntervalCount = Math.floor((avgShots - 1) / weapon.burstCount);
    // 计算总间隔数（不包括连发间隔，因为已经单独计算了）
    const totalIntervalCount = (avgShots - 1) - burstIntervalCount;
    
    if (totalIntervalCount <= 0) {
      return { noMissFireDelay: 0, emptyDelay: 0 };
    }
    
    // 按空枪比例分配间隔时间
    // 限制missRatio在[0, 1]范围内，防止avgMisses超过totalIntervalCount时产生负值
    const missRatio = Math.min(1, Math.max(0, avgMisses / totalIntervalCount));
    const emptyDelay = allIntervalTime * missRatio;
    const noMissFireDelay = allIntervalTime * (1 - missRatio);
    
    return { noMissFireDelay, emptyDelay };
  }

  /**
   * 计算全自动模式下的射击延迟
   * @private
   */
  _calculateAutoModeDelays(avgShots, avgMisses, allIntervalTime) {
    const totalIntervalCount = avgShots - 1;
    
    if (totalIntervalCount <= 0) {
      return { noMissFireDelay: 0, emptyDelay: 0 };
    }
    
    // 按空枪比例分配间隔时间
    // 限制missRatio在[0, 1]范围内，防止avgMisses超过totalIntervalCount时产生负值
    const missRatio = Math.min(1, Math.max(0, avgMisses / totalIntervalCount));
    const emptyDelay = allIntervalTime * missRatio;
    const noMissFireDelay = allIntervalTime * (1 - missRatio);
    
    return { noMissFireDelay, emptyDelay };
  }

  calculateRankChanges(newResults) {
    newResults.forEach((r, newIdx) => {
      const oldIdx = this.previousResults.findIndex(o => o.name === r.name);
      if (oldIdx >= 0) {
        r.rankChange = newIdx - oldIdx;
        r.delayChange = Math.round((r.totalTime - this.previousResults[oldIdx].totalTime) * TIME_UNITS.SECONDS_TO_MS);
      } else {
        r.rankChange = 0;
        r.delayChange = 0;
      }
    });
  }

  updateChartData(newResults) {
    this.chart.data.labels = newResults.map(r => r.name);
    // 修复：keys顺序要与数据集顺序匹配
    const keys = ['noMissFireDelay', 'burstInterval', 'emptyDelay', 'flight', 'triggerDelay'];
    this.chart.data.datasets.forEach((ds, i) => {
      ds.data = newResults.map(r => r[keys[i]]);
    });
    this.chart.update();
  }

  drawRankDelayPlugin(chart) {
    if (chart.config.type !== 'bar') return;
    
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(4);
    
    meta.data.forEach((bar, i) => {
      const r = this.lastResults[i];
      if (!r) return;
      
      const rank = r.rankChange;
      let rankText, rankColor;
      
      if (rank === 0) {
        rankText = '0';
        rankColor = RANK_COLORS.NO_CHANGE;
      } else if (rank > 0) {
        rankText = `↓${Math.abs(rank)}`;
        rankColor = RANK_COLORS.RANK_DOWN;
      } else {
        rankText = `↑${Math.abs(rank)}`;
        rankColor = RANK_COLORS.RANK_UP;
      }

      const delay = r.delayChange;
      let delayText = delay === 0 ? '0' : (delay > 0 ? '+' + delay : delay.toString());

      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      const x = bar.x;
      const y = bar.y;

      ctx.fillStyle = RANK_COLORS.NO_CHANGE;
      ctx.fillText(delayText, x, y - 40);
      
      ctx.fillStyle = rankColor;
      ctx.fillText(rankText, x, y - 55);
    });
  }

  getChartContext(chartId) {
    return document.getElementById(chartId).getContext('2d');
  }

  formatTTKLabel(value, ctx) {
    const totals = this.lastResults.map(r => r.totalTime);
    const sum = totals[ctx.dataIndex];
    const best = Math.min(...totals);
    const pct = Math.round((sum / best) * 100);
    return `${pct}%\n${formatTime(sum, 'ms_raw')}`;
  }

  getTooltipCallbacks() {
    return {
      title: items => items[0].label,
      label: ctx => `${ctx.dataset.label}: ${formatTime(ctx.raw, 'ms')}`,
      afterBody: items => {
        const idx = items[0].dataIndex;
        const r = this.lastResults[idx];
        const currentRank = idx + 1;
        const totalWeapons = this.lastResults.length;
        
        // 判断是否为半自动武器（连发模式）
        const isSemiAuto = r.weapon.fireMode === 'burst' && r.weapon.burstCount && r.weapon.burstInternalROF;
        
        const tooltipLines = [
          `当前排名: ${currentRank}/${totalWeapons}`,
          `子弹初速: ${Math.round(r.weapon.velocity)} m/s`,
          `肉伤: ${r.weapon.flesh}`,
          `甲伤: ${r.weapon.armor}`,
          `射速: ${r.weapon.rof}`,
          `平均致死枪数: ${r.avgShots.toFixed(2)}`
        ];
        
        // 半自动武器时显示连发间隔和内部射速
        if (isSemiAuto) {
          const burstInterval = r.weapon.burstInterval || 0;
          const burstInternalROF = r.weapon.burstInternalROF || 0;
          tooltipLines.push(
            `连发间隔: ${formatTime(burstInterval, 'ms')}`,
            `内部射速: ${burstInternalROF}`
          );
        }
        
        return tooltipLines;
      }
    };
  }

  destroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}
