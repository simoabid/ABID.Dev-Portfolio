#!/usr/bin/env node

/**
 * Image Optimization Script
 *
 * Processes raw images using sharp to produce optimized variants:
 * - AVIF (modern, best compression)
 * - WebP (modern, good support)
 * - PNG (fallback)
 *
 * Generates multiple sizes for responsive images.
 *
 * Usage:
 *   node scripts/optimize-images.js --source ./public/images/raw
 *   node scripts/optimize-images.js --source ./public/images/raw --output ./public/optimized
 *   node scripts/optimize-images.js --help
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────

const SIZES = {
  thumbnail: 400,
  small: 800,
  medium: 1200,
  large: 1920,
  xlarge: 2560,
};

const FORMATS = ['avif', 'webp', 'png'];

const QUALITY = {
  avif: 80,
  webp: 85,
  png: 90,
  jpeg: 85,
};

// ─────────────────────────────────────────────────────────────────────────────
// CLI Argument Parsing
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    source: './public/images/raw',
    output: './public/optimized',
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      config.help = true;
    } else if (arg === '--source' || arg === '-s') {
      config.source = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      config.output = args[++i];
    }
  }

  return config;
}

function showHelp() {
  console.log(`
Image Optimization Script

Usage:
  node scripts/optimize-images.js [options]

Options:
  --source, -s   Source directory containing raw images (default: ./public/images/raw)
  --output, -o   Output directory for optimized images (default: ./public/optimized)
  --help, -h     Show this help message

Examples:
  node scripts/optimize-images.js
  node scripts/optimize-images.js --source ./public/images/raw
  node scripts/optimize-images.js --source ./public/images --output ./public/opt

Generates:
  - AVIF (best compression, modern browsers)
  - WebP (good compression, wide support)
  - PNG (fallback, universal support)

Sizes generated:
  - thumbnail: 400px
  - small: 800px
  - medium: 1200px
  - large: 1920px
  - xlarge: 2560px
`);
}

// ─────────────────────────────────────────────────────────────────────────────
// File System Utilities
// ─────────────────────────────────────────────────────────────────────────────

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

function getAllImageFiles(dir) {
  const supportedExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.tiff',
    '.avif',
  ];
  const files = [];

  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  Source directory does not exist: ${dir}`);
    return files;
  }

  function scanDirectory(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (supportedExtensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }

  scanDirectory(dir);
  return files;
}

// ─────────────────────────────────────────────────────────────────────────────
// Image Processing
// ─────────────────────────────────────────────────────────────────────────────

async function optimizeImage(inputPath, outputDir) {
  const relativePath = path.relative(path.dirname(inputPath), inputPath);
  const { name, dir } = path.parse(inputPath);
  const baseOutputDir = path.join(
    outputDir,
    path.relative(path.dirname(dir), dir)
  );

  console.log(`\n🖼️  Processing: ${relativePath}`);

  const results = {
    original: inputPath,
    variants: [],
  };

  try {
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    const originalWidth = metadata.width || 0;
    const originalHeight = metadata.height || 0;

    console.log(
      `   Original: ${originalWidth}x${originalHeight} (${(metadata.size / 1024).toFixed(1)} KB)`
    );

    // Process each size
    for (const [sizeName, targetWidth] of Object.entries(SIZES)) {
      // Skip if original is smaller than target
      if (originalWidth < targetWidth) {
        console.log(
          `   ⏭️  Skipping ${sizeName} (${targetWidth}px) - original is smaller`
        );
        continue;
      }

      console.log(`   📐 Generating ${sizeName} (${targetWidth}px)...`);

      // Create size-specific output directory
      const sizeOutputDir = path.join(baseOutputDir, sizeName);
      ensureDirectoryExists(sizeOutputDir);

      // Resize base image
      const resizedBuffer = await sharp(inputPath)
        .resize(targetWidth, null, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toBuffer();

      // Generate each format
      for (const format of FORMATS) {
        const outputFileName = `${name}.${format}`;
        const outputPath = path.join(sizeOutputDir, outputFileName);

        let processor = sharp(resizedBuffer);

        if (format === 'avif') {
          processor = processor.avif({ quality: QUALITY.avif });
        } else if (format === 'webp') {
          processor = processor.webp({ quality: QUALITY.webp });
        } else if (format === 'png') {
          processor = processor.png({
            quality: QUALITY.png,
            compressionLevel: 9,
          });
        }

        await processor.toFile(outputPath);

        const stats = fs.statSync(outputPath);
        const sizeKB = (stats.size / 1024).toFixed(1);

        console.log(`      ✓ ${format.toUpperCase()}: ${sizeKB} KB`);

        results.variants.push({
          size: sizeName,
          format,
          width: targetWidth,
          path: outputPath,
          sizeKB: parseFloat(sizeKB),
        });
      }
    }

    console.log(
      `   ✅ Complete: ${results.variants.length} variants generated`
    );
    return results;
  } catch (error) {
    console.error(`   ❌ Error processing ${inputPath}:`, error.message);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Execution
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const config = parseArgs();

  if (config.help) {
    showHelp();
    process.exit(0);
  }

  console.log('\n🚀 Image Optimization Pipeline\n');
  console.log(`📂 Source: ${path.resolve(config.source)}`);
  console.log(`📂 Output: ${path.resolve(config.output)}\n`);

  // Ensure output directory exists
  ensureDirectoryExists(config.output);

  // Get all image files
  const imageFiles = getAllImageFiles(config.source);

  if (imageFiles.length === 0) {
    console.log('⚠️  No images found to process.');
    console.log(`    Checked directory: ${config.source}`);
    console.log(
      '    Supported formats: .jpg, .jpeg, .png, .webp, .tiff, .avif'
    );
    process.exit(0);
  }

  console.log(`📊 Found ${imageFiles.length} image(s) to process\n`);
  console.log('━'.repeat(80));

  // Process each image
  const startTime = Date.now();
  const results = [];

  for (const imagePath of imageFiles) {
    const result = await optimizeImage(imagePath, config.output);
    if (result) {
      results.push(result);
    }
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Summary
  console.log('\n━'.repeat(80));
  console.log('\n📊 Optimization Summary\n');
  console.log(`   Images processed: ${results.length}`);
  console.log(
    `   Total variants: ${results.reduce((sum, r) => sum + r.variants.length, 0)}`
  );
  console.log(`   Time elapsed: ${duration}s`);
  console.log(`   Output directory: ${path.resolve(config.output)}`);
  console.log('\n✨ Optimization complete!\n');
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { optimizeImage, getAllImageFiles };
