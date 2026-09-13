import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const assetsDir = './src/assets';
const extensions = ['.png', '.jpg', '.jpeg', '.webp'];

async function getFiles(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map(async entry => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            return getFiles(fullPath);
        }

        return fullPath;
    }));

    return files.flat();
}

async function optimizeImage(file) {
    const extension = path.extname(file).toLowerCase();

    if (!extensions.includes(extension)) {
        return;
    }

    const tempFile = `${file}.tmp`;

    try {
        let image = sharp(file);

        if (extension === '.png') {
            image = image.png({
                compressionLevel: 9,
                palette: true
            });
        }

        if (extension === '.jpg' || extension === '.jpeg') {
            image = image.jpeg({
                quality: 82,
                mozjpeg: true
            });
        }

        if (extension === '.webp') {
            image = image.webp({
                quality: 82,
                effort: 6
            });
        }

        await image.toFile(tempFile);

        const original = await fs.stat(file);
        const optimized = await fs.stat(tempFile);

        if (optimized.size < original.size) {
            await fs.rename(tempFile, file);

            const saved = original.size - optimized.size;
            const percent = ((saved / original.size) * 100).toFixed(1);

            console.log(`✓ ${file} - ${percent}% kleiner`);
        } else {
            await fs.unlink(tempFile);
            console.log(`- ${file} - bereits optimal`);
        }
    } catch (error) {
        try {
            await fs.unlink(tempFile);
        } catch { }

        console.error(`✗ Fehler bei ${file}:`, error.message);
    }
}

async function main() {
    console.log('Bilder werden optimiert...\n');

    const files = await getFiles(assetsDir);
    const images = files.filter(file =>
        extensions.includes(path.extname(file).toLowerCase())
    );

    console.log(`${images.length} Bilder gefunden.\n`);

    for (const file of images) {
        await optimizeImage(file);
    }

    console.log('\nFertig!');
}

main();