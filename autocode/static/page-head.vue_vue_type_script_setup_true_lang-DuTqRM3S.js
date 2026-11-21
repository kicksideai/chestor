import { defineComponent as h, openBlock as l, createElementBlock as n, createElementVNode as a, createVNode as r, unref as o, toDisplayString as u, createCommentVNode as c, renderSlot as k, createBlock as m, withCtx as b } from "vue";
import { Icon as s } from "@iconify/vue";
import { s as x } from "./accounts.vue_vue_type_script_setup_true_lang-BS36zsOI.js";
const y = { class: "kx-head" }, f = { class: "kx-head-icon" }, v = { class: "kx-head-text" }, p = { class: "kx-title" }, q = { class: "kx-head-sub" }, C = { class: "kx-head-actions" }, $ = {
  key: 0,
  class: "kx-count"
}, g = {
  key: 1,
  class: "kx-search",
  role: "search"
}, B = ["value", "placeholder", "aria-label"], I = /* @__PURE__ */ h({
  __name: "page-head",
  props: {
    title: {},
    subtitle: {},
    count: {},
    action: {},
    query: { default: "" },
    placeholder: {},
    icon: { default: "tabler:robot" }
  },
  emits: ["update:query", "create"],
  setup(e) {
    return (i, t) => (l(), n("header", y, [
      a("div", f, [
        r(o(s), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      a("div", v, [
        a("h1", p, u(e.title), 1),
        a("p", q, u(e.subtitle), 1)
      ]),
      a("div", C, [
        e.count ? (l(), n("span", $, u(e.count), 1)) : c("", !0),
        e.placeholder ? (l(), n("div", g, [
          r(o(s), {
            icon: "tabler:search",
            "aria-hidden": "true"
          }),
          a("input", {
            type: "search",
            value: e.query,
            class: "kx-search-input kx-focus-halo",
            placeholder: e.placeholder,
            "aria-label": e.placeholder,
            onInput: t[0] || (t[0] = (d) => i.$emit("update:query", d.target.value))
          }, null, 40, B),
          e.query ? (l(), n("button", {
            key: 0,
            type: "button",
            class: "kx-search-clear kx-focus-outline",
            "aria-label": "Clear search",
            onClick: t[1] || (t[1] = (d) => i.$emit("update:query", ""))
          }, [
            r(o(s), {
              icon: "tabler:x",
              "aria-hidden": "true"
            })
          ])) : c("", !0)
        ])) : c("", !0),
        k(i.$slots, "actions"),
        e.action ? (l(), m(o(x), {
          key: 2,
          label: e.action,
          onClick: t[2] || (t[2] = (d) => i.$emit("create"))
        }, {
          icon: b(() => [
            r(o(s), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["label"])) : c("", !0)
      ])
    ]));
  }
});
export {
  I as _
};
