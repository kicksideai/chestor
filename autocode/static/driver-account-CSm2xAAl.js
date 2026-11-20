import { W as t, l as o } from "./wc-runtime-DbdXH-lj.js";
import { s } from "./styles-Bsh0K-CX.js";
const i = {
  type: "object",
  properties: {
    "provider-id": { type: "string", default: "", description: "Registry ID of the Autocode driver binding." }
  }
};
class p extends t {
  static get wippyConfig() {
    return {
      propsSchema: i,
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"],
      inlineCss: s + ":host, :host > div { height: auto; }"
    };
  }
}
function a(e) {
  return o(e, {
    surface: "compact",
    loading: "Loading accounts…",
    failed: "Could not load accounts.",
    timeout: 3e4
  });
}
export {
  p as D,
  a as p
};
