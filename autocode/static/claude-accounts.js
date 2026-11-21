import "vue";
import { P as o } from "./wc-runtime-DgMRDxeK.js";
import { D as n, p as r } from "./driver-account-BHooVDXw.js";
import { define as i } from "@wippy-fe/proxy";
class t extends n {
  static get vueConfig() {
    return r(() => import("./claude-provider-accounts-B5d20IRB.js").then((e) => ({ rootComponent: e.default, plugins: [o] })));
  }
}
async function a() {
  return t;
}
i(import.meta.url, t);
export {
  a as webComponent
};
