import { W as o, l as s } from "./wc-runtime-CEQ5gZTA.js";
import { s as i } from "./styles-Bsh0K-CX.js";
import { define as n } from "@wippy-fe/proxy";
const r = { type: "object", properties: {} };
class e extends o {
  static get wippyConfig() {
    return { propsSchema: r, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"], inlineCss: i };
  }
  static get vueConfig() {
    return {
      ...s(() => import("./admin-mount-CIvdktNU.js").then((t) => t.mountConfig), { surface: "page", loading: "Loading…", failed: "Could not load Autocode settings. Reload the page to try again.", timeout: 3e4 })
    };
  }
}
async function u() {
  return e;
}
n(import.meta.url, e);
export {
  u as webComponent
};
