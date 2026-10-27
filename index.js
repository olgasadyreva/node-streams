import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const mergeTxtFiles = async (dirPath, outputFileName) => {
  const outputPath = path.join(path.dirname(dirPath), outputFileName);
  const writeStream = fs.createWriteStream(outputPath, { encoding: 'utf-8' });

  const files = await fsp.readdir(dirPath);
  const txtFiles = files.filter(file => path.extname(file).toLowerCase() === '.txt');

  for (const file of txtFiles) {
    const filePath = path.join(dirPath, file);
    const fileNameWithoutExt = path.parse(file).name;

    const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

    writeStream.write(`[${fileNameWithoutExt}]\n`);
    readStream.pipe(writeStream, { end: false });

    await new Promise((resolve, reject) => {
      readStream.on('end', resolve);
      readStream.on('error', reject);
    });
  }

  writeStream.end();
  await new Promise((resolve) => writeStream.on('finish', resolve));

  console.log(`Готово! Файл сохранен: ${outputPath}`);
};

// Проверка
mergeTxtFiles('./test', 'result.txt')
  .catch(err => {
    console.error('Ошибка:', err);
    process.exit(1);
  });
