const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

async function build() {
  try {
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }

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

    // 拷贝 public 根文件
    fs.copyFileSync('public/index.html', 'dist/index.html');
    fs.copyFileSync('public/styles.css', 'dist/styles.css');

    // 递归拷贝 assets 到 dist/assets（包含 libs、图片、Version.txt 等）
    const srcAssets = path.resolve('assets');
    const dstAssets = path.resolve('dist/assets');

    if (fs.existsSync(dstAssets)) {
      // 清空已有 dist/assets
      fs.rmSync(dstAssets, { recursive: true, force: true });
    }
    fs.cpSync(srcAssets, dstAssets, { recursive: true });

    console.log('Build completed! Files generated in dist/ directory.');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build(); 