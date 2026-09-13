import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const assetsDir = './src/assets';
const extensions = ['.png', '.jpg', '.jpeg', '.webp'];

const joelImageName = 'joel4.png';
const joelMaxSize = 1024 * 1024;
const joelStartDimension = 1800;
const joelMinDimension = 800;
const joelDimensionStep = 100;

const stickerNames = [
    'sticker_open.png',
    'sticker_hover.png',
    'sticker_white.png'
];

const stickerMaxSize = 400 * 1024;
const stickerStartDimension = 1200;
const stickerMinDimension = 300;
const stickerDimensionStep = 100;

/**
 * Returns all files inside a directory and its subdirectories.
 *
 * @param {string} dir The directory to scan.
 * @returns {Promise<string[]>} All discovered file paths.
 */
async function getFiles(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
        entries.map(entry => resolveEntry(dir, entry))
    );

    return files.flat();
}

/**
 * Resolves a directory entry to files.
 *
 * @param {string} dir The parent directory.
 * @param {import('fs').Dirent} entry The directory entry.
 * @returns {Promise<string|string[]>} The resolved file or nested files.
 */
async function resolveEntry(dir, entry) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
        return getFiles(fullPath);
    }

    return fullPath;
}

/**
 * Checks whether a file has a supported image extension.
 *
 * @param {string} file The file path.
 * @returns {boolean} Whether the image format is supported.
 */
function isSupportedImage(file) {
    const extension = path.extname(file).toLowerCase();

    return extensions.includes(extension);
}

/**
 * Checks whether the file is the portfolio photo.
 *
 * @param {string} file The file path.
 * @returns {boolean} Whether the file is joel4.png.
 */
function isJoelImage(file) {
    return path.basename(file).toLowerCase() === joelImageName;
}

/**
 * Checks whether the file is one of the optimized stickers.
 *
 * @param {string} file The file path.
 * @returns {boolean} Whether the file is a sticker.
 */
function isStickerImage(file) {
    const name = path.basename(file).toLowerCase();

    return stickerNames.includes(name);
}

/**
 * Selects the appropriate optimization strategy.
 *
 * @param {string} file The image file path.
 * @returns {Promise<void>}
 */
async function optimizeImage(file) {
    if (!isSupportedImage(file)) {
        return;
    }

    if (isJoelImage(file)) {
        return optimizeJoelImage(file);
    }

    return optimizeNonJoelImage(file);
}

/**
 * Selects sticker or standard image optimization.
 *
 * @param {string} file The image file path.
 * @returns {Promise<void>}
 */
async function optimizeNonJoelImage(file) {
    if (isStickerImage(file)) {
        await optimizeStickerImage(file);
        return;
    }

    await optimizeStandardImage(file);
}

/**
 * Optimizes a regular asset image.
 *
 * @param {string} file The image file path.
 * @returns {Promise<void>}
 */
async function optimizeStandardImage(file) {
    const tempFile = `${file}.tmp`;

    try {
        await createStandardImage(file, tempFile);
        await replaceIfSmaller(file, tempFile);
    } catch (error) {
        await handleOptimizationError(file, tempFile, error);
    }
}

/**
 * Creates an optimized regular image.
 *
 * @param {string} file The source image.
 * @param {string} output The temporary output file.
 * @returns {Promise<void>}
 */
async function createStandardImage(file, output) {
    const extension = path.extname(file).toLowerCase();
    const image = getStandardPipeline(file, extension);

    await image.toFile(output);
}

/**
 * Creates the Sharp pipeline for a regular image.
 *
 * @param {string} file The source image.
 * @param {string} extension The image extension.
 * @returns {sharp.Sharp} The configured Sharp instance.
 */
function getStandardPipeline(file, extension) {
    const image = sharp(file);

    if (extension === '.png') {
        return image.png({ compressionLevel: 9, palette: true });
    }

    return configureLossyImage(image, extension);
}

/**
 * Configures JPEG or WebP compression.
 *
 * @param {sharp.Sharp} image The Sharp instance.
 * @param {string} extension The image extension.
 * @returns {sharp.Sharp} The configured Sharp instance.
 */
function configureLossyImage(image, extension) {
    if (extension === '.jpg' || extension === '.jpeg') {
        return image.jpeg({ quality: 82, mozjpeg: true });
    }

    return image.webp({ quality: 82, effort: 6 });
}

/**
 * Optimizes the portfolio image to a maximum of one megabyte.
 *
 * @param {string} file The portfolio image path.
 * @returns {Promise<void>}
 */
async function optimizeJoelImage(file) {
    const originalSize = await getFileSize(file);

    if (originalSize <= joelMaxSize) {
        logAlreadySmall(file, originalSize);
        return;
    }

    await createJoelVariants(file, originalSize);
}

