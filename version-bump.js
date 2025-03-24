import { readFileSync, writeFileSync } from 'fs';

const targetVersion = process.env.npm_package_version;

// Проверка, задана ли версия
if (!targetVersion) {
  console.error("❌ Ошибка: npm_package_version не задан. Запускайте через 'npm version patch'.");
  process.exit(1);
}

try {
  // Читаем текущий manifest
  const manifest = JSON.parse(readFileSync('manifest.json', 'utf8'));

  // Читаем или создаем versions.json
  let versions = {};
  try {
    versions = JSON.parse(readFileSync('versions.json', 'utf8'));
  } catch (error) {
    console.error('❌ Ошибка при чтении versions.json:', error);
    console.warn('⚠️ Warning: versions.json не найден, создается новый.');
  }

  // Обновляем версию в manifest.json
  manifest.version = targetVersion;
  writeFileSync('manifest.json', JSON.stringify(manifest, null, 4));

  // Обновляем versions.json
  versions[targetVersion] = manifest.minAppVersion || 'unknown';
  writeFileSync('versions.json', JSON.stringify(versions, null, 4));

  console.log(`✅ Версия обновлена до ${targetVersion}`);
} catch (error) {
  console.error('❌ Ошибка обновления версии:', error);
  process.exit(1);
}
