import { W as o, u as r } from "./wc-runtime-ClNbKZcC.js";
import { l as s } from "./lazy-BJ8Fi15o.js";
import { s as n } from "./styles-HSyuw4_P.js";
import "@iconify/vue";
import { define as p } from "@wippy-fe/proxy";
const i = { props: { type: "object", properties: { route: { type: "string", default: "", description: "Path relative to /autocode; runs/<run_id> opens a run." } } } }, a = {
  wippy: i
};
class e extends o {
  static get wippyConfig() {
    return {
      propsSchema: a.wippy.props,
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"],
      inlineCss: n
    };
  }
  static get vueConfig() {
    return {
      lazyConfig: s(
        () => import("./index-mount-DOx6kv_q.js").then((t) => t.mountConfig),
        "Could not load Autocode. Reload the page to try again.",
        r
      )
    };
  }
}
async function y() {
  return e;
}
p(import.meta.url, e);
export {
  y as webComponent
};
