import { W as o, l as r } from "./wc-runtime-B0OetHdg.js";
import { s as n } from "./styles-Du9OJcMy.js";
import { define as i } from "@wippy-fe/proxy";
const a = {
  type: "object",
  properties: {
    type: { type: "string" },
    "parent-id": { type: "string" }
  }
};
class e extends o {
  static get wippyConfig() {
    return {
      propsSchema: a,
      hostCssKeys: ["themeConfigUrl", "iframeCssUrl"],
      inlineCss: n
    };
  }
  static get vueConfig() {
    return r(() => import("./EntryCreate-nArTTV9z.js").then((t) => ({ rootComponent: t.default })), { surface: "compact", loading: "Loading the create form…", failed: "Could not load the create form. Reload the page to try again.", delay: 200, timeout: 3e4 });
  }
}
async function f() {
  return e;
}
i(import.meta.url, e);
export {
  f as webComponent
};
//# sourceMappingURL=entry_create.js.map
