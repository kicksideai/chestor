import { W as o, l as r } from "./wc-runtime-B0OetHdg.js";
import { s } from "./styles-Du9OJcMy.js";
import { define as i } from "@wippy-fe/proxy";
class e extends o {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { route: { type: "string" } } },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"],
      inlineCss: s
    };
  }
  static get vueConfig() {
    return {
      ...r(() => import("./lazy-mount-DxukQOL2.js").then((t) => t.mountConfig), { surface: "page", loading: "Loading…", failed: "Could not load the workspace. Reload the page to try again.", timeout: 3e4 })
    };
  }
}
async function l() {
  return e;
}
i(import.meta.url, e);
export {
  l as webComponent
};
//# sourceMappingURL=index.js.map
