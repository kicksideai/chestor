import { W as t, u as o } from "./wc-runtime-BIZwvF6q.js";
import { l as r, s as n } from "./styles-DP-xQddr.js";
import "@iconify/vue";
import { define as s } from "@wippy-fe/proxy";
const i = {
  type: "object",
  properties: {
    type: { type: "string" },
    "parent-id": { type: "string" }
  }
}, a = r(
  () => import("./EntryCreate-C7anMRIl.js"),
  { loading: "Loading the create form…", failed: "Could not load the create form. Reload the page to try again." },
  o
);
class e extends t {
  static get wippyConfig() {
    return {
      propsSchema: i,
      hostCssKeys: ["themeConfigUrl", "iframeCssUrl"],
      inlineCss: n
    };
  }
  static get vueConfig() {
    return { rootComponent: a };
  }
}
async function c() {
  return e;
}
s(import.meta.url, e);
export {
  c as webComponent
};
//# sourceMappingURL=entry_create.js.map