/**
 * Creates progressively smaller portfolio image variants.
 *
 * @param {string} file The portfolio image path.
 * @param {number} originalSize The original file size.
 * @returns {Promise<void>}
 */
async function createJoelVariants(file, originalSize) {
    const tempFile = `${file}.tmp`;

    try {
        await findJoelSize(file, tempFile, joelStartDimension);
        await replaceTargetImage(file, tempFile, originalSize, joelMaxSize);
    } catch (error) {
        await handleOptimizationError(file, tempFile, error);
    }
}

/**
 * Reduces the portfolio image until the target size is reached.
 *
 * @param {string} file The source image.
 * @param {string} output The temporary output file.
 * @param {number} dimension The current maximum dimension.
 * @returns {Promise<void>}
 */
async function findJoelSize(file, output, dimension) {
    await createJoelImage(file, output, dimension);
    const size = await getFileSize(output);

    if (size <= joelMaxSize || dimension <= joelMinDimension) {
        return;
    }

    await recreateJoelVariant(file, output, dimension);
}

/**
 * Removes the current portfolio variant and creates a smaller one.
 *
 * @param {string} file The source image.
 * @param {string} output The temporary output file.
 * @param {number} dimension The current maximum dimension.
 * @returns {Promise<void>}
 */
async function recreateJoelVariant(file, output, dimension) {
    await fs.unlink(output);

    await findJoelSize(
        file,
        output,
        dimension - joelDimensionStep
    );
}

/**
 * Creates a resized portfolio PNG.
 *
 * @param {string} file The source image.
 * @param {string} output The temporary output file.
 * @param {number} dimension The maximum image dimension.
 * @returns {Promise<void>}
 */
async function createJoelImage(file, output, dimension) {
    const image = sharp(file).resize({
        width: dimension,
        height: dimension,
        fit: 'inside',
        withoutEnlargement: true
    });

    await image.png({ compressionLevel: 9 }).toFile(output);
}

/**
 * Optimizes a sticker to a maximum of 400 KB.
 *
 * @param {string} file The sticker image path.
 * @returns {Promise<void>}
 */
async function optimizeStickerImage(file) {
    const originalSize = await getFileSize(file);

    if (originalSize <= stickerMaxSize) {
        logAlreadySmall(file, originalSize);
        return;
    }

    await createStickerVariants(file, originalSize);
}

/**
 * Creates progressively smaller sticker variants.
 *
 * @param {string} file The sticker image path.
 * @param {number} originalSize The original file size.
 * @returns {Promise<void>}
 */
async function createStickerVariants(file, originalSize) {
    const tempFile = `${file}.tmp`;

    try {
        await findStickerSize(file, tempFile, stickerStartDimension);
        await replaceTargetImage(file, tempFile, originalSize, stickerMaxSize);
    } catch (error) {
        await handleOptimizationError(file, tempFile, error);
    }
}

/**
 * Reduces a sticker until it reaches the target size.
 *
 * @param {string} file The source image.
 * @param {string} output The temporary output file.
 * @param {number} dimension The current maximum dimension.
 * @returns {Promise<void>}
 */
async function findStickerSize(file, output, dimension) {
    await createStickerImage(file, output, dimension);
    const size = await getFileSize(output);

    if (size <= stickerMaxSize || dimension <= stickerMinDimension) {
        return;
    }

    await recreateStickerVariant(file, output, dimension);
}

/**
 * Removes the current sticker variant and creates a smaller one.
 *
 * @param {string} file The source image.
 * @param {string} output The temporary output file.
 * @param {number} dimension The current maximum dimension.
 * @returns {Promise<void>}
 */
async function recreateStickerVariant(file, output, dimension) {
    await fs.unlink(output);

    await findStickerSize(
        file,
        output,
        dimension - stickerDimensionStep
    );
}

/**
 * Creates an optimized transparent sticker PNG.
 *
 * @param {string} file The source image.
 * @param {string} output The temporary output file.
 * @param {number} dimension The maximum image dimension.
 * @returns {Promise<void>}
 */
async function createStickerImage(file, output, dimension) {
    const image = sharp(file).resize({
        width: dimension,
        height: dimension,
        fit: 'inside',
        withoutEnlargement: true
    });

    await createStickerPng(image, output);
}

/**
 * Writes a compressed transparent PNG sticker.
 *
 * @param {sharp.Sharp} image The Sharp instance.
 * @param {string} output The output path.
 * @returns {Promise<void>}
 */
async function createStickerPng(image, output) {
    await image.png({
        compressionLevel: 9,
        palette: true,
        quality: 90,
        effort: 10
    }).toFile(output);
}

/**
 * Replaces a targeted image when it meets the requested size.
 *
 * @param {string} file The original image.
 * @param {string} tempFile The optimized image.
 * @param {number} originalSize The original file size.
 * @param {number} maxSize The maximum allowed size.
 */
