import {
  defineHeadPlugin,
  resolveTitleTemplate
} from "./chunk-FF6TV3JN.js";

// node_modules/@unhead/addons/dist/index.mjs
function InferSeoMetaPlugin(options = {}) {
  return defineHeadPlugin({
    hooks: {
      entries: {
        resolve({ entries }) {
          var _a;
          let titleTemplate = null;
          for (const entry of entries) {
            const inputKey = entry.resolvedInput ? "resolvedInput" : "input";
            const input = entry[inputKey];
            if (typeof input.titleTemplate !== "undefined")
              titleTemplate = input.titleTemplate;
          }
          for (const entry of entries) {
            const inputKey = entry.resolvedInput ? "resolvedInput" : "input";
            const input = entry[inputKey];
            const resolvedMeta = input.meta || [];
            titleTemplate = resolveTitleTemplate(titleTemplate, input.title);
            const title = input.title;
            const description = (_a = resolvedMeta.find((meta) => meta.name === "description")) == null ? void 0 : _a.content;
            const hasOgTitle = resolvedMeta.some((meta) => meta.property === "og:title");
            const hasOgImage = resolvedMeta.some((meta) => meta.property === "og:image");
            const hasTwitterCard = resolvedMeta.some((meta) => meta.name === "twitter:card");
            const hasOgDescription = resolvedMeta.some((meta) => meta.property === "og:description");
            entry[inputKey].meta = input.meta || [];
            if (!hasOgTitle && (input.titleTemplate || input.title)) {
              let newOgTitle = (options == null ? void 0 : options.ogTitle) || titleTemplate || input.title;
              if (typeof newOgTitle === "function")
                newOgTitle = newOgTitle(title);
              if (newOgTitle) {
                entry[inputKey].meta.push({
                  property: "og:title",
                  // have the og:title be removed if we don't have a title
                  content: String(newOgTitle)
                });
              }
            }
            if (description && !hasOgDescription) {
              let newOgDescription = (options == null ? void 0 : options.ogDescription) || description;
              if (typeof newOgDescription === "function")
                newOgDescription = newOgDescription(title);
              if (newOgDescription) {
                entry[inputKey].meta.push({
                  property: "og:description",
                  content: String(newOgDescription)
                });
              }
            }
            if (hasOgImage && !hasTwitterCard) {
              entry[inputKey].meta.push({
                name: "twitter:card",
                content: (options == null ? void 0 : options.twitterCard) || "summary_large_image"
              });
            }
          }
        }
      }
    }
  });
}
var DefaultCriticalTags = {
  htmlAttrs: {
    lang: "en"
  },
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" }
  ]
};
export {
  DefaultCriticalTags,
  InferSeoMetaPlugin
};
//# sourceMappingURL=@unhead_addons.js.map