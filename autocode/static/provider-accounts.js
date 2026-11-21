import "vue";
import "./wc-runtime-CvWl7e3g.js";
import { D as e, p as r } from "./driver-account-BqgIXn-z.js";
import { define as n } from "@wippy-fe/proxy";
class t extends e {
  static get vueConfig() {
    return r(() => import("./provider-accounts-mount-D9ZRuPsZ.js").then((o) => o.mountConfig));
  }
}
async function u() {
  return t;
}
n(import.meta.url, t);
export {
  u as webComponent
};
