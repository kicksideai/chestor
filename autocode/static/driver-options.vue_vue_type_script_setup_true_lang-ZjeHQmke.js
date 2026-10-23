import { defineComponent as L, ref as y, computed as J, openBlock as l, createElementBlock as s, createElementVNode as r, createTextVNode as k, toDisplayString as d, createCommentVNode as h, withDirectives as D, vModelText as B, Fragment as _, renderList as j } from "vue";
function W(u, i) {
  return u.agents.find((o) => i.some((m) => m.agent === o.id && m.usable && m.enabled))?.id ?? u.agents[0]?.id ?? "";
}
function X(u, i) {
  return u.filter((o) => o.status === "ready" && o.agents.includes(i));
}
function Y(u) {
  return Object.fromEntries((u?.options ?? []).filter((i) => i.default !== void 0 && i.default !== null).map((i) => [i.name, JSON.parse(JSON.stringify(i.default))]));
}
const E = { class: "ac-options" }, I = { class: "kx-focus-outline" }, F = {
  key: 0,
  class: "ac-muted"
}, T = { class: "ac-option-head" }, $ = { class: "ac-mono" }, w = { class: "ac-muted" }, A = {
  key: 0,
  class: "ac-muted ac-mono"
}, M = ["value", "onChange"], U = { value: "" }, q = ["value", "onChange"], z = { value: "" }, G = ["value"], H = ["value", "placeholder", "onChange"], K = ["value", "placeholder", "onChange"], P = {
  key: 5,
  class: "ac-error"
}, Q = {
  key: 0,
  class: "ac-muted"
}, Z = /* @__PURE__ */ L({
  __name: "driver-options",
  props: {
    options: {},
    modelValue: {},
    exclude: {},
    locked: {}
  },
  emits: ["update:modelValue", "invalid"],
  setup(u, { emit: i }) {
    const o = u, m = i, p = y(""), g = y({}), f = y({}), x = J(() => {
      const t = p.value.trim().toLowerCase();
      return o.options.filter((n) => !(o.exclude ?? []).includes(n.name) && (!t || n.name.includes(t) || n.label.toLowerCase().includes(t) || n.description.toLowerCase().includes(t)));
    }), C = J(() => Object.keys(o.modelValue).length);
    function c(t, n) {
      const e = { ...o.modelValue };
      n === void 0 ? delete e[t] : e[t] = n, m("update:modelValue", e);
    }
    function S(t) {
      if (t.name in g.value) return g.value[t.name];
      const n = o.modelValue[t.name];
      return n === void 0 ? "" : t.type === "json" ? JSON.stringify(n) : t.type === "ids" ? n.join(", ") : String(n);
    }
    function b(t, n) {
      n ? f.value[t] = n : delete f.value[t], m("invalid", Object.keys(f.value).length);
    }
    function N(t, n) {
      g.value[t.name] = n, b(t.name, void 0);
      const e = n.trim();
      if (e === "") {
        c(t.name, void 0);
        return;
      }
      if (t.type === "json") {
        try {
          c(t.name, JSON.parse(e));
        } catch {
          c(t.name, void 0), b(t.name, "Not valid JSON");
        }
        return;
      }
      if (t.type === "ids") {
        c(t.name, e.split(",").map((a) => a.trim()).filter(Boolean));
        return;
      }
      c(t.name, e);
    }
    function O(t, n) {
      if (n === "") {
        c(t.name, void 0);
        return;
      }
      if (t.type === "boolean") {
        c(t.name, n === "true");
        return;
      }
      const e = (t.values ?? []).find((a) => String(a) === n);
      c(t.name, e ?? n);
    }
    function V(t) {
      const n = o.modelValue[t.name];
      return n === void 0 ? "" : String(n);
    }
    function v(t) {
      return t.default === void 0 || t.default === null ? "CLI default" : `default: ${JSON.stringify(t.default)}`;
    }
    return (t, n) => (l(), s("details", E, [
      r("summary", I, [
        n[1] || (n[1] = k("Driver options", -1)),
        C.value ? (l(), s("span", F, " · " + d(C.value) + " set", 1)) : h("", !0)
      ]),
      D(r("input", {
        "onUpdate:modelValue": n[0] || (n[0] = (e) => p.value = e),
        class: "ac-mono ac-options-filter kx-focus-halo",
        placeholder: "Filter options"
      }, null, 512), [
        [B, p.value]
      ]),
      (l(!0), s(_, null, j(x.value, (e) => (l(), s("div", {
        key: e.name,
        class: "ac-option"
      }, [
        r("div", T, [
          r("span", $, d(e.name), 1),
          r("small", w, [
            k(d(e.label), 1),
            e.description && e.description !== e.label ? (l(), s(_, { key: 0 }, [
              k(" — " + d(e.description), 1)
            ], 64)) : h("", !0)
          ])
        ]),
        u.locked && e.name in u.locked ? (l(), s("small", A, d(JSON.stringify(u.locked[e.name])) + " · set by unattended mode", 1)) : e.type === "boolean" ? (l(), s("select", {
          key: 1,
          class: "kx-focus-halo",
          value: V(e),
          onChange: (a) => O(e, a.target.value)
        }, [
          r("option", U, d(v(e)), 1),
          n[2] || (n[2] = r("option", { value: "true" }, "on", -1)),
          n[3] || (n[3] = r("option", { value: "false" }, "off", -1))
        ], 40, M)) : e.type === "enum" ? (l(), s("select", {
          key: 2,
          class: "kx-focus-halo",
          value: V(e),
          onChange: (a) => O(e, a.target.value)
        }, [
          r("option", z, d(v(e)), 1),
          (l(!0), s(_, null, j(e.values ?? [], (a) => (l(), s("option", {
            key: String(a),
            value: String(a)
          }, d(a), 9, G))), 128))
        ], 40, q)) : e.type === "json" ? (l(), s("textarea", {
          key: 3,
          rows: "2",
          class: "ac-mono kx-focus-halo",
          value: S(e),
          placeholder: `JSON · ${v(e)}`,
          onChange: (a) => N(e, a.target.value)
        }, null, 40, H)) : (l(), s("input", {
          key: 4,
          class: "ac-mono kx-focus-halo",
          value: S(e),
          placeholder: e.type === "ids" ? "comma separated" : v(e),
          onChange: (a) => N(e, a.target.value)
        }, null, 40, K)),
        f.value[e.name] ? (l(), s("small", P, d(f.value[e.name]), 1)) : h("", !0)
      ]))), 128)),
      x.value.length ? h("", !0) : (l(), s("p", Q, "No matching options."))
    ]));
  }
});
export {
  Z as _,
  Y as a,
  W as d,
  X as m
};
//# sourceMappingURL=driver-options.vue_vue_type_script_setup_true_lang-ZjeHQmke.js.map
