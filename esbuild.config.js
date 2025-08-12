const esbuild = require('esbuild');
const fs = require('fs');

// 构建函数
async function build() {
  try {
    // 确保dist目录存在
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }

    // 打包JavaScript为bundle.js
    await esbuild.build({
      entryPoints: ['src/main.js'],
      bundle: true,
      outfile: 'dist/bundle.js',
      format: 'iife',
      minify: true,
      target: ['es2020'],
      sourcemap: false,
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });

    fs.copyFileSync('public/index.html', 'dist/index.html');
    fs.copyFileSync('public/styles.css', 'dist/styles.css');
    
    // 复制assets文件夹
    if (!fs.existsSync('dist/assets')) {
      fs.mkdirSync('dist/assets', { recursive: true });
    }
    fs.copyFileSync('assets/bili.png', 'dist/assets/bili.png');
    
    console.log('Build completed! Files generated in dist/ directory.');

  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build(); 