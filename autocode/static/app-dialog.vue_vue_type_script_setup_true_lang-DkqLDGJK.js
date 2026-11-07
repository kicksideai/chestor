import q from "primevue/config";
import V from "primevue/menu";
import H from "primevue/portal";
import { renderSlot as w, createCommentVNode as f, h as Y, Teleport as D, ref as k, provide as F, inject as I, computed as X, defineComponent as M, openBlock as c, createElementBlock as p, createElementVNode as s, createVNode as m, unref as d, toDisplayString as b, createBlock as j, withCtx as z, onMounted as W, nextTick as _, onBeforeUnmount as U, normalizeClass as G } from "vue";
import { a as J } from "./wc-runtime-ClNbKZcC.js";
import { c as K, s as Q, a as Z, e as ee } from "./presentation-CaNB3T5F.js";
import { Icon as y } from "@iconify/vue";
import te from "primevue/button";
const oe = "data-wippy-overlay-layer";
function N() {
  return typeof window < "u" && typeof window.document < "u";
}
function B() {
  return N() && typeof HTMLElement < "u" && Object.hasOwn(HTMLElement.prototype, "popover");
}
function ne() {
  return B() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("top", "anchor(--a bottom)");
}
const re = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let ie = 0;
const g = /* @__PURE__ */ new WeakMap();
function A(e, t) {
  const o = e.style;
  o.setProperty("position", "fixed", "important"), o.setProperty("inset", "auto", "important"), o.setProperty("margin", "0", "important"), o.setProperty("position-anchor", t), o.setProperty("top", `anchor(${t} bottom)`, "important"), o.setProperty("left", `anchor(${t} left)`, "important"), o.setProperty("position-try-fallbacks", "flip-block");
}
function se(e, t) {
  if (!re.test(e.className))
    return;
  const o = e.style.cssText;
  A(e, t), e.getAttribute("popover") !== "manual" && e.setAttribute("popover", "manual");
  try {
    e.matches(":popover-open") || e.showPopover();
  } catch {
  }
  if (!e.matches(":popover-open")) {
    e.removeAttribute("popover"), e.style.cssText = o;
    return;
  }
  if (!g.has(e)) {
    const n = new MutationObserver(() => {
      e.style.getPropertyPriority("top") !== "important" && A(e, t);
    });
    n.observe(e, { attributes: !0, attributeFilter: ["style"] }), g.set(e, n);
  }
}
function T(e) {
  const t = g.get(e);
  t && (t.disconnect(), g.delete(e));
}
function ae(e) {
  const t = e && typeof e.getRootNode == "function" ? e.getRootNode() : null;
  return t instanceof ShadowRoot ? t : null;
}
function C(e) {
  e.style.top = "0px", e.style.left = "0px";
  const t = e.getBoundingClientRect();
  e.style.top = `${-window.scrollY - t.top}px`, e.style.left = `${-window.scrollX - t.left}px`;
}
const v = /* @__PURE__ */ new Set(), L = /* @__PURE__ */ new WeakMap();
let $ = !1, x = !1;
function le() {
  x = !1;
  for (const e of v) {
    if (!e.isConnected) {
      for (const t of Array.from(e.children))
        t instanceof HTMLElement && T(t);
      v.delete(e), L.get(e)?.disconnect();
      continue;
    }
    e.childElementCount > 0 && C(e);
  }
}
function E() {
  x || (x = !0, requestAnimationFrame(le));
}
function ce(e) {
  const t = document.createElement("div");
  t.setAttribute(oe, "");
  const o = B();
  if (t.style.cssText = o ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", o && t.setAttribute("popover", "manual"), e.appendChild(t), o) {
    try {
      t.showPopover();
    } catch {
    }
    t.matches(":popover-open") || (t.removeAttribute("popover"), t.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  C(t);
  const n = new MutationObserver((r) => {
    const u = t.__wippyAnchorName;
    for (const h of r) {
      if (u)
        for (const i of Array.from(h.addedNodes))
          i instanceof HTMLElement && se(i, u);
      for (const i of Array.from(h.removedNodes))
        i instanceof HTMLElement && T(i);
    }
    t.isConnected && t.childElementCount > 0 && C(t);
  });
  return n.observe(t, { childList: !0 }), L.set(t, n), v.add(t), $ || ($ = !0, window.addEventListener("scroll", E, { capture: !0, passive: !0 }), window.addEventListener("resize", E, { passive: !0 })), t;
}
function P(e) {
  if (!(!e.hostRoot || e.layer) && (e.layer = ce(e.hostRoot), ne())) {
    const t = e.$el ? e.$el.parentElement : null;
    t && (e.anchorName = `--wippy-a-${++ie}`, e.anchorTrigger = t, t.style.setProperty("anchor-name", e.anchorName), e.layer.__wippyAnchorName = e.anchorName);
  }
}
function O(e) {
  if (e.anchorTrigger && (e.anchorTrigger.style.removeProperty("anchor-name"), e.anchorTrigger = null), e.anchorName = null, e.layer) {
    for (const t of Array.from(e.layer.children))
      t instanceof HTMLElement && T(t);
    v.delete(e.layer), L.get(e.layer)?.disconnect(), e.layer.remove(), e.layer = null;
  }
}
let R = !1;
function ue() {
  if (R)
    return;
  const e = V;
  !e.methods || typeof e.methods.bindOutsideClickListener != "function" || (e.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (t) => {
      const o = t.composedPath(), n = this.container && !o.includes(this.container), r = !(this.target && o.includes(this.target));
      this.overlayVisible && n && r ? this.hide() : !this.popup && n && r && (this.focusedOptionIndex = -1);
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, R = !0);
}
let S = !1;
function de() {
  if (S)
    return;
  S = !0;
  const e = H;
  e.computed = e.computed || {}, e.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, e.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, e.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, e.mounted = function() {
    N() && (this.hostRoot = ae(this.$el), this.mounted = !0, this.hostRoot && (this.inline || P(this), this.$watch("inline", (t) => {
      t ? O(this) : P(this);
    })));
  }, e.render = function() {
    return this.inline ? w(this.$slots, "default", { key: 0 }) : this.mounted ? Y(D, { key: 1, to: this.resolvedTarget || document.body }, [
      w(this.$slots, "default")
    ]) : f("", !0);
  }, e.unmounted = function() {
    O(this);
  };
}
const Me = {
  install: (e) => {
    ue(), de(), e.use(q, { theme: "none" });
  }
};
function Ne() {
  const e = K(), t = k(null), o = k(""), n = Q(async () => {
    try {
      const r = await Z.catalog();
      if (!e()) return;
      t.value = r, o.value = "";
    } catch (r) {
      if (!e()) return;
      o.value = ee(r, "Could not load the agent catalog.");
    }
  }, e);
  return F("catalog", t), J(n), { catalog: t, error: o, load: n };
}
function Be() {
  const e = I("catalog");
  if (!e) throw new Error("Autocode catalog provider is missing.");
  return X(() => {
    if (!e.value) throw new Error("Autocode catalog is not loaded.");
    return e.value;
  });
}
const fe = { class: "kx-head" }, pe = { class: "kx-head-icon" }, he = { class: "kx-head-text" }, me = { class: "kx-title" }, ye = { class: "kx-head-sub" }, be = { class: "kx-head-actions" }, ge = {
  key: 0,
  class: "kx-count"
}, ve = {
  key: 1,
  class: "kx-search",
  role: "search"
}, we = ["value", "placeholder", "aria-label"], qe = /* @__PURE__ */ M({
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
    return (t, o) => (c(), p("header", fe, [
      s("div", pe, [
        m(d(y), {
          icon: "tabler:robot",
          "aria-hidden": "true"
        })
      ]),
      s("div", he, [
        s("h1", me, b(e.title), 1),
        s("p", ye, b(e.subtitle), 1)
      ]),
      s("div", be, [
        e.count ? (c(), p("span", ge, b(e.count), 1)) : f("", !0),
        e.placeholder ? (c(), p("div", ve, [
          m(d(y), {
            icon: "tabler:search",
            "aria-hidden": "true"
          }),
          s("input", {
            type: "search",
            value: e.query,
            class: "kx-search-input kx-focus-halo",
            placeholder: e.placeholder,
            "aria-label": e.placeholder,
            onInput: o[0] || (o[0] = (n) => t.$emit("update:query", n.target.value))
          }, null, 40, we),
          e.query ? (c(), p("button", {
            key: 0,
            type: "button",
            class: "kx-search-clear kx-focus-outline",
            "aria-label": "Clear search",
            onClick: o[1] || (o[1] = (n) => t.$emit("update:query", ""))
          }, [
            m(d(y), {
              icon: "tabler:x",
              "aria-hidden": "true"
            })
          ])) : f("", !0)
        ])) : f("", !0),
        e.action ? (c(), j(d(te), {
          key: 2,
          label: e.action,
          onClick: o[2] || (o[2] = (n) => t.$emit("create"))
        }, {
          icon: z(() => [
            m(d(y), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["label"])) : f("", !0)
      ])
    ]));
  }
}), ke = ["aria-label", "aria-busy"], Ce = { class: "ac-dialog-header" }, xe = ["disabled"], Te = { class: "ac-dialog-content" }, Ve = /* @__PURE__ */ M({
  __name: "app-dialog",
  props: {
    title: {},
    wide: { type: Boolean },
    busy: { type: Boolean }
  },
  emits: ["close"],
  setup(e, { emit: t }) {
    const o = e, n = t, r = k(null);
    function u(i) {
      i.preventDefault(), o.busy || n("close");
    }
    function h(i) {
      const a = r.value;
      if (!a || i.target !== a) return;
      const l = a.getBoundingClientRect();
      (i.clientX < l.left || i.clientX > l.right || i.clientY < l.top || i.clientY > l.bottom) && u(i);
    }
    return W(async () => {
      await _(), r.value && !r.value.open && r.value.showModal();
    }), U(() => {
      r.value?.open && r.value.close();
    }), (i, a) => (c(), p("dialog", {
      ref_key: "dialog",
      ref: r,
      class: G(["ac-dialog", { "ac-dialog-wide": e.wide }]),
      "aria-label": e.title,
      "aria-modal": "true",
      "aria-busy": e.busy || void 0,
      onCancel: u,
      onClose: a[1] || (a[1] = (l) => !e.busy && n("close")),
      onClick: h
    }, [
      s("header", Ce, [
        s("h2", null, b(e.title), 1),
        s("button", {
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          "aria-label": "Close dialog",
          disabled: e.busy,
          onClick: a[0] || (a[0] = (l) => n("close"))
        }, "×", 8, xe)
      ]),
      s("div", Te, [
        w(i.$slots, "default")
      ])
    ], 42, ke));
  }
});
export {
  Me as P,
  Ve as _,
  Ne as a,
  qe as b,
  Be as u
};
