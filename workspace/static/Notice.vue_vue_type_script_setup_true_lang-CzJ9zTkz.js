import { ref as v, defineComponent as $, onMounted as F, watch as S, onBeforeUnmount as D, openBlock as m, createElementBlock as y, createElementVNode as w, createTextVNode as L, toDisplayString as x, createCommentVNode as V, normalizeClass as C, createBlock as P, unref as _, renderSlot as A, createVNode as I } from "vue";
import { api as d, loadByTagName as M } from "@wippy-fe/proxy";
import { Icon as B } from "@iconify/vue";
const p = "/api/v1/workspace/entries";
function T(e, s) {
  const o = e?.response?.data ?? e?.data;
  return typeof o?.error == "string" && o.error ? o.error : e instanceof Error ? e.message : s;
}
function Y() {
  const e = v([]), s = v("");
  async function o() {
    try {
      const { data: t } = await d.get(`${p}/types`);
      t.success && (e.value = t.types ?? []);
    } catch (t) {
      s.value = T(t, "failed to load types");
    }
  }
  async function u(t) {
    const a = t ? `${p}?parent_id=${encodeURIComponent(t)}` : p;
    try {
      const { data: n } = await d.get(a);
      if (!n.success) throw new Error(n.error || "Could not load this folder.");
      return n.entries ?? [];
    } catch (n) {
      throw new Error(T(n, "Could not load this folder."));
    }
  }
  async function l(t) {
    const { data: a } = await d.get(`${p}/${t}`);
    return a.success ? a.entry : null;
  }
  async function c(t) {
    const { data: a } = await d.get(`${p}/${t}/breadcrumbs`);
    return a.success ? a.breadcrumbs ?? [] : [];
  }
  async function k(t) {
    const { data: a } = await d.post(p, t);
    if (!a.success) throw new Error(a.error || "failed to create");
    return a.entry;
  }
  async function r(t, a) {
    const n = new FormData();
    n.append("file", t), n.append("metadata", JSON.stringify({ target_parent_id: a ?? "", filename: t.name }));
    const { data: f } = await d.post("/api/v1/uploads", n, { headers: { "Content-Type": "multipart/form-data" } }), N = f.uuid || f.upload_id || f.id || f.upload?.id;
    if (!N) throw new Error(f.error || "upload failed");
    return String(N);
  }
  async function b(t, a) {
    const { data: n } = await d.put(`${p}/${t}`, a);
    if (!n.success) throw new Error(n.error || "failed to update");
    return n.entry;
  }
  async function g(t) {
    const { data: a } = await d.post(
      "/api/v1/transfer/export",
      { component_ids: [t] },
      { responseType: "blob" }
    );
    return a;
  }
  async function E(t, a) {
    const { data: n } = await d.post(`${p}/${t}/move`, { parent_id: a ?? "" });
    if (!n.success) throw new Error(n.error || "failed to move");
  }
  async function i(t) {
    const { data: a } = await d.delete(`${p}/${t}`);
    if (!a.success) throw new Error(a.error || "failed to delete");
    return { inProgress: a.in_progress === !0 };
  }
  async function h(t) {
    const a = await u(t);
    let n = a.length;
    for (const f of a)
      (f.type === "folder" || f.container) && (n += await h(f.id));
    return n;
  }
  return { types: e, error: s, loadTypes: o, list: u, get: l, breadcrumbs: c, create: k, uploadFile: r, update: b, move: E, remove: i, countDescendants: h, exportEntry: g };
}
const O = { class: "wc-iconfield" }, R = {
  key: 0,
  role: "status"
}, U = {
  key: 1,
  role: "alert"
}, Z = /* @__PURE__ */ $({
  __name: "IconField",
  props: {
    modelValue: {},
    fallback: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: s }) {
    const o = e, u = s, l = v(null), c = v(!1), k = v("");
    let r = null, b = 0;
    function g(i) {
      u("update:modelValue", String(i.detail || ""));
    }
    async function E() {
      const i = ++b, h = l.value;
      if (h) {
        if (c.value = !0, k.value = "", !customElements.get("wc-icon-picker"))
          try {
            await M("wc-icon-picker", { timeoutMs: 8e3 });
          } catch {
            i === b && (k.value = "Icon picker is unavailable."), i === b && (c.value = !1);
            return;
          }
        i !== b || l.value !== h || (r = document.createElement("wc-icon-picker"), r.setAttribute("value", o.modelValue || ""), o.fallback && r.setAttribute("fallback", o.fallback), r.addEventListener("select", g), h.replaceChildren(r), c.value = !1);
      }
    }
    return F(() => {
      E();
    }), S(() => o.modelValue, (i) => {
      r && r.getAttribute("value") !== i && r.setAttribute("value", i || "");
    }), S(() => o.fallback, (i) => {
      r && (i ? r.setAttribute("fallback", i) : r.removeAttribute("fallback"));
    }), D(() => {
      b += 1, r && r.removeEventListener("select", g), r = null;
    }), (i, h) => (m(), y("div", O, [
      w("div", {
        ref_key: "host",
        ref: l
      }, null, 512),
      c.value ? (m(), y("span", R, "Loading icon picker…")) : k.value ? (m(), y("span", U, [
        L(x(k.value) + " ", 1),
        w("button", {
          type: "button",
          onClick: E
        }, "Retry")
      ])) : V("", !0)
    ]));
  }
}), z = ["type", "disabled"], G = {
  key: 0,
  class: "km-spin",
  "aria-hidden": "true"
}, ee = /* @__PURE__ */ $({
  __name: "Button",
  props: {
    icon: {},
    variant: { default: "primary" },
    type: { default: "button" },
    loading: { type: Boolean },
    disabled: { type: Boolean },
    small: { type: Boolean }
  },
  emits: ["click"],
  setup(e, { emit: s }) {
    const o = s;
    return (u, l) => (m(), y("button", {
      type: e.type,
      class: C(["km-btn", [`km-btn-${e.variant}`, e.small && "sm"]]),
      disabled: e.disabled || e.loading,
      onClick: l[0] || (l[0] = (c) => o("click"))
    }, [
      e.loading ? (m(), y("span", G)) : e.icon ? (m(), P(_(B), {
        key: 1,
        icon: e.icon,
        "aria-hidden": "true"
      }, null, 8, ["icon"])) : V("", !0),
      A(u.$slots, "default")
    ], 10, z));
  }
}), J = { class: "km-field" }, W = { class: "km-field-label" }, j = {
  key: 0,
  class: "km-field-help"
}, te = /* @__PURE__ */ $({
  __name: "FormField",
  props: {
    label: {},
    help: {}
  },
  setup(e) {
    return (s, o) => (m(), y("label", J, [
      w("span", W, x(e.label), 1),
      A(s.$slots, "default"),
      e.help ? (m(), y("small", j, x(e.help), 1)) : V("", !0)
    ]));
  }
}), q = ["type", "value", "placeholder", "readonly", "disabled", "autocomplete", "min", "max", "step"], ae = /* @__PURE__ */ $({
  __name: "TextInput",
  props: {
    modelValue: {},
    type: { default: "text" },
    placeholder: {},
    readonly: { type: Boolean },
    disabled: { type: Boolean },
    autocomplete: {},
    min: {},
    max: {},
    step: {},
    mono: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: s }) {
    const o = s;
    function u(l) {
      const c = l.target;
      o("update:modelValue", c.value);
    }
    return (l, c) => (m(), y("input", {
      class: C(["km-input", e.mono && "mono"]),
      type: e.type,
      value: e.modelValue,
      placeholder: e.placeholder,
      readonly: e.readonly,
      disabled: e.disabled,
      autocomplete: e.autocomplete,
      min: e.min,
      max: e.max,
      step: e.step,
      onInput: u
    }, null, 42, q));
  }
}), H = { class: "km-notice-text" }, ne = /* @__PURE__ */ $({
  __name: "Notice",
  props: {
    tone: { default: "info" }
  },
  emits: ["dismiss"],
  setup(e, { emit: s }) {
    const o = s;
    return (u, l) => (m(), y("div", {
      class: C(["km-notice", `t-${e.tone}`]),
      role: "status"
    }, [
      I(_(B), {
        icon: e.tone === "error" ? "tabler:alert-triangle" : "tabler:info-circle",
        "aria-hidden": "true"
      }, null, 8, ["icon"]),
      w("span", H, [
        A(u.$slots, "default")
      ]),
      w("button", {
        class: "km-notice-x",
        "aria-label": "Dismiss",
        onClick: l[0] || (l[0] = (c) => o("dismiss"))
      }, [
        I(_(B), {
          icon: "tabler:x",
          "aria-hidden": "true"
        })
      ])
    ], 2));
  }
});
export {
  te as _,
  Z as a,
  ae as b,
  ne as c,
  ee as d,
  Y as u
};
//# sourceMappingURL=Notice.vue_vue_type_script_setup_true_lang-CzJ9zTkz.js.map
