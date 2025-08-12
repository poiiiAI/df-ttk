# TTK计算器

三角洲行动TTK（Time To Kill）计算器

## 功能特性

- ✅ 支持多种自定义参数
- ✅ 支持查看详细的TTK构成
- ✅ 精确到每米的距离TTK折线图
- ✅ 实时TTK计算和排名

## 文件结构

```
ttk/
├── src/                    # 源代码
│   ├── constants/          # 常量配置
│   ├── core/               # 核心逻辑
│   ├── data/               # 数据文件
│   ├── ui/                 # 用户界面
│   │   └── charts/         # 图表组件
│   ├── utils/              # 工具函数
│   └── main.js             # 主入口文件
├── public/                  # 静态资源
│   ├── index.html          # 源HTML文件
│   └── styles.css          # 源CSS文件
├── dist/                    # 构建输出
│   ├── bundle.js           # 打包后的JavaScript文件
│   ├── bundle.js.map       # 源码映射文件
│   ├── index.html          # 构建后的HTML文件
│   └── styles.css          # 构建后的CSS文件
├── .github/workflows/       # GitHub Actions配置
├── esbuild.config.js        # 构建配置
├── package.json             # 项目配置
└── .gitignore              # Git忽略文件
```
