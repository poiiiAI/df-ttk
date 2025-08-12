// 命中部位常量
export const HIT_KEYS = ['head', 'chest', 'stomach', 'limbs'];

// 命中概率校验容差
export const HIT_PROB_TOLERANCE = 1e-6;

// 图表配置
export const CHART_CONFIG = {
  // 距离图表配置
  MAX_DISTANCE: 100,
  CUTOFF_DISTANCE: 35,
  // 显示配置
  TOP_WEAPONS_COUNT: 10,
  PADDING_TOP: 40
};

// 模拟配置
export const SIMULATION_CONFIG = {
  DEFAULT_SIM_COUNT: 20000,
  DISTANCE_SIM_COUNT: 20000
};

// 枪口精度加成
export const MUZZLE_PRECISION_BONUS = 1.09;

// 时间单位转换
export const TIME_UNITS = {
  SECONDS_TO_MS: 1000,
  MINUTES_TO_SECONDS: 60
};

// 图表颜色配置
export const CHART_COLORS = {
  NO_MISS_FIRE: 'rgba(54, 162, 235, 0.7)',
  EMPTY_DELAY: 'rgba(75, 192, 192, 0.7)',
  FLIGHT_DELAY: 'rgba(255, 159, 64, 0.7)',
  TRIGGER_DELAY: 'rgba(153, 102, 255, 0.7)'
};

// 排名变化颜色
export const RANK_COLORS = {
  NO_CHANGE: '#000000',  // 黑色表示无变化
  RANK_UP: '#ff0000',    // 红色表示排名提升
  RANK_DOWN: '#00ff00'   // 绿色表示排名下降
};
