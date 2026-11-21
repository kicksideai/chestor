import { W as o, l as r } from "./wc-runtime-DgMRDxeK.js";
import { s } from "./styles-Bsh0K-CX.js";
import { define as i } from "@wippy-fe/proxy";
const n = { props: { type: "object", properties: { route: { type: "string", default: "", description: "Path relative to /autocode; runs/<run_id> opens a run." } } } }, p = {
  wippy: n
};
class e extends o {
  static get wippyConfig() {
    return {
      propsSchema: p.wippy.props,
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"],
      inlineCss: s
    };
  }
  static get vueConfig() {
    return {
      ...r(() => import("./index-mount-DT9xgYtm.js").then((t) => t.mountConfig), { surface: "page", loading: "Loading…", failed: "Could not load Autocode. Reload the page to try again.", timeout: 3e4 })
    };
  }
}
async function c() {
  return e;
}
i(import.meta.url, e);
export {
  c as webComponent
};
