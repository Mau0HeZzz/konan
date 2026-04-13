// vite.config.js
import { resolve as resolve3 } from "path";
import { defineConfig } from "file:///G:/Vsyachina/Work/projects/lyrmin/konan/node_modules/vite/dist/node/index.js";
import handlebars from "file:///G:/Vsyachina/Work/projects/lyrmin/konan/node_modules/vite-plugin-handlebars/dist/index.js";
import injectHTML from "file:///G:/Vsyachina/Work/projects/lyrmin/konan/node_modules/vite-plugin-html-inject/dist/index.mjs";
import { ViteImageOptimizer } from "file:///G:/Vsyachina/Work/projects/lyrmin/konan/node_modules/vite-plugin-image-optimizer/dist/index.mjs";
import cssnanoPlugin from "file:///G:/Vsyachina/Work/projects/lyrmin/konan/node_modules/cssnano/src/index.js";
import viteHTMLIncludes from "file:///G:/Vsyachina/Work/projects/lyrmin/konan/node_modules/@kingkongdevs/vite-plugin-html-includes/index.js";
import Unfonts from "file:///G:/Vsyachina/Work/projects/lyrmin/konan/node_modules/unplugin-fonts/dist/vite.mjs";

// vitejs/pages.config.js
import { resolve } from "path";
var __vite_injected_original_dirname = "G:\\Vsyachina\\Work\\projects\\lyrmin\\konan\\vitejs";
var pages = [
  { name: "index", path: resolve(__vite_injected_original_dirname, "../index.html") },
  { name: "home", path: resolve(__vite_injected_original_dirname, "../pages/home.html") },
  { name: "404", path: resolve(__vite_injected_original_dirname, "../pages/404.html") },
  { name: "contacts", path: resolve(__vite_injected_original_dirname, "../pages/contacts.html") },
  { name: "catalog", path: resolve(__vite_injected_original_dirname, "../pages/catalog.html") },
  { name: "product", path: resolve(__vite_injected_original_dirname, "../pages/product.html") },
  { name: "sales", path: resolve(__vite_injected_original_dirname, "../pages/sales.html") },
  { name: "sale", path: resolve(__vite_injected_original_dirname, "../pages/sale.html") },
  { name: "reviews", path: resolve(__vite_injected_original_dirname, "../pages/reviews.html") },
  { name: "payment-delivery", path: resolve(__vite_injected_original_dirname, "../pages/payment-delivery.html") },
  { name: "guarantees", path: resolve(__vite_injected_original_dirname, "../pages/guarantees.html") },
  { name: "politic", path: resolve(__vite_injected_original_dirname, "../pages/politic.html") },
  { name: "partners", path: resolve(__vite_injected_original_dirname, "../pages/partners.html") },
  { name: "security", path: resolve(__vite_injected_original_dirname, "../pages/security.html") },
  { name: "basket", path: resolve(__vite_injected_original_dirname, "../pages/basket.html") },
  { name: "checkout", path: resolve(__vite_injected_original_dirname, "../pages/checkout.html") },
  { name: "blog", path: resolve(__vite_injected_original_dirname, "../pages/blog.html") },
  { name: "article", path: resolve(__vite_injected_original_dirname, "../pages/article.html") }
];
var pages_config_default = pages;