async function replaceTargetImage(file, tempFile, originalSize, maxSize) {
    const optimizedSize = await getFileSize(tempFile);

    if (optimizedSize <= maxSize && optimizedSize < originalSize) {
        await replaceAndLog(file, tempFile, originalSize, optimizedSize);
        return;
    }

    await rejectTargetImage(file, tempFile, optimizedSize);
}

/**
 * Removes an image that failed to reach its target size.
 *
 * @param {string} file The original image.
 * @param {string} tempFile The temporary file.
 * @param {number} optimizedSize The attempted optimized size.
 */
async function rejectTargetImage(file, tempFile, optimizedSize) {
    await removeFile(tempFile);

    console.log(
        `✗ ${file} - Ziel nicht erreicht: ${formatKilobytes(optimizedSize)} KB`
    );
}

/**
 * Replaces an original image when the optimized version is smaller.
 *
 * @param {string} file The original image.
 * @param {string} tempFile The temporary image.
 * @returns {Promise<void>}
 */
async function replaceIfSmaller(file, tempFile) {
    const originalSize = await getFileSize(file);
    const optimizedSize = await getFileSize(tempFile);

    if (optimizedSize < originalSize) {
        await replaceAndLog(file, tempFile, originalSize, optimizedSize);
        return;
    }

    await removeUnchangedImage(file, tempFile);
}

/**
 * Removes an unchanged temporary image.
 *
 * @param {string} file The original image.
 * @param {string} tempFile The temporary image.
 * @returns {Promise<void>}
 */
async function removeUnchangedImage(file, tempFile) {
    await fs.unlink(tempFile);

    console.log(`- ${file} - bereits optimal`);
}

/**
 * Replaces an image and logs the result.
 *
 * @param {string} file The original image.
 * @param {string} tempFile The optimized image.
 * @param {number} originalSize The original file size.
 * @param {number} optimizedSize The optimized file size.
 */
async function replaceAndLog(file, tempFile, originalSize, optimizedSize) {
    await fs.rename(tempFile, file);

    const before = formatKilobytes(originalSize);
    const after = formatKilobytes(optimizedSize);

    console.log(`✓ ${file} - ${before} KB → ${after} KB`);
}

/**
 * Returns a file size in bytes.
 *
 * @param {string} file The file path.
 * @returns {Promise<number>} The file size in bytes.
 */
async function getFileSize(file) {
    const stats = await fs.stat(file);

    return stats.size;
}

/**
 * Handles an image optimization error.
 *
 * @param {string} file The original image.
 * @param {string} tempFile The temporary file.
 * @param {unknown} error The thrown error.
 * @returns {Promise<void>}
 */
async function handleOptimizationError(file, tempFile, error) {
    await removeFile(tempFile);

    const message = getErrorMessage(error);

    console.error(`✗ Fehler bei ${file}:`, message);
}

/**
 * Returns a readable error message.
 *
 * @param {unknown} error The thrown error.
 * @returns {string} The readable error message.
 */
function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }

    return String(error);
}

/**
 * Removes a file when it exists.
 *
 * @param {string} file The file to remove.
 * @returns {Promise<void>}
 */
async function removeFile(file) {
    try {
        await fs.unlink(file);
    } catch {
        return;
    }
}

/**
 * Logs that an image already meets its target size.
 *
 * @param {string} file The image path.
 * @param {number} size The current file size.
 */
function logAlreadySmall(file, size) {
    const kilobytes = formatKilobytes(size);

    console.log(`- ${file} - bereits ${kilobytes} KB`);
}

/**
 * Converts bytes to formatted kilobytes.
 *
 * @param {number} bytes The number of bytes.
 * @returns {string} The formatted kilobyte value.
 */
function formatKilobytes(bytes) {
    return (bytes / 1024).toFixed(0);
}

/**
 * Returns all supported images from a list of files.
 *
 * @param {string[]} files The discovered files.
 * @returns {string[]} Supported image files.
 */
function getImages(files) {
    return files.filter(file => isSupportedImage(file));
}

/**
 * Optimizes all supplied images sequentially.
 *
 * @param {string[]} images The images to optimize.
 * @returns {Promise<void>}
 */
async function optimizeImages(images) {
    for (const file of images) {
        await optimizeImage(file);
    }
}

/**
 * Starts the asset optimization process.
 *
 * @returns {Promise<void>}
 */
async function main() {
    console.log('Bilder werden optimiert...\n');

    const files = await getFiles(assetsDir);
    const images = getImages(files);

    await runOptimization(images);
}

/**
 * Runs optimization and prints progress information.
 *
 * @param {string[]} images The images to optimize.
 * @returns {Promise<void>}
 */
async function runOptimization(images) {
    console.log(`${images.length} Bilder gefunden.\n`);

    await optimizeImages(images);

    console.log('\nFertig!');
}

main();