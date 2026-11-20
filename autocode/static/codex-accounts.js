import "vue";
import "./wc-runtime-DbdXH-lj.js";
import { D as e, p as n } from "./driver-account-CSm2xAAl.js";
import { define as r } from "@wippy-fe/proxy";
class t extends e {
  static get vueConfig() {
    return n(() => import("./provider-accounts-mount-nK5v6Fs9.js").then((o) => o.mountConfig));
  }
}
async function u() {
  return t;
}
r(import.meta.url, t);
export {
  u as webComponent
};
