// 枪口数据
export const muzzles = [
  { name: '无', mult: 0 },
  { name: '死寂', mult: 0.24 },
  { name: '先进/轻语/勇火', mult: 0.18 },
  { name: '冲锋枪回声消音器', mult: 0.30 }
];

// 武器数据
export const weapons = [
    {
      name: 'SR-3M',
      type: '冲锋枪',
      ranges: [15, 31, Infinity, Infinity],
      decays: [1.0, 0.75, 0.65, 0.65, 0.65],
      velocity: 330,
      flesh: 36,
      armor: 48,
      rof: 747,
      triggerDelay: 0,
      barrels: [
        { 
          name: 'SR-3M铸钢战术枪管', 
          rangeMult: 1.18,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [3, 4, 5],
    },
    {
      name: '勇士',
      type: '冲锋枪',
      ranges: [20, 27, 40, 55],
      decays: [1.0, 0.7, 0.6, 0.5, 0.4],
      velocity: 500,
      flesh: 36,
      armor: 35,
      rof: 700,
      triggerDelay: 0,
      barrels: [
        { 
          name: '勇士海狸枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 'RIP'],
    },
    {
      name: 'QCQ171高导',
      type: '冲锋枪',
      ranges: [20, 27, 40, 55],
      decays: [1.0, 0.75, 0.65, 0.55, 0.45],
      velocity: 450,
      flesh: 36,
      armor: 33,
      rof: 848,
      triggerDelay: 0,
      barrels: [
        { 
          name: '新式渗透一体消音枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: '新式红缨战术长枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 'RIP'],
    },
    {
      name: 'QCQ171',
      type: '冲锋枪',
      ranges: [20, 27, 40, 55],
      decays: [1.0, 0.75, 0.65, 0.55, 0.45],
      velocity: 450,
      flesh: 36,
      armor: 33,
      rof: 763,
      triggerDelay: 0,
      barrels: [
        { 
          name: '新式渗透一体消音枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: '新式红缨战术长枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 5],
    },
    {
      name: 'QCQ171稳固',
      type: '冲锋枪',
      ranges: [27, 36.45, 54, 74.25],
      decays: [1.0, 0.75, 0.65, 0.55, 0.45],
      velocity: 450,
      flesh: 36,
      armor: 33,
      rof: 694,
      triggerDelay: 0,
      barrels: [
        { 
          name: '新式渗透一体消音枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: '新式红缨战术长枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 2.1, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 5],
    },
    {
      name: 'P90',
      type: '冲锋枪',
      ranges: [20, 27, 40, 55],
      decays: [1.0, 0.75, 0.65, 0.55, 0.45],
      velocity: 450,
      flesh: 32,
      armor: 35,
      rof: 898,
      triggerDelay: 0,
      barrels: [
        { 
          name: '重攻长枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 5, 'RIP'],
    },
    {
      name: '野牛',
      type: '冲锋枪',
      ranges: [20, 27, 40, 55],
      decays: [1.0, 0.75, 0.65, 0.55, 0.45],
      velocity: 500,
      flesh: 32,
      armor: 35,
      rof: 659,
      triggerDelay: 0,
      barrels: [
        { 
          name: '野牛刀锋超长枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 'RIP'],
    },
    {
      name: 'Vector',
      type: '冲锋枪',
      ranges: [20, 27, 40, 55],
      decays: [1.0, 0.75, 0.65, 0.55, 0.45],
      velocity: 500,
      flesh: 32,
      armor: 28,
      rof: 1091,
      triggerDelay: 0,
      barrels: [
        { 
          name: '导轨枪管组合', 
          rangeMult: 1.06,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: '长剑超长枪管组合', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 'RIP45'],
    },
    {
      name: 'MP7',
      type: '冲锋枪',
      ranges: [20, 27, 40, Infinity],
      decays: [1.0, 0.75, 0.65, 0.55, 0.55],
      velocity: 450,
      flesh: 32,
      armor: 28,
      rof: 950,
      triggerDelay: 0,
      barrels: [
        { 
          name: '增强枪管组合', 
          rangeMult: 1.06,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: '蜂刺长枪管组合', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [3, 4, 5],
    },
    {
      name: 'MP5',
      type: '冲锋枪',
      ranges: [20, 27, 40, 55],
      decays: [1.0, 0.75, 0.65, 0.55, 0.45],
      velocity: 450,
      flesh: 30,
      armor: 32,
      rof: 820,
      triggerDelay: 0,
      barrels: [
        { 
          name: '战术枪管组合', 
          rangeMult: 1.06,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: '性能枪管组合', 
          rangeMult: 1.06,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: '斥候长枪管组合', 
          rangeMult: 1.18,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: '特勤一体消音枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 'RIP'],
    },
    {
      name: 'UZI',
      type: '冲锋枪',
      ranges: [20, 27, 40, 55],
      decays: [1.0, 0.75, 0.65, 0.55, 0.45],
      velocity: 450,
      flesh: 28,
      armor: 35,
      rof: 780,
      triggerDelay: 67,
      barrels: [
        { 
          name: '军需长枪管', 
          rangeMult: 1.06,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: '竞赛性能长枪管', 
          rangeMult: 1.18,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 'RIP'],
    },
    {
      name: 'SMG-45',
      type: '冲锋枪',
      ranges: [27, 54, 90, Infinity],
      decays: [1.0, 0.75, 0.65, 0.55, 0.55],
      velocity: 500,
      flesh: 35,
      armor: 40,
      rof: 605,
      triggerDelay: 0,
      barrels: [
        { 
          name: '实用重枪管', 
          rangeMult: 1.06,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: '裂变长枪管', 
          rangeMult: 1.18,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: '长弩超长枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 'RIP45'],
    },
    {
      name: 'K416',
      type: '步枪',
      ranges: [27, 53, Infinity, Infinity],
      decays: [1.0, 0.85, 0.7, 0.7, 0.7],
      velocity: 575,
      flesh: 31,
      armor: 35,
      rof: 880,
      triggerDelay: 0,
      barrels: [
        { 
          name: '精英重枪管组合', 
          rangeMult: 1.06,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: 'A8枪管组合', 
          rangeMult: 1.18,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: 'A8长枪管组合', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 5],
    },
    {
      name: 'AS Val',
      type: '步枪',
      ranges: [27, 53, Infinity, Infinity],
      decays: [1.0, 0.85, 0.7, 0.7, 0.7],
      velocity: 330,
      flesh: 29,
      armor: 48,
      rof: 972,
      triggerDelay: 0,
      barrels: [
        { 
          name: 'VSS海啸长枪管组合', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 5],
    },
    {
      name: '腾龙高导',
      type: '步枪',
      ranges: [35, 62, Infinity, Infinity],
      decays: [1.0, 0.9, 0.7, 0.7, 0.7],
      velocity: 575,
      flesh: 35,
      armor: 38,
      rof: 759,
      triggerDelay: 0,
      barrels: [
        { 
          name: '新式蛟龙战术长枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 2.1, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [2, 3, 4, 5],
    },
    {
      name: '腾龙',
      type: '步枪',
      ranges: [35, 62, Infinity, Infinity],
      decays: [1.0, 0.9, 0.7, 0.7, 0.7],
      velocity: 575,
      flesh: 35,
      armor: 38,
      rof: 706,
      triggerDelay: 0,
      barrels: [
        { 
          name: '新式蛟龙战术长枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 2.1, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [2, 3, 4, 5],
    },
    {
      name: '腾龙稳固',
      type: '步枪',
      ranges: [35, 62, Infinity, Infinity],
      decays: [1.0, 0.9, 0.7, 0.7, 0.7],
      velocity: 575,
      flesh: 35,
      armor: 38,
      rof: 660,
      triggerDelay: 0,
      barrels: [
        { 
          name: '新式蛟龙战术长枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [2, 3, 4, 5],
    },
    {
      name: 'K437',
      type: '步枪',
      ranges: [35, 60, Infinity, Infinity],
      decays: [1.0, 0.9, 0.7, 0.7, 0.7],
      velocity: 575,
      flesh: 34,
      armor: 35,
      rof: 780,
      triggerDelay: 0,
      barrels: [
        { 
          name: '特攻一体消音枪管', 
          rangeMult: 1.18,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: '长矛手长枪管组合', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 5],
    },
    {
      name: 'SG552',
      type: '步枪',
      ranges: [35, 65, Infinity, Infinity],
      decays: [1.0, 0.85, 0.75, 0.75, 0.75],
      velocity: 575,
      flesh: 24,
      armor: 31,
      rof: 906,
      triggerDelay: 0,
      barrels: [
        { 
          name: '骑士重枪管', 
          rangeMult: 1.18,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 5],
    },
    {
      name: 'M250',
      type: '轻机枪',
      ranges: [40, 70, Infinity, Infinity],
      decays: [1.0, 0.85, 0.7, 0.7, 0.7],
      velocity: 630,
      flesh: 55,
      armor: 53,
      rof: 550,
      triggerDelay: 100,
      barrels: [
        { 
          name: '钛金长枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.6, chest: 1, stomach: 0.7, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 5],
    },
    {
      name: 'PKM',
      type: '轻机枪',
      ranges: [40, 70, Infinity, Infinity],
      decays: [1.0, 0.85, 0.7, 0.7, 0.7],
      velocity: 630,
      flesh: 45,
      armor: 42,
      rof: 669,
      triggerDelay: 50,
      barrels: [
        { 
          name: '地平线重枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 5],
    },
    {
      name: 'AKM',
      type: '步枪',
      ranges: [40, 70, Infinity, Infinity],
      decays: [1.0, 0.85, 0.7, 0.7, 0.7],
      velocity: 525,
      flesh: 40,
      armor: 42,
      rof: 600,
      triggerDelay: 0,
      barrels: [
        { 
          name: '性能枪管组合', 
          rangeMult: 1.06,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: '超然长枪管组合', 
          rangeMult: 1.18,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: '海狸长枪管组合', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: '实用长枪管组合', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 5],
    },
    {
      name: 'SCAR-H',
      type: '步枪',
      ranges: [40, 70, Infinity, Infinity],
      decays: [1.0, 0.85, 0.7, 0.7, 0.7],
      velocity: 630,
      flesh: 40,
      armor: 40,
      rof: 585,
      triggerDelay: 0,
      barrels: [
        { 
          name: '实用标准枪管', 
          rangeMult: 1.06,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: '海狸长枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [2, 3, 4, 5,'M61'],
    },
    {
      name: 'M14',
      type: '精确射手步枪',
      ranges: [40, 70, Infinity, Infinity],
      decays: [1.0, 0.8, 0.7, 0.7, 0.7],
      velocity: 575,
      flesh: 39,
      armor: 41,
      rof: 727,
      triggerDelay: 0,
      barrels: [
        { 
          name: '漫游标准枪管', 
          rangeMult: 1.18,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: '洞察超长枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [2, 3, 4, 5,'M61'],
    },
    {
      name: 'PTR-32',
      type: '步枪',
      ranges: [40, 70, Infinity, Infinity],
      decays: [1.0, 0.85, 0.7, 0.7, 0.7],
      velocity: 630,
      flesh: 34,
      armor: 36,
      rof: 632,
      triggerDelay: 0,
      barrels: [
        { 
          name: 'G3守卫标准枪管组合', 
          rangeMult: 1.18,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: 'G3平台神射枪管组合', 
          rangeMult: 1.36,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 0.87
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 5],
    },
    {
      name: 'AKS-74U',
      type: '步枪',
      ranges: [40, 70, Infinity, Infinity],
      decays: [1.0, 0.8, 0.6, 0.6, 0.6],
      velocity: 500,
      flesh: 34,
      armor: 36,
      rof: 533,
      triggerDelay: 0,
      barrels: [], 
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 5],
    },
    {
      name: 'QJB201高导',
      type: '轻机枪',
      ranges: [40, 70, Infinity, Infinity],
      decays: [1.0, 0.85, 0.7, 0.7, 0.7],
      velocity: 575,
      flesh: 32,
      armor: 38,
      rof: 873,
      triggerDelay: 50,
      barrels: [
        { 
          name: '新式重锤战术枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 2.1, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 5],
    },
    {
      name: 'QJB201',
      type: '轻机枪',
      ranges: [40, 70, Infinity, Infinity],
      decays: [1.0, 0.85, 0.7, 0.7, 0.7],
      velocity: 575,
      flesh: 32,
      armor: 38,
      rof: 785,
      triggerDelay: 50,
      barrels: [
        { 
          name: '新式重锤战术枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 2.1, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 5],
    },
    {
      name: 'QJB201稳固',
      type: '轻机枪',
      ranges: [54, 94.5, Infinity, Infinity],
      decays: [1.0, 0.85, 0.7, 0.7, 0.7],
      velocity: 575,
      flesh: 32,
      armor: 38,
      rof: 714,
      triggerDelay: 50,
      barrels: [
        { 
          name: '新式重锤战术枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 2.1, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 5],
    },
    {
      name: 'M249',
      type: '轻机枪',
      ranges: [40, 70, Infinity, Infinity],
      decays: [1.0, 0.85, 0.7, 0.7, 0.7],
      velocity: 575,
      flesh: 30,
      armor: 38,
      rof: 858,
      triggerDelay: 50,
      barrels: [
        { 
          name: '犀牛长枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 5],
    },
    {
      name: 'AK-12',
      type: '步枪',
      ranges: [40, 70, Infinity, Infinity],
      decays: [1.0, 0.9, 0.75, 0.75, 0.75],
      velocity: 575,
      flesh: 29,
      armor: 41,
      rof: 735,
      triggerDelay: 0,
      barrels: [
        { 
          name: '精英脚架长枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 5],
    },
    {
      name: 'M4A1',
      type: '步枪',
      ranges: [40, 70, Infinity, Infinity],
      decays: [1.0, 0.85, 0.7, 0.7, 0.7],
      velocity: 575,
      flesh: 29,
      armor: 32,
      rof: 800,
      triggerDelay: 0,
      barrels: [
        { 
          name: 'AR特勤一体消音组合', 
          rangeMult: 1.18,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: 'AR战壕标准枪管组合', 
          rangeMult: 1.18,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: 'AR碳纤维枪管组合', 
          rangeMult: 1.18,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: 'AR战壕标准枪管组合', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 5],
    },
    {
      name: 'CAR-15',
      type: '步枪',
      ranges: [40, 70, Infinity, Infinity],
      decays: [1.0, 0.85, 0.7, 0.7, 0.7],
      velocity: 575,
      flesh: 27,
      armor: 32,
      rof: 632,
      triggerDelay: 0,
      barrels: [
        { 
          name: 'AR特勤一体消音组合', 
          rangeMult: 1.18,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: 'AR战壕标准枪管组合', 
          rangeMult: 1.18,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: 'AR碳纤维枪管组合', 
          rangeMult: 1.18,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: 'AR战壕标准枪管组合', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 5],
    },
    {
      name: 'M7',
      type: '步枪',
      ranges: [50, 85, Infinity, Infinity],
      decays: [1.0, 0.9, 0.8, 0.8, 0.8],
      velocity: 630,
      flesh: 38,
      armor: 40,
      rof: 649,
      triggerDelay: 0,
      barrels: [
        { 
          name: '实用长枪管组合', 
          rangeMult: 1.18,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: '堤风超长枪管组合', 
          rangeMult: 1.3,
          damageBonus: 2,
          armorDamageBonus: 2,
          rofMult: 1.0
        },
        { 
          name: '灵蜥短枪管', 
          rangeMult: 0.7,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 1, limbs: 0.4 },
      allowedBullets: [4, 5,'AP'],
    },
    {
      name: 'ASh-12',
      type: '步枪',
      ranges: [55, 90, Infinity, Infinity],
      decays: [1.0, 0.9, 0.85, 0.85, 0.85],
      velocity: 340,
      flesh: 56,
      armor: 55,
      rof: 500,
      triggerDelay: 0,
      barrels: [
        { 
          name: '歼灭高精长枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.6, chest: 1, stomach: 0.9, limbs: 0.45 },
      allowedBullets: [3, 4, 5,'Double'],
    },
    {
      name: 'G3',
      type: '步枪',
      ranges: [55, 90, Infinity, Infinity],
      decays: [1.0, 0.9, 0.8, 0.8, 0.8],
      velocity: 630,
      flesh: 39,
      armor: 42,
      rof: 533,
      triggerDelay: 0,
      barrels: [
        { 
          name: 'G3守卫标准枪管组合', 
          rangeMult: 1.18,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: 'G3加强长枪管组合', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: 'G3平台神射枪管组合', 
          rangeMult: 1.36,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 0.87
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 5],
    },
    {
      name: 'AUG',
      type: '步枪',
      ranges: [55, 90, Infinity, Infinity],
      decays: [1.0, 0.9, 0.8, 0.8, 0.8],
      velocity: 575,
      flesh: 32,
      armor: 35,
      rof: 679,
      triggerDelay: 0,
      barrels: [
        { 
          name: '实用集成三倍镜枪管', 
          rangeMult: 1.06,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: '晨零一体消音管', 
          rangeMult: 1.18,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: '精英脚架长枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 2.0, chest: 1.1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 5],
    },
    {
      name: 'KC17',
      type: '步枪',
      ranges: [55, 90, Infinity, Infinity],
      decays: [1.0, 0.85, 0.7, 0.7, 0.7],
      velocity: 575,
      flesh: 30,
      armor: 48,
      rof: 740,
      triggerDelay: 0,
      barrels: [
        { 
          name: '影舞者消音', 
          rangeMult: 1.18,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: '长剑枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 5],
    },
    {
      name: 'QBZ95-1',
      type: '步枪',
      ranges: [55, 90, Infinity, Infinity],
      decays: [1.0, 0.85, 0.7, 0.7, 0.7],
      velocity: 575,
      flesh: 28,
      armor: 42,
      rof: 679,
      triggerDelay: 0,
      barrels: [
        { 
          name: '战术枪管', 
          rangeMult: 1.06,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        },
        { 
          name: '长弓枪管组合', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 2.3, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [2, 3, 4, 5],
    },{
      name: 'G18',
      type: '手枪',
      ranges: [10, 20, 30, Infinity],
      decays: [1.0, 0.85, 0.7, 0.6, 0.6],
      velocity: 400,
      flesh: 23,
      armor: 16,
      rof: 1172,
      triggerDelay: 0,
      barrels: [
        { 
          name: '冲击长枪管', 
          rangeMult: 1.3,
          damageBonus: 0,
          armorDamageBonus: 0,
          rofMult: 1.0
        }
      ],
      mult: { head: 1.9, chest: 1, stomach: 0.9, limbs: 0.4 },
      allowedBullets: [1, 2, 3, 4, 'RIP'],
    }
  ];