// config/appendAssetVersion.js
import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve as resolve2 } from "node:path";
var CSS_OR_JS_ASSET_PATTERN = /((?:href|src)=["'])([^"'?#]+\.(?:css|js))(\?[^"'#]*)?(#[^"']*)?(["'])/gi;
var appendVersionToUrl = (url, version) => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${version}`;
};
var updateHtmlAssetLinks = (html, version) => html.replace(
  CSS_OR_JS_ASSET_PATTERN,
  (_, attributeStart, pathname, query = "", hash = "", attributeEnd) => `${attributeStart}${appendVersionToUrl(
    `${pathname}${query}`,
    version
  )}${hash}${attributeEnd}`
);
var getHtmlFiles = async (directoryPath) => {
  const directoryEntries = await readdir(directoryPath, { withFileTypes: true });
  const htmlFiles = [];
  for (const entry of directoryEntries) {
    const entryPath = resolve2(directoryPath, entry.name);
    if (entry.isDirectory()) {
      htmlFiles.push(...await getHtmlFiles(entryPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".html")) {
      htmlFiles.push(entryPath);
    }
  }
  return htmlFiles;
};
function appendAssetVersion() {
  let buildVersion = "";
  let outDir = "";
  return {
    name: "append-asset-version",
    apply: "build",
    configResolved(config) {
      outDir = resolve2(config.root, config.build.outDir);
    },
    buildStart() {
      buildVersion = String((/* @__PURE__ */ new Date()).getTime());
    },
    async closeBundle() {
      const version = buildVersion || String((/* @__PURE__ */ new Date()).getTime());
      const htmlFiles = await getHtmlFiles(outDir);
      for (const htmlFilePath of htmlFiles) {
        const html = await readFile(htmlFilePath, "utf8");
        const updatedHtml = updateHtmlAssetLinks(html, version);
        if (updatedHtml !== html) {
          await writeFile(htmlFilePath, updatedHtml);
        }
      }
    }
  };
}

// vite.config.js
var __vite_injected_original_dirname2 = "G:\\Vsyachina\\Work\\projects\\lyrmin\\konan";
var pagesInput = {};
pages_config_default.forEach((page) => {
  pagesInput[page.name] = page.path;
});
var fontsConditions = {
  "thin": {
    weight: 100
  },
  "light": {
    weight: 300
  },
  "extralight": {
    weight: 200
  },
  "medium": {
    weight: 500
  },
  "bold": {
    weight: 700
  },
  "semibold": {
    weight: 600
  },
  "extrabold": {
    weight: 900
  }
};
var fontTransformer = (font) => {
  Object.keys(fontsConditions).forEach((key) => {
    const value = fontsConditions[key];
    if (font.basename.toLowerCase().includes(key)) {
      if (value.weight) {
        font.weight = value.weight;
      }
    }
  });
  if (font.basename.toLowerCase().includes("italic")) {
    font.style = "italic";
  }
  return font;
};
var vite_config_default = defineConfig({
  build: {
    target: "es2017",
    // target: 'es5',
    outDir: "dist",
    rollupOptions: {
      input: {
        ...pagesInput
      },
      output: {
        // sourcemap: true,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name == "app.css") {
            return "assets/style.css";
          }
          return "assets/" + assetInfo.name;
        },
        chunkFileNames: (chunkInfo) => {
          console.log(chunkInfo);
          return "assets/[name].js";
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
      }
    },
    devSourcemap: true
  },
  server: {
    port: 3e3,
    host: "0.0.0.0",
    hmr: true
  },
  plugins: [
    Unfonts({
      custom: {
        families: [{
          name: "Onest",
          local: "Onest",
          src: "./public/local/template/konan/fonts/*",
          transform: fontTransformer
        }],
        display: "swap",
        preload: true,
        prefetch: false,
        injectTo: "head"
      }
    }),
    // ViteImageOptimizer(DEFAULT_OPTIONS),
    handlebars({
      partialDirectory: resolve3(__vite_injected_original_dirname2, "src/html")
    }),
    injectHTML(),
    // Минификация CSS
    cssnanoPlugin({
      preset: "default"
    }),
    appendAssetVersion(),
    viteHTMLIncludes({
      componentsPath: "/src/html/",
      componentsDir: "/src/html/"
    })
    // htmlReplacer(replaceArr)
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAidml0ZWpzL3BhZ2VzLmNvbmZpZy5qcyIsICJjb25maWcvYXBwZW5kQXNzZXRWZXJzaW9uLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRzpcXFxcVnN5YWNoaW5hXFxcXFdvcmtcXFxccHJvamVjdHNcXFxcbHlybWluXFxcXGtvbmFuXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJHOlxcXFxWc3lhY2hpbmFcXFxcV29ya1xcXFxwcm9qZWN0c1xcXFxseXJtaW5cXFxca29uYW5cXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0c6L1ZzeWFjaGluYS9Xb3JrL3Byb2plY3RzL2x5cm1pbi9rb25hbi92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgaGFuZGxlYmFycyBmcm9tICd2aXRlLXBsdWdpbi1oYW5kbGViYXJzJztcclxuaW1wb3J0IGluamVjdEhUTUwgZnJvbSAndml0ZS1wbHVnaW4taHRtbC1pbmplY3QnO1xyXG5pbXBvcnQgeyBWaXRlSW1hZ2VPcHRpbWl6ZXIgfSBmcm9tIFwidml0ZS1wbHVnaW4taW1hZ2Utb3B0aW1pemVyXCI7XHJcbmltcG9ydCB7IERFRkFVTFRfT1BUSU9OUyB9IGZyb20gJy4vY29uZmlnL2ltYWdlT3B0aW1pemVyQ29uZmlnJztcclxuaW1wb3J0IGNzc25hbm9QbHVnaW4gZnJvbSAnY3NzbmFubyc7XHJcbmltcG9ydCB2aXRlSFRNTEluY2x1ZGVzIGZyb20gJ0BraW5na29uZ2RldnMvdml0ZS1wbHVnaW4taHRtbC1pbmNsdWRlcyc7XHJcbmltcG9ydCBVbmZvbnRzIGZyb20gJ3VucGx1Z2luLWZvbnRzL3ZpdGUnO1xyXG5cclxuaW1wb3J0IHBhZ2VzIGZyb20gJy4vdml0ZWpzL3BhZ2VzLmNvbmZpZydcclxuaW1wb3J0IHsgaHRtbFJlcGxhY2VyIH0gZnJvbSAnLi9jb25maWcvaHRtbFJlcGxhY2VyJztcclxuaW1wb3J0IHsgYXBwZW5kQXNzZXRWZXJzaW9uIH0gZnJvbSAnLi9jb25maWcvYXBwZW5kQXNzZXRWZXJzaW9uJztcclxuXHJcbmNvbnN0IHBhZ2VzSW5wdXQgPSB7fVxyXG5cclxucGFnZXMuZm9yRWFjaCgocGFnZSA9PiB7XHJcbiAgICBwYWdlc0lucHV0W3BhZ2UubmFtZV0gPSBwYWdlLnBhdGhcclxufSkpO1xyXG5cclxuY29uc3QgcmVwbGFjZUFyciA9IFtcclxuICB7IGVudHJ5OiBgY3Jvc3NvcmlnaW5gLCByZXBsYWNlOiBgYCB9LFxyXG4gIHsgZW50cnk6IGBzY3JpcHRgLCByZXBsYWNlOiBgc2NyaXB0IGRlZmVyYCB9LFxyXG5dO1xyXG5cclxuY29uc3QgZm9udHNDb25kaXRpb25zID0ge1xyXG4gICd0aGluJzoge1xyXG4gICAgd2VpZ2h0OiAxMDBcclxuICB9LFxyXG4gICdsaWdodCc6IHtcclxuICAgIHdlaWdodDogMzAwXHJcbiAgfSxcclxuICAnZXh0cmFsaWdodCc6IHtcclxuICAgIHdlaWdodDogMjAwXHJcbiAgfSxcclxuICAnbWVkaXVtJzoge1xyXG4gICAgd2VpZ2h0OiA1MDBcclxuICB9LFxyXG4gICdib2xkJzoge1xyXG4gICAgd2VpZ2h0OiA3MDBcclxuICB9LFxyXG4gICdzZW1pYm9sZCc6IHtcclxuICAgIHdlaWdodDogNjAwXHJcbiAgfSxcclxuICAnZXh0cmFib2xkJzoge1xyXG4gICAgd2VpZ2h0OiA5MDBcclxuICB9LFxyXG59XHJcblxyXG5jb25zdCBmb250VHJhbnNmb3JtZXIgPSAoZm9udCkgPT4ge1xyXG4gIE9iamVjdC5rZXlzKGZvbnRzQ29uZGl0aW9ucykuZm9yRWFjaChrZXk9PntcclxuICAgIGNvbnN0IHZhbHVlID0gZm9udHNDb25kaXRpb25zW2tleV07XHJcbiAgICBpZiAoZm9udC5iYXNlbmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleSkpIHtcclxuICAgICAgaWYgKHZhbHVlLndlaWdodCkge1xyXG4gICAgICAgIGZvbnQud2VpZ2h0ID0gdmFsdWUud2VpZ2h0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSlcclxuICBpZiAoZm9udC5iYXNlbmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdpdGFsaWMnKSkge1xyXG4gICAgZm9udC5zdHlsZSA9ICdpdGFsaWMnO1xyXG4gIH1cclxuICByZXR1cm4gZm9udFxyXG59XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBidWlsZDoge1xyXG4gICAgdGFyZ2V0OiAnZXMyMDE3JyxcclxuICAgIC8vIHRhcmdldDogJ2VzNScsXHJcbiAgICBvdXREaXI6ICdkaXN0JyxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgaW5wdXQ6IHtcclxuICAgICAgICAuLi5wYWdlc0lucHV0XHJcbiAgICAgIH0sXHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIC8vIHNvdXJjZW1hcDogdHJ1ZSxcclxuICAgICAgICBhc3NldEZpbGVOYW1lczogKGFzc2V0SW5mbykgPT4ge1xyXG4gICAgICAgICAgaWYgKGFzc2V0SW5mby5uYW1lID09ICdhcHAuY3NzJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2Fzc2V0cy9zdHlsZS5jc3MnO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybiAnYXNzZXRzLycrYXNzZXRJbmZvLm5hbWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjaHVua0ZpbGVOYW1lczogKGNodW5rSW5mbykgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coY2h1bmtJbmZvKTtcclxuICAgICAgICAgIHJldHVybiBcImFzc2V0cy9bbmFtZV0uanNcIlxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY3NzOiB7XHJcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgIHNjc3M6IHtcclxuICAgICAgICBhcGk6ICdtb2Rlcm4tY29tcGlsZXInXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBkZXZTb3VyY2VtYXA6IHRydWUsXHJcbiAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDMwMDAsXHJcbiAgICBob3N0OiAnMC4wLjAuMCcsXHJcbiAgICBobXI6IHRydWUsXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICBVbmZvbnRzKHtcclxuICAgICAgY3VzdG9tOiB7XHJcbiAgICAgICAgZmFtaWxpZXM6IFt7XHJcbiAgICAgICAgICBuYW1lOiAnT25lc3QnLFxyXG4gICAgICAgICAgbG9jYWw6ICdPbmVzdCcsXHJcbiAgICAgICAgICBzcmM6ICcuL3B1YmxpYy9sb2NhbC90ZW1wbGF0ZS9rb25hbi9mb250cy8qJyxcclxuICAgICAgICAgIHRyYW5zZm9ybTogZm9udFRyYW5zZm9ybWVyXHJcbiAgICAgICAgfV0sXHJcbiAgICAgICAgZGlzcGxheTogJ3N3YXAnLFxyXG4gICAgICAgIHByZWxvYWQ6IHRydWUsXHJcbiAgICAgICAgcHJlZmV0Y2g6IGZhbHNlLFxyXG4gICAgICAgIGluamVjdFRvOiAnaGVhZCcsXHJcbiAgICAgIH0sXHJcbiAgICB9KSxcclxuICAgIC8vIFZpdGVJbWFnZU9wdGltaXplcihERUZBVUxUX09QVElPTlMpLFxyXG4gICAgaGFuZGxlYmFycyh7XHJcbiAgICAgIHBhcnRpYWxEaXJlY3Rvcnk6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2h0bWwnKSxcclxuICAgIH0pLFxyXG4gICAgaW5qZWN0SFRNTCgpLFxyXG4gICAgLy8gXHUwNDFDXHUwNDM4XHUwNDNEXHUwNDM4XHUwNDQ0XHUwNDM4XHUwNDNBXHUwNDMwXHUwNDQ2XHUwNDM4XHUwNDRGIENTU1xyXG4gICAgY3NzbmFub1BsdWdpbih7XHJcbiAgICAgIHByZXNldDogXCJkZWZhdWx0XCIsXHJcbiAgICB9KSxcclxuICAgIGFwcGVuZEFzc2V0VmVyc2lvbigpLFxyXG4gICAgdml0ZUhUTUxJbmNsdWRlcyh7XHJcbiAgICAgIGNvbXBvbmVudHNQYXRoOiAnL3NyYy9odG1sLycsXHJcbiAgICAgIGNvbXBvbmVudHNEaXI6ICcvc3JjL2h0bWwvJ1xyXG4gICAgfSksXHJcbiAgICAvLyBodG1sUmVwbGFjZXIocmVwbGFjZUFycilcclxuICBdLFxyXG59KVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkc6XFxcXFZzeWFjaGluYVxcXFxXb3JrXFxcXHByb2plY3RzXFxcXGx5cm1pblxcXFxrb25hblxcXFx2aXRlanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkc6XFxcXFZzeWFjaGluYVxcXFxXb3JrXFxcXHByb2plY3RzXFxcXGx5cm1pblxcXFxrb25hblxcXFx2aXRlanNcXFxccGFnZXMuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9HOi9Wc3lhY2hpbmEvV29yay9wcm9qZWN0cy9seXJtaW4va29uYW4vdml0ZWpzL3BhZ2VzLmNvbmZpZy5qc1wiO2ltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xyXG5cclxuY29uc3QgcGFnZXMgPSBbXHJcbiAge25hbWU6ICdpbmRleCcsICAgICAgICAgICAgIHBhdGg6IHJlc29sdmUoX19kaXJuYW1lLCAnLi4vaW5kZXguaHRtbCcpICAgICAgICAgICAgICAgICAgfSxcclxuICB7bmFtZTogJ2hvbWUnLCAgICAgICAgICAgICAgcGF0aDogcmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9wYWdlcy9ob21lLmh0bWwnKSAgICAgICAgICAgICB9LFxyXG4gIHtuYW1lOiAnNDA0JywgICAgICAgICAgICAgICBwYXRoOiByZXNvbHZlKF9fZGlybmFtZSwgJy4uL3BhZ2VzLzQwNC5odG1sJykgICAgICAgICAgICAgIH0sXHJcbiAge25hbWU6ICdjb250YWN0cycsICAgICAgICAgIHBhdGg6IHJlc29sdmUoX19kaXJuYW1lLCAnLi4vcGFnZXMvY29udGFjdHMuaHRtbCcpICAgICAgICAgfSxcclxuICB7bmFtZTogJ2NhdGFsb2cnLCAgICAgICAgICAgcGF0aDogcmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9wYWdlcy9jYXRhbG9nLmh0bWwnKSAgICAgICAgICB9LFxyXG4gIHtuYW1lOiAncHJvZHVjdCcsICAgICAgICAgICBwYXRoOiByZXNvbHZlKF9fZGlybmFtZSwgJy4uL3BhZ2VzL3Byb2R1Y3QuaHRtbCcpICAgICAgICAgIH0sXHJcbiAge25hbWU6ICdzYWxlcycsICAgICAgICAgICAgIHBhdGg6IHJlc29sdmUoX19kaXJuYW1lLCAnLi4vcGFnZXMvc2FsZXMuaHRtbCcpICAgICAgICAgICAgfSxcclxuICB7bmFtZTogJ3NhbGUnLCAgICAgICAgICAgICAgcGF0aDogcmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9wYWdlcy9zYWxlLmh0bWwnKSAgICAgICAgICAgICB9LFxyXG4gIHtuYW1lOiAncmV2aWV3cycsICAgICAgICAgICBwYXRoOiByZXNvbHZlKF9fZGlybmFtZSwgJy4uL3BhZ2VzL3Jldmlld3MuaHRtbCcpICAgICAgICAgIH0sXHJcbiAge25hbWU6ICdwYXltZW50LWRlbGl2ZXJ5JywgIHBhdGg6IHJlc29sdmUoX19kaXJuYW1lLCAnLi4vcGFnZXMvcGF5bWVudC1kZWxpdmVyeS5odG1sJykgfSxcclxuICB7bmFtZTogJ2d1YXJhbnRlZXMnLCAgICAgICAgcGF0aDogcmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9wYWdlcy9ndWFyYW50ZWVzLmh0bWwnKSAgICAgICB9LFxyXG4gIHtuYW1lOiAncG9saXRpYycsICAgICAgICAgICBwYXRoOiByZXNvbHZlKF9fZGlybmFtZSwgJy4uL3BhZ2VzL3BvbGl0aWMuaHRtbCcpICAgICAgICAgIH0sXHJcbiAge25hbWU6ICdwYXJ0bmVycycsICAgICAgICAgIHBhdGg6IHJlc29sdmUoX19kaXJuYW1lLCAnLi4vcGFnZXMvcGFydG5lcnMuaHRtbCcpICAgICAgICAgfSxcclxuICB7bmFtZTogJ3NlY3VyaXR5JywgICAgICAgICAgcGF0aDogcmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9wYWdlcy9zZWN1cml0eS5odG1sJykgICAgICAgICB9LFxyXG4gIHtuYW1lOiAnYmFza2V0JywgICAgICAgICAgICBwYXRoOiByZXNvbHZlKF9fZGlybmFtZSwgJy4uL3BhZ2VzL2Jhc2tldC5odG1sJykgICAgICAgICAgIH0sXHJcbiAge25hbWU6ICdjaGVja291dCcsICAgICAgICAgIHBhdGg6IHJlc29sdmUoX19kaXJuYW1lLCAnLi4vcGFnZXMvY2hlY2tvdXQuaHRtbCcpICAgICAgICAgfSxcclxuICB7bmFtZTogJ2Jsb2cnLCAgICAgICAgICAgICAgcGF0aDogcmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9wYWdlcy9ibG9nLmh0bWwnKSAgICAgICAgICAgICB9LFxyXG4gIHtuYW1lOiAnYXJ0aWNsZScsICAgICAgICAgICBwYXRoOiByZXNvbHZlKF9fZGlybmFtZSwgJy4uL3BhZ2VzL2FydGljbGUuaHRtbCcpICAgICAgICAgIH0sXHJcbl07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBwYWdlcyIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRzpcXFxcVnN5YWNoaW5hXFxcXFdvcmtcXFxccHJvamVjdHNcXFxcbHlybWluXFxcXGtvbmFuXFxcXGNvbmZpZ1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRzpcXFxcVnN5YWNoaW5hXFxcXFdvcmtcXFxccHJvamVjdHNcXFxcbHlybWluXFxcXGtvbmFuXFxcXGNvbmZpZ1xcXFxhcHBlbmRBc3NldFZlcnNpb24uanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0c6L1ZzeWFjaGluYS9Xb3JrL3Byb2plY3RzL2x5cm1pbi9rb25hbi9jb25maWcvYXBwZW5kQXNzZXRWZXJzaW9uLmpzXCI7aW1wb3J0IHsgcmVhZGRpciwgcmVhZEZpbGUsIHdyaXRlRmlsZSB9IGZyb20gJ25vZGU6ZnMvcHJvbWlzZXMnO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ25vZGU6cGF0aCc7XG5cbmNvbnN0IENTU19PUl9KU19BU1NFVF9QQVRURVJOID1cbiAgLygoPzpocmVmfHNyYyk9W1wiJ10pKFteXCInPyNdK1xcLig/OmNzc3xqcykpKFxcP1teXCInI10qKT8oI1teXCInXSopPyhbXCInXSkvZ2k7XG5cbmNvbnN0IGFwcGVuZFZlcnNpb25Ub1VybCA9ICh1cmwsIHZlcnNpb24pID0+IHtcbiAgY29uc3Qgc2VwYXJhdG9yID0gdXJsLmluY2x1ZGVzKCc/JykgPyAnJicgOiAnPyc7XG5cbiAgcmV0dXJuIGAke3VybH0ke3NlcGFyYXRvcn12PSR7dmVyc2lvbn1gO1xufTtcblxuY29uc3QgdXBkYXRlSHRtbEFzc2V0TGlua3MgPSAoaHRtbCwgdmVyc2lvbikgPT5cbiAgaHRtbC5yZXBsYWNlKFxuICAgIENTU19PUl9KU19BU1NFVF9QQVRURVJOLFxuICAgIChfLCBhdHRyaWJ1dGVTdGFydCwgcGF0aG5hbWUsIHF1ZXJ5ID0gJycsIGhhc2ggPSAnJywgYXR0cmlidXRlRW5kKSA9PlxuICAgICAgYCR7YXR0cmlidXRlU3RhcnR9JHthcHBlbmRWZXJzaW9uVG9VcmwoXG4gICAgICAgIGAke3BhdGhuYW1lfSR7cXVlcnl9YCxcbiAgICAgICAgdmVyc2lvblxuICAgICAgKX0ke2hhc2h9JHthdHRyaWJ1dGVFbmR9YFxuICApO1xuXG5jb25zdCBnZXRIdG1sRmlsZXMgPSBhc3luYyAoZGlyZWN0b3J5UGF0aCkgPT4ge1xuICBjb25zdCBkaXJlY3RvcnlFbnRyaWVzID0gYXdhaXQgcmVhZGRpcihkaXJlY3RvcnlQYXRoLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XG4gIGNvbnN0IGh0bWxGaWxlcyA9IFtdO1xuXG4gIGZvciAoY29uc3QgZW50cnkgb2YgZGlyZWN0b3J5RW50cmllcykge1xuICAgIGNvbnN0IGVudHJ5UGF0aCA9IHJlc29sdmUoZGlyZWN0b3J5UGF0aCwgZW50cnkubmFtZSk7XG5cbiAgICBpZiAoZW50cnkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgaHRtbEZpbGVzLnB1c2goLi4uKGF3YWl0IGdldEh0bWxGaWxlcyhlbnRyeVBhdGgpKSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoZW50cnkuaXNGaWxlKCkgJiYgZW50cnkubmFtZS5lbmRzV2l0aCgnLmh0bWwnKSkge1xuICAgICAgaHRtbEZpbGVzLnB1c2goZW50cnlQYXRoKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaHRtbEZpbGVzO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGVuZEFzc2V0VmVyc2lvbigpIHtcbiAgbGV0IGJ1aWxkVmVyc2lvbiA9ICcnO1xuICBsZXQgb3V0RGlyID0gJyc7XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnYXBwZW5kLWFzc2V0LXZlcnNpb24nLFxuICAgIGFwcGx5OiAnYnVpbGQnLFxuICAgIGNvbmZpZ1Jlc29sdmVkKGNvbmZpZykge1xuICAgICAgb3V0RGlyID0gcmVzb2x2ZShjb25maWcucm9vdCwgY29uZmlnLmJ1aWxkLm91dERpcik7XG4gICAgfSxcbiAgICBidWlsZFN0YXJ0KCkge1xuICAgICAgYnVpbGRWZXJzaW9uID0gU3RyaW5nKG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgICB9LFxuICAgIGFzeW5jIGNsb3NlQnVuZGxlKCkge1xuICAgICAgY29uc3QgdmVyc2lvbiA9IGJ1aWxkVmVyc2lvbiB8fCBTdHJpbmcobmV3IERhdGUoKS5nZXRUaW1lKCkpO1xuICAgICAgY29uc3QgaHRtbEZpbGVzID0gYXdhaXQgZ2V0SHRtbEZpbGVzKG91dERpcik7XG5cbiAgICAgIGZvciAoY29uc3QgaHRtbEZpbGVQYXRoIG9mIGh0bWxGaWxlcykge1xuICAgICAgICBjb25zdCBodG1sID0gYXdhaXQgcmVhZEZpbGUoaHRtbEZpbGVQYXRoLCAndXRmOCcpO1xuICAgICAgICBjb25zdCB1cGRhdGVkSHRtbCA9IHVwZGF0ZUh0bWxBc3NldExpbmtzKGh0bWwsIHZlcnNpb24pO1xuXG4gICAgICAgIGlmICh1cGRhdGVkSHRtbCAhPT0gaHRtbCkge1xuICAgICAgICAgIGF3YWl0IHdyaXRlRmlsZShodG1sRmlsZVBhdGgsIHVwZGF0ZWRIdG1sKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gIH07XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1ULFNBQVMsV0FBQUEsZ0JBQWU7QUFDM1UsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywwQkFBMEI7QUFFbkMsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxzQkFBc0I7QUFDN0IsT0FBTyxhQUFhOzs7QUNSd1QsU0FBUyxlQUFlO0FBQXBXLElBQU0sbUNBQW1DO0FBRXpDLElBQU0sUUFBUTtBQUFBLEVBQ1osRUFBQyxNQUFNLFNBQXFCLE1BQU0sUUFBUSxrQ0FBVyxlQUFlLEVBQW1CO0FBQUEsRUFDdkYsRUFBQyxNQUFNLFFBQXFCLE1BQU0sUUFBUSxrQ0FBVyxvQkFBb0IsRUFBYztBQUFBLEVBQ3ZGLEVBQUMsTUFBTSxPQUFxQixNQUFNLFFBQVEsa0NBQVcsbUJBQW1CLEVBQWU7QUFBQSxFQUN2RixFQUFDLE1BQU0sWUFBcUIsTUFBTSxRQUFRLGtDQUFXLHdCQUF3QixFQUFVO0FBQUEsRUFDdkYsRUFBQyxNQUFNLFdBQXFCLE1BQU0sUUFBUSxrQ0FBVyx1QkFBdUIsRUFBVztBQUFBLEVBQ3ZGLEVBQUMsTUFBTSxXQUFxQixNQUFNLFFBQVEsa0NBQVcsdUJBQXVCLEVBQVc7QUFBQSxFQUN2RixFQUFDLE1BQU0sU0FBcUIsTUFBTSxRQUFRLGtDQUFXLHFCQUFxQixFQUFhO0FBQUEsRUFD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
