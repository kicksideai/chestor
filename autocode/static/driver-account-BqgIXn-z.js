import { W as a, l as o } from "./wc-runtime-CvWl7e3g.js";
import { s as t } from "./styles-B5ax8-b4.js";
const r = ".kx-modal-head-icon{width:38px;height:38px;border-radius:11px;flex:none;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.kx-modal-head-icon svg{width:20px;height:20px}.kx-modal-head-text{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}.kx-modal-head-title{font-size:15.5px;font-weight:700;color:var(--p-text-color);line-height:1.2}.kx-modal-head-sub{font-size:12.5px;font-weight:400;color:var(--p-text-muted-color);line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ac-dialog-header:has(.kx-modal-head-icon) h2{margin-inline-end:auto}.ac-provider-actions{align-items:center}.ac-provider-actions p,.ac-managed-account p{margin:0}.ac-managed-account{flex-wrap:nowrap}.ac-managed-account .ac-row-name{font-size:14px}.ac-account-summary,.ac-usage-label,.ac-device-code,.ac-setup-actions{display:flex;align-items:center;flex-wrap:wrap;gap:8px}.ac-usage-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,9rem),1fr));gap:10px}.ac-usage-window{display:grid;gap:4px}.ac-usage-label{justify-content:space-between;font-size:12px}.ac-usage-meter{height:5px}.ac-usage-limited{--p-progressbar-value-background: var(--p-warn-color)}.ac-account-details{color:var(--p-text-muted-color);font-size:12px;overflow-wrap:anywhere}.ac-setup-steps{display:grid;gap:8px;margin-block:0;padding-inline-start:1.25rem}.ac-device-code>code{background:var(--kx-overlay-hover);border-radius:var(--kx-radius-8);font-size:1.15rem;letter-spacing:.08em;padding:8px 12px}.ac-advanced-credential{border-top:1px solid var(--p-content-border-color);padding-block-start:12px}", i = {
  type: "object",
  properties: {
    "provider-id": { type: "string", default: "", description: "Registry ID of the Autocode driver binding." }
  }
};
class s extends a {
  static get wippyConfig() {
    return {
      propsSchema: i,
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"],
      inlineCss: t + r + ":host, :host > div { height: auto; }"
    };
  }
}
function p(e) {
  return o(e, {
    surface: "compact",
    loading: "Loading accounts…",
    failed: "Could not load accounts.",
    timeout: 3e4
  });
}
export {
  s as D,
  p
};
