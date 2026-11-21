import "vue";
import { P as o } from "./wc-runtime-CvWl7e3g.js";
import { D as n, p as r } from "./driver-account-BqgIXn-z.js";
import { define as i } from "@wippy-fe/proxy";
class t extends n {
  static get vueConfig() {
    return r(() => import("./codex-provider-accounts-CI2uRbgC.js").then((e) => ({ rootComponent: e.default, plugins: [o] })));
  }
}
async function a() {
  return t;
}
i(import.meta.url, t);
export {
  a as webComponent
};
