import { W as o, u as s } from "./wc-runtime-6vw183jT.js";
import { l as r } from "./lazy-ZWC1tvFC.js";
import { s as n } from "./styles-BbmDgjzB.js";
import "@iconify/vue";
import { define as i } from "@wippy-fe/proxy";
const m = { type: "object", properties: {} };
class e extends o {
  static get wippyConfig() {
    return { propsSchema: m, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"], inlineCss: n };
  }
  static get vueConfig() {
    return {
      lazyConfig: r(
        () => import("./admin-mount-CFBpHHip.js").then((t) => t.mountConfig),
        "Could not load Autocode settings. Reload the page to try again.",
        s
      )
    };
  }
}
async function g() {
  return e;
}
i(import.meta.url, e);
export {
  g as webComponent
};
