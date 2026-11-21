import "vue";
import "./wc-runtime-DgMRDxeK.js";
import { D as e, p as r } from "./driver-account-BHooVDXw.js";
import { define as n } from "@wippy-fe/proxy";
class t extends e {
  static get vueConfig() {
    return r(() => import("./provider-accounts-mount-CSaherjq.js").then((o) => o.mountConfig));
  }
}
async function u() {
  return t;
}
n(import.meta.url, t);
export {
  u as webComponent
};
