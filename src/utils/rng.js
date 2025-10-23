/**
 * 简单的随机种子管理
 * 使用固定种子确保模拟结果的一致性
 */

let currentSeed = 12345; // 固定种子

/**
 * 设置随机种子
 * @param {number} seed - 种子值
 */
export function setSeed(seed) {
  currentSeed = seed;
}

/**
 * 重置到默认种子
 */
export function resetSeed() {
  currentSeed = 12345;
}

/**
 * 生成带种子的随机数
 * 使用简单的线性同余生成器
 * @returns {number} 0-1之间的随机数
 */
export function seededRandom() {
  // LCG参数：a = 1664525, c = 1013904223, m = 2^32
  currentSeed = (1664525 * currentSeed + 1013904223) % Math.pow(2, 32);
  return currentSeed / Math.pow(2, 32);
}
