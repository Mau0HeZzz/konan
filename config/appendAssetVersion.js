import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const CSS_OR_JS_ASSET_PATTERN =
  /((?:href|src)=["'])([^"'?#]+\.(?:css|js))(\?[^"'#]*)?(#[^"']*)?(["'])/gi;

const appendVersionToUrl = (url, version) => {
  const separator = url.includes('?') ? '&' : '?';

  return `${url}${separator}v=${version}`;
};

const updateHtmlAssetLinks = (html, version) =>
  html.replace(
    CSS_OR_JS_ASSET_PATTERN,
    (_, attributeStart, pathname, query = '', hash = '', attributeEnd) =>
      `${attributeStart}${appendVersionToUrl(
        `${pathname}${query}`,
        version
      )}${hash}${attributeEnd}`
  );

const getHtmlFiles = async (directoryPath) => {
  const directoryEntries = await readdir(directoryPath, { withFileTypes: true });
  const htmlFiles = [];

  for (const entry of directoryEntries) {
    const entryPath = resolve(directoryPath, entry.name);

    if (entry.isDirectory()) {
      htmlFiles.push(...(await getHtmlFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.html')) {
      htmlFiles.push(entryPath);
    }
  }

  return htmlFiles;
};

export function appendAssetVersion() {
  let buildVersion = '';
  let outDir = '';

  return {
    name: 'append-asset-version',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    buildStart() {
      buildVersion = String(new Date().getTime());
    },
    async closeBundle() {
      const version = buildVersion || String(new Date().getTime());
      const htmlFiles = await getHtmlFiles(outDir);

      for (const htmlFilePath of htmlFiles) {
        const html = await readFile(htmlFilePath, 'utf8');
        const updatedHtml = updateHtmlAssetLinks(html, version);

        if (updatedHtml !== html) {
          await writeFile(htmlFilePath, updatedHtml);
        }
      }
    },
  };
}
