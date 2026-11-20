import { defineComponent as h, openBlock as o, createElementBlock as i, createElementVNode as a, createVNode as r, unref as l, toDisplayString as u, createCommentVNode as n, createBlock as k, withCtx as m } from "vue";
import { Icon as c } from "@iconify/vue";
import { b } from "./accounts.vue_vue_type_script_setup_true_lang-DjUXxyse.js";
const x = { class: "kx-head" }, y = { class: "kx-head-icon" }, p = { class: "kx-head-text" }, v = { class: "kx-title" }, f = { class: "kx-head-sub" }, q = { class: "kx-head-actions" }, C = {
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
    query: {},
    placeholder: {}
  },
  emits: ["update:query", "create"],
  setup(e) {
    return (s, t) => (o(), i("header", x, [
      a("div", y, [
        r(l(c), {
          icon: "tabler:robot",
          "aria-hidden": "true"
        })
      ]),
      a("div", p, [
        a("h1", v, u(e.title), 1),
        a("p", f, u(e.subtitle), 1)
      ]),
      a("div", q, [
        e.count ? (o(), i("span", C, u(e.count), 1)) : n("", !0),
        e.placeholder ? (o(), i("div", $, [
          r(l(c), {
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
          e.query ? (o(), i("button", {
            key: 0,
            type: "button",
            class: "kx-search-clear kx-focus-outline",
            "aria-label": "Clear search",
            onClick: t[1] || (t[1] = (d) => s.$emit("update:query", ""))
          }, [
            r(l(c), {
              icon: "tabler:x",
              "aria-hidden": "true"
            })
          ])) : n("", !0)
        ])) : n("", !0),
        e.action ? (o(), k(l(b), {
          key: 2,
          label: e.action,
          onClick: t[2] || (t[2] = (d) => s.$emit("create"))
        }, {
          icon: m(() => [
            r(l(c), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["label"])) : n("", !0)
      ])
    ]));
  }
});
export {
  E as _
};
