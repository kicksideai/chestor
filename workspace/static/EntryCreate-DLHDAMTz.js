import { defineComponent as C, computed as b, ref as r, openBlock as y, createElementBlock as h, withModifiers as N, createElementVNode as u, toDisplayString as V, createVNode as o, unref as a, withCtx as c, withKeys as E, createBlock as $, createTextVNode as p, createCommentVNode as x } from "vue";
import { a as B, u as K } from "./wc-runtime-CNDpK4lj.js";
import { u as U, _ as A, a as D, b as I, c as L, d as g } from "./Notice.vue_vue_type_script_setup_true_lang-CzJ9zTkz.js";
import "@iconify/vue";
const M = { class: "ws-dialog" }, P = { class: "ws-dialog-head" }, S = { class: "ec-name-row" }, T = { class: "ws-dialog-foot" }, G = /* @__PURE__ */ C({
  __name: "EntryCreate",
  setup(W) {
    const s = B(), v = K(), k = U(), w = b(() => s.value.type || "entry"), t = r(""), d = r(""), n = r(!1), i = r("");
    async function f() {
      if (!(!t.value.trim() || n.value)) {
        n.value = !0, i.value = "";
        try {
          const l = await k.create({
            type: s.value.type || "",
            name: t.value.trim(),
            icon: d.value,
            // useProps exposes host attributes camelCased (parent-id -> parentId); kebab fallback.
            parent_id: s.value.parentId ?? s.value["parent-id"] ?? null
          });
          v("created", { id: l.id });
        } catch (l) {
          i.value = l instanceof Error ? l.message : "failed to create", n.value = !1;
        }
      }
    }
    function _() {
      v("close", {});
    }
    return (l, e) => (y(), h("div", {
      style: { height: "100%", display: "grid", "place-items": "center" },
      onClick: N(_, ["self"])
    }, [
      u("div", M, [
        u("div", P, "New " + V(w.value), 1),
        o(a(A), { label: "Name" }, {
          default: c(() => [
            u("div", S, [
              o(a(D), {
                modelValue: d.value,
                "onUpdate:modelValue": e[0] || (e[0] = (m) => d.value = m)
              }, null, 8, ["modelValue"]),
              o(a(I), {
                modelValue: t.value,
                "onUpdate:modelValue": e[1] || (e[1] = (m) => t.value = m),
                placeholder: "Name",
                onKeyup: E(f, ["enter"])
              }, null, 8, ["modelValue"])
            ])
          ]),
          _: 1
        }),
        i.value ? (y(), $(a(L), {
          key: 0,
          tone: "error"
        }, {
          default: c(() => [
            p(V(i.value), 1)
          ]),
          _: 1
        })) : x("", !0),
        u("div", T, [
          o(a(g), {
            variant: "ghost",
            onClick: _
          }, {
            default: c(() => [...e[2] || (e[2] = [
              p("Cancel", -1)
            ])]),
            _: 1
          }),
          o(a(g), {
            icon: "tabler:check",
            disabled: !t.value.trim() || n.value,
            onClick: f
          }, {
            default: c(() => [...e[3] || (e[3] = [
              p("Create", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ])
    ]));
  }
});
export {
  G as default
};
//# sourceMappingURL=EntryCreate-DLHDAMTz.js.map
