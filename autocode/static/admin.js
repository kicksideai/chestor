import { W as i, l as a } from "./wc-runtime-DbdXH-lj.js";
import { s as o } from "./styles-Bsh0K-CX.js";
import { define as t } from "@wippy-fe/proxy";
const m = ".ac-limits{max-width:70rem}.ac-limit-group{gap:0}.ac-limit-group>h3{padding-block-end:.75rem}.ac-limit-row{align-items:start;border-top:1px solid var(--p-content-border-color);display:grid;gap:.75rem 1rem;grid-template-columns:minmax(12rem,1fr) minmax(9rem,12rem) minmax(9rem,auto);padding-block:.75rem}.ac-limit-row:last-child{padding-block-end:0}.ac-limit-row .ac-hint,.ac-provider-detail .ac-hint{margin:.25rem 0 0}.ac-limit-actions{display:flex;flex-wrap:wrap;gap:.25rem}.ac-limit-error{grid-column:1 / -1}.ac-limit-status{margin:0;color:var(--p-text-muted-color)}.ac-provider-layout{display:grid;grid-template-columns:minmax(12rem,17rem) minmax(0,1fr);gap:1rem;align-items:start}.ac-provider-list{display:grid;gap:.35rem}.ac-provider-choice{display:flex;align-items:center;gap:.75rem;text-align:start;cursor:pointer;width:100%;padding:.75rem;border:1px solid var(--p-content-border-color);border-radius:var(--p-content-border-radius);color:var(--p-text-color);background:var(--p-content-background);font:inherit}.ac-provider-choice>svg{flex:none;font-size:1.25rem}.ac-provider-choice>span{display:grid;gap:.25rem}.ac-provider-choice:hover,.ac-provider-choice[aria-pressed=true]{background:var(--p-content-hover-background)}.ac-provider-choice[aria-pressed=true]{border-color:var(--p-primary-color)}.ac-provider-detail{min-width:0}.ac-provider-detail>p,.ac-provider-actions p{margin-block:0}@media(max-width:45rem){.ac-provider-layout,.ac-limit-row{grid-template-columns:minmax(0,1fr)}.ac-provider-list{grid-template-columns:repeat(auto-fit,minmax(min(11rem,100%),1fr))}}", n = { type: "object", properties: {} };
class r extends i {
  static get wippyConfig() {
    return { propsSchema: n, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"], inlineCss: o + m };
  }
  static get vueConfig() {
    return {
      ...a(() => import("./admin-mount-_1CSJAkh.js").then((e) => e.mountConfig), { surface: "page", loading: "Loading…", failed: "Could not load Autocode settings. Reload the page to try again.", timeout: 3e4 })
    };
  }
}
async function s() {
  return r;
}
t(import.meta.url, r);
export {
  s as webComponent
};
