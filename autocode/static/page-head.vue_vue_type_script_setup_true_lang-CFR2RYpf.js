import { defineComponent as h, openBlock as l, createElementBlock as i, createElementVNode as a, createVNode as n, unref as o, toDisplayString as u, createCommentVNode as c, createBlock as k, withCtx as m } from "vue";
import { Icon as r } from "@iconify/vue";
import { d as b } from "./accounts.vue_vue_type_script_setup_true_lang-DBO9rQIp.js";
const x = { class: "kx-head" }, y = { class: "kx-head-icon" }, f = { class: "kx-head-text" }, v = { class: "kx-title" }, p = { class: "kx-head-sub" }, q = { class: "kx-head-actions" }, C = {
  key: 0,
  class: "kx-count"
}, $ = {
  key: 1,
  class: "kx-search",
  role: "search"
}, g = ["value", "placeholder", "aria-label"], E = /* @__PURE__ */ h({
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
    return (s, t) => (l(), i("header", x, [
      a("div", y, [
        n(o(r), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      a("div", f, [
        a("h1", v, u(e.title), 1),
        a("p", p, u(e.subtitle), 1)
      ]),
      a("div", q, [
        e.count ? (l(), i("span", C, u(e.count), 1)) : c("", !0),
        e.placeholder ? (l(), i("div", $, [
          n(o(r), {
            icon: "tabler:search",
            "aria-hidden": "true"
          }),
          a("input", {
            type: "search",
            value: e.query,
            class: "kx-search-input kx-focus-halo",
            placeholder: e.placeholder,
            "aria-label": e.placeholder,
            onInput: t[0] || (t[0] = (d) => s.$emit("update:query", d.target.value))
          }, null, 40, g),
          e.query ? (l(), i("button", {
            key: 0,
            type: "button",
            class: "kx-search-clear kx-focus-outline",
            "aria-label": "Clear search",
            onClick: t[1] || (t[1] = (d) => s.$emit("update:query", ""))
          }, [
            n(o(r), {
              icon: "tabler:x",
              "aria-hidden": "true"
            })
          ])) : c("", !0)
        ])) : c("", !0),
        e.action ? (l(), k(o(b), {
          key: 2,
          label: e.action,
          onClick: t[2] || (t[2] = (d) => s.$emit("create"))
        }, {
          icon: m(() => [
            n(o(r), {
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
  E as _
};
