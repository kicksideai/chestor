import { b as pe, s as Me, B as je, f as ze, p as Ke, M as _e, c as xe, d as Ce, u as qe, a as Ge, P as We } from "./wc-runtime-CvWl7e3g.js";
import { defineComponent as Q, computed as F, openBlock as o, createElementBlock as m, Fragment as z, renderList as Z, normalizeClass as ie, toDisplayString as D, createCommentVNode as g, createBlock as E, unref as k, createElementVNode as r, ref as w, watch as J, createVNode as V, createTextVNode as j, withDirectives as O, vModelText as Y, createStaticVNode as He, vModelCheckbox as Ze, onUnmounted as Pe, withCtx as ee, mergeProps as G, resolveComponent as Ie, normalizeStyle as Ye, renderSlot as X, toHandlers as ue, resolveDynamicComponent as ce, withModifiers as Je, vShow as de, nextTick as Se } from "vue";
import { host as se, loadByTagName as Qe, config as Xe, on as et } from "@wippy-fe/proxy";
import { Icon as R } from "@iconify/vue";
import { u as ke, _ as Ve, a as he, s as ne, b as tt, c as nt, d as De, p as at, e as it, f as st } from "./accounts.vue_vue_type_script_setup_true_lang-BS36zsOI.js";
import { _ as re } from "./page-head.vue_vue_type_script_setup_true_lang-DuTqRM3S.js";
import { a as W, e as H, u as Ue, b as rt, s as me, r as Te, p as lt, c as $e, _ as Ee, d as ot } from "./Disclosure.vue_vue_type_script_setup_true_lang-CrWwplXA.js";
import { s as Ne, a as ut } from "./index-BBR9l5Id.js";
const ct = ["aria-label"], dt = {
  key: 0,
  class: "kx-settings-rail-group"
}, pt = ["aria-current", "onClick"], mt = { class: "kx-settings-rail-label" }, ft = /* @__PURE__ */ Q({
  __name: "SettingsRail",
  props: {
    label: {},
    value: {},
    groups: {},
    leadingItem: {}
  },
  emits: ["update:value"],
  setup(t) {
    const e = t, n = F(() => e.leadingItem ? [{ items: [e.leadingItem] }, ...e.groups] : e.groups);
    function a(u) {
      const i = [...u.currentTarget.querySelectorAll(".kx-settings-rail-item")], s = i.indexOf(u.target);
      if (s < 0) return;
      let d;
      switch (u.key) {
        case "ArrowDown":
        case "ArrowRight":
          d = (s + 1) % i.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          d = (s + i.length - 1) % i.length;
          break;
        case "Home":
          d = 0;
          break;
        case "End":
          d = i.length - 1;
          break;
        default:
          return;
      }
      u.preventDefault(), i[d]?.focus();
    }
    return (u, i) => (o(), m("nav", {
      class: "kx-settings-rail",
      "aria-label": t.label,
      onKeydown: a
    }, [
      (o(!0), m(z, null, Z(n.value, (s, d) => (o(), m("div", {
        key: s.items[0]?.value ?? d,
        class: ie(["kx-settings-rail-section", { "kx-settings-rail-leading": t.leadingItem && d === 0 }])
      }, [
        s.heading ? (o(), m("div", dt, D(s.heading), 1)) : g("", !0),
        (o(!0), m(z, null, Z(s.items, (v) => (o(), m("button", {
          key: v.value,
          type: "button",
          class: "kx-settings-rail-item",
          "aria-current": v.value === t.value ? "true" : void 0,
          onClick: (_) => u.$emit("update:value", v.value)
        }, [
          v.icon ? (o(), E(k(R), {
            key: 0,
            class: "kx-settings-rail-icon",
            icon: v.icon,
            "aria-hidden": "true"
          }, null, 8, ["icon"])) : g("", !0),
          r("span", mt, D(v.label), 1)
        ], 8, pt))), 128))
      ], 2))), 128))
    ], 40, ct));
  }
}), ht = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, vt = ["disabled"], bt = { class: "ac-card-head" }, gt = { class: "ac-muted" }, yt = { class: "ac-field" }, kt = { class: "ac-seg" }, $t = {
  key: 0,
  class: "ac-field"
}, wt = {
  key: 1,
  class: "ac-muted"
}, _t = { class: "ac-field" }, xt = { class: "ac-field" }, Ct = { class: "ac-row-fields" }, It = { class: "ac-field" }, St = ["placeholder"], Dt = { class: "ac-field" }, Bt = ["placeholder"], At = { class: "ac-field" }, Lt = { class: "ac-row-fields" }, Mt = { class: "ac-field" }, Pt = { class: "ac-field" }, Vt = ["placeholder"], Ut = {
  key: 2,
  class: "ac-field"
}, Tt = { class: "ac-checks" }, Et = ["value"], Nt = { class: "ac-field" }, Rt = { class: "ac-dialog-foot" }, Ft = ["disabled"], Ot = {
  key: 3,
  class: "kx-err"
}, jt = /* @__PURE__ */ Q({
  __name: "image-form",
  props: {
    edit: {},
    capabilities: {}
  },
  emits: ["saved", "cancel", "busy"],
  setup(t, { emit: e }) {
    const n = t, a = e, u = ke();
    function i(c = u.value.default_image.settings) {
      return c ? {
        ref: "",
        mode: "pull",
        dockerfile: "",
        label: "",
        home: u.value.default_image.home,
        ...c,
        extra_args: [...c.extra_args],
        allows: [...c.allows],
        extra: ""
      } : null;
    }
    const s = w(i()), d = w(!1);
    J(() => s.value?.ref, (c) => {
      s.value && !n.edit && !d.value && c !== void 0 && (s.value.label = c);
    });
    const v = w(!1), _ = w("");
    J(() => n.edit, (c) => {
      if (_.value = "", d.value = !!c, !c) {
        s.value = i();
        return;
      }
      if (!c.settings) {
        s.value = null;
        return;
      }
      const l = c.settings;
      s.value = {
        ...l,
        ref: c.image.ref,
        label: c.image.label,
        home: c.image.home,
        mode: c.dockerfile ? "build" : "pull",
        dockerfile: c.dockerfile ?? "",
        extra: l.extra_args.join(`
`),
        allows: [...l.allows]
      };
    }, { immediate: !0 });
    function L() {
      const c = u.value.default_image;
      d.value = !0;
      const l = i();
      s.value = l ? { ...l, ref: c.ref, label: c.label, home: c.home, mode: "build", dockerfile: c.dockerfile } : null;
    }
    function S() {
      const c = s.value;
      if (!c) throw new Error("Image settings are unavailable.");
      return {
        label: c.label,
        home: c.home,
        memory: c.memory,
        cpus: c.cpus,
        pids_limit: Number(c.pids_limit) || 0,
        gpus: c.gpus,
        network: c.network,
        extra_args: c.extra.split(`
`).map((l) => l.trim()).filter(Boolean),
        allows: [...c.allows]
      };
    }
    async function b() {
      if (!(!s.value || v.value)) {
        _.value = "", v.value = !0, a("busy", !0);
        try {
          let c;
          if (n.edit) {
            const l = await W.updateImage(n.edit.image.id, { ...S(), ref: s.value.ref, dockerfile: s.value.mode === "build" ? s.value.dockerfile : "" });
            l.build_error && (c = `Settings saved. Build preparation has not started: ${l.build_error.message}. Use Prepare image to retry.`);
          } else {
            const l = s.value, p = await W.createImage({ ...S(), ref: l.ref, dockerfile: l.mode === "build" ? l.dockerfile : "" });
            p.build_error && (c = `Image created. Build preparation has not started: ${p.build_error.message}. Use Prepare image to retry.`), s.value = i();
          }
          a("saved", c);
        } catch (c) {
          _.value = H(c, "Could not save the image.");
        } finally {
          v.value = !1, a("busy", !1);
        }
      }
    }
    return (c, l) => s.value ? (o(), m("fieldset", {
      key: 1,
      class: "ac-form",
      disabled: v.value
    }, [
      r("div", bt, [
        r("span", gt, D(t.edit ? "Container settings" : "Use an image reference or the default agent recipe."), 1),
        t.edit ? g("", !0) : (o(), m("button", {
          key: 0,
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: L
        }, [
          V(k(R), { icon: "tabler:sparkles" }),
          l[15] || (l[15] = j(" Default agent image", -1))
        ]))
      ]),
      r("label", yt, [
        l[16] || (l[16] = r("span", null, "Image reference", -1)),
        O(r("input", {
          "onUpdate:modelValue": l[0] || (l[0] = (p) => s.value.ref = p),
          class: "ac-mono kx-focus-halo",
          placeholder: "registry/name:tag"
        }, null, 512), [
          [Y, s.value.ref]
        ])
      ]),
      r("div", kt, [
        r("button", {
          type: "button",
          class: ie(["kx-focus-outline", { active: s.value.mode === "pull" }]),
          onClick: l[1] || (l[1] = (p) => s.value.mode = "pull")
        }, "Use or pull existing", 2),
        r("button", {
          type: "button",
          class: ie(["kx-focus-outline", { active: s.value.mode === "build" }]),
          onClick: l[2] || (l[2] = (p) => s.value.mode = "build")
        }, "Build from Dockerfile", 2)
      ]),
      s.value.mode === "build" ? (o(), m("label", $t, [
        l[17] || (l[17] = r("span", null, "Dockerfile", -1)),
        O(r("textarea", {
          "onUpdate:modelValue": l[3] || (l[3] = (p) => s.value.dockerfile = p),
          rows: "9",
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [Y, s.value.dockerfile]
        ]),
        l[18] || (l[18] = He('<small class="ac-hint">Include <code>sh</code>, <code>git</code>, <code>mkdir</code>, <code>dirname</code>, a <code>timeout</code> that supports <code>-k</code>, and the agent CLIs. The image user needs writable home and work directories.</small>', 1))
      ])) : g("", !0),
      t.edit ? (o(), m("p", wt, "Saving container settings prepares the image automatically.")) : g("", !0),
      r("label", _t, [
        l[19] || (l[19] = r("span", null, "Label", -1)),
        O(r("input", {
          "onUpdate:modelValue": l[4] || (l[4] = (p) => s.value.label = p),
          class: "kx-focus-halo",
          onInput: l[5] || (l[5] = (p) => d.value = !0)
        }, null, 544), [
          [Y, s.value.label]
        ])
      ]),
      r("label", xt, [
        l[20] || (l[20] = r("span", null, "Home directory in the image", -1)),
        O(r("input", {
          "onUpdate:modelValue": l[6] || (l[6] = (p) => s.value.home = p),
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [Y, s.value.home]
        ])
      ]),
      r("div", Ct, [
        r("label", It, [
          l[21] || (l[21] = r("span", null, "Memory", -1)),
          O(r("input", {
            "onUpdate:modelValue": l[7] || (l[7] = (p) => s.value.memory = p),
            class: "ac-mono kx-focus-halo",
            placeholder: k(u).default_image.settings?.memory
          }, null, 8, St), [
            [Y, s.value.memory]
          ])
        ]),
        r("label", Dt, [
          l[22] || (l[22] = r("span", null, "CPUs", -1)),
          O(r("input", {
            "onUpdate:modelValue": l[8] || (l[8] = (p) => s.value.cpus = p),
            class: "ac-mono kx-focus-halo",
            placeholder: k(u).default_image.settings?.cpus
          }, null, 8, Bt), [
            [Y, s.value.cpus]
          ])
        ]),
        r("label", At, [
          l[23] || (l[23] = r("span", null, "PIDs limit", -1)),
          O(r("input", {
            "onUpdate:modelValue": l[9] || (l[9] = (p) => s.value.pids_limit = p),
            type: "number",
            min: "0",
            class: "ac-mono kx-focus-halo"
          }, null, 512), [
            [
              Y,
              s.value.pids_limit,
              void 0,
              { number: !0 }
            ]
          ])
        ])
      ]),
      r("div", Lt, [
        r("label", Mt, [
          l[24] || (l[24] = r("span", null, "GPUs", -1)),
          O(r("input", {
            "onUpdate:modelValue": l[10] || (l[10] = (p) => s.value.gpus = p),
            class: "ac-mono kx-focus-halo",
            placeholder: "all, or device=0"
          }, null, 512), [
            [Y, s.value.gpus]
          ])
        ]),
        r("label", Pt, [
          l[25] || (l[25] = r("span", null, "Network", -1)),
          O(r("input", {
            "onUpdate:modelValue": l[11] || (l[11] = (p) => s.value.network = p),
            class: "ac-mono kx-focus-halo",
            placeholder: k(u).default_image.settings?.network
          }, null, 8, Vt), [
            [Y, s.value.network]
          ])
        ])
      ]),
      t.capabilities?.length ? (o(), m("div", Ut, [
        l[26] || (l[26] = r("span", null, "Agents may", -1)),
        r("div", Tt, [
          (o(!0), m(z, null, Z(t.capabilities, (p) => (o(), m("label", {
            key: p,
            class: "ac-check ac-mono"
          }, [
            O(r("input", {
              "onUpdate:modelValue": l[12] || (l[12] = (A) => s.value.allows = A),
              type: "checkbox",
              class: "kx-focus-outline",
              value: p
            }, null, 8, Et), [
              [Ze, s.value.allows]
            ]),
            j(" " + D(p), 1)
          ]))), 128))
        ])
      ])) : g("", !0),
      r("label", Nt, [
        l[27] || (l[27] = r("span", null, "Extra Docker arguments", -1)),
        O(r("textarea", {
          "onUpdate:modelValue": l[13] || (l[13] = (p) => s.value.extra = p),
          rows: "3",
          class: "ac-mono kx-focus-halo",
          placeholder: `One argument per line, e.g.
--add-host
host.docker.internal:host-gateway`
        }, null, 512), [
          [Y, s.value.extra]
        ])
      ]),
      l[28] || (l[28] = r("p", { class: "ac-hint" }, [
        r("a", {
          class: "ac-link kx-focus-outline",
          href: "https://github.com/kicksideai/chestor/blob/main/autocode/docs/docker-options.md#settings-limits-and-docker-warnings",
          target: "_blank",
          rel: "noopener noreferrer"
        }, "Container limits and isolation")
      ], -1)),
      r("footer", Rt, [
        r("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: l[14] || (l[14] = (p) => a("cancel"))
        }, "Cancel"),
        r("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: v.value || !t.capabilities || !s.value.ref,
          onClick: b
        }, [
          V(k(R), { icon: "tabler:box" }),
          j(" " + D(v.value ? "Saving…" : t.edit ? "Save settings" : s.value.mode === "build" ? "Build image" : "Add image"), 1)
        ], 8, Ft)
      ]),
      _.value ? (o(), m("p", Ot, D(_.value), 1)) : g("", !0)
    ], 8, vt)) : (o(), m("p", ht, D(t.edit ? "Image settings are unavailable." : "Image defaults are unavailable.") + " Ask an administrator to update the image configuration.", 1));
  }
}), zt = { class: "ac-stack" }, Kt = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, qt = {
  key: 1,
  class: "kx-loading"
}, Gt = {
  key: 2,
  class: "kx-empty"
}, Wt = { class: "kx-empty-ico" }, Ht = {
  key: 3,
  class: "kx-empty"
}, Zt = { class: "ac-list ac-resource-list" }, Yt = { class: "ac-resource-icon" }, Jt = { class: "ac-account-main" }, Qt = { class: "ac-row-title" }, Xt = {
  key: 0,
  class: "kx-tag-sm ac-tone ready"
}, en = { class: "ac-muted ac-mono" }, tn = { class: "ac-chips" }, nn = { class: "ac-muted" }, an = {
  key: 0,
  class: "kx-err ac-small"
}, sn = { class: "ac-row-actions" }, rn = ["disabled", "onClick"], ln = ["onClick"], on = ["onClick"], un = ["onClick"], cn = { class: "ac-form" }, dn = { class: "ac-mono" }, pn = { class: "ac-pre ac-build-log" }, mn = /* @__PURE__ */ Q({
  __name: "images",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(t, { expose: e, emit: n }) {
    const a = ke(), u = t, i = n, s = w(!1), d = w(!1), v = w({});
    e({ open: T });
    const _ = w([]), L = w([]), S = w(""), b = w(null), c = w(null), l = F(() => [...new Set(a.value.agents.flatMap((M) => M.capabilities))].sort()), p = w(!1);
    let A = !0, y = 0, U = 0, $ = 0;
    Pe(() => {
      A = !1, y++, U++;
    });
    async function x(M) {
      const P = y, I = await W.image(M);
      !A || P !== y || c.value?.id !== M || (c.value = { id: M, ref: I.image.ref, text: I.build_log || "(empty)" });
    }
    const h = me(async () => {
      try {
        const M = await Te(W.images, (P) => P.map((I) => I.id), L, () => A, (P) => {
          _.value = P, p.value = !0, S.value = "";
        }, () => {
          h();
        });
        if (!A) return;
        _.value = M, f(M, ++$), c.value && M.some((P) => P.id === c.value?.id) && await x(c.value.id), p.value = !0, S.value = "";
      } catch (M) {
        S.value = H(M, "Could not load images.");
      }
    });
    async function f(M, P) {
      try {
        const I = await lt([...new Set(M.map((q) => q.owner_user_id))]);
        if (!A || P !== $) return;
        v.value = Object.fromEntries(M.map((q) => [q.id, `Owner: ${I[q.owner_user_id] || q.owner_user_id}`]));
      } catch (I) {
        A && P === $ && (S.value = H(I, "Could not load image owners."));
      }
    }
    Ue(() => L.value, () => {
      h();
    }), pe(h);
    async function C(M, P) {
      S.value = "";
      try {
        await M(), await h();
      } catch (I) {
        S.value = H(I, P);
      }
    }
    async function K(M) {
      const P = ++U;
      S.value = "";
      try {
        const I = await W.image(M.id);
        A && P === U && (b.value = I);
      } catch (I) {
        A && P === U && (S.value = H(I, "Could not load the image settings."));
      }
    }
    function B() {
      U++, s.value = !1, b.value = null;
    }
    function T() {
      B(), s.value = !0;
    }
    const N = (M) => C(() => W.prepareImage(M.id), "Could not start the image preparation.");
    function ae(M) {
      y++, c.value = { id: M.id, ref: M.ref, text: "Loading…" }, h();
    }
    function oe() {
      y++, c.value = null;
    }
    async function fe(M) {
      B(), await h(), M && (S.value = M);
    }
    async function te(M) {
      if (!await se.confirm({
        header: "Delete image",
        message: `Delete image "${M.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) return;
      const I = await se.confirm({
        header: "Docker image",
        message: `Also remove ${M.ref} from Docker on the host? Keeping it lets a later image with the same reference reuse it.`,
        icon: "tabler:brand-docker",
        acceptLabel: "Remove from Docker",
        rejectLabel: "Keep in Docker",
        acceptClass: "p-button-danger"
      });
      U++, b.value?.image.id === M.id && B(), c.value?.id === M.id && oe(), S.value = "";
      try {
        await W.deleteImage(M.id, I), await h();
      } catch (q) {
        S.value = H(q, "Could not delete the image.");
      }
    }
    const we = F(() => _.value.filter((M) => [M.label, M.ref, ...M.agents].join(" ").toLowerCase().includes(u.query.toLowerCase())));
    return J(_, (M) => i("count", M.length)), (M, P) => (o(), m("div", zt, [
      P[7] || (P[7] = r("p", { class: "ac-hint" }, "Ready means preparation finished. Usable means you can run tasks with the image. Share ready images to make them available to others.", -1)),
      S.value ? (o(), m("p", Kt, [
        j(D(S.value) + " ", 1),
        r("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: P[0] || (P[0] = //@ts-ignore
          (...I) => k(h) && k(h)(...I))
        }, "Retry")
      ])) : g("", !0),
      !p.value && !S.value ? (o(), m("div", qt, "Loading images…")) : g("", !0),
      p.value && !_.value.length ? (o(), m("div", Gt, [
        r("div", Wt, [
          V(k(R), { icon: "tabler:box" })
        ]),
        P[4] || (P[4] = r("div", { class: "kx-empty-title" }, "No images yet", -1)),
        P[5] || (P[5] = r("div", { class: "kx-empty-sub" }, "Start with the default agent recipe or use an existing image.", -1)),
        r("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: T
        }, "Add image")
      ])) : p.value && !we.value.length ? (o(), m("div", Ht, [...P[6] || (P[6] = [
        r("div", { class: "kx-empty-title" }, "No matches", -1),
        r("div", { class: "kx-empty-sub" }, "Try another image, reference or agent.", -1)
      ])])) : g("", !0),
      r("ul", Zt, [
        (o(!0), m(z, null, Z(we.value, (I) => (o(), m("li", {
          key: I.id,
          class: "ac-row ac-resource"
        }, [
          r("span", Yt, [
            V(k(R), { icon: "tabler:box" })
          ]),
          r("div", Jt, [
            r("div", Qt, [
              j(D(I.label), 1),
              r("span", {
                class: ie(["kx-tag-sm ac-tone", I.status])
              }, D(I.status === "unprepared" ? "Needs preparation" : I.status.charAt(0).toUpperCase() + I.status.slice(1)), 3),
              I.usable ? (o(), m("span", Xt, "Usable")) : g("", !0)
            ]),
            r("div", en, D(I.ref) + " · " + D(I.home), 1),
            r("div", tn, [
              (o(!0), m(z, null, Z(I.agents, (q) => (o(), m("span", {
                key: q,
                class: "kx-tag-sm ac-tone"
              }, [
                V(k(R), {
                  icon: k(rt)(q, k(a).agents)
                }, null, 8, ["icon"]),
                j(D(q), 1)
              ]))), 128))
            ]),
            r("div", nn, D(v.value[I.id]), 1),
            I.last_error ? (o(), m("div", an, D(I.last_error), 1)) : g("", !0)
          ]),
          r("div", sn, [
            I.shareable ? (o(), E(Ve, {
              key: 0,
              id: I.id,
              title: I.label
            }, null, 8, ["id", "title"])) : g("", !0),
            I.writable ? (o(), m("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Prepare image",
              "aria-label": "Prepare image",
              disabled: I.status === "preparing",
              onClick: (q) => N(I)
            }, [
              V(k(R), { icon: "tabler:refresh" })
            ], 8, rn)) : g("", !0),
            r("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Build log",
              "aria-label": "Build log",
              onClick: (q) => ae(I)
            }, [
              V(k(R), { icon: "tabler:file-text" })
            ], 8, ln),
            I.writable ? (o(), m("button", {
              key: 2,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Edit settings",
              "aria-label": "Edit settings",
              onClick: (q) => K(I)
            }, [
              V(k(R), { icon: "tabler:pencil" })
            ], 8, on)) : g("", !0),
            I.deletable ? (o(), m("button", {
              key: 3,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete image",
              "aria-label": "Delete image",
              onClick: (q) => te(I)
            }, [
              V(k(R), { icon: "tabler:trash" })
            ], 8, un)) : g("", !0)
          ])
        ]))), 128))
      ]),
      s.value || b.value ? (o(), E(he, {
        key: 4,
        title: b.value ? "Edit image" : "Add image",
        busy: d.value,
        wide: "",
        onClose: P[3] || (P[3] = (I) => B())
      }, {
        default: ee(() => [
          V(jt, {
            onBusy: P[1] || (P[1] = (I) => d.value = I),
            edit: b.value,
            capabilities: l.value,
            onSaved: fe,
            onCancel: P[2] || (P[2] = (I) => B())
          }, null, 8, ["edit", "capabilities"])
        ]),
        _: 1
      }, 8, ["title", "busy"])) : g("", !0),
      c.value ? (o(), E(he, {
        key: 5,
        title: "Build log",
        wide: "",
        onClose: oe
      }, {
        default: ee(() => [
          r("div", cn, [
            r("strong", dn, D(c.value.ref), 1),
            r("pre", pn, D(c.value.text), 1)
          ])
        ]),
        _: 1
      })) : g("", !0)
    ]));
  }
}), fn = { class: "ac-stack" }, hn = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, vn = {
  key: 1,
  class: "kx-loading"
}, bn = {
  key: 2,
  class: "ac-chips"
}, gn = {
  key: 3,
  class: "kx-empty"
}, yn = { class: "kx-empty-ico" }, kn = {
  key: 4,
  class: "kx-empty"
}, $n = { class: "ac-list ac-resource-list" }, wn = { class: "ac-resource-icon" }, _n = { class: "ac-account-main" }, xn = { class: "ac-row-title" }, Cn = { class: "kx-tag-sm ac-tone" }, In = {
  key: 0,
  class: "ac-muted"
}, Sn = { class: "ac-mono" }, Dn = {
  key: 1,
  class: "ac-muted ac-mono"
}, Bn = { class: "ac-row-actions" }, An = ["onClick"], Ln = ["disabled"], Mn = {
  key: 0,
  class: "ac-muted"
}, Pn = {
  key: 1,
  class: "ac-field"
}, Vn = { class: "ac-chips" }, Un = ["onClick"], Tn = { class: "ac-field" }, En = { class: "ac-field" }, Nn = ["placeholder"], Rn = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Fn = { class: "ac-dialog-foot" }, On = ["disabled"], jn = ["disabled"], zn = /* @__PURE__ */ Q({
  __name: "workspaces",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(t, { expose: e, emit: n }) {
    const a = $e(), u = w([]), i = t, s = n, d = w(!1);
    e({ open: () => {
      d.value = !0;
    } });
    const v = w([]), _ = w([]), L = w(""), S = w(!1), b = w(""), c = w(!1), l = w(""), p = w(!1);
    function A(h) {
      return h.replace(/\/+$/, "") + "/";
    }
    J([d, _], () => {
      d.value && !l.value && _.value.length && (l.value = A(_.value[0]));
    }), J(l, (h) => {
      c.value || (b.value = h.trim().split("/").filter(Boolean).pop() ?? "");
    });
    const y = me(async () => {
      try {
        await Te(W.workspaces, (h) => h.workspaces.map((f) => f.id), u, a, (h) => {
          v.value = h.workspaces, _.value = h.roots ?? [], p.value = !0, L.value = "";
        }, () => {
          y();
        });
      } catch (h) {
        a() && (L.value = H(h, "Could not load workspaces."));
      }
    }, a);
    Ue(() => u.value, () => {
      y();
    }), pe(y);
    async function U() {
      L.value = "", S.value = !0;
      try {
        if (await W.createWorkspace({ name: b.value, host_path: l.value }), !a()) return;
        c.value = !1, b.value = "", l.value = "", d.value = !1, await y();
      } catch (h) {
        a() && (L.value = H(h, "Could not save the workspace."));
      } finally {
        a() && (S.value = !1);
      }
    }
    async function $(h) {
      const f = await se.confirm({
        header: "Delete workspace",
        message: `Delete workspace "${h.name}"? The host directory stays untouched.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      });
      if (!(!a() || !f)) {
        L.value = "";
        try {
          await W.deleteWorkspace(h.id), await y();
        } catch (C) {
          a() && (L.value = H(C, "Could not delete the workspace."));
        }
      }
    }
    const x = F(() => v.value.filter((h) => [h.name, h.host_path].join(" ").toLowerCase().includes(i.query.toLowerCase())));
    return J(v, (h) => {
      s("count", h.length);
    }), (h, f) => (o(), m("div", fn, [
      f[15] || (f[15] = r("p", { class: "ac-hint" }, "Tasks use shared workspaces with the access you grant.", -1)),
      L.value && !d.value ? (o(), m("p", hn, [
        j(D(L.value) + " ", 1),
        r("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: f[0] || (f[0] = //@ts-ignore
          (...C) => k(y) && k(y)(...C))
        }, "Retry")
      ])) : g("", !0),
      !p.value && !L.value ? (o(), m("div", vn, "Loading workspaces…")) : g("", !0),
      _.value.length ? (o(), m("div", bn, [
        f[7] || (f[7] = r("span", { class: "ac-muted" }, "Allowed roots", -1)),
        (o(!0), m(z, null, Z(_.value, (C) => (o(), m("span", {
          key: C,
          class: "ac-hint-chip ac-mono"
        }, D(C), 1))), 128))
      ])) : g("", !0),
      p.value && !v.value.length ? (o(), m("div", gn, [
        r("div", yn, [
          V(k(R), { icon: "tabler:folder" })
        ]),
        f[8] || (f[8] = r("div", { class: "kx-empty-title" }, "No workspaces yet", -1)),
        f[9] || (f[9] = r("div", { class: "kx-empty-sub" }, "Add a host directory, or let tasks use a scratch directory.", -1)),
        r("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: f[1] || (f[1] = (C) => d.value = !0)
        }, "Add workspace")
      ])) : p.value && !x.value.length ? (o(), m("div", kn, [...f[10] || (f[10] = [
        r("div", { class: "kx-empty-title" }, "No matches", -1),
        r("div", { class: "kx-empty-sub" }, "Try another workspace name or path.", -1)
      ])])) : g("", !0),
      r("ul", $n, [
        (o(!0), m(z, null, Z(x.value, (C) => (o(), m("li", {
          key: C.id,
          class: "ac-row ac-resource"
        }, [
          r("span", wn, [
            V(k(R), { icon: "tabler:folder" })
          ]),
          r("div", _n, [
            r("div", xn, [
              j(D(C.name), 1),
              r("span", Cn, D(C.writable ? "read-write" : "read-only"), 1)
            ]),
            C.unavailable_reason ? (o(), m("div", In, D(C.unavailable_reason), 1)) : g("", !0),
            (o(!0), m(z, null, Z(C.conflicts, (K) => (o(), m("div", {
              key: K.id,
              class: "ac-muted"
            }, [
              j("Conflicts with " + D(K.id) + ": ", 1),
              r("span", Sn, D(K.host_path), 1)
            ]))), 128)),
            C.host_path ? (o(), m("div", Dn, D(C.host_path), 1)) : g("", !0)
          ]),
          r("div", Bn, [
            C.shareable ? (o(), E(Ve, {
              key: 0,
              id: C.id,
              title: C.name
            }, null, 8, ["id", "title"])) : g("", !0),
            C.deletable ? (o(), m("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete workspace",
              "aria-label": "Delete workspace",
              onClick: (K) => $(C)
            }, [
              V(k(R), { icon: "tabler:trash" })
            ], 8, An)) : g("", !0)
          ])
        ]))), 128))
      ]),
      d.value ? (o(), E(he, {
        key: 5,
        title: "Add workspace",
        busy: S.value,
        onClose: f[6] || (f[6] = (C) => d.value = !1)
      }, {
        default: ee(() => [
          r("fieldset", {
            class: "ac-form",
            disabled: S.value
          }, [
            _.value.length ? (o(), m("div", Pn, [
              f[11] || (f[11] = r("span", null, "Allowed roots", -1)),
              r("div", Vn, [
                (o(!0), m(z, null, Z(_.value, (C) => (o(), m("button", {
                  key: C,
                  type: "button",
                  class: "ac-chip ac-mono kx-focus-halo",
                  title: "Start from this root",
                  onClick: (K) => l.value = A(C)
                }, D(C), 9, Un))), 128))
              ])
            ])) : (o(), m("p", Mn, "The host administrator configures allowed workspace roots.")),
            r("label", Tn, [
              f[12] || (f[12] = r("span", null, "Name", -1)),
              O(r("input", {
                "onUpdate:modelValue": f[2] || (f[2] = (C) => b.value = C),
                onInput: f[3] || (f[3] = (C) => c.value = !0),
                autofocus: "",
                class: "kx-focus-halo",
                placeholder: "e.g. Kickside checkout"
              }, null, 544), [
                [Y, b.value]
              ])
            ]),
            r("label", En, [
              f[13] || (f[13] = r("span", null, "Host directory", -1)),
              O(r("input", {
                "onUpdate:modelValue": f[4] || (f[4] = (C) => l.value = C),
                class: "ac-mono kx-focus-halo",
                placeholder: (_.value[0] ?? "/srv/work") + "/project"
              }, null, 8, Nn), [
                [Y, l.value]
              ]),
              f[14] || (f[14] = r("small", { class: "ac-hint" }, [
                j("An existing directory, mounted at "),
                r("code", null, "/workspace"),
                j(".")
              ], -1))
            ]),
            L.value ? (o(), m("p", Rn, D(L.value), 1)) : g("", !0),
            r("footer", Fn, [
              r("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                disabled: S.value,
                onClick: f[5] || (f[5] = (C) => d.value = !1)
              }, "Cancel", 8, On),
              r("button", {
                type: "button",
                class: "ac-btn primary kx-focus-halo",
                disabled: S.value || !b.value.trim() || !l.value.trim(),
                onClick: U
              }, [
                V(k(R), { icon: "tabler:folder-plus" }),
                j(D(S.value ? "Saving…" : "Add workspace"), 1)
              ], 8, jn)
            ])
          ], 8, Ln)
        ]),
        _: 1
      }, 8, ["busy"])) : g("", !0)
    ]));
  }
}), Kn = { class: "ac-stack ac-narrow" }, qn = { class: "ac-card" }, Gn = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Wn = { class: "ac-pre" }, Hn = /* @__PURE__ */ Q({
  __name: "maintenance",
  setup(t) {
    const e = ke(), n = w(!1), a = w(""), u = w("");
    async function i() {
      if (await se.confirm({
        header: "Clean up Docker",
        message: `Prune stopped Autocode containers, unused images and build cache older than ${e.value.build_cache_retention} across this Docker host? Other modules may use the shared image cache.`,
        icon: "tabler:trash-x",
        acceptLabel: "Clean up",
        rejectLabel: "Cancel"
      })) {
        u.value = "", a.value = "", n.value = !0;
        try {
          a.value = await W.prune();
        } catch (d) {
          u.value = H(d, "Cleanup failed.");
        } finally {
          n.value = !1;
        }
      }
    }
    return (s, d) => (o(), m("section", Kn, [
      V(re, {
        title: "Docker cleanup",
        icon: "tabler:brand-docker",
        subtitle: "Reclaim disk space used by finished tasks and old builds.",
        count: `Cache retention · ${k(e).build_cache_retention}`
      }, {
        actions: ee(() => [
          V(k(ne), {
            label: "Clean up Docker",
            loading: n.value,
            disabled: n.value,
            onClick: i
          }, {
            icon: ee(() => [
              V(k(R), {
                icon: "tabler:trash-x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["loading", "disabled"])
        ]),
        _: 1
      }, 8, ["count"]),
      r("div", qn, [
        d[1] || (d[1] = r("p", { class: "ac-hint" }, "Remove stopped Autocode containers, dangling images and unused build cache older than the retention window. The cache is shared with other modules. Tagged images stay.", -1)),
        u.value ? (o(), m("p", Gn, D(u.value) + " Check the Docker host and try again.", 1)) : g("", !0),
        a.value ? (o(), m(z, { key: 1 }, [
          d[0] || (d[0] = r("p", { role: "status" }, "Cleanup finished.", -1)),
          V(Ee, { label: "Technical details" }, {
            default: ee(() => [
              r("pre", Wn, D(a.value), 1)
            ]),
            _: 1
          })
        ], 64)) : g("", !0)
      ])
    ]));
  }
});
var Re = {
  name: "AngleDownIcon",
  extends: Me
};
function Zn(t) {
  return Xn(t) || Qn(t) || Jn(t) || Yn();
}
function Yn() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Jn(t, e) {
  if (t) {
    if (typeof t == "string") return ve(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ve(t, e) : void 0;
  }
}
function Qn(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Xn(t) {
  if (Array.isArray(t)) return ve(t);
}
function ve(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, a = Array(e); n < e; n++) a[n] = t[n];
  return a;
}
function ea(t, e, n, a, u, i) {
  return o(), m("svg", G({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), Zn(e[0] || (e[0] = [r("path", {
    d: "M3.58659 4.5007C3.68513 4.50023 3.78277 4.51945 3.87379 4.55723C3.9648 4.59501 4.04735 4.65058 4.11659 4.7207L7.11659 7.7207L10.1166 4.7207C10.2619 4.65055 10.4259 4.62911 10.5843 4.65956C10.7427 4.69002 10.8871 4.77074 10.996 4.88976C11.1049 5.00877 11.1726 5.15973 11.1889 5.32022C11.2052 5.48072 11.1693 5.6422 11.0866 5.7807L7.58659 9.2807C7.44597 9.42115 7.25534 9.50004 7.05659 9.50004C6.85784 9.50004 6.66722 9.42115 6.52659 9.2807L3.02659 5.7807C2.88614 5.64007 2.80725 5.44945 2.80725 5.2507C2.80725 5.05195 2.88614 4.86132 3.02659 4.7207C3.09932 4.64685 3.18675 4.58911 3.28322 4.55121C3.37969 4.51331 3.48305 4.4961 3.58659 4.5007Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Re.render = ea;
var Fe = {
  name: "AngleUpIcon",
  extends: Me
};
function ta(t) {
  return sa(t) || ia(t) || aa(t) || na();
}
function na() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function aa(t, e) {
  if (t) {
    if (typeof t == "string") return be(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? be(t, e) : void 0;
  }
}
function ia(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function sa(t) {
  if (Array.isArray(t)) return be(t);
}
function be(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, a = Array(e); n < e; n++) a[n] = t[n];
  return a;
}
function ra(t, e, n, a, u, i) {
  return o(), m("svg", G({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), ta(e[0] || (e[0] = [r("path", {
    d: "M10.4134 9.49931C10.3148 9.49977 10.2172 9.48055 10.1262 9.44278C10.0352 9.405 9.95263 9.34942 9.88338 9.27931L6.88338 6.27931L3.88338 9.27931C3.73811 9.34946 3.57409 9.3709 3.41567 9.34044C3.25724 9.30999 3.11286 9.22926 3.00395 9.11025C2.89504 8.99124 2.82741 8.84028 2.8111 8.67978C2.79478 8.51928 2.83065 8.35781 2.91338 8.21931L6.41338 4.71931C6.55401 4.57886 6.74463 4.49997 6.94338 4.49997C7.14213 4.49997 7.33276 4.57886 7.47338 4.71931L10.9734 8.21931C11.1138 8.35994 11.1927 8.55056 11.1927 8.74931C11.1927 8.94806 11.1138 9.13868 10.9734 9.27931C10.9007 9.35315 10.8132 9.41089 10.7168 9.44879C10.6203 9.48669 10.5169 9.5039 10.4134 9.49931Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Fe.render = ra;
var la = `
    .p-inputnumber {
        display: inline-flex;
        position: relative;
    }

    .p-inputnumber-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        cursor: pointer;
        background: dt('inputnumber.button.background');
        color: dt('inputnumber.button.color');
        width: dt('inputnumber.button.width');
        transition:
            background dt('inputnumber.transition.duration'),
            color dt('inputnumber.transition.duration'),
            border-color dt('inputnumber.transition.duration'),
            outline-color dt('inputnumber.transition.duration');
    }

    .p-inputnumber-button:disabled {
        cursor: auto;
    }

    .p-inputnumber-button:not(:disabled):hover {
        background: dt('inputnumber.button.hover.background');
        color: dt('inputnumber.button.hover.color');
    }

    .p-inputnumber-button:not(:disabled):active {
        background: dt('inputnumber.button.active.background');
        color: dt('inputnumber.button.active.color');
    }

    .p-inputnumber-stacked .p-inputnumber-button {
        position: relative;
        flex: 1 1 auto;
        border: 0 none;
    }

    .p-inputnumber-stacked .p-inputnumber-button-group {
        display: flex;
        flex-direction: column;
        position: absolute;
        inset-block-start: 1px;
        inset-inline-end: 1px;
        height: calc(100% - 2px);
        z-index: 1;
    }

    .p-inputnumber-stacked .p-inputnumber-increment-button {
        padding: 0;
        border-start-end-radius: calc(dt('inputnumber.button.border.radius') - 1px);
    }

    .p-inputnumber-stacked .p-inputnumber-decrement-button {
        padding: 0;
        border-end-end-radius: calc(dt('inputnumber.button.border.radius') - 1px);
    }

    .p-inputnumber-stacked .p-inputnumber-input {
        padding-inline-end: calc(dt('inputnumber.button.width') + dt('form.field.padding.x'));
    }

    .p-inputnumber-horizontal .p-inputnumber-button {
        border: 1px solid dt('inputnumber.button.border.color');
    }

    .p-inputnumber-horizontal .p-inputnumber-button:hover {
        border-color: dt('inputnumber.button.hover.border.color');
    }

    .p-inputnumber-horizontal .p-inputnumber-button:active {
        border-color: dt('inputnumber.button.active.border.color');
    }

    .p-inputnumber-horizontal .p-inputnumber-increment-button {
        order: 3;
        border-start-end-radius: dt('inputnumber.button.border.radius');
        border-end-end-radius: dt('inputnumber.button.border.radius');
        border-inline-start: 0 none;
    }

    .p-inputnumber-horizontal .p-inputnumber-input {
        order: 2;
        border-radius: 0;
    }

    .p-inputnumber-horizontal .p-inputnumber-decrement-button {
        order: 1;
        border-start-start-radius: dt('inputnumber.button.border.radius');
        border-end-start-radius: dt('inputnumber.button.border.radius');
        border-inline-end: 0 none;
    }

    .p-floatlabel:has(.p-inputnumber-horizontal) label {
        margin-inline-start: dt('inputnumber.button.width');
    }

    .p-inputnumber-vertical {
        flex-direction: column;
    }

    .p-inputnumber-vertical .p-inputnumber-button {
        border: 1px solid dt('inputnumber.button.border.color');
        padding: dt('inputnumber.button.vertical.padding');
    }

    .p-inputnumber-vertical .p-inputnumber-button:hover {
        border-color: dt('inputnumber.button.hover.border.color');
    }

    .p-inputnumber-vertical .p-inputnumber-button:active {
        border-color: dt('inputnumber.button.active.border.color');
    }

    .p-inputnumber-vertical .p-inputnumber-increment-button {
        order: 1;
        border-start-start-radius: dt('inputnumber.button.border.radius');
        border-start-end-radius: dt('inputnumber.button.border.radius');
        width: 100%;
        border-block-end: 0 none;
    }

    .p-inputnumber-vertical .p-inputnumber-input {
        order: 2;
        border-radius: 0;
        text-align: center;
    }

    .p-inputnumber-vertical .p-inputnumber-decrement-button {
        order: 3;
        border-end-start-radius: dt('inputnumber.button.border.radius');
        border-end-end-radius: dt('inputnumber.button.border.radius');
        width: 100%;
        border-block-start: 0 none;
    }

    .p-inputnumber-input {
        flex: 1 1 auto;
    }

    .p-inputnumber-fluid {
        width: 100%;
    }

    .p-inputnumber-fluid .p-inputnumber-input {
        width: 1%;
    }

    .p-inputnumber-fluid.p-inputnumber-vertical .p-inputnumber-input {
        width: 100%;
    }

    .p-inputnumber:has(.p-inputtext-sm) .p-inputnumber-button .p-icon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
    }

    .p-inputnumber:has(.p-inputtext-lg) .p-inputnumber-button .p-icon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
    }

    .p-inputnumber-clear-icon {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        cursor: pointer;
        inset-inline-end: dt('form.field.padding.x');
        color: dt('form.field.icon.color');
    }

    .p-inputnumber:has(.p-inputnumber-clear-icon) .p-inputnumber-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-inputnumber-stacked .p-inputnumber-clear-icon {
        inset-inline-end: calc(dt('inputnumber.button.width') + dt('form.field.padding.x'));
    }

    .p-inputnumber-stacked:has(.p-inputnumber-clear-icon) .p-inputnumber-input {
        padding-inline-end: calc(dt('inputnumber.button.width') + (dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-inputnumber-horizontal .p-inputnumber-clear-icon {
        inset-inline-end: calc(dt('inputnumber.button.width') + dt('form.field.padding.x'));
    }
`, oa = {
  root: function(e) {
    var n = e.instance, a = e.props;
    return ["p-inputnumber p-component p-inputwrapper", {
      "p-invalid": n.$invalid,
      "p-inputwrapper-filled": n.$filled || a.allowEmpty === !1,
      "p-inputwrapper-focus": n.focused,
      "p-inputnumber-stacked": a.showButtons && a.buttonLayout === "stacked",
      "p-inputnumber-horizontal": a.showButtons && a.buttonLayout === "horizontal",
      "p-inputnumber-vertical": a.showButtons && a.buttonLayout === "vertical",
      "p-inputnumber-fluid": n.$fluid
    }];
  },
  pcInputText: "p-inputnumber-input",
  clearIcon: "p-inputnumber-clear-icon",
  buttonGroup: "p-inputnumber-button-group",
  incrementButton: function(e) {
    var n = e.instance, a = e.props;
    return ["p-inputnumber-button p-inputnumber-increment-button", {
      "p-disabled": a.showButtons && a.max !== null && n.maxBoundry()
    }];
  },
  decrementButton: function(e) {
    var n = e.instance, a = e.props;
    return ["p-inputnumber-button p-inputnumber-decrement-button", {
      "p-disabled": a.showButtons && a.min !== null && n.minBoundry()
    }];
  }
}, ua = je.extend({
  name: "inputnumber",
  style: la,
  classes: oa
}), ca = {
  name: "BaseInputNumber",
  extends: ut,
  props: {
    format: {
      type: Boolean,
      default: !0
    },
    showButtons: {
      type: Boolean,
      default: !1
    },
    buttonLayout: {
      type: String,
      default: "stacked"
    },
    incrementButtonClass: {
      type: String,
      default: null
    },
    decrementButtonClass: {
      type: String,
      default: null
    },
    incrementButtonIcon: {
      type: String,
      default: void 0
    },
    incrementIcon: {
      type: String,
      default: void 0
    },
    decrementButtonIcon: {
      type: String,
      default: void 0
    },
    decrementIcon: {
      type: String,
      default: void 0
    },
    locale: {
      type: String,
      default: void 0
    },
    localeMatcher: {
      type: String,
      default: void 0
    },
    mode: {
      type: String,
      default: "decimal"
    },
    prefix: {
      type: String,
      default: null
    },
    suffix: {
      type: String,
      default: null
    },
    currency: {
      type: String,
      default: void 0
    },
    currencyDisplay: {
      type: String,
      default: void 0
    },
    useGrouping: {
      type: Boolean,
      default: !0
    },
    minFractionDigits: {
      type: Number,
      default: void 0
    },
    maxFractionDigits: {
      type: Number,
      default: void 0
    },
    roundingMode: {
      type: String,
      default: "halfExpand",
      validator: function(e) {
        return ["ceil", "floor", "expand", "trunc", "halfCeil", "halfFloor", "halfExpand", "halfTrunc", "halfEven"].includes(e);
      }
    },
    min: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: null
    },
    step: {
      type: Number,
      default: 1
    },
    allowEmpty: {
      type: Boolean,
      default: !0
    },
    highlightOnFocus: {
      type: Boolean,
      default: !1
    },
    showClear: {
      type: Boolean,
      default: !1
    },
    readonly: {
      type: Boolean,
      default: !1
    },
    placeholder: {
      type: String,
      default: null
    },
    inputId: {
      type: String,
      default: null
    },
    inputClass: {
      type: [String, Object],
      default: null
    },
    inputStyle: {
      type: Object,
      default: null
    },
    ariaLabelledby: {
      type: String,
      default: null
    },
    ariaLabel: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: !1
    }
  },
  style: ua,
  provide: function() {
    return {
      $pcInputNumber: this,
      $parentInstance: this
    };
  }
};
function le(t) {
  "@babel/helpers - typeof";
  return le = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, le(t);
}
function Be(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(t);
    e && (a = a.filter(function(u) {
      return Object.getOwnPropertyDescriptor(t, u).enumerable;
    })), n.push.apply(n, a);
  }
  return n;
}
function Ae(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Be(Object(n), !0).forEach(function(a) {
      ge(t, a, n[a]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Be(Object(n)).forEach(function(a) {
      Object.defineProperty(t, a, Object.getOwnPropertyDescriptor(n, a));
    });
  }
  return t;
}
function ge(t, e, n) {
  return (e = da(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function da(t) {
  var e = pa(t, "string");
  return le(e) == "symbol" ? e : e + "";
}
function pa(t, e) {
  if (le(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var a = n.call(t, e);
    if (le(a) != "object") return a;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function ma(t) {
  return ba(t) || va(t) || ha(t) || fa();
}
function fa() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ha(t, e) {
  if (t) {
    if (typeof t == "string") return ye(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ye(t, e) : void 0;
  }
}
function va(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function ba(t) {
  if (Array.isArray(t)) return ye(t);
}
function ye(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, a = Array(e); n < e; n++) a[n] = t[n];
  return a;
}
var Oe = {
  name: "InputNumber",
  extends: ca,
  inheritAttrs: !1,
  emits: ["input", "focus", "blur"],
  inject: {
    $pcFluid: {
      default: null
    }
  },
  numberFormat: null,
  _numeral: null,
  _decimal: null,
  _group: null,
  _minusSign: null,
  _currency: null,
  _suffix: null,
  _prefix: null,
  _index: null,
  groupChar: "",
  isSpecialChar: null,
  prefixChar: null,
  suffixChar: null,
  timer: null,
  data: function() {
    return {
      // @deprecated
      d_modelValue: this.d_value,
      focused: !1
    };
  },
  watch: {
    d_value: {
      immediate: !0,
      handler: function(e) {
        var n;
        this.d_modelValue = e, (n = this.$refs.clearIcon) !== null && n !== void 0 && (n = n.$el) !== null && n !== void 0 && n.style && (this.$refs.clearIcon.$el.style.display = xe(e) ? "none" : "block");
      }
    },
    locale: function(e, n) {
      this.updateConstructParser(e, n);
    },
    localeMatcher: function(e, n) {
      this.updateConstructParser(e, n);
    },
    mode: function(e, n) {
      this.updateConstructParser(e, n);
    },
    currency: function(e, n) {
      this.updateConstructParser(e, n);
    },
    currencyDisplay: function(e, n) {
      this.updateConstructParser(e, n);
    },
    useGrouping: function(e, n) {
      this.updateConstructParser(e, n);
    },
    minFractionDigits: function(e, n) {
      this.updateConstructParser(e, n);
    },
    maxFractionDigits: function(e, n) {
      this.updateConstructParser(e, n);
    },
    suffix: function(e, n) {
      this.updateConstructParser(e, n);
    },
    prefix: function(e, n) {
      this.updateConstructParser(e, n);
    }
  },
  created: function() {
    this.constructParser();
  },
  mounted: function() {
    var e;
    (e = this.$refs.clearIcon) !== null && e !== void 0 && (e = e.$el) !== null && e !== void 0 && e.style && (this.$refs.clearIcon.$el.style.display = this.$filled ? "block" : "none");
  },
  methods: {
    getOptions: function() {
      return {
        localeMatcher: this.localeMatcher,
        style: this.mode,
        currency: this.currency,
        currencyDisplay: this.currencyDisplay,
        useGrouping: this.useGrouping,
        minimumFractionDigits: this.minFractionDigits,
        maximumFractionDigits: this.maxFractionDigits,
        roundingMode: this.roundingMode
      };
    },
    constructParser: function() {
      this.numberFormat = new Intl.NumberFormat(this.locale, this.getOptions());
      var e = ma(new Intl.NumberFormat(this.locale, {
        useGrouping: !1
      }).format(9876543210)).reverse(), n = new Map(e.map(function(a, u) {
        return [a, u];
      }));
      this._numeral = new RegExp("[".concat(e.join(""), "]"), "g"), this._group = this.getGroupingExpression(), this._minusSign = this.getMinusSignExpression(), this._currency = this.getCurrencyExpression(), this._decimal = this.getDecimalExpression(), this._suffix = this.getSuffixExpression(), this._prefix = this.getPrefixExpression(), this._index = function(a) {
        return n.get(a);
      };
    },
    updateConstructParser: function(e, n) {
      e !== n && this.constructParser();
    },
    escapeRegExp: function(e) {
      return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    },
    getDecimalExpression: function() {
      var e = new Intl.NumberFormat(this.locale, Ae(Ae({}, this.getOptions()), {}, {
        useGrouping: !1
      })), n = e.format(1.1);
      return n === e.format(1) ? new RegExp("[]", "g") : new RegExp("[".concat(n.replace(this._currency, "").trim().replace(this._numeral, ""), "]"), "g");
    },
    getGroupingExpression: function() {
      var e = new Intl.NumberFormat(this.locale, {
        useGrouping: !0
      });
      return this.groupChar = e.format(1e6).trim().replace(this._numeral, "").charAt(0), new RegExp("[".concat(this.groupChar, "]"), "g");
    },
    getMinusSignExpression: function() {
      var e = new Intl.NumberFormat(this.locale, {
        useGrouping: !1
      });
      return new RegExp("[".concat(e.format(-1).trim().replace(this._numeral, ""), "]"), "g");
    },
    getCurrencyExpression: function() {
      if (this.currency) {
        var e = new Intl.NumberFormat(this.locale, {
          style: "currency",
          currency: this.currency,
          currencyDisplay: this.currencyDisplay,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          roundingMode: this.roundingMode
        });
        return new RegExp("[".concat(e.format(1).replace(/\s/g, "").replace(this._numeral, "").replace(this._group, ""), "]"), "g");
      }
      return new RegExp("[]", "g");
    },
    getPrefixExpression: function() {
      if (this.prefix)
        this.prefixChar = this.prefix;
      else {
        var e = new Intl.NumberFormat(this.locale, {
          style: this.mode,
          currency: this.currency,
          currencyDisplay: this.currencyDisplay
        });
        this.prefixChar = e.format(1).split("1")[0];
      }
      return new RegExp("".concat(this.escapeRegExp(this.prefixChar || "")), "g");
    },
    getSuffixExpression: function() {
      if (this.suffix)
        this.suffixChar = this.suffix;
      else {
        var e = new Intl.NumberFormat(this.locale, {
          style: this.mode,
          currency: this.currency,
          currencyDisplay: this.currencyDisplay,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          roundingMode: this.roundingMode
        });
        this.suffixChar = e.format(1).split("1")[1];
      }
      return new RegExp("".concat(this.escapeRegExp(this.suffixChar || "")), "g");
    },
    formatValue: function(e) {
      if (e != null) {
        if (e === "-")
          return e;
        if (this.format) {
          var n = new Intl.NumberFormat(this.locale, this.getOptions()), a = n.format(e);
          return this.prefix && (a = this.prefix + a), this.suffix && (a = a + this.suffix), a;
        }
        return e.toString();
      }
      return "";
    },
    parseValue: function(e) {
      var n = e.replace(this._suffix, "").replace(this._prefix, "").trim().replace(/\s/g, "").replace(this._currency, "").replace(this._group, "").replace(this._minusSign, "-").replace(this._decimal, ".").replace(this._numeral, this._index);
      if (n) {
        if (n === "-")
          return n;
        var a = +n;
        return isNaN(a) ? null : a;
      }
      return null;
    },
    repeat: function(e, n, a) {
      var u = this;
      if (!this.readonly) {
        var i = n || 500;
        this.clearTimer(), this.timer = setTimeout(function() {
          u.repeat(e, 40, a);
        }, i), this.spin(e, a);
      }
    },
    addWithPrecision: function(e, n) {
      var a = e.toString(), u = n.toString(), i = a.includes(".") ? a.split(".")[1].length : 0, s = u.includes(".") ? u.split(".")[1].length : 0, d = Math.max(i, s), v = Math.pow(10, d);
      return Math.round((e + n) * v) / v;
    },
    spin: function(e, n) {
      if (this.$refs.input) {
        var a = this.step * n, u = this.parseValue(this.$refs.input.$el.value) || 0, i = this.validateValue(this.addWithPrecision(u, a));
        this.updateInput(i, null, "spin"), this.updateModel(e, i), this.handleOnInput(e, u, i);
      }
    },
    onUpButtonMouseDown: function(e) {
      this.disabled || (this.$refs.input.$el.focus(), this.repeat(e, null, 1), e.preventDefault());
    },
    onUpButtonMouseUp: function() {
      this.disabled || this.clearTimer();
    },
    onUpButtonMouseLeave: function() {
      this.disabled || this.clearTimer();
    },
    onUpButtonKeyUp: function() {
      this.disabled || this.clearTimer();
    },
    onUpButtonKeyDown: function(e) {
      (e.code === "Space" || e.code === "Enter" || e.code === "NumpadEnter") && this.repeat(e, null, 1);
    },
    onDownButtonMouseDown: function(e) {
      this.disabled || (this.$refs.input.$el.focus(), this.repeat(e, null, -1), e.preventDefault());
    },
    onDownButtonMouseUp: function() {
      this.disabled || this.clearTimer();
    },
    onDownButtonMouseLeave: function() {
      this.disabled || this.clearTimer();
    },
    onDownButtonKeyUp: function() {
      this.disabled || this.clearTimer();
    },
    onDownButtonKeyDown: function(e) {
      (e.code === "Space" || e.code === "Enter" || e.code === "NumpadEnter") && this.repeat(e, null, -1);
    },
    onUserInput: function() {
      this.isSpecialChar && (this.$refs.input.$el.value = this.lastValue), this.isSpecialChar = !1;
    },
    onInputKeyDown: function(e) {
      if (!this.readonly && !e.isComposing) {
        if (e.altKey || e.ctrlKey || e.metaKey) {
          this.isSpecialChar = !0, this.lastValue = this.$refs.input.$el.value;
          return;
        }
        this.lastValue = e.target.value;
        var n = e.target.selectionStart, a = e.target.selectionEnd, u = a - n, i = e.target.value, s = null, d = e.code || e.key;
        switch (d) {
          case "ArrowUp":
            this.spin(e, 1), e.preventDefault();
            break;
          case "ArrowDown":
            this.spin(e, -1), e.preventDefault();
            break;
          case "ArrowLeft":
            if (u > 1) {
              var v = this.isNumeralChar(i.charAt(n)) ? n + 1 : n + 2;
              this.$refs.input.$el.setSelectionRange(v, v);
            } else this.isNumeralChar(i.charAt(n - 1)) || e.preventDefault();
            break;
          case "ArrowRight":
            if (u > 1) {
              var _ = a - 1;
              this.$refs.input.$el.setSelectionRange(_, _);
            } else this.isNumeralChar(i.charAt(n)) || e.preventDefault();
            break;
          case "Tab":
          case "Enter":
          case "NumpadEnter":
            s = this.validateValue(this.parseValue(i)), this.$refs.input.$el.value = this.formatValue(s), this.$refs.input.$el.setAttribute("aria-valuenow", s), this.updateModel(e, s);
            break;
          case "Backspace": {
            if (e.preventDefault(), n === a) {
              n >= i.length && this.suffixChar !== null && (n = i.length - this.suffixChar.length, this.$refs.input.$el.setSelectionRange(n, n));
              var L = i.charAt(n - 1), S = this.getDecimalCharIndexes(i), b = S.decimalCharIndex, c = S.decimalCharIndexWithoutPrefix;
              if (this.isNumeralChar(L)) {
                var l = this.getDecimalLength(i);
                if (this._group.test(L))
                  this._group.lastIndex = 0, s = i.slice(0, n - 2) + i.slice(n - 1);
                else if (this._decimal.test(L))
                  this._decimal.lastIndex = 0, l ? this.$refs.input.$el.setSelectionRange(n - 1, n - 1) : s = i.slice(0, n - 1) + i.slice(n);
                else if (b > 0 && n > b) {
                  var p = this.isDecimalMode() && (this.minFractionDigits || 0) < l ? "" : "0";
                  s = i.slice(0, n - 1) + p + i.slice(n);
                } else c === 1 ? (s = i.slice(0, n - 1) + "0" + i.slice(n), s = this.parseValue(s) > 0 ? s : "") : s = i.slice(0, n - 1) + i.slice(n);
              }
              this.updateValue(e, s, null, "delete-single");
            } else
              s = this.deleteRange(i, n, a), this.updateValue(e, s, null, "delete-range");
            break;
          }
          case "Delete":
            if (e.preventDefault(), n === a) {
              var A = i.charAt(n), y = this.getDecimalCharIndexes(i), U = y.decimalCharIndex, $ = y.decimalCharIndexWithoutPrefix;
              if (this.isNumeralChar(A)) {
                var x = this.getDecimalLength(i);
                if (this._group.test(A))
                  this._group.lastIndex = 0, s = i.slice(0, n) + i.slice(n + 2);
                else if (this._decimal.test(A))
                  this._decimal.lastIndex = 0, x ? this.$refs.input.$el.setSelectionRange(n + 1, n + 1) : s = i.slice(0, n) + i.slice(n + 1);
                else if (U > 0 && n > U) {
                  var h = this.isDecimalMode() && (this.minFractionDigits || 0) < x ? "" : "0";
                  s = i.slice(0, n) + h + i.slice(n + 1);
                } else $ === 1 ? (s = i.slice(0, n) + "0" + i.slice(n + 1), s = this.parseValue(s) > 0 ? s : "") : s = i.slice(0, n) + i.slice(n + 1);
              }
              this.updateValue(e, s, null, "delete-back-single");
            } else
              s = this.deleteRange(i, n, a), this.updateValue(e, s, null, "delete-range");
            break;
          case "Home":
            e.preventDefault(), Ce(this.min) && this.updateModel(e, this.min);
            break;
          case "End":
            e.preventDefault(), Ce(this.max) && this.updateModel(e, this.max);
            break;
        }
      }
    },
    onInputKeyPress: function(e) {
      if (!this.readonly) {
        var n = e.key, a = this.isDecimalSign(n), u = this.isMinusSign(n);
        e.code !== "Enter" && e.preventDefault(), (Number(n) >= 0 && Number(n) <= 9 || u || a) && this.insert(e, n, {
          isDecimalSign: a,
          isMinusSign: u
        });
      }
    },
    onPaste: function(e) {
      if (!(this.readonly || this.disabled)) {
        e.preventDefault();
        var n = (e.clipboardData || window.clipboardData).getData("Text");
        if (!(this.inputId === "integeronly" && /[^\d-]/.test(n)) && n) {
          var a = this.parseValue(n);
          a != null && this.insert(e, a.toString());
        }
      }
    },
    onClearClick: function(e) {
      this.updateModel(e, null), this.$refs.input.$el.focus();
    },
    allowMinusSign: function() {
      return this.min === null || this.min < 0;
    },
    isMinusSign: function(e) {
      return this._minusSign.test(e) || e === "-" ? (this._minusSign.lastIndex = 0, !0) : !1;
    },
    isDecimalSign: function(e) {
      var n;
      return (n = this.locale) !== null && n !== void 0 && n.includes("fr") && [".", ","].includes(e) || this._decimal.test(e) ? (this._decimal.lastIndex = 0, !0) : !1;
    },
    isDecimalMode: function() {
      return this.mode === "decimal";
    },
    getDecimalCharIndexes: function(e) {
      var n = e.search(this._decimal);
      this._decimal.lastIndex = 0;
      var a = e.replace(this._prefix, "").trim().replace(/\s/g, "").replace(this._currency, ""), u = a.search(this._decimal);
      return this._decimal.lastIndex = 0, {
        decimalCharIndex: n,
        decimalCharIndexWithoutPrefix: u
      };
    },
    getCharIndexes: function(e) {
      var n = e.search(this._decimal);
      this._decimal.lastIndex = 0;
      var a = e.search(this._minusSign);
      this._minusSign.lastIndex = 0;
      var u = e.search(this._suffix);
      this._suffix.lastIndex = 0;
      var i = e.search(this._currency);
      return this._currency.lastIndex = 0, {
        decimalCharIndex: n,
        minusCharIndex: a,
        suffixCharIndex: u,
        currencyCharIndex: i
      };
    },
    insert: function(e, n) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
        isDecimalSign: !1,
        isMinusSign: !1
      }, u = n.search(this._minusSign);
      if (this._minusSign.lastIndex = 0, !(!this.allowMinusSign() && u !== -1)) {
        var i = this.$refs.input.$el.selectionStart, s = this.$refs.input.$el.selectionEnd, d = this.$refs.input.$el.value.trim(), v = this.getCharIndexes(d), _ = v.decimalCharIndex, L = v.minusCharIndex, S = v.suffixCharIndex, b = v.currencyCharIndex, c;
        if (a.isMinusSign) {
          var l = L === -1;
          (i === 0 || i === b + 1) && (c = d, (l || s !== 0) && (c = this.insertText(d, n, 0, s)), this.updateValue(e, c, n, "insert"));
        } else if (a.isDecimalSign)
          _ > 0 && i === _ ? this.updateValue(e, d, n, "insert") : _ > i && _ < s ? (c = this.insertText(d, n, i, s), this.updateValue(e, c, n, "insert")) : _ === -1 && this.maxFractionDigits && (c = this.insertText(d, n, i, s), this.updateValue(e, c, n, "insert"));
        else {
          var p = this.numberFormat.resolvedOptions().maximumFractionDigits, A = i !== s ? "range-insert" : "insert";
          if (_ > 0 && i > _) {
            if (i + n.length - (_ + 1) <= p) {
              var y = b >= i ? b - 1 : S >= i ? S : d.length;
              c = d.slice(0, i) + n + d.slice(i + n.length, y) + d.slice(y), this.updateValue(e, c, n, A);
            }
          } else
            c = this.insertText(d, n, i, s), this.updateValue(e, c, n, A);
        }
      }
    },
    insertText: function(e, n, a, u) {
      var i = n === "." ? n : n.split(".");
      if (i.length === 2) {
        var s = e.slice(a, u).search(this._decimal);
        return this._decimal.lastIndex = 0, s > 0 ? e.slice(0, a) + this.formatValue(n) + e.slice(u) : this.formatValue(n) || e;
      } else return u - a === e.length ? this.formatValue(n) : a === 0 ? n + e.slice(u) : u === e.length ? e.slice(0, a) + n : e.slice(0, a) + n + e.slice(u);
    },
    deleteRange: function(e, n, a) {
      var u;
      return a - n === e.length ? u = "" : n === 0 ? u = e.slice(a) : a === e.length ? u = e.slice(0, n) : u = e.slice(0, n) + e.slice(a), u;
    },
    initCursor: function() {
      var e = this.$refs.input.$el.selectionStart, n = this.$refs.input.$el.value, a = n.length, u = null, i = (this.prefixChar || "").length;
      n = n.replace(this._prefix, ""), e = e - i;
      var s = n.charAt(e);
      if (this.isNumeralChar(s))
        return e + i;
      for (var d = e - 1; d >= 0; )
        if (s = n.charAt(d), this.isNumeralChar(s)) {
          u = d + i;
          break;
        } else
          d--;
      if (u !== null)
        this.$refs.input.$el.setSelectionRange(u + 1, u + 1);
      else {
        for (d = e; d < a; )
          if (s = n.charAt(d), this.isNumeralChar(s)) {
            u = d + i;
            break;
          } else
            d++;
        u !== null && this.$refs.input.$el.setSelectionRange(u, u);
      }
      return u || 0;
    },
    onInputClick: function() {
      var e = this.$refs.input.$el.value;
      !this.readonly && e !== _e() && this.initCursor();
    },
    isNumeralChar: function(e) {
      return e.length === 1 && (this._numeral.test(e) || this._decimal.test(e) || this._group.test(e) || this._minusSign.test(e)) ? (this.resetRegex(), !0) : !1;
    },
    resetRegex: function() {
      this._numeral.lastIndex = 0, this._decimal.lastIndex = 0, this._group.lastIndex = 0, this._minusSign.lastIndex = 0;
    },
    updateValue: function(e, n, a, u) {
      var i = this.$refs.input.$el.value, s = null;
      n != null && (s = this.parseValue(n), s = !s && !this.allowEmpty ? 0 : s, this.updateInput(s, a, u, n), this.handleOnInput(e, i, s));
    },
    handleOnInput: function(e, n, a) {
      if (this.isValueChanged(n, a)) {
        var u, i;
        this.$emit("input", {
          originalEvent: e,
          value: a,
          formattedValue: n
        }), (u = (i = this.formField).onInput) === null || u === void 0 || u.call(i, {
          originalEvent: e,
          value: a
        });
      }
    },
    isValueChanged: function(e, n) {
      if (n === null && e !== null)
        return !0;
      if (n != null) {
        var a = typeof e == "string" ? this.parseValue(e) : e;
        return n !== a;
      }
      return !1;
    },
    validateValue: function(e) {
      return e === "-" || e == null ? null : this.min != null && e < this.min ? this.min : this.max != null && e > this.max ? this.max : e;
    },
    updateInput: function(e, n, a, u) {
      var i;
      n = n || "";
      var s = this.$refs.input.$el.value, d = this.formatValue(e), v = s.length;
      if (d !== u && (d = this.concatValues(d, u)), v === 0) {
        this.$refs.input.$el.value = d, this.$refs.input.$el.setSelectionRange(0, 0);
        var _ = this.initCursor(), L = _ + n.length;
        this.$refs.input.$el.setSelectionRange(L, L);
      } else {
        var S = this.$refs.input.$el.selectionStart, b = this.$refs.input.$el.selectionEnd;
        this.$refs.input.$el.value = d;
        var c = d.length;
        if (a === "range-insert") {
          var l = this.parseValue((s || "").slice(0, S)), p = l !== null ? l.toString() : "", A = p.split("").join("(".concat(this.groupChar, ")?")), y = new RegExp(A, "g");
          y.test(d);
          var U = n.split("").join("(".concat(this.groupChar, ")?")), $ = new RegExp(U, "g");
          $.test(d.slice(y.lastIndex)), b = y.lastIndex + $.lastIndex, this.$refs.input.$el.setSelectionRange(b, b);
        } else if (c === v)
          a === "insert" || a === "delete-back-single" ? this.$refs.input.$el.setSelectionRange(b + 1, b + 1) : a === "delete-single" ? this.$refs.input.$el.setSelectionRange(b - 1, b - 1) : (a === "delete-range" || a === "spin") && this.$refs.input.$el.setSelectionRange(b, b);
        else if (a === "delete-back-single") {
          var x = s.charAt(b - 1), h = s.charAt(b), f = v - c, C = this._group.test(h);
          C && f === 1 ? b += 1 : !C && this.isNumeralChar(x) && (b += -1 * f + 1), this._group.lastIndex = 0, this.$refs.input.$el.setSelectionRange(b, b);
        } else if (s === "-" && a === "insert") {
          this.$refs.input.$el.setSelectionRange(0, 0);
          var K = this.initCursor(), B = K + n.length + 1;
          this.$refs.input.$el.setSelectionRange(B, B);
        } else
          b = b + (c - v), this.$refs.input.$el.setSelectionRange(b, b);
      }
      this.$refs.input.$el.setAttribute("aria-valuenow", e), (i = this.$refs.clearIcon) !== null && i !== void 0 && (i = i.$el) !== null && i !== void 0 && i.style && (this.$refs.clearIcon.$el.style.display = xe(d) ? "none" : "block");
    },
    concatValues: function(e, n) {
      if (e && n) {
        var a = n.search(this._decimal);
        return this._decimal.lastIndex = 0, this.suffixChar ? a !== -1 ? e.replace(this.suffixChar, "").split(this._decimal)[0] + n.replace(this.suffixChar, "").slice(a) + this.suffixChar : e : a !== -1 ? e.split(this._decimal)[0] + n.slice(a) : e;
      }
      return e;
    },
    getDecimalLength: function(e) {
      if (e) {
        var n = e.split(this._decimal);
        if (n.length === 2)
          return n[1].replace(this._suffix, "").trim().replace(/\s/g, "").replace(this._currency, "").length;
      }
      return 0;
    },
    updateModel: function(e, n) {
      this.writeValue(n, e);
    },
    onInputFocus: function(e) {
      this.focused = !0, !this.disabled && !this.readonly && this.$refs.input.$el.value !== _e() && this.highlightOnFocus && e.target.select(), this.$emit("focus", e);
    },
    onInputBlur: function(e) {
      var n, a;
      this.focused = !1;
      var u = e.target, i = this.validateValue(this.parseValue(u.value));
      this.$emit("blur", {
        originalEvent: e,
        value: u.value
      }), (n = (a = this.formField).onBlur) === null || n === void 0 || n.call(a, e), u.value = this.formatValue(i), u.setAttribute("aria-valuenow", i), this.updateModel(e, i), !this.disabled && !this.readonly && this.highlightOnFocus && Ke();
    },
    clearTimer: function() {
      this.timer && clearTimeout(this.timer);
    },
    maxBoundry: function() {
      return this.d_value >= this.max;
    },
    minBoundry: function() {
      return this.d_value <= this.min;
    }
  },
  computed: {
    upButtonListeners: function() {
      var e = this;
      return {
        mousedown: function(a) {
          return e.onUpButtonMouseDown(a);
        },
        mouseup: function(a) {
          return e.onUpButtonMouseUp(a);
        },
        mouseleave: function(a) {
          return e.onUpButtonMouseLeave(a);
        },
        keydown: function(a) {
          return e.onUpButtonKeyDown(a);
        },
        keyup: function(a) {
          return e.onUpButtonKeyUp(a);
        }
      };
    },
    downButtonListeners: function() {
      var e = this;
      return {
        mousedown: function(a) {
          return e.onDownButtonMouseDown(a);
        },
        mouseup: function(a) {
          return e.onDownButtonMouseUp(a);
        },
        mouseleave: function(a) {
          return e.onDownButtonMouseLeave(a);
        },
        keydown: function(a) {
          return e.onDownButtonKeyDown(a);
        },
        keyup: function(a) {
          return e.onDownButtonKeyUp(a);
        }
      };
    },
    formattedValue: function() {
      var e = !this.d_value && !this.allowEmpty ? 0 : this.d_value;
      return this.formatValue(e);
    },
    getFormatter: function() {
      return this.numberFormat;
    },
    dataP: function() {
      return ze(ge(ge({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size), this.buttonLayout, this.showButtons && this.buttonLayout));
    }
  },
  components: {
    InputText: Ne,
    AngleUpIcon: Fe,
    AngleDownIcon: Re,
    TimesIcon: tt
  }
}, ga = ["data-p"], ya = ["data-p"], ka = ["disabled", "data-p"], $a = ["disabled", "data-p"], wa = ["disabled", "data-p"], _a = ["disabled", "data-p"];
function xa(t, e, n, a, u, i) {
  var s = Ie("InputText"), d = Ie("TimesIcon");
  return o(), m("span", G({
    class: t.cx("root")
  }, t.ptmi("root"), {
    "data-p": i.dataP
  }), [V(s, {
    ref: "input",
    id: t.inputId,
    name: t.$formName,
    role: "spinbutton",
    class: ie([t.cx("pcInputText"), t.inputClass]),
    style: Ye(t.inputStyle),
    defaultValue: i.formattedValue,
    "aria-valuemin": t.min,
    "aria-valuemax": t.max,
    "aria-valuenow": t.d_value,
    inputmode: t.mode === "decimal" && !t.minFractionDigits ? "numeric" : "decimal",
    disabled: t.disabled,
    readonly: t.readonly,
    placeholder: t.placeholder,
    "aria-labelledby": t.ariaLabelledby,
    "aria-label": t.ariaLabel,
    required: t.required,
    size: t.size,
    invalid: t.invalid,
    variant: t.variant,
    onInput: i.onUserInput,
    onKeydown: i.onInputKeyDown,
    onKeypress: i.onInputKeyPress,
    onPaste: i.onPaste,
    onClick: i.onInputClick,
    onFocus: i.onInputFocus,
    onBlur: i.onInputBlur,
    pt: t.ptm("pcInputText"),
    unstyled: t.unstyled,
    "data-p": i.dataP
  }, null, 8, ["id", "name", "class", "style", "defaultValue", "aria-valuemin", "aria-valuemax", "aria-valuenow", "inputmode", "disabled", "readonly", "placeholder", "aria-labelledby", "aria-label", "required", "size", "invalid", "variant", "onInput", "onKeydown", "onKeypress", "onPaste", "onClick", "onFocus", "onBlur", "pt", "unstyled", "data-p"]), t.showClear && t.buttonLayout !== "vertical" ? X(t.$slots, "clearicon", {
    key: 0,
    class: ie(t.cx("clearIcon")),
    clearCallback: i.onClearClick
  }, function() {
    return [V(d, G({
      ref: "clearIcon",
      class: [t.cx("clearIcon")],
      onClick: i.onClearClick
    }, t.ptm("clearIcon")), null, 16, ["class", "onClick"])];
  }) : g("", !0), t.showButtons && t.buttonLayout === "stacked" ? (o(), m("span", G({
    key: 1,
    class: t.cx("buttonGroup")
  }, t.ptm("buttonGroup"), {
    "data-p": i.dataP
  }), [X(t.$slots, "incrementbutton", {
    listeners: i.upButtonListeners
  }, function() {
    return [r("button", G({
      class: [t.cx("incrementButton"), t.incrementButtonClass]
    }, ue(i.upButtonListeners, !0), {
      disabled: t.disabled,
      tabindex: -1,
      "aria-hidden": "true",
      type: "button"
    }, t.ptm("incrementButton"), {
      "data-p": i.dataP
    }), [X(t.$slots, t.$slots.incrementicon ? "incrementicon" : "incrementbuttonicon", {}, function() {
      return [(o(), E(ce(t.incrementIcon || t.incrementButtonIcon ? "span" : "AngleUpIcon"), G({
        class: [t.incrementIcon, t.incrementButtonIcon]
      }, t.ptm("incrementIcon"), {
        "data-pc-section": "incrementicon"
      }), null, 16, ["class"]))];
    })], 16, ka)];
  }), X(t.$slots, "decrementbutton", {
    listeners: i.downButtonListeners
  }, function() {
    return [r("button", G({
      class: [t.cx("decrementButton"), t.decrementButtonClass]
    }, ue(i.downButtonListeners, !0), {
      disabled: t.disabled,
      tabindex: -1,
      "aria-hidden": "true",
      type: "button"
    }, t.ptm("decrementButton"), {
      "data-p": i.dataP
    }), [X(t.$slots, t.$slots.decrementicon ? "decrementicon" : "decrementbuttonicon", {}, function() {
      return [(o(), E(ce(t.decrementIcon || t.decrementButtonIcon ? "span" : "AngleDownIcon"), G({
        class: [t.decrementIcon, t.decrementButtonIcon]
      }, t.ptm("decrementIcon"), {
        "data-pc-section": "decrementicon"
      }), null, 16, ["class"]))];
    })], 16, $a)];
  })], 16, ya)) : g("", !0), X(t.$slots, "incrementbutton", {
    listeners: i.upButtonListeners
  }, function() {
    return [t.showButtons && t.buttonLayout !== "stacked" ? (o(), m("button", G({
      key: 0,
      class: [t.cx("incrementButton"), t.incrementButtonClass]
    }, ue(i.upButtonListeners, !0), {
      disabled: t.disabled,
      tabindex: -1,
      "aria-hidden": "true",
      type: "button"
    }, t.ptm("incrementButton"), {
      "data-p": i.dataP
    }), [X(t.$slots, t.$slots.incrementicon ? "incrementicon" : "incrementbuttonicon", {}, function() {
      return [(o(), E(ce(t.incrementIcon || t.incrementButtonIcon ? "span" : "AngleUpIcon"), G({
        class: [t.incrementIcon, t.incrementButtonIcon]
      }, t.ptm("incrementIcon"), {
        "data-pc-section": "incrementicon"
      }), null, 16, ["class"]))];
    })], 16, wa)) : g("", !0)];
  }), X(t.$slots, "decrementbutton", {
    listeners: i.downButtonListeners
  }, function() {
    return [t.showButtons && t.buttonLayout !== "stacked" ? (o(), m("button", G({
      key: 0,
      class: [t.cx("decrementButton"), t.decrementButtonClass]
    }, ue(i.downButtonListeners, !0), {
      disabled: t.disabled,
      tabindex: -1,
      "aria-hidden": "true",
      type: "button"
    }, t.ptm("decrementButton"), {
      "data-p": i.dataP
    }), [X(t.$slots, t.$slots.decrementicon ? "decrementicon" : "decrementbuttonicon", {}, function() {
      return [(o(), E(ce(t.decrementIcon || t.decrementButtonIcon ? "span" : "AngleDownIcon"), G({
        class: [t.decrementIcon, t.decrementButtonIcon]
      }, t.ptm("decrementIcon"), {
        "data-pc-section": "decrementicon"
      }), null, 16, ["class"]))];
    })], 16, _a)) : g("", !0)];
  })], 16, ga);
}
Oe.render = xa;
const Ca = {
  class: "ac-stack ac-limits",
  "aria-label": "Limits"
}, Ia = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Sa = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Da = {
  key: 2,
  class: "ac-limit-status",
  role: "status"
}, Ba = { class: "ac-card-title" }, Aa = ["onSubmit"], La = ["for"], Ma = ["id"], Pa = { class: "ac-limit-control" }, Va = { class: "ac-hint" }, Ua = { class: "ac-limit-actions" }, Ta = {
  key: 0,
  class: "kx-err ac-limit-error",
  role: "alert"
}, Ea = /* @__PURE__ */ Q({
  __name: "limits",
  emits: ["saved"],
  setup(t, { emit: e }) {
    const n = e, a = $e(), u = w([]), i = w({}), s = w({}), d = w(""), v = w(""), _ = w(!1), L = w(""), S = F(() => {
      if (!_.value) return;
      const p = u.value.length, A = u.value.filter((y) => y.overridden).length;
      return `${p} ${p === 1 ? "limit" : "limits"} · ${A} overridden`;
    }), b = F(() => {
      const p = /* @__PURE__ */ new Map();
      for (const A of [...u.value].sort((y, U) => y.order - U.order)) {
        const y = p.get(A.category) ?? [];
        y.push(A), p.set(A.category, y);
      }
      return p;
    }), c = me(async () => {
      try {
        const p = await W.limits();
        if (!a()) return;
        if (!p.length) throw new Error("No Autocode limits were found.");
        const A = new Map(u.value.map((y) => [y.key, y.value]));
        for (const y of p) {
          const U = i.value[y.key];
          (U === void 0 || U === A.get(y.key) || v.value === y.key) && (i.value[y.key] = y.value);
        }
        u.value = p, _.value = !0, d.value = "";
      } catch (p) {
        a() && (d.value = H(p, "Could not load limits."));
      }
    }, a);
    pe(c);
    async function l(p, A = !1) {
      const y = A ? null : i.value[p.key];
      if (!(v.value || !A && (y == null || y === "" || y === p.value))) {
        v.value = p.key, L.value = "", s.value[p.key] = "";
        try {
          if (p.key === "run_retention" && !await se.confirm({
            header: "Change run retention?",
            message: "Shorter retention can delete completed runs and their logs.",
            acceptLabel: "Change retention",
            rejectLabel: "Cancel"
          }) || !a() || (await W.saveLimit(p.key, y ?? null), !a()) || (await c(), !a())) return;
          d.value || (L.value = A ? `${p.title} reset to default.` : `${p.title} saved.`), n("saved");
        } catch (U) {
          a() && (s.value[p.key] = H(U, "Could not save this limit."));
        } finally {
          a() && (v.value = "");
        }
      }
    }
    return (p, A) => (o(), m("section", Ca, [
      V(re, {
        title: "Limits",
        icon: "tabler:adjustments",
        subtitle: "Set task resource defaults and run retention. Enter durations such as 30m or 2h.",
        count: S.value
      }, null, 8, ["count"]),
      !_.value && !d.value ? (o(), m("p", Ia, "Loading limits…")) : g("", !0),
      d.value ? (o(), m("div", Sa, [
        j(D(d.value) + " ", 1),
        V(k(ne), {
          label: "Retry",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: k(c)
        }, null, 8, ["onClick"])
      ])) : g("", !0),
      L.value ? (o(), m("p", Da, D(L.value), 1)) : g("", !0),
      (o(!0), m(z, null, Z(b.value, ([y, U]) => (o(), m("section", {
        key: y,
        class: "ac-card ac-limit-group"
      }, [
        r("h3", Ba, D(y), 1),
        (o(!0), m(z, null, Z(U, ($) => (o(), m("form", {
          key: $.key,
          class: "ac-limit-row",
          onSubmit: Je((x) => l($), ["prevent"])
        }, [
          r("div", null, [
            r("label", {
              for: "ac-limit-" + $.key,
              class: "ac-strong"
            }, D($.title), 9, La),
            r("p", {
              id: "ac-limit-help-" + $.key,
              class: "ac-hint"
            }, D($.description), 9, Ma)
          ]),
          r("div", Pa, [
            $.value_type === "int" ? (o(), E(k(Oe), {
              key: 0,
              "input-id": "ac-limit-" + $.key,
              "model-value": typeof i.value[$.key] == "number" ? Number(i.value[$.key]) : null,
              "input-props": { "aria-describedby": "ac-limit-help-" + $.key },
              disabled: !!v.value,
              fluid: "",
              onInput: (x) => i.value[$.key] = typeof x.value == "number" ? x.value : null,
              "onUpdate:modelValue": (x) => i.value[$.key] = x
            }, null, 8, ["input-id", "model-value", "input-props", "disabled", "onInput", "onUpdate:modelValue"])) : (o(), E(k(Ne), {
              key: 1,
              id: "ac-limit-" + $.key,
              "model-value": String(i.value[$.key] ?? ""),
              "aria-describedby": "ac-limit-help-" + $.key,
              disabled: !!v.value,
              fluid: "",
              "onUpdate:modelValue": (x) => i.value[$.key] = x ?? ""
            }, null, 8, ["id", "model-value", "aria-describedby", "disabled", "onUpdate:modelValue"])),
            r("p", Va, D($.unit) + " · " + D($.overridden ? `Override · default ${$.default}` : "Default"), 1)
          ]),
          r("div", Ua, [
            i.value[$.key] !== $.value ? (o(), E(k(ne), {
              key: 0,
              type: "submit",
              label: "Save",
              size: "small",
              "aria-label": "Save " + $.title,
              disabled: !!v.value || i.value[$.key] == null || i.value[$.key] === ""
            }, null, 8, ["aria-label", "disabled"])) : g("", !0),
            $.overridden ? (o(), E(k(ne), {
              key: 1,
              type: "button",
              label: "Reset",
              size: "small",
              text: "",
              severity: "secondary",
              "aria-label": "Reset " + $.title + " to default",
              disabled: !!v.value,
              onClick: (x) => l($, !0)
            }, null, 8, ["aria-label", "disabled", "onClick"])) : g("", !0)
          ]),
          s.value[$.key] ? (o(), m("p", Ta, D(s.value[$.key]), 1)) : g("", !0)
        ], 40, Aa))), 128))
      ]))), 128))
    ]));
  }
}), Na = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Ra = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Fa = /* @__PURE__ */ Q({
  __name: "account-provider-mount",
  props: {
    tag: {},
    providerId: {}
  },
  emits: ["changed"],
  setup(t, { emit: e }) {
    const n = t, a = e, u = w(null), i = w(0), s = w(!1), d = w("");
    return J([u, i], async ([v], _, L) => {
      if (!v) return;
      let S = !0;
      const b = (c) => {
        if (c instanceof CustomEvent && c.detail?.success === !1) {
          d.value = c.detail.error || "Could not complete account setup.";
          return;
        }
        d.value = "", a("changed");
      };
      L(() => {
        S = !1, v.replaceChildren();
      }), s.value = !0, d.value = "";
      try {
        if (await Qe(n.tag, { timeoutMs: 8e3 }), !S) return;
        const c = document.createElement(n.tag);
        c.setAttribute("provider-id", n.providerId), c.addEventListener("connection-saved", b), c.addEventListener("oauth-result", b), v.replaceChildren(c);
      } catch (c) {
        S && (d.value = H(c, "Could not load the provider’s account editor."));
      } finally {
        S && (s.value = !1);
      }
    }), (v, _) => (o(), m(z, null, [
      s.value ? (o(), m("p", Na, "Loading account editor…")) : g("", !0),
      d.value ? (o(), m("div", Ra, [
        j(D(d.value) + " ", 1),
        V(k(ne), {
          label: "Retry",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: _[0] || (_[0] = (L) => i.value++)
        })
      ])) : g("", !0),
      r("div", {
        ref_key: "container",
        ref: u
      }, null, 512)
    ], 64));
  }
}), Oa = {
  class: "kx-card ac-provider-choice",
  type: "button"
}, ja = { class: "kx-card-head" }, za = { class: "ac-provider-icon" }, Ka = { class: "kx-card-id" }, qa = { class: "kx-card-name" }, Ga = { class: "kx-card-desc" }, Wa = { class: "kx-card-meta" }, Ha = {
  key: 0,
  class: "ac-muted"
}, Le = /* @__PURE__ */ Q({
  __name: "provider-choice",
  props: {
    title: {},
    hint: {},
    icon: {},
    status: {},
    count: {},
    severity: {}
  },
  setup(t) {
    return (e, n) => (o(), m("button", Oa, [
      r("span", ja, [
        r("span", za, [
          V(k(R), {
            icon: t.icon,
            "aria-hidden": "true"
          }, null, 8, ["icon"])
        ]),
        r("span", Ka, [
          r("span", qa, D(t.title), 1),
          r("span", Ga, D(t.hint), 1)
        ]),
        V(k(R), {
          icon: "tabler:chevron-right",
          class: "ac-provider-arrow",
          "aria-hidden": "true"
        })
      ]),
      r("span", Wa, [
        V(k(nt), {
          value: t.status,
          severity: t.severity
        }, null, 8, ["value", "severity"]),
        t.count ? (o(), m("small", Ha, D(t.count), 1)) : g("", !0)
      ])
    ]));
  }
}), Za = {
  class: "ac-stack ac-provider-page",
  "aria-label": "Accounts"
}, Ya = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Ja = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, Qa = {
  key: 2,
  class: "ac-stack"
}, Xa = { class: "ac-hint" }, ei = {
  key: 3,
  class: "ac-stack"
}, ti = {
  key: 0,
  class: "ac-muted"
}, ni = {
  key: 1,
  "aria-label": "Account providers",
  class: "ac-stack"
}, ai = {
  key: 0,
  class: "ac-provider-grid"
}, ii = { class: "ac-provider-grid" }, si = /* @__PURE__ */ Q({
  __name: "account-management",
  props: {
    active: { type: Boolean, default: !0 }
  },
  setup(t) {
    const e = t, n = w([]), a = w([]), u = w(""), i = w(!1), s = w(""), d = w();
    let v;
    const _ = ot(), L = $e(), S = F(() => {
      const x = /* @__PURE__ */ new Map();
      for (const h of a.value) {
        const f = x.get(h.agent) ?? [];
        f.push(h), x.set(h.agent, f);
      }
      return x;
    }), b = F(() => {
      const x = new Set(n.value.map((h) => h.agent));
      return [...n.value, ...Array.from(S.value.keys()).filter((h) => !x.has(h)).map((h) => ({ agent: h, title: h, provider_id: h, icon: "tabler:terminal-off", create_ui_id: void 0 }))].map((h) => {
        const f = S.value.get(h.agent) ?? [], C = f.map((te) => De(te, _.value)), K = C.filter((te) => te.state === "ready").length, B = C.find((te) => te.state === "cooling"), T = at(h.agent, h.title), N = h.agent === "codex" ? 0 : h.agent === "claude" ? 1 : 2, ae = x.has(h.agent), oe = ae ? K ? "Ready" : B ? B.label : f.length ? "Needs attention" : "Not set up" : "Provider unavailable", fe = K ? "success" : B ? "warn" : f.length ? "danger" : "secondary";
        return {
          ...h,
          ...T,
          rank: N,
          status: oe,
          ready: K,
          total: f.length,
          installed: ae,
          severity: fe
        };
      }).sort((h, f) => +!!f.total - +!!h.total || h.rank - f.rank || h.name.localeCompare(f.name));
    }), c = F(() => b.value.filter((x) => x.total || x.rank < 2)), l = F(() => b.value.filter((x) => !x.total && x.rank === 2)), p = F(() => b.value.find((x) => x.provider_id === u.value));
    J(() => e.active, (x) => {
      x || (u.value = "");
    });
    const A = F(() => i.value ? a.value.length ? `${a.value.filter((h) => De(h, _.value).state === "ready").length} of ${a.value.length} ready` : "No accounts yet" : void 0);
    async function y(x, h) {
      h.currentTarget instanceof HTMLElement && (v = h.currentTarget), u.value = x, await Se(), d.value?.focus();
    }
    async function U() {
      u.value = "", await Se(), v?.focus();
    }
    const $ = me(async () => {
      try {
        const x = await W.managedAccounts();
        if (!L()) return;
        n.value = x.providers, a.value = x.accounts, i.value = !0, s.value = "";
      } catch (x) {
        L() && (s.value = H(x, "Could not load account providers."));
      }
    }, L);
    return pe($), (x, h) => (o(), m("section", Za, [
      !i.value && !s.value ? (o(), m("p", Ya, "Loading account providers…")) : g("", !0),
      s.value ? (o(), m("p", Ja, [
        j(D(s.value) + " ", 1),
        V(k(ne), {
          label: "Retry",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: k($)
        }, null, 8, ["onClick"])
      ])) : g("", !0),
      p.value ? (o(), m("div", Qa, [
        r("div", null, [
          V(k(ne), {
            label: "All providers",
            text: "",
            severity: "secondary",
            size: "small",
            onClick: U
          }, {
            icon: ee(() => [
              V(k(R), {
                icon: "tabler:arrow-left",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        r("div", {
          ref_key: "detailHeading",
          ref: d,
          tabindex: "-1"
        }, [
          V(re, {
            title: p.value.name,
            subtitle: p.value.hint,
            count: p.value.total ? `${p.value.ready} of ${p.value.total} ready` : p.value.status,
            icon: p.value.icon || "tabler:key"
          }, null, 8, ["title", "subtitle", "count", "icon"])
        ], 512),
        p.value.create_ui_id ? (o(), E(Fa, {
          key: p.value.provider_id,
          tag: p.value.create_ui_id,
          "provider-id": p.value.provider_id,
          onChanged: k($)
        }, null, 8, ["tag", "provider-id", "onChanged"])) : (o(), m(z, { key: 1 }, [
          r("p", Xa, D(p.value.installed ? "This provider does not offer account setup." : "This provider is unavailable. You can still manage its existing accounts."), 1),
          p.value.total ? (o(), E(it, {
            key: p.value.agent,
            query: "",
            "selected-agent": p.value.agent,
            management: "",
            "allow-setup": !1,
            onChanged: k($)
          }, null, 8, ["selected-agent", "onChanged"])) : g("", !0)
        ], 64))
      ])) : g("", !0),
      i.value ? O((o(), m("div", ei, [
        V(re, {
          title: "Accounts",
          subtitle: "Connect a provider to run tasks, see usage, and manage access.",
          icon: "tabler:key",
          count: A.value
        }, null, 8, ["count"]),
        b.value.length ? (o(), m("nav", ni, [
          c.value.length ? (o(), m("div", ai, [
            (o(!0), m(z, null, Z(c.value, (f) => (o(), E(Le, {
              key: f.provider_id,
              "data-account-provider": f.provider_id,
              title: f.name,
              hint: f.hint,
              icon: f.icon || "tabler:terminal-2",
              status: f.status,
              severity: f.severity,
              count: f.total ? `${f.ready} of ${f.total} ready` : void 0,
              onClick: (C) => y(f.provider_id, C)
            }, null, 8, ["data-account-provider", "title", "hint", "icon", "status", "severity", "count", "onClick"]))), 128))
          ])) : g("", !0),
          l.value.length ? (o(), E(Ee, {
            key: 1,
            label: `More providers · ${l.value.length}`,
            open: !c.value.length
          }, {
            default: ee(() => [
              r("div", ii, [
                (o(!0), m(z, null, Z(l.value, (f) => (o(), E(Le, {
                  key: f.provider_id,
                  "data-account-provider": f.provider_id,
                  title: f.name,
                  hint: f.hint,
                  icon: f.icon || "tabler:terminal-2",
                  status: f.status,
                  severity: f.severity,
                  onClick: (C) => y(f.provider_id, C)
                }, null, 8, ["data-account-provider", "title", "hint", "icon", "status", "severity", "onClick"]))), 128))
              ])
            ]),
            _: 1
          }, 8, ["label", "open"])) : g("", !0)
        ])) : (o(), m("p", ti, "Install an Autocode provider in System → Modules, then return here to connect an account."))
      ], 512)), [
        [de, !p.value]
      ]) : g("", !0)
    ]));
  }
}), ri = { class: "ac ac-admin" }, li = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, oi = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, ui = {
  key: 2,
  class: "ac-muted"
}, ci = {
  key: 3,
  class: "ac-settings-layout"
}, di = ["aria-label"], pi = { class: "ac-settings-content" }, mi = /* @__PURE__ */ Q({
  __name: "admin",
  setup(t) {
    const e = [
      { id: "images", label: "Images", icon: "tabler:box", permission: "can_images" },
      { id: "workspaces", label: "Workspaces", icon: "tabler:folder", permission: "can_workspaces" },
      { id: "docker", label: "Docker", icon: "tabler:brand-docker", permission: "can_prune" },
      { id: "limits", label: "Limits", icon: "tabler:adjustments", permission: "can_limits" },
      { id: "accounts", label: "Accounts", icon: "tabler:key", permission: "can_accounts" }
    ], n = qe(), a = Ge(), { catalog: u, error: i, load: s } = st(), d = F(() => u.value?.settings_path || "/system/autocode"), v = w(L(n.value.route?.includes("?") ? n.value.route : Xe.context?.route)), _ = et("@history", ({ path: B }) => {
      B.split(/[?#]/, 1)[0] === d.value && (v.value = L(B));
    });
    Pe(_), J(() => n.value.route, (B) => {
      B?.includes("?") && (v.value = L(B));
    });
    function L(B) {
      const T = new URLSearchParams(B?.split("?")[1]?.split("#", 1)[0]).get("section");
      return e.find((N) => N.id === T)?.id;
    }
    function S(B) {
      const T = b.value.find((N) => N.id === B);
      !T || T.id === l.value || (v.value = T.id, a("navigate", { path: d.value + "?section=" + B }));
    }
    const b = F(() => e.filter((B) => u.value?.[B.permission])), c = F(() => b.value.find((B) => B.id === v.value) ?? b.value[0]), l = F(() => c.value?.id), p = F(() => [
      { heading: "Execution", items: b.value.filter((B) => B.id === "images" || B.id === "workspaces" || B.id === "docker") },
      { heading: "Configuration", items: b.value.filter((B) => B.id === "limits" || B.id === "accounts") }
    ].filter((B) => B.items.length).map((B) => ({
      heading: B.heading,
      items: B.items.map(({ id: T, label: N, icon: ae }) => ({ value: T, label: N, icon: ae }))
    }))), A = w(""), y = w(), U = w(), $ = w(), x = w(null), h = w(null), f = F(() => {
      if (l.value === "images") return { title: "Images", subtitle: "Manage the container images that run tasks.", icon: "tabler:box", count: C(y.value, "image", "images"), action: y.value ? "Add image" : void 0 };
      if (l.value === "workspaces") return { title: "Workspaces", subtitle: "Manage the host directories that tasks can use.", icon: "tabler:folder", count: C(U.value, "workspace", "workspaces"), action: U.value ? "Add workspace" : void 0 };
    });
    J(l, () => {
      A.value = "", $.value && ($.value.scrollTop = 0);
    });
    function C(B, T, N) {
      return B === void 0 ? void 0 : `${B} ${B === 1 ? T : N}`;
    }
    function K() {
      l.value === "images" ? x.value?.open() : l.value === "workspaces" && h.value?.open();
    }
    return (B, T) => (o(), m("div", ri, [
      k(i) && !k(u) ? (o(), m("p", li, [
        j(D(k(i)) + " ", 1),
        r("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: T[0] || (T[0] = //@ts-ignore
          (...N) => k(s) && k(s)(...N))
        }, "Retry")
      ])) : k(u) ? l.value ? (o(), m("div", ci, [
        V(ft, {
          label: "Autocode settings",
          value: l.value,
          groups: p.value,
          "onUpdate:value": S
        }, null, 8, ["value", "groups"]),
        r("main", {
          ref_key: "content",
          ref: $,
          class: "ac-settings-pane",
          "aria-label": c.value?.label
        }, [
          r("div", pi, [
            f.value ? (o(), E(re, G({ key: 0 }, f.value, {
              query: A.value,
              "onUpdate:query": T[1] || (T[1] = (N) => A.value = N),
              placeholder: f.value.count && f.value.action ? `Search ${l.value}…` : void 0,
              onCreate: K
            }), null, 16, ["query", "placeholder"])) : g("", !0),
            k(u).can_images ? O((o(), E(mn, {
              key: 1,
              ref_key: "images",
              ref: x,
              query: l.value === "images" ? A.value : "",
              onCount: T[2] || (T[2] = (N) => y.value = N)
            }, null, 8, ["query"])), [
              [de, l.value === "images"]
            ]) : g("", !0),
            k(u).can_workspaces ? O((o(), E(zn, {
              key: 2,
              ref_key: "workspaces",
              ref: h,
              query: l.value === "workspaces" ? A.value : "",
              onCount: T[3] || (T[3] = (N) => U.value = N)
            }, null, 8, ["query"])), [
              [de, l.value === "workspaces"]
            ]) : g("", !0),
            l.value === "docker" ? (o(), E(Hn, { key: 3 })) : g("", !0),
            l.value === "limits" ? (o(), E(Ea, {
              key: 4,
              onSaved: k(s)
            }, null, 8, ["onSaved"])) : g("", !0),
            k(u).can_accounts ? O((o(), E(si, {
              key: 5,
              active: l.value === "accounts"
            }, null, 8, ["active"])), [
              [de, l.value === "accounts"]
            ]) : g("", !0)
          ])
        ], 8, di)
      ])) : (o(), m("p", ui, "Ask an administrator for access to the Autocode settings you need.")) : (o(), m("div", oi, [
        V(k(R), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        T[4] || (T[4] = j(" Loading…", -1))
      ]))
    ]));
  }
}), wi = {
  rootComponent: mi,
  plugins: [We]
};
export {
  wi as mountConfig
};
