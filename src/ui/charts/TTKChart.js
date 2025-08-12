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
    if (typeof Chart === 'undefined') {
      setTimeout(() => this.initialize(), 100);
      return;
    }
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
          { label: '平均空枪延迟', backgroundColor: CHART_COLORS.EMPTY_DELAY, data: [] },
          { label: '飞行延迟', backgroundColor: CHART_COLORS.FLIGHT_DELAY, data: [] },
          { label: '扳机延迟', backgroundColor: CHART_COLORS.TRIGGER_DELAY, data: [] }
        ]
      },
      options: {
        layout: { padding: { top: CHART_CONFIG.PADDING_TOP } },
        plugins: {
          datalabels: { 
            display: ctx => ctx.datasetIndex === 3, 
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

  calculateDelays(stats, params) {
    const { weapon: w, avgTime, avgShots, avgMisses } = stats;
    const flight = params.distance / w.velocity;
    const interval = TIME_UNITS.MINUTES_TO_SECONDS / w.rof;
    const emptyDelay = interval * avgMisses;
    const triggerDelay = params.triggerDelayEnable ? w.triggerDelay / 1000 : 0;
    const avgHits = avgShots - avgMisses;
    const noMissFireDelay = interval * (avgHits - 1);
    const totalTime = avgTime + triggerDelay;
    
    return { 
      name: w.name, 
      weapon: w, 
      noMissFireDelay, 
      flight, 
      emptyDelay, 
      triggerDelay, 
      avgShots, 
      totalTime
    };
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
    const keys = ['noMissFireDelay', 'emptyDelay', 'flight', 'triggerDelay'];
    this.chart.data.datasets.forEach((ds, i) => {
      ds.data = newResults.map(r => r[keys[i]]);
    });
    this.chart.update();
  }

  drawRankDelayPlugin(chart) {
    if (chart.config.type !== 'bar') return;
    
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(3);
    
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
        
        return [
          `当前排名: ${currentRank}/${totalWeapons}`,
          `子弹初速: ${Math.round(r.weapon.velocity)} m/s`,
          `肉伤: ${r.weapon.flesh}`,
          `甲伤: ${r.weapon.armor}`,
          `射速: ${r.weapon.rof}`,
          `平均致死枪数: ${r.avgShots.toFixed(2)}`
        ];
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
