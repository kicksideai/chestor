import { u as w, a as E, b, _ as N, c as x, d as $, e as K, f as y, W as S, s as U } from "./styles-DH7MJabM.js";
import { defineComponent as B, computed as P, ref as r, openBlock as C, createElementBlock as W, withModifiers as A, createElementVNode as c, toDisplayString as g, createVNode as o, unref as t, withCtx as u, withKeys as M, createBlock as T, createTextVNode as p, createCommentVNode as j } from "vue";
import "@iconify/vue";
import { define as D } from "@wippy-fe/proxy";
const H = { class: "ws-dialog" }, I = { class: "ws-dialog-head" }, L = { class: "ec-name-row" }, O = { class: "ws-dialog-foot" }, R = /* @__PURE__ */ B({
  __name: "EntryCreate",
  setup(V) {
    const n = w(), f = E(), h = b(), k = P(() => n.value.type || "entry"), a = r(""), d = r(""), l = r(!1), i = r("");
    async function v() {
      if (!(!a.value.trim() || l.value)) {
        l.value = !0, i.value = "";
        try {
          const s = await h.create({
            type: n.value.type || "",
            name: a.value.trim(),
            icon: d.value,
            // useProps exposes host attributes camelCased (parent-id -> parentId); kebab fallback.
            parent_id: n.value.parentId ?? n.value["parent-id"] ?? null
          });
          f("created", { id: s.id });
        } catch (s) {
          i.value = s instanceof Error ? s.message : "failed to create", l.value = !1;
        }
      }
    }
    function _() {
      f("close", {});
    }
    return (s, e) => (C(), W("div", {
      style: { height: "100%", display: "grid", "place-items": "center" },
      onClick: A(_, ["self"])
    }, [
      c("div", H, [
        c("div", I, "New " + g(k.value), 1),
        o(t(N), { label: "Name" }, {
          default: u(() => [
            c("div", L, [
              o(t(x), {
                modelValue: d.value,
                "onUpdate:modelValue": e[0] || (e[0] = (m) => d.value = m)
              }, null, 8, ["modelValue"]),
              o(t($), {
                modelValue: a.value,
                "onUpdate:modelValue": e[1] || (e[1] = (m) => a.value = m),
                placeholder: "Name",
                onKeyup: M(v, ["enter"])
              }, null, 8, ["modelValue"])
            ])
          ]),
          _: 1
        }),
        i.value ? (C(), T(t(K), {
          key: 0,
          tone: "error"
        }, {
          default: u(() => [
            p(g(i.value), 1)
          ]),
          _: 1
        })) : j("", !0),
        c("div", O, [
          o(t(y), {
            variant: "ghost",
            onClick: _
          }, {
            default: u(() => [...e[2] || (e[2] = [
              p("Cancel", -1)
            ])]),
            _: 1
          }),
          o(t(y), {
            icon: "tabler:check",
            disabled: !a.value.trim() || l.value,
            onClick: v
          }, {
            default: u(() => [...e[3] || (e[3] = [
              p("Create", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ])
    ]));
  }
}), q = {
  type: "object",
  properties: {
    type: { type: "string" },
    "parent-id": { type: "string" }
  }
};
class z extends S {
  static get wippyConfig() {
    return {
      propsSchema: q,
      hostCssKeys: ["themeConfigUrl", "iframeCssUrl"],
      inlineCss: U
    };
  }
  static get vueConfig() {
    return { rootComponent: R };
  }
}
D(import.meta.url, z);
//# sourceMappingURL=entry_create.js.map
