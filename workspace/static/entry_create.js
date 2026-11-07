import { W as t, u as o } from "./wc-runtime-CNDpK4lj.js";
import { l as r, s as n } from "./styles-VL8uLHxK.js";
import "@iconify/vue";
import { define as s } from "@wippy-fe/proxy";
const i = {
  type: "object",
  properties: {
    type: { type: "string" },
    "parent-id": { type: "string" }
  }
}, a = r(
  () => import("./EntryCreate-DLHDAMTz.js"),
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
