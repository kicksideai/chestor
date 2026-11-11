import { W as o, u as r } from "./wc-runtime-CNDpK4lj.js";
import { s, a as n } from "./styles-DP-xQddr.js";
import "@iconify/vue";
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
      lazyConfig: n(
        () => import("./lazy-mount-BBby_phr.js").then((t) => t.mountConfig),
        "Could not load the workspace. Reload the page to try again.",
        r
      )
    };
  }
}
async function f() {
  return e;
}
i(import.meta.url, e);
export {
  f as webComponent
};
//# sourceMappingURL=index.js.map
