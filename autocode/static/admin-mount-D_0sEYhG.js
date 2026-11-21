import { b as pe, s as Me, B as je, f as ze, p as Ke, M as xe, c as Ce, d as _e, u as qe, a as Ge, P as We } from "./wc-runtime-CvWl7e3g.js";
import { defineComponent as Q, computed as F, openBlock as o, createElementBlock as d, Fragment as z, renderList as Y, normalizeClass as se, toDisplayString as C, createCommentVNode as v, createBlock as T, unref as y, createElementVNode as r, createVNode as P, renderSlot as X, withCtx as te, ref as w, watch as ee, createTextVNode as j, withDirectives as O, vModelText as J, createStaticVNode as He, vModelCheckbox as Ze, onUnmounted as Pe, mergeProps as W, resolveComponent as Ie, normalizeStyle as Ye, toHandlers as ue, resolveDynamicComponent as ce, withModifiers as Je, vShow as de, nextTick as Se } from "vue";
import { host as re, loadByTagName as Qe, config as Xe, on as et } from "@wippy-fe/proxy";
import { Icon as N } from "@iconify/vue";
import { s as ne, u as ke, _ as Ve, a as he, b as tt, c as nt, d as De, p as at, e as it, f as st } from "./accounts.vue_vue_type_script_setup_true_lang-BS36zsOI.js";
import { a as H, e as Z, u as Ue, b as rt, s as me, r as Te, p as lt, c as $e, _ as Ee, d as ot } from "./Disclosure.vue_vue_type_script_setup_true_lang-CrWwplXA.js";
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
      let p;
      switch (u.key) {
        case "ArrowDown":
        case "ArrowRight":
          p = (s + 1) % i.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          p = (s + i.length - 1) % i.length;
          break;
        case "Home":
          p = 0;
          break;
        case "End":
          p = i.length - 1;
          break;
        default:
          return;
      }
      u.preventDefault(), i[p]?.focus();
    }
    return (u, i) => (o(), d("nav", {
      class: "kx-settings-rail",
      "aria-label": t.label,
      onKeydown: a
    }, [
      (o(!0), d(z, null, Y(n.value, (s, p) => (o(), d("div", {
        key: s.items[0]?.value ?? p,
        class: se(["kx-settings-rail-section", { "kx-settings-rail-leading": t.leadingItem && p === 0 }])
      }, [
        s.heading ? (o(), d("div", dt, C(s.heading), 1)) : v("", !0),
        (o(!0), d(z, null, Y(s.items, (b) => (o(), d("button", {
          key: b.value,
          type: "button",
          class: "kx-settings-rail-item",
          "aria-current": b.value === t.value ? "true" : void 0,
          onClick: (x) => u.$emit("update:value", b.value)
        }, [
          b.icon ? (o(), T(y(N), {
            key: 0,
            class: "kx-settings-rail-icon",
            icon: b.icon,
            "aria-hidden": "true"
          }, null, 8, ["icon"])) : v("", !0),
          r("span", mt, C(b.label), 1)
        ], 8, pt))), 128))
      ], 2))), 128))
    ], 40, ct));
  }
}), ht = { class: "system-section-head" }, vt = { class: "system-section-head-text" }, bt = { class: "kx-head-actions" }, gt = {
  key: 0,
  class: "kx-count"
}, yt = {
  key: 1,
  class: "kx-search",
  role: "search"
}, kt = ["value", "placeholder", "aria-label"], le = /* @__PURE__ */ Q({
  __name: "settings-head",
  props: {
    title: {},
    subtitle: {},
    count: {},
    action: {},
    query: { default: "" },
    placeholder: {}
  },
  emits: ["update:query", "create"],
  setup(t) {
    return (e, n) => (o(), d("header", ht, [
      r("div", vt, [
        r("h1", null, C(t.title), 1),
        r("p", null, C(t.subtitle), 1)
      ]),
      r("div", bt, [
        t.count ? (o(), d("span", gt, C(t.count), 1)) : v("", !0),
        t.placeholder ? (o(), d("div", yt, [
          P(y(N), {
            icon: "tabler:search",
            "aria-hidden": "true"
          }),
          r("input", {
            type: "search",
            value: t.query,
            class: "kx-search-input kx-focus-halo",
            placeholder: t.placeholder,
            "aria-label": t.placeholder,
            onInput: n[0] || (n[0] = (a) => e.$emit("update:query", a.target.value))
          }, null, 40, kt),
          t.query ? (o(), d("button", {
            key: 0,
            type: "button",
            class: "kx-search-clear kx-focus-outline",
            "aria-label": "Clear search",
            onClick: n[1] || (n[1] = (a) => e.$emit("update:query", ""))
          }, [
            P(y(N), {
              icon: "tabler:x",
              "aria-hidden": "true"
            })
          ])) : v("", !0)
        ])) : v("", !0),
        X(e.$slots, "actions"),
        t.action ? (o(), T(y(ne), {
          key: 2,
          label: t.action,
          onClick: n[2] || (n[2] = (a) => e.$emit("create"))
        }, {
          icon: te(() => [
            P(y(N), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["label"])) : v("", !0)
      ])
    ]));
  }
}), $t = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, wt = ["disabled"], xt = { class: "ac-card-head" }, Ct = { class: "ac-muted" }, _t = { class: "ac-field" }, It = { class: "ac-seg" }, St = {
  key: 0,
  class: "ac-field"
}, Dt = {
  key: 1,
  class: "ac-muted"
}, Bt = { class: "ac-field" }, At = { class: "ac-field" }, Lt = { class: "ac-row-fields" }, Mt = { class: "ac-field" }, Pt = ["placeholder"], Vt = { class: "ac-field" }, Ut = ["placeholder"], Tt = { class: "ac-field" }, Et = { class: "ac-row-fields" }, Nt = { class: "ac-field" }, Rt = { class: "ac-field" }, Ft = ["placeholder"], Ot = {
  key: 2,
  class: "ac-field"
}, jt = { class: "ac-checks" }, zt = ["value"], Kt = { class: "ac-field" }, qt = { class: "ac-dialog-foot" }, Gt = ["disabled"], Wt = {
  key: 3,
  class: "kx-err"
}, Ht = /* @__PURE__ */ Q({
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
    const s = w(i()), p = w(!1);
    ee(() => s.value?.ref, (c) => {
      s.value && !n.edit && !p.value && c !== void 0 && (s.value.label = c);
    });
    const b = w(!1), x = w("");
    ee(() => n.edit, (c) => {
      if (x.value = "", p.value = !!c, !c) {
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
    function A() {
      const c = u.value.default_image;
      p.value = !0;
      const l = i();
      s.value = l ? { ...l, ref: c.ref, label: c.label, home: c.home, mode: "build", dockerfile: c.dockerfile } : null;
    }
    function D() {
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
    async function g() {
      if (!(!s.value || b.value)) {
        x.value = "", b.value = !0, a("busy", !0);
        try {
          let c;
          if (n.edit) {
            const l = await H.updateImage(n.edit.image.id, { ...D(), ref: s.value.ref, dockerfile: s.value.mode === "build" ? s.value.dockerfile : "" });
            l.build_error && (c = `Settings saved. Build preparation has not started: ${l.build_error.message}. Use Prepare image to retry.`);
          } else {
            const l = s.value, m = await H.createImage({ ...D(), ref: l.ref, dockerfile: l.mode === "build" ? l.dockerfile : "" });
            m.build_error && (c = `Image created. Build preparation has not started: ${m.build_error.message}. Use Prepare image to retry.`), s.value = i();
          }
          a("saved", c);
        } catch (c) {
          x.value = Z(c, "Could not save the image.");
        } finally {
          b.value = !1, a("busy", !1);
        }
      }
    }
    return (c, l) => s.value ? (o(), d("fieldset", {
      key: 1,
      class: "ac-form",
      disabled: b.value
    }, [
      r("div", xt, [
        r("span", Ct, C(t.edit ? "Container settings" : "Use an image reference or the default agent recipe."), 1),
        t.edit ? v("", !0) : (o(), d("button", {
          key: 0,
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: A
        }, [
          P(y(N), { icon: "tabler:sparkles" }),
          l[15] || (l[15] = j(" Default agent image", -1))
        ]))
      ]),
      r("label", _t, [
        l[16] || (l[16] = r("span", null, "Image reference", -1)),
        O(r("input", {
          "onUpdate:modelValue": l[0] || (l[0] = (m) => s.value.ref = m),
          class: "ac-mono kx-focus-halo",
          placeholder: "registry/name:tag"
        }, null, 512), [
          [J, s.value.ref]
        ])
      ]),
      r("div", It, [
        r("button", {
          type: "button",
          class: se(["kx-focus-outline", { active: s.value.mode === "pull" }]),
          onClick: l[1] || (l[1] = (m) => s.value.mode = "pull")
        }, "Use or pull existing", 2),
        r("button", {
          type: "button",
          class: se(["kx-focus-outline", { active: s.value.mode === "build" }]),
          onClick: l[2] || (l[2] = (m) => s.value.mode = "build")
        }, "Build from Dockerfile", 2)
      ]),
      s.value.mode === "build" ? (o(), d("label", St, [
        l[17] || (l[17] = r("span", null, "Dockerfile", -1)),
        O(r("textarea", {
          "onUpdate:modelValue": l[3] || (l[3] = (m) => s.value.dockerfile = m),
          rows: "9",
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [J, s.value.dockerfile]
        ]),
        l[18] || (l[18] = He('<small class="ac-hint">Include <code>sh</code>, <code>git</code>, <code>mkdir</code>, <code>dirname</code>, a <code>timeout</code> that supports <code>-k</code>, and the agent CLIs. The image user needs writable home and work directories.</small>', 1))
      ])) : v("", !0),
      t.edit ? (o(), d("p", Dt, "Saving container settings prepares the image automatically.")) : v("", !0),
      r("label", Bt, [
        l[19] || (l[19] = r("span", null, "Label", -1)),
        O(r("input", {
          "onUpdate:modelValue": l[4] || (l[4] = (m) => s.value.label = m),
          class: "kx-focus-halo",
          onInput: l[5] || (l[5] = (m) => p.value = !0)
        }, null, 544), [
          [J, s.value.label]
        ])
      ]),
      r("label", At, [
        l[20] || (l[20] = r("span", null, "Home directory in the image", -1)),
        O(r("input", {
          "onUpdate:modelValue": l[6] || (l[6] = (m) => s.value.home = m),
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [J, s.value.home]
        ])
      ]),
      r("div", Lt, [
        r("label", Mt, [
          l[21] || (l[21] = r("span", null, "Memory", -1)),
          O(r("input", {
            "onUpdate:modelValue": l[7] || (l[7] = (m) => s.value.memory = m),
            class: "ac-mono kx-focus-halo",
            placeholder: y(u).default_image.settings?.memory
          }, null, 8, Pt), [
            [J, s.value.memory]
          ])
        ]),
        r("label", Vt, [
          l[22] || (l[22] = r("span", null, "CPUs", -1)),
          O(r("input", {
            "onUpdate:modelValue": l[8] || (l[8] = (m) => s.value.cpus = m),
            class: "ac-mono kx-focus-halo",
            placeholder: y(u).default_image.settings?.cpus
          }, null, 8, Ut), [
            [J, s.value.cpus]
          ])
        ]),
        r("label", Tt, [
          l[23] || (l[23] = r("span", null, "PIDs limit", -1)),
          O(r("input", {
            "onUpdate:modelValue": l[9] || (l[9] = (m) => s.value.pids_limit = m),
            type: "number",
            min: "0",
            class: "ac-mono kx-focus-halo"
          }, null, 512), [
            [
              J,
              s.value.pids_limit,
              void 0,
              { number: !0 }
            ]
          ])
        ])
      ]),
      r("div", Et, [
        r("label", Nt, [
          l[24] || (l[24] = r("span", null, "GPUs", -1)),
          O(r("input", {
            "onUpdate:modelValue": l[10] || (l[10] = (m) => s.value.gpus = m),
            class: "ac-mono kx-focus-halo",
            placeholder: "all, or device=0"
          }, null, 512), [
            [J, s.value.gpus]
          ])
        ]),
        r("label", Rt, [
          l[25] || (l[25] = r("span", null, "Network", -1)),
          O(r("input", {
            "onUpdate:modelValue": l[11] || (l[11] = (m) => s.value.network = m),
            class: "ac-mono kx-focus-halo",
            placeholder: y(u).default_image.settings?.network
          }, null, 8, Ft), [
            [J, s.value.network]
          ])
        ])
      ]),
      t.capabilities?.length ? (o(), d("div", Ot, [
        l[26] || (l[26] = r("span", null, "Agents may", -1)),
        r("div", jt, [
          (o(!0), d(z, null, Y(t.capabilities, (m) => (o(), d("label", {
            key: m,
            class: "ac-check ac-mono"
          }, [
            O(r("input", {
              "onUpdate:modelValue": l[12] || (l[12] = (B) => s.value.allows = B),
              type: "checkbox",
              class: "kx-focus-outline",
              value: m
            }, null, 8, zt), [
              [Ze, s.value.allows]
            ]),
            j(" " + C(m), 1)
          ]))), 128))
        ])
      ])) : v("", !0),
      r("label", Kt, [
        l[27] || (l[27] = r("span", null, "Extra Docker arguments", -1)),
        O(r("textarea", {
          "onUpdate:modelValue": l[13] || (l[13] = (m) => s.value.extra = m),
          rows: "3",
          class: "ac-mono kx-focus-halo",
          placeholder: `One argument per line, e.g.
--add-host
host.docker.internal:host-gateway`
        }, null, 512), [
          [J, s.value.extra]
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
      r("footer", qt, [
        r("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: l[14] || (l[14] = (m) => a("cancel"))
        }, "Cancel"),
        r("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: b.value || !t.capabilities || !s.value.ref,
          onClick: g
        }, [
          P(y(N), { icon: "tabler:box" }),
          j(" " + C(b.value ? "Saving…" : t.edit ? "Save settings" : s.value.mode === "build" ? "Build image" : "Add image"), 1)
        ], 8, Gt)
      ]),
      x.value ? (o(), d("p", Wt, C(x.value), 1)) : v("", !0)
    ], 8, wt)) : (o(), d("p", $t, C(t.edit ? "Image settings are unavailable." : "Image defaults are unavailable.") + " Ask an administrator to update the image configuration.", 1));
  }
}), Zt = { class: "ac-stack" }, Yt = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Jt = {
  key: 1,
  class: "kx-loading"
}, Qt = {
  key: 2,
  class: "kx-empty"
}, Xt = { class: "kx-empty-ico" }, en = {
  key: 3,
  class: "kx-empty"
}, tn = { class: "ac-list ac-resource-list" }, nn = { class: "ac-resource-icon" }, an = { class: "ac-account-main" }, sn = { class: "ac-row-title" }, rn = {
  key: 0,
  class: "kx-tag-sm ac-tone ready"
}, ln = { class: "ac-muted ac-mono" }, on = { class: "ac-chips" }, un = { class: "ac-muted" }, cn = {
  key: 0,
  class: "kx-err ac-small"
}, dn = { class: "ac-row-actions" }, pn = ["disabled", "onClick"], mn = ["onClick"], fn = ["onClick"], hn = ["onClick"], vn = { class: "ac-form" }, bn = { class: "ac-mono" }, gn = { class: "ac-pre ac-build-log" }, yn = /* @__PURE__ */ Q({
  __name: "images",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(t, { expose: e, emit: n }) {
    const a = ke(), u = t, i = n, s = w(!1), p = w(!1), b = w({});
    e({ open: L });
    const x = w([]), A = w([]), D = w(""), g = w(null), c = w(null), l = F(() => [...new Set(a.value.agents.flatMap((M) => M.capabilities))].sort()), m = w(!1);
    let B = !0, k = 0, U = 0, $ = 0;
    Pe(() => {
      B = !1, k++, U++;
    });
    async function _(M) {
      const V = k, S = await H.image(M);
      !B || V !== k || c.value?.id !== M || (c.value = { id: M, ref: S.image.ref, text: S.build_log || "(empty)" });
    }
    const h = me(async () => {
      try {
        const M = await Te(H.images, (V) => V.map((S) => S.id), A, () => B, (V) => {
          x.value = V, m.value = !0, D.value = "";
        }, () => {
          h();
        });
        if (!B) return;
        x.value = M, f(M, ++$), c.value && M.some((V) => V.id === c.value?.id) && await _(c.value.id), m.value = !0, D.value = "";
      } catch (M) {
        D.value = Z(M, "Could not load images.");
      }
    });
    async function f(M, V) {
      try {
        const S = await lt([...new Set(M.map((q) => q.owner_user_id))]);
        if (!B || V !== $) return;
        b.value = Object.fromEntries(M.map((q) => [q.id, `Owner: ${S[q.owner_user_id] || q.owner_user_id}`]));
      } catch (S) {
        B && V === $ && (D.value = Z(S, "Could not load image owners."));
      }
    }
    Ue(() => A.value, () => {
      h();
    }), pe(h);
    async function I(M, V) {
      D.value = "";
      try {
        await M(), await h();
      } catch (S) {
        D.value = Z(S, V);
      }
    }
    async function K(M) {
      const V = ++U;
      D.value = "";
      try {
        const S = await H.image(M.id);
        B && V === U && (g.value = S);
      } catch (S) {
        B && V === U && (D.value = Z(S, "Could not load the image settings."));
      }
    }
    function G() {
      U++, s.value = !1, g.value = null;
    }
    function L() {
      G(), s.value = !0;
    }
    const E = (M) => I(() => H.prepareImage(M.id), "Could not start the image preparation.");
    function R(M) {
      k++, c.value = { id: M.id, ref: M.ref, text: "Loading…" }, h();
    }
    function ie() {
      k++, c.value = null;
    }
    async function fe(M) {
      G(), await h(), M && (D.value = M);
    }
    async function ae(M) {
      if (!await re.confirm({
        header: "Delete image",
        message: `Delete image "${M.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) return;
      const S = await re.confirm({
        header: "Docker image",
        message: `Also remove ${M.ref} from Docker on the host? Keeping it lets a later image with the same reference reuse it.`,
        icon: "tabler:brand-docker",
        acceptLabel: "Remove from Docker",
        rejectLabel: "Keep in Docker",
        acceptClass: "p-button-danger"
      });
      U++, g.value?.image.id === M.id && G(), c.value?.id === M.id && ie(), D.value = "";
      try {
        await H.deleteImage(M.id, S), await h();
      } catch (q) {
        D.value = Z(q, "Could not delete the image.");
      }
    }
    const we = F(() => x.value.filter((M) => [M.label, M.ref, ...M.agents].join(" ").toLowerCase().includes(u.query.toLowerCase())));
    return ee(x, (M) => i("count", M.length)), (M, V) => (o(), d("div", Zt, [
      V[7] || (V[7] = r("p", { class: "ac-hint" }, "Ready means preparation finished. Usable means you can run tasks with the image. Share ready images to make them available to others.", -1)),
      D.value ? (o(), d("p", Yt, [
        j(C(D.value) + " ", 1),
        r("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: V[0] || (V[0] = //@ts-ignore
          (...S) => y(h) && y(h)(...S))
        }, "Retry")
      ])) : v("", !0),
      !m.value && !D.value ? (o(), d("div", Jt, "Loading images…")) : v("", !0),
      m.value && !x.value.length ? (o(), d("div", Qt, [
        r("div", Xt, [
          P(y(N), { icon: "tabler:box" })
        ]),
        V[4] || (V[4] = r("div", { class: "kx-empty-title" }, "No images yet", -1)),
        V[5] || (V[5] = r("div", { class: "kx-empty-sub" }, "Start with the default agent recipe or use an existing image.", -1)),
        r("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: L
        }, "Add image")
      ])) : m.value && !we.value.length ? (o(), d("div", en, [...V[6] || (V[6] = [
        r("div", { class: "kx-empty-title" }, "No matches", -1),
        r("div", { class: "kx-empty-sub" }, "Try another image, reference or agent.", -1)
      ])])) : v("", !0),
      r("ul", tn, [
        (o(!0), d(z, null, Y(we.value, (S) => (o(), d("li", {
          key: S.id,
          class: "ac-row ac-resource"
        }, [
          r("span", nn, [
            P(y(N), { icon: "tabler:box" })
          ]),
          r("div", an, [
            r("div", sn, [
              j(C(S.label), 1),
              r("span", {
                class: se(["kx-tag-sm ac-tone", S.status])
              }, C(S.status === "unprepared" ? "Needs preparation" : S.status.charAt(0).toUpperCase() + S.status.slice(1)), 3),
              S.usable ? (o(), d("span", rn, "Usable")) : v("", !0)
            ]),
            r("div", ln, C(S.ref) + " · " + C(S.home), 1),
            r("div", on, [
              (o(!0), d(z, null, Y(S.agents, (q) => (o(), d("span", {
                key: q,
                class: "kx-tag-sm ac-tone"
              }, [
                P(y(N), {
                  icon: y(rt)(q, y(a).agents)
                }, null, 8, ["icon"]),
                j(C(q), 1)
              ]))), 128))
            ]),
            r("div", un, C(b.value[S.id]), 1),
            S.last_error ? (o(), d("div", cn, C(S.last_error), 1)) : v("", !0)
          ]),
          r("div", dn, [
            S.shareable ? (o(), T(Ve, {
              key: 0,
              id: S.id,
              title: S.label
            }, null, 8, ["id", "title"])) : v("", !0),
            S.writable ? (o(), d("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Prepare image",
              "aria-label": "Prepare image",
              disabled: S.status === "preparing",
              onClick: (q) => E(S)
            }, [
              P(y(N), { icon: "tabler:refresh" })
            ], 8, pn)) : v("", !0),
            r("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Build log",
              "aria-label": "Build log",
              onClick: (q) => R(S)
            }, [
              P(y(N), { icon: "tabler:file-text" })
            ], 8, mn),
            S.writable ? (o(), d("button", {
              key: 2,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Edit settings",
              "aria-label": "Edit settings",
              onClick: (q) => K(S)
            }, [
              P(y(N), { icon: "tabler:pencil" })
            ], 8, fn)) : v("", !0),
            S.deletable ? (o(), d("button", {
              key: 3,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete image",
              "aria-label": "Delete image",
              onClick: (q) => ae(S)
            }, [
              P(y(N), { icon: "tabler:trash" })
            ], 8, hn)) : v("", !0)
          ])
        ]))), 128))
      ]),
      s.value || g.value ? (o(), T(he, {
        key: 4,
        title: g.value ? "Edit image" : "Add image",
        busy: p.value,
        wide: "",
        onClose: V[3] || (V[3] = (S) => G())
      }, {
        default: te(() => [
          P(Ht, {
            onBusy: V[1] || (V[1] = (S) => p.value = S),
            edit: g.value,
            capabilities: l.value,
            onSaved: fe,
            onCancel: V[2] || (V[2] = (S) => G())
          }, null, 8, ["edit", "capabilities"])
        ]),
        _: 1
      }, 8, ["title", "busy"])) : v("", !0),
      c.value ? (o(), T(he, {
        key: 5,
        title: "Build log",
        wide: "",
        onClose: ie
      }, {
        default: te(() => [
          r("div", vn, [
            r("strong", bn, C(c.value.ref), 1),
            r("pre", gn, C(c.value.text), 1)
          ])
        ]),
        _: 1
      })) : v("", !0)
    ]));
  }
}), kn = { class: "ac-stack" }, $n = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, wn = {
  key: 1,
  class: "kx-loading"
}, xn = {
  key: 2,
  class: "ac-chips"
}, Cn = {
  key: 3,
  class: "kx-empty"
}, _n = { class: "kx-empty-ico" }, In = {
  key: 4,
  class: "kx-empty"
}, Sn = { class: "ac-list ac-resource-list" }, Dn = { class: "ac-resource-icon" }, Bn = { class: "ac-account-main" }, An = { class: "ac-row-title" }, Ln = { class: "kx-tag-sm ac-tone" }, Mn = {
  key: 0,
  class: "ac-muted"
}, Pn = { class: "ac-mono" }, Vn = {
  key: 1,
  class: "ac-muted ac-mono"
}, Un = { class: "ac-row-actions" }, Tn = ["onClick"], En = ["disabled"], Nn = {
  key: 0,
  class: "ac-muted"
}, Rn = {
  key: 1,
  class: "ac-field"
}, Fn = { class: "ac-chips" }, On = ["onClick"], jn = { class: "ac-field" }, zn = { class: "ac-field" }, Kn = ["placeholder"], qn = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Gn = { class: "ac-dialog-foot" }, Wn = ["disabled"], Hn = ["disabled"], Zn = /* @__PURE__ */ Q({
  __name: "workspaces",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(t, { expose: e, emit: n }) {
    const a = $e(), u = w([]), i = t, s = n, p = w(!1);
    e({ open: () => {
      p.value = !0;
    } });
    const b = w([]), x = w([]), A = w(""), D = w(!1), g = w(""), c = w(!1), l = w(""), m = w(!1);
    function B(h) {
      return h.replace(/\/+$/, "") + "/";
    }
    ee([p, x], () => {
      p.value && !l.value && x.value.length && (l.value = B(x.value[0]));
    }), ee(l, (h) => {
      c.value || (g.value = h.trim().split("/").filter(Boolean).pop() ?? "");
    });
    const k = me(async () => {
      try {
        await Te(H.workspaces, (h) => h.workspaces.map((f) => f.id), u, a, (h) => {
          b.value = h.workspaces, x.value = h.roots ?? [], m.value = !0, A.value = "";
        }, () => {
          k();
        });
      } catch (h) {
        a() && (A.value = Z(h, "Could not load workspaces."));
      }
    }, a);
    Ue(() => u.value, () => {
      k();
    }), pe(k);
    async function U() {
      A.value = "", D.value = !0;
      try {
        if (await H.createWorkspace({ name: g.value, host_path: l.value }), !a()) return;
        c.value = !1, g.value = "", l.value = "", p.value = !1, await k();
      } catch (h) {
        a() && (A.value = Z(h, "Could not save the workspace."));
      } finally {
        a() && (D.value = !1);
      }
    }
    async function $(h) {
      const f = await re.confirm({
        header: "Delete workspace",
        message: `Delete workspace "${h.name}"? The host directory stays untouched.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      });
      if (!(!a() || !f)) {
        A.value = "";
        try {
          await H.deleteWorkspace(h.id), await k();
        } catch (I) {
          a() && (A.value = Z(I, "Could not delete the workspace."));
        }
      }
    }
    const _ = F(() => b.value.filter((h) => [h.name, h.host_path].join(" ").toLowerCase().includes(i.query.toLowerCase())));
    return ee(b, (h) => {
      s("count", h.length);
    }), (h, f) => (o(), d("div", kn, [
      f[15] || (f[15] = r("p", { class: "ac-hint" }, "Tasks use shared workspaces with the access you grant.", -1)),
      A.value && !p.value ? (o(), d("p", $n, [
        j(C(A.value) + " ", 1),
        r("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: f[0] || (f[0] = //@ts-ignore
          (...I) => y(k) && y(k)(...I))
        }, "Retry")
      ])) : v("", !0),
      !m.value && !A.value ? (o(), d("div", wn, "Loading workspaces…")) : v("", !0),
      x.value.length ? (o(), d("div", xn, [
        f[7] || (f[7] = r("span", { class: "ac-muted" }, "Allowed roots", -1)),
        (o(!0), d(z, null, Y(x.value, (I) => (o(), d("span", {
          key: I,
          class: "ac-hint-chip ac-mono"
        }, C(I), 1))), 128))
      ])) : v("", !0),
      m.value && !b.value.length ? (o(), d("div", Cn, [
        r("div", _n, [
          P(y(N), { icon: "tabler:folder" })
        ]),
        f[8] || (f[8] = r("div", { class: "kx-empty-title" }, "No workspaces yet", -1)),
        f[9] || (f[9] = r("div", { class: "kx-empty-sub" }, "Add a host directory, or let tasks use a scratch directory.", -1)),
        r("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: f[1] || (f[1] = (I) => p.value = !0)
        }, "Add workspace")
      ])) : m.value && !_.value.length ? (o(), d("div", In, [...f[10] || (f[10] = [
        r("div", { class: "kx-empty-title" }, "No matches", -1),
        r("div", { class: "kx-empty-sub" }, "Try another workspace name or path.", -1)
      ])])) : v("", !0),
      r("ul", Sn, [
        (o(!0), d(z, null, Y(_.value, (I) => (o(), d("li", {
          key: I.id,
          class: "ac-row ac-resource"
        }, [
          r("span", Dn, [
            P(y(N), { icon: "tabler:folder" })
          ]),
          r("div", Bn, [
            r("div", An, [
              j(C(I.name), 1),
              r("span", Ln, C(I.writable ? "read-write" : "read-only"), 1)
            ]),
            I.unavailable_reason ? (o(), d("div", Mn, C(I.unavailable_reason), 1)) : v("", !0),
            (o(!0), d(z, null, Y(I.conflicts, (K) => (o(), d("div", {
              key: K.id,
              class: "ac-muted"
            }, [
              j("Conflicts with " + C(K.id) + ": ", 1),
              r("span", Pn, C(K.host_path), 1)
            ]))), 128)),
            I.host_path ? (o(), d("div", Vn, C(I.host_path), 1)) : v("", !0)
          ]),
          r("div", Un, [
            I.shareable ? (o(), T(Ve, {
              key: 0,
              id: I.id,
              title: I.name
            }, null, 8, ["id", "title"])) : v("", !0),
            I.deletable ? (o(), d("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete workspace",
              "aria-label": "Delete workspace",
              onClick: (K) => $(I)
            }, [
              P(y(N), { icon: "tabler:trash" })
            ], 8, Tn)) : v("", !0)
          ])
        ]))), 128))
      ]),
      p.value ? (o(), T(he, {
        key: 5,
        title: "Add workspace",
        busy: D.value,
        onClose: f[6] || (f[6] = (I) => p.value = !1)
      }, {
        default: te(() => [
          r("fieldset", {
            class: "ac-form",
            disabled: D.value
          }, [
            x.value.length ? (o(), d("div", Rn, [
              f[11] || (f[11] = r("span", null, "Allowed roots", -1)),
              r("div", Fn, [
                (o(!0), d(z, null, Y(x.value, (I) => (o(), d("button", {
                  key: I,
                  type: "button",
                  class: "ac-chip ac-mono kx-focus-halo",
                  title: "Start from this root",
                  onClick: (K) => l.value = B(I)
                }, C(I), 9, On))), 128))
              ])
            ])) : (o(), d("p", Nn, "The host administrator configures allowed workspace roots.")),
            r("label", jn, [
              f[12] || (f[12] = r("span", null, "Name", -1)),
              O(r("input", {
                "onUpdate:modelValue": f[2] || (f[2] = (I) => g.value = I),
                onInput: f[3] || (f[3] = (I) => c.value = !0),
                autofocus: "",
                class: "kx-focus-halo",
                placeholder: "e.g. Kickside checkout"
              }, null, 544), [
                [J, g.value]
              ])
            ]),
            r("label", zn, [
              f[13] || (f[13] = r("span", null, "Host directory", -1)),
              O(r("input", {
                "onUpdate:modelValue": f[4] || (f[4] = (I) => l.value = I),
                class: "ac-mono kx-focus-halo",
                placeholder: (x.value[0] ?? "/srv/work") + "/project"
              }, null, 8, Kn), [
                [J, l.value]
              ]),
              f[14] || (f[14] = r("small", { class: "ac-hint" }, [
                j("An existing directory, mounted at "),
                r("code", null, "/workspace"),
                j(".")
              ], -1))
            ]),
            A.value ? (o(), d("p", qn, C(A.value), 1)) : v("", !0),
            r("footer", Gn, [
              r("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                disabled: D.value,
                onClick: f[5] || (f[5] = (I) => p.value = !1)
              }, "Cancel", 8, Wn),
              r("button", {
                type: "button",
                class: "ac-btn primary kx-focus-halo",
                disabled: D.value || !g.value.trim() || !l.value.trim(),
                onClick: U
              }, [
                P(y(N), { icon: "tabler:folder-plus" }),
                j(C(D.value ? "Saving…" : "Add workspace"), 1)
              ], 8, Hn)
            ])
          ], 8, En)
        ]),
        _: 1
      }, 8, ["busy"])) : v("", !0)
    ]));
  }
}), Yn = { class: "ac-stack" }, Jn = { class: "ac-card ac-narrow" }, Qn = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Xn = { class: "ac-pre" }, ea = /* @__PURE__ */ Q({
  __name: "maintenance",
  setup(t) {
    const e = ke(), n = w(!1), a = w(""), u = w("");
    async function i() {
      if (await re.confirm({
        header: "Clean up Docker",
        message: `Prune stopped Autocode containers, unused images and build cache older than ${e.value.build_cache_retention} across this Docker host? Other modules may use the shared image cache.`,
        icon: "tabler:trash-x",
        acceptLabel: "Clean up",
        rejectLabel: "Cancel"
      })) {
        u.value = "", a.value = "", n.value = !0;
        try {
          a.value = await H.prune();
        } catch (p) {
          u.value = Z(p, "Cleanup failed.");
        } finally {
          n.value = !1;
        }
      }
    }
    return (s, p) => (o(), d("section", Yn, [
      P(le, {
        title: "Docker cleanup",
        subtitle: "Reclaim disk space used by finished tasks and old builds.",
        count: `Cache retention · ${y(e).build_cache_retention}`
      }, {
        actions: te(() => [
          P(y(ne), {
            label: "Clean up Docker",
            loading: n.value,
            disabled: n.value,
            onClick: i
          }, {
            icon: te(() => [
              P(y(N), {
                icon: "tabler:trash-x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["loading", "disabled"])
        ]),
        _: 1
      }, 8, ["count"]),
      r("div", Jn, [
        p[1] || (p[1] = r("p", { class: "ac-hint" }, "Remove stopped Autocode containers, dangling images and unused build cache older than the retention window. The cache is shared with other modules. Tagged images stay.", -1)),
        u.value ? (o(), d("p", Qn, C(u.value) + " Check the Docker host and try again.", 1)) : v("", !0),
        a.value ? (o(), d(z, { key: 1 }, [
          p[0] || (p[0] = r("p", { role: "status" }, "Cleanup finished.", -1)),
          P(Ee, { label: "Technical details" }, {
            default: te(() => [
              r("pre", Xn, C(a.value), 1)
            ]),
            _: 1
          })
        ], 64)) : v("", !0)
      ])
    ]));
  }
});
var Re = {
  name: "AngleDownIcon",
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
    if (typeof t == "string") return ve(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ve(t, e) : void 0;
  }
}
function ia(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function sa(t) {
  if (Array.isArray(t)) return ve(t);
}
function ve(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, a = Array(e); n < e; n++) a[n] = t[n];
  return a;
}
function ra(t, e, n, a, u, i) {
  return o(), d("svg", W({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), ta(e[0] || (e[0] = [r("path", {
    d: "M3.58659 4.5007C3.68513 4.50023 3.78277 4.51945 3.87379 4.55723C3.9648 4.59501 4.04735 4.65058 4.11659 4.7207L7.11659 7.7207L10.1166 4.7207C10.2619 4.65055 10.4259 4.62911 10.5843 4.65956C10.7427 4.69002 10.8871 4.77074 10.996 4.88976C11.1049 5.00877 11.1726 5.15973 11.1889 5.32022C11.2052 5.48072 11.1693 5.6422 11.0866 5.7807L7.58659 9.2807C7.44597 9.42115 7.25534 9.50004 7.05659 9.50004C6.85784 9.50004 6.66722 9.42115 6.52659 9.2807L3.02659 5.7807C2.88614 5.64007 2.80725 5.44945 2.80725 5.2507C2.80725 5.05195 2.88614 4.86132 3.02659 4.7207C3.09932 4.64685 3.18675 4.58911 3.28322 4.55121C3.37969 4.51331 3.48305 4.4961 3.58659 4.5007Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Re.render = ra;
var Fe = {
  name: "AngleUpIcon",
  extends: Me
};
function la(t) {
  return da(t) || ca(t) || ua(t) || oa();
}
function oa() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ua(t, e) {
  if (t) {
    if (typeof t == "string") return be(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? be(t, e) : void 0;
  }
}
function ca(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function da(t) {
  if (Array.isArray(t)) return be(t);
}
function be(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, a = Array(e); n < e; n++) a[n] = t[n];
  return a;
}
function pa(t, e, n, a, u, i) {
  return o(), d("svg", W({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), la(e[0] || (e[0] = [r("path", {
    d: "M10.4134 9.49931C10.3148 9.49977 10.2172 9.48055 10.1262 9.44278C10.0352 9.405 9.95263 9.34942 9.88338 9.27931L6.88338 6.27931L3.88338 9.27931C3.73811 9.34946 3.57409 9.3709 3.41567 9.34044C3.25724 9.30999 3.11286 9.22926 3.00395 9.11025C2.89504 8.99124 2.82741 8.84028 2.8111 8.67978C2.79478 8.51928 2.83065 8.35781 2.91338 8.21931L6.41338 4.71931C6.55401 4.57886 6.74463 4.49997 6.94338 4.49997C7.14213 4.49997 7.33276 4.57886 7.47338 4.71931L10.9734 8.21931C11.1138 8.35994 11.1927 8.55056 11.1927 8.74931C11.1927 8.94806 11.1138 9.13868 10.9734 9.27931C10.9007 9.35315 10.8132 9.41089 10.7168 9.44879C10.6203 9.48669 10.5169 9.5039 10.4134 9.49931Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Fe.render = pa;
var ma = `
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
`, fa = {
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
}, ha = je.extend({
  name: "inputnumber",
  style: ma,
  classes: fa
}), va = {
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
  style: ha,
  provide: function() {
    return {
      $pcInputNumber: this,
      $parentInstance: this
    };
  }
};
function oe(t) {
  "@babel/helpers - typeof";
  return oe = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, oe(t);
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
  return (e = ba(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function ba(t) {
  var e = ga(t, "string");
  return oe(e) == "symbol" ? e : e + "";
}
function ga(t, e) {
  if (oe(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var a = n.call(t, e);
    if (oe(a) != "object") return a;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function ya(t) {
  return xa(t) || wa(t) || $a(t) || ka();
}
function ka() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function $a(t, e) {
  if (t) {
    if (typeof t == "string") return ye(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ye(t, e) : void 0;
  }
}
function wa(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function xa(t) {
  if (Array.isArray(t)) return ye(t);
}
function ye(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, a = Array(e); n < e; n++) a[n] = t[n];
  return a;
}
var Oe = {
  name: "InputNumber",
  extends: va,
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
        this.d_modelValue = e, (n = this.$refs.clearIcon) !== null && n !== void 0 && (n = n.$el) !== null && n !== void 0 && n.style && (this.$refs.clearIcon.$el.style.display = Ce(e) ? "none" : "block");
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
      var e = ya(new Intl.NumberFormat(this.locale, {
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
      var a = e.toString(), u = n.toString(), i = a.includes(".") ? a.split(".")[1].length : 0, s = u.includes(".") ? u.split(".")[1].length : 0, p = Math.max(i, s), b = Math.pow(10, p);
      return Math.round((e + n) * b) / b;
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
        var n = e.target.selectionStart, a = e.target.selectionEnd, u = a - n, i = e.target.value, s = null, p = e.code || e.key;
        switch (p) {
          case "ArrowUp":
            this.spin(e, 1), e.preventDefault();
            break;
          case "ArrowDown":
            this.spin(e, -1), e.preventDefault();
            break;
          case "ArrowLeft":
            if (u > 1) {
              var b = this.isNumeralChar(i.charAt(n)) ? n + 1 : n + 2;
              this.$refs.input.$el.setSelectionRange(b, b);
            } else this.isNumeralChar(i.charAt(n - 1)) || e.preventDefault();
            break;
          case "ArrowRight":
            if (u > 1) {
              var x = a - 1;
              this.$refs.input.$el.setSelectionRange(x, x);
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
              var A = i.charAt(n - 1), D = this.getDecimalCharIndexes(i), g = D.decimalCharIndex, c = D.decimalCharIndexWithoutPrefix;
              if (this.isNumeralChar(A)) {
                var l = this.getDecimalLength(i);
                if (this._group.test(A))
                  this._group.lastIndex = 0, s = i.slice(0, n - 2) + i.slice(n - 1);
                else if (this._decimal.test(A))
                  this._decimal.lastIndex = 0, l ? this.$refs.input.$el.setSelectionRange(n - 1, n - 1) : s = i.slice(0, n - 1) + i.slice(n);
                else if (g > 0 && n > g) {
                  var m = this.isDecimalMode() && (this.minFractionDigits || 0) < l ? "" : "0";
                  s = i.slice(0, n - 1) + m + i.slice(n);
                } else c === 1 ? (s = i.slice(0, n - 1) + "0" + i.slice(n), s = this.parseValue(s) > 0 ? s : "") : s = i.slice(0, n - 1) + i.slice(n);
              }
              this.updateValue(e, s, null, "delete-single");
            } else
              s = this.deleteRange(i, n, a), this.updateValue(e, s, null, "delete-range");
            break;
          }
          case "Delete":
            if (e.preventDefault(), n === a) {
              var B = i.charAt(n), k = this.getDecimalCharIndexes(i), U = k.decimalCharIndex, $ = k.decimalCharIndexWithoutPrefix;
              if (this.isNumeralChar(B)) {
                var _ = this.getDecimalLength(i);
                if (this._group.test(B))
                  this._group.lastIndex = 0, s = i.slice(0, n) + i.slice(n + 2);
                else if (this._decimal.test(B))
                  this._decimal.lastIndex = 0, _ ? this.$refs.input.$el.setSelectionRange(n + 1, n + 1) : s = i.slice(0, n) + i.slice(n + 1);
                else if (U > 0 && n > U) {
                  var h = this.isDecimalMode() && (this.minFractionDigits || 0) < _ ? "" : "0";
                  s = i.slice(0, n) + h + i.slice(n + 1);
                } else $ === 1 ? (s = i.slice(0, n) + "0" + i.slice(n + 1), s = this.parseValue(s) > 0 ? s : "") : s = i.slice(0, n) + i.slice(n + 1);
              }
              this.updateValue(e, s, null, "delete-back-single");
            } else
              s = this.deleteRange(i, n, a), this.updateValue(e, s, null, "delete-range");
            break;
          case "Home":
            e.preventDefault(), _e(this.min) && this.updateModel(e, this.min);
            break;
          case "End":
            e.preventDefault(), _e(this.max) && this.updateModel(e, this.max);
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
        var i = this.$refs.input.$el.selectionStart, s = this.$refs.input.$el.selectionEnd, p = this.$refs.input.$el.value.trim(), b = this.getCharIndexes(p), x = b.decimalCharIndex, A = b.minusCharIndex, D = b.suffixCharIndex, g = b.currencyCharIndex, c;
        if (a.isMinusSign) {
          var l = A === -1;
          (i === 0 || i === g + 1) && (c = p, (l || s !== 0) && (c = this.insertText(p, n, 0, s)), this.updateValue(e, c, n, "insert"));
        } else if (a.isDecimalSign)
          x > 0 && i === x ? this.updateValue(e, p, n, "insert") : x > i && x < s ? (c = this.insertText(p, n, i, s), this.updateValue(e, c, n, "insert")) : x === -1 && this.maxFractionDigits && (c = this.insertText(p, n, i, s), this.updateValue(e, c, n, "insert"));
        else {
          var m = this.numberFormat.resolvedOptions().maximumFractionDigits, B = i !== s ? "range-insert" : "insert";
          if (x > 0 && i > x) {
            if (i + n.length - (x + 1) <= m) {
              var k = g >= i ? g - 1 : D >= i ? D : p.length;
              c = p.slice(0, i) + n + p.slice(i + n.length, k) + p.slice(k), this.updateValue(e, c, n, B);
            }
          } else
            c = this.insertText(p, n, i, s), this.updateValue(e, c, n, B);
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
      for (var p = e - 1; p >= 0; )
        if (s = n.charAt(p), this.isNumeralChar(s)) {
          u = p + i;
          break;
        } else
          p--;
      if (u !== null)
        this.$refs.input.$el.setSelectionRange(u + 1, u + 1);
      else {
        for (p = e; p < a; )
          if (s = n.charAt(p), this.isNumeralChar(s)) {
            u = p + i;
            break;
          } else
            p++;
        u !== null && this.$refs.input.$el.setSelectionRange(u, u);
      }
      return u || 0;
    },
    onInputClick: function() {
      var e = this.$refs.input.$el.value;
      !this.readonly && e !== xe() && this.initCursor();
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
      var s = this.$refs.input.$el.value, p = this.formatValue(e), b = s.length;
      if (p !== u && (p = this.concatValues(p, u)), b === 0) {
        this.$refs.input.$el.value = p, this.$refs.input.$el.setSelectionRange(0, 0);
        var x = this.initCursor(), A = x + n.length;
        this.$refs.input.$el.setSelectionRange(A, A);
      } else {
        var D = this.$refs.input.$el.selectionStart, g = this.$refs.input.$el.selectionEnd;
        this.$refs.input.$el.value = p;
        var c = p.length;
        if (a === "range-insert") {
          var l = this.parseValue((s || "").slice(0, D)), m = l !== null ? l.toString() : "", B = m.split("").join("(".concat(this.groupChar, ")?")), k = new RegExp(B, "g");
          k.test(p);
          var U = n.split("").join("(".concat(this.groupChar, ")?")), $ = new RegExp(U, "g");
          $.test(p.slice(k.lastIndex)), g = k.lastIndex + $.lastIndex, this.$refs.input.$el.setSelectionRange(g, g);
        } else if (c === b)
          a === "insert" || a === "delete-back-single" ? this.$refs.input.$el.setSelectionRange(g + 1, g + 1) : a === "delete-single" ? this.$refs.input.$el.setSelectionRange(g - 1, g - 1) : (a === "delete-range" || a === "spin") && this.$refs.input.$el.setSelectionRange(g, g);
        else if (a === "delete-back-single") {
          var _ = s.charAt(g - 1), h = s.charAt(g), f = b - c, I = this._group.test(h);
          I && f === 1 ? g += 1 : !I && this.isNumeralChar(_) && (g += -1 * f + 1), this._group.lastIndex = 0, this.$refs.input.$el.setSelectionRange(g, g);
        } else if (s === "-" && a === "insert") {
          this.$refs.input.$el.setSelectionRange(0, 0);
          var K = this.initCursor(), G = K + n.length + 1;
          this.$refs.input.$el.setSelectionRange(G, G);
        } else
          g = g + (c - b), this.$refs.input.$el.setSelectionRange(g, g);
      }
      this.$refs.input.$el.setAttribute("aria-valuenow", e), (i = this.$refs.clearIcon) !== null && i !== void 0 && (i = i.$el) !== null && i !== void 0 && i.style && (this.$refs.clearIcon.$el.style.display = Ce(p) ? "none" : "block");
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
      this.focused = !0, !this.disabled && !this.readonly && this.$refs.input.$el.value !== xe() && this.highlightOnFocus && e.target.select(), this.$emit("focus", e);
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
}, Ca = ["data-p"], _a = ["data-p"], Ia = ["disabled", "data-p"], Sa = ["disabled", "data-p"], Da = ["disabled", "data-p"], Ba = ["disabled", "data-p"];
function Aa(t, e, n, a, u, i) {
  var s = Ie("InputText"), p = Ie("TimesIcon");
  return o(), d("span", W({
    class: t.cx("root")
  }, t.ptmi("root"), {
    "data-p": i.dataP
  }), [P(s, {
    ref: "input",
    id: t.inputId,
    name: t.$formName,
    role: "spinbutton",
    class: se([t.cx("pcInputText"), t.inputClass]),
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
    class: se(t.cx("clearIcon")),
    clearCallback: i.onClearClick
  }, function() {
    return [P(p, W({
      ref: "clearIcon",
      class: [t.cx("clearIcon")],
      onClick: i.onClearClick
    }, t.ptm("clearIcon")), null, 16, ["class", "onClick"])];
  }) : v("", !0), t.showButtons && t.buttonLayout === "stacked" ? (o(), d("span", W({
    key: 1,
    class: t.cx("buttonGroup")
  }, t.ptm("buttonGroup"), {
    "data-p": i.dataP
  }), [X(t.$slots, "incrementbutton", {
    listeners: i.upButtonListeners
  }, function() {
    return [r("button", W({
      class: [t.cx("incrementButton"), t.incrementButtonClass]
    }, ue(i.upButtonListeners, !0), {
      disabled: t.disabled,
      tabindex: -1,
      "aria-hidden": "true",
      type: "button"
    }, t.ptm("incrementButton"), {
      "data-p": i.dataP
    }), [X(t.$slots, t.$slots.incrementicon ? "incrementicon" : "incrementbuttonicon", {}, function() {
      return [(o(), T(ce(t.incrementIcon || t.incrementButtonIcon ? "span" : "AngleUpIcon"), W({
        class: [t.incrementIcon, t.incrementButtonIcon]
      }, t.ptm("incrementIcon"), {
        "data-pc-section": "incrementicon"
      }), null, 16, ["class"]))];
    })], 16, Ia)];
  }), X(t.$slots, "decrementbutton", {
    listeners: i.downButtonListeners
  }, function() {
    return [r("button", W({
      class: [t.cx("decrementButton"), t.decrementButtonClass]
    }, ue(i.downButtonListeners, !0), {
      disabled: t.disabled,
      tabindex: -1,
      "aria-hidden": "true",
      type: "button"
    }, t.ptm("decrementButton"), {
      "data-p": i.dataP
    }), [X(t.$slots, t.$slots.decrementicon ? "decrementicon" : "decrementbuttonicon", {}, function() {
      return [(o(), T(ce(t.decrementIcon || t.decrementButtonIcon ? "span" : "AngleDownIcon"), W({
        class: [t.decrementIcon, t.decrementButtonIcon]
      }, t.ptm("decrementIcon"), {
        "data-pc-section": "decrementicon"
      }), null, 16, ["class"]))];
    })], 16, Sa)];
  })], 16, _a)) : v("", !0), X(t.$slots, "incrementbutton", {
    listeners: i.upButtonListeners
  }, function() {
    return [t.showButtons && t.buttonLayout !== "stacked" ? (o(), d("button", W({
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
      return [(o(), T(ce(t.incrementIcon || t.incrementButtonIcon ? "span" : "AngleUpIcon"), W({
        class: [t.incrementIcon, t.incrementButtonIcon]
      }, t.ptm("incrementIcon"), {
        "data-pc-section": "incrementicon"
      }), null, 16, ["class"]))];
    })], 16, Da)) : v("", !0)];
  }), X(t.$slots, "decrementbutton", {
    listeners: i.downButtonListeners
  }, function() {
    return [t.showButtons && t.buttonLayout !== "stacked" ? (o(), d("button", W({
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
      return [(o(), T(ce(t.decrementIcon || t.decrementButtonIcon ? "span" : "AngleDownIcon"), W({
        class: [t.decrementIcon, t.decrementButtonIcon]
      }, t.ptm("decrementIcon"), {
        "data-pc-section": "decrementicon"
      }), null, 16, ["class"]))];
    })], 16, Ba)) : v("", !0)];
  })], 16, Ca);
}
Oe.render = Aa;
const La = {
  class: "ac-stack ac-limits",
  "aria-label": "Limits"
}, Ma = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Pa = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Va = {
  key: 2,
  class: "ac-limit-status",
  role: "status"
}, Ua = { class: "ac-card-title" }, Ta = ["onSubmit"], Ea = ["for"], Na = ["id"], Ra = { class: "ac-limit-control" }, Fa = { class: "ac-hint" }, Oa = { class: "ac-limit-actions" }, ja = {
  key: 0,
  class: "kx-err ac-limit-error",
  role: "alert"
}, za = /* @__PURE__ */ Q({
  __name: "limits",
  emits: ["saved"],
  setup(t, { emit: e }) {
    const n = e, a = $e(), u = w([]), i = w({}), s = w({}), p = w(""), b = w(""), x = w(!1), A = w(""), D = F(() => {
      if (!x.value) return;
      const m = u.value.length, B = u.value.filter((k) => k.overridden).length;
      return `${m} ${m === 1 ? "limit" : "limits"} · ${B} overridden`;
    }), g = F(() => {
      const m = /* @__PURE__ */ new Map();
      for (const B of [...u.value].sort((k, U) => k.order - U.order)) {
        const k = m.get(B.category) ?? [];
        k.push(B), m.set(B.category, k);
      }
      return m;
    }), c = me(async () => {
      try {
        const m = await H.limits();
        if (!a()) return;
        if (!m.length) throw new Error("No Autocode limits were found.");
        const B = new Map(u.value.map((k) => [k.key, k.value]));
        for (const k of m) {
          const U = i.value[k.key];
          (U === void 0 || U === B.get(k.key) || b.value === k.key) && (i.value[k.key] = k.value);
        }
        u.value = m, x.value = !0, p.value = "";
      } catch (m) {
        a() && (p.value = Z(m, "Could not load limits."));
      }
    }, a);
    pe(c);
    async function l(m, B = !1) {
      const k = B ? null : i.value[m.key];
      if (!(b.value || !B && (k == null || k === "" || k === m.value))) {
        b.value = m.key, A.value = "", s.value[m.key] = "";
        try {
          if (m.key === "run_retention" && !await re.confirm({
            header: "Change run retention?",
            message: "Shorter retention can delete completed runs and their logs.",
            acceptLabel: "Change retention",
            rejectLabel: "Cancel"
          }) || !a() || (await H.saveLimit(m.key, k ?? null), !a()) || (await c(), !a())) return;
          p.value || (A.value = B ? `${m.title} reset to default.` : `${m.title} saved.`), n("saved");
        } catch (U) {
          a() && (s.value[m.key] = Z(U, "Could not save this limit."));
        } finally {
          a() && (b.value = "");
        }
      }
    }
    return (m, B) => (o(), d("section", La, [
      P(le, {
        title: "Limits",
        subtitle: "Set task resource defaults and run retention. Enter durations such as 30m or 2h.",
        count: D.value
      }, null, 8, ["count"]),
      !x.value && !p.value ? (o(), d("p", Ma, "Loading limits…")) : v("", !0),
      p.value ? (o(), d("div", Pa, [
        j(C(p.value) + " ", 1),
        P(y(ne), {
          label: "Retry",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: y(c)
        }, null, 8, ["onClick"])
      ])) : v("", !0),
      A.value ? (o(), d("p", Va, C(A.value), 1)) : v("", !0),
      (o(!0), d(z, null, Y(g.value, ([k, U]) => (o(), d("section", {
        key: k,
        class: "ac-card ac-limit-group"
      }, [
        r("h3", Ua, C(k), 1),
        (o(!0), d(z, null, Y(U, ($) => (o(), d("form", {
          key: $.key,
          class: "ac-limit-row",
          onSubmit: Je((_) => l($), ["prevent"])
        }, [
          r("div", null, [
            r("label", {
              for: "ac-limit-" + $.key,
              class: "ac-strong"
            }, C($.title), 9, Ea),
            r("p", {
              id: "ac-limit-help-" + $.key,
              class: "ac-hint"
            }, C($.description), 9, Na)
          ]),
          r("div", Ra, [
            $.value_type === "int" ? (o(), T(y(Oe), {
              key: 0,
              "input-id": "ac-limit-" + $.key,
              "model-value": typeof i.value[$.key] == "number" ? Number(i.value[$.key]) : null,
              "input-props": { "aria-describedby": "ac-limit-help-" + $.key },
              disabled: !!b.value,
              fluid: "",
              onInput: (_) => i.value[$.key] = typeof _.value == "number" ? _.value : null,
              "onUpdate:modelValue": (_) => i.value[$.key] = _
            }, null, 8, ["input-id", "model-value", "input-props", "disabled", "onInput", "onUpdate:modelValue"])) : (o(), T(y(Ne), {
              key: 1,
              id: "ac-limit-" + $.key,
              "model-value": String(i.value[$.key] ?? ""),
              "aria-describedby": "ac-limit-help-" + $.key,
              disabled: !!b.value,
              fluid: "",
              "onUpdate:modelValue": (_) => i.value[$.key] = _ ?? ""
            }, null, 8, ["id", "model-value", "aria-describedby", "disabled", "onUpdate:modelValue"])),
            r("p", Fa, C($.unit) + " · " + C($.overridden ? `Override · default ${$.default}` : "Default"), 1)
          ]),
          r("div", Oa, [
            i.value[$.key] !== $.value ? (o(), T(y(ne), {
              key: 0,
              type: "submit",
              label: "Save",
              size: "small",
              "aria-label": "Save " + $.title,
              disabled: !!b.value || i.value[$.key] == null || i.value[$.key] === ""
            }, null, 8, ["aria-label", "disabled"])) : v("", !0),
            $.overridden ? (o(), T(y(ne), {
              key: 1,
              type: "button",
              label: "Reset",
              size: "small",
              text: "",
              severity: "secondary",
              "aria-label": "Reset " + $.title + " to default",
              disabled: !!b.value,
              onClick: (_) => l($, !0)
            }, null, 8, ["aria-label", "disabled", "onClick"])) : v("", !0)
          ]),
          s.value[$.key] ? (o(), d("p", ja, C(s.value[$.key]), 1)) : v("", !0)
        ], 40, Ta))), 128))
      ]))), 128))
    ]));
  }
}), Ka = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, qa = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Ga = /* @__PURE__ */ Q({
  __name: "account-provider-mount",
  props: {
    tag: {},
    providerId: {}
  },
  emits: ["changed"],
  setup(t, { emit: e }) {
    const n = t, a = e, u = w(null), i = w(0), s = w(!1), p = w("");
    return ee([u, i], async ([b], x, A) => {
      if (!b) return;
      let D = !0;
      const g = (c) => {
        if (c instanceof CustomEvent && c.detail?.success === !1) {
          p.value = c.detail.error || "Could not complete account setup.";
          return;
        }
        p.value = "", a("changed");
      };
      A(() => {
        D = !1, b.replaceChildren();
      }), s.value = !0, p.value = "";
      try {
        if (await Qe(n.tag, { timeoutMs: 8e3 }), !D) return;
        const c = document.createElement(n.tag);
        c.setAttribute("provider-id", n.providerId), c.addEventListener("connection-saved", g), c.addEventListener("oauth-result", g), b.replaceChildren(c);
      } catch (c) {
        D && (p.value = Z(c, "Could not load the provider’s account editor."));
      } finally {
        D && (s.value = !1);
      }
    }), (b, x) => (o(), d(z, null, [
      s.value ? (o(), d("p", Ka, "Loading account editor…")) : v("", !0),
      p.value ? (o(), d("div", qa, [
        j(C(p.value) + " ", 1),
        P(y(ne), {
          label: "Retry",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: x[0] || (x[0] = (A) => i.value++)
        })
      ])) : v("", !0),
      r("div", {
        ref_key: "container",
        ref: u
      }, null, 512)
    ], 64));
  }
}), Wa = {
  class: "kx-card ac-provider-choice",
  type: "button"
}, Ha = { class: "kx-card-head" }, Za = { class: "ac-provider-icon" }, Ya = { class: "kx-card-id" }, Ja = { class: "kx-card-name" }, Qa = { class: "kx-card-desc" }, Xa = { class: "kx-card-meta" }, ei = {
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
    return (e, n) => (o(), d("button", Wa, [
      r("span", Ha, [
        r("span", Za, [
          P(y(N), {
            icon: t.icon,
            "aria-hidden": "true"
          }, null, 8, ["icon"])
        ]),
        r("span", Ya, [
          r("span", Ja, C(t.title), 1),
          r("span", Qa, C(t.hint), 1)
        ]),
        P(y(N), {
          icon: "tabler:chevron-right",
          class: "ac-provider-arrow",
          "aria-hidden": "true"
        })
      ]),
      r("span", Xa, [
        P(y(nt), {
          value: t.status,
          severity: t.severity
        }, null, 8, ["value", "severity"]),
        t.count ? (o(), d("small", ei, C(t.count), 1)) : v("", !0)
      ])
    ]));
  }
}), ti = {
  class: "ac-stack ac-provider-page",
  "aria-label": "Accounts"
}, ni = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, ai = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, ii = {
  key: 2,
  class: "ac-stack"
}, si = { class: "ac-hint" }, ri = {
  key: 3,
  class: "ac-stack"
}, li = {
  key: 0,
  class: "ac-muted"
}, oi = {
  key: 1,
  "aria-label": "Account providers",
  class: "ac-stack"
}, ui = {
  key: 0,
  class: "ac-provider-grid"
}, ci = { class: "ac-provider-grid" }, di = /* @__PURE__ */ Q({
  __name: "account-management",
  props: {
    active: { type: Boolean, default: !0 }
  },
  setup(t) {
    const e = t, n = w([]), a = w([]), u = w(""), i = w(!1), s = w(""), p = w();
    let b;
    const x = ot(), A = $e(), D = F(() => {
      const _ = /* @__PURE__ */ new Map();
      for (const h of a.value) {
        const f = _.get(h.agent) ?? [];
        f.push(h), _.set(h.agent, f);
      }
      return _;
    }), g = F(() => {
      const _ = new Set(n.value.map((h) => h.agent));
      return [...n.value, ...Array.from(D.value.keys()).filter((h) => !_.has(h)).map((h) => ({ agent: h, title: h, provider_id: h, icon: "tabler:terminal-off", create_ui_id: void 0 }))].map((h) => {
        const f = D.value.get(h.agent) ?? [], I = f.map((ae) => De(ae, x.value)), K = I.filter((ae) => ae.state === "ready").length, G = I.find((ae) => ae.state === "cooling"), L = at(h.agent, h.title), E = h.agent === "codex" ? 0 : h.agent === "claude" ? 1 : 2, R = _.has(h.agent), ie = R ? K ? "Ready" : G ? G.label : f.length ? "Needs attention" : "Not set up" : "Provider unavailable", fe = K ? "success" : G ? "warn" : f.length ? "danger" : "secondary";
        return {
          ...h,
          ...L,
          rank: E,
          status: ie,
          ready: K,
          total: f.length,
          installed: R,
          severity: fe
        };
      }).sort((h, f) => +!!f.total - +!!h.total || h.rank - f.rank || h.name.localeCompare(f.name));
    }), c = F(() => g.value.filter((_) => _.total || _.rank < 2)), l = F(() => g.value.filter((_) => !_.total && _.rank === 2)), m = F(() => g.value.find((_) => _.provider_id === u.value));
    ee(() => e.active, (_) => {
      _ || (u.value = "");
    });
    const B = F(() => i.value ? a.value.length ? `${a.value.filter((h) => De(h, x.value).state === "ready").length} of ${a.value.length} ready` : "No accounts yet" : void 0);
    async function k(_, h) {
      h.currentTarget instanceof HTMLElement && (b = h.currentTarget), u.value = _, await Se(), p.value?.focus();
    }
    async function U() {
      u.value = "", await Se(), b?.focus();
    }
    const $ = me(async () => {
      try {
        const _ = await H.managedAccounts();
        if (!A()) return;
        n.value = _.providers, a.value = _.accounts, i.value = !0, s.value = "";
      } catch (_) {
        A() && (s.value = Z(_, "Could not load account providers."));
      }
    }, A);
    return pe($), (_, h) => (o(), d("section", ti, [
      !i.value && !s.value ? (o(), d("p", ni, "Loading account providers…")) : v("", !0),
      s.value ? (o(), d("p", ai, [
        j(C(s.value) + " ", 1),
        P(y(ne), {
          label: "Retry",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: y($)
        }, null, 8, ["onClick"])
      ])) : v("", !0),
      m.value ? (o(), d("div", ii, [
        r("div", {
          ref_key: "detailHeading",
          ref: p,
          tabindex: "-1"
        }, [
          P(le, {
            title: m.value.name,
            subtitle: m.value.hint,
            count: m.value.total ? `${m.value.ready} of ${m.value.total} ready` : m.value.status
          }, {
            actions: te(() => [
              P(y(ne), {
                label: "All providers",
                text: "",
                severity: "secondary",
                size: "small",
                onClick: U
              })
            ]),
            _: 1
          }, 8, ["title", "subtitle", "count"])
        ], 512),
        m.value.create_ui_id ? (o(), T(Ga, {
          key: m.value.provider_id,
          tag: m.value.create_ui_id,
          "provider-id": m.value.provider_id,
          onChanged: y($)
        }, null, 8, ["tag", "provider-id", "onChanged"])) : (o(), d(z, { key: 1 }, [
          r("p", si, C(m.value.installed ? "This provider does not offer account setup." : "This provider is unavailable. You can still manage its existing accounts."), 1),
          m.value.total ? (o(), T(it, {
            key: m.value.agent,
            query: "",
            "selected-agent": m.value.agent,
            management: "",
            "allow-setup": !1,
            onChanged: y($)
          }, null, 8, ["selected-agent", "onChanged"])) : v("", !0)
        ], 64))
      ])) : v("", !0),
      i.value ? O((o(), d("div", ri, [
        P(le, {
          title: "Accounts",
          subtitle: "Connect a provider to run tasks, see usage, and manage access.",
          count: B.value
        }, null, 8, ["count"]),
        g.value.length ? (o(), d("nav", oi, [
          c.value.length ? (o(), d("div", ui, [
            (o(!0), d(z, null, Y(c.value, (f) => (o(), T(Le, {
              key: f.provider_id,
              "data-account-provider": f.provider_id,
              title: f.name,
              hint: f.hint,
              icon: f.icon || "tabler:terminal-2",
              status: f.status,
              severity: f.severity,
              count: f.total ? `${f.ready} of ${f.total} ready` : void 0,
              onClick: (I) => k(f.provider_id, I)
            }, null, 8, ["data-account-provider", "title", "hint", "icon", "status", "severity", "count", "onClick"]))), 128))
          ])) : v("", !0),
          l.value.length ? (o(), T(Ee, {
            key: 1,
            label: `More providers · ${l.value.length}`,
            open: !c.value.length
          }, {
            default: te(() => [
              r("div", ci, [
                (o(!0), d(z, null, Y(l.value, (f) => (o(), T(Le, {
                  key: f.provider_id,
                  "data-account-provider": f.provider_id,
                  title: f.name,
                  hint: f.hint,
                  icon: f.icon || "tabler:terminal-2",
                  status: f.status,
                  severity: f.severity,
                  onClick: (I) => k(f.provider_id, I)
                }, null, 8, ["data-account-provider", "title", "hint", "icon", "status", "severity", "onClick"]))), 128))
              ])
            ]),
            _: 1
          }, 8, ["label", "open"])) : v("", !0)
        ])) : (o(), d("p", li, "Install an Autocode provider in System → Modules, then return here to connect an account."))
      ], 512)), [
        [de, !m.value]
      ]) : v("", !0)
    ]));
  }
}), pi = { class: "ac ac-admin" }, mi = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, fi = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, hi = {
  key: 2,
  class: "ac-muted"
}, vi = {
  key: 3,
  class: "ac-settings-layout"
}, bi = ["aria-label"], gi = { class: "ac-settings-content" }, yi = /* @__PURE__ */ Q({
  __name: "admin",
  setup(t) {
    const e = [
      { id: "images", label: "Images", icon: "tabler:box", permission: "can_images" },
      { id: "workspaces", label: "Workspaces", icon: "tabler:folder", permission: "can_workspaces" },
      { id: "docker", label: "Docker", icon: "tabler:brand-docker", permission: "can_prune" },
      { id: "limits", label: "Limits", icon: "tabler:adjustments", permission: "can_limits" },
      { id: "accounts", label: "Accounts", icon: "tabler:key", permission: "can_accounts" }
    ], n = qe(), a = Ge(), { catalog: u, error: i, load: s } = st(), p = F(() => u.value?.settings_path || "/system/autocode"), b = w(A(n.value.route?.includes("?") ? n.value.route : Xe.context?.route)), x = et("@history", ({ path: L }) => {
      L.split(/[?#]/, 1)[0] === p.value && (b.value = A(L));
    });
    Pe(x), ee(() => n.value.route, (L) => {
      L?.includes("?") && (b.value = A(L));
    });
    function A(L) {
      const E = new URLSearchParams(L?.split("?")[1]?.split("#", 1)[0]).get("section");
      return e.find((R) => R.id === E)?.id;
    }
    function D(L) {
      const E = g.value.find((R) => R.id === L);
      !E || E.id === l.value || (b.value = E.id, a("navigate", { path: p.value + "?section=" + L }));
    }
    const g = F(() => e.filter((L) => u.value?.[L.permission])), c = F(() => g.value.find((L) => L.id === b.value) ?? g.value[0]), l = F(() => c.value?.id), m = F(() => [
      { heading: "Execution", items: g.value.filter((L) => L.id === "images" || L.id === "workspaces" || L.id === "docker") },
      { heading: "Configuration", items: g.value.filter((L) => L.id === "limits" || L.id === "accounts") }
    ].filter((L) => L.items.length).map((L) => ({
      heading: L.heading,
      items: L.items.map(({ id: E, label: R, icon: ie }) => ({ value: E, label: R, icon: ie }))
    }))), B = w(""), k = w(), U = w(), $ = w(), _ = w(null), h = w(null), f = F(() => {
      if (l.value === "images") return { title: "Images", subtitle: "Manage the container images that run tasks.", count: I(k.value, "image", "images"), action: k.value ? "Add image" : void 0 };
      if (l.value === "workspaces") return { title: "Workspaces", subtitle: "Manage the host directories that tasks can use.", count: I(U.value, "workspace", "workspaces"), action: U.value ? "Add workspace" : void 0 };
    });
    ee(l, () => {
      B.value = "", $.value && ($.value.scrollTop = 0);
    });
    function I(L, E, R) {
      return L === void 0 ? void 0 : `${L} ${L === 1 ? E : R}`;
    }
    function K() {
      l.value === "images" ? _.value?.open() : l.value === "workspaces" && h.value?.open();
    }
    function G(L) {
      L.button === 0 && L.target instanceof Element && L.target.closest(".kx-settings-rail-item:focus-visible")?.blur();
    }
    return (L, E) => (o(), d("div", pi, [
      y(i) && !y(u) ? (o(), d("p", mi, [
        j(C(y(i)) + " ", 1),
        r("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: E[0] || (E[0] = //@ts-ignore
          (...R) => y(s) && y(s)(...R))
        }, "Retry")
      ])) : y(u) ? l.value ? (o(), d("div", vi, [
        P(ft, {
          label: "Autocode settings",
          value: l.value,
          groups: m.value,
          "onUpdate:value": D,
          onPointerdown: G
        }, null, 8, ["value", "groups"]),
        r("main", {
          ref_key: "content",
          ref: $,
          class: "ac-settings-pane",
          "aria-label": c.value?.label
        }, [
          r("div", gi, [
            f.value ? (o(), T(le, W({ key: 0 }, f.value, {
              query: B.value,
              "onUpdate:query": E[1] || (E[1] = (R) => B.value = R),
              placeholder: f.value.count && f.value.action ? `Search ${l.value}…` : void 0,
              onCreate: K
            }), null, 16, ["query", "placeholder"])) : v("", !0),
            y(u).can_images ? O((o(), T(yn, {
              key: 1,
              ref_key: "images",
              ref: _,
              query: l.value === "images" ? B.value : "",
              onCount: E[2] || (E[2] = (R) => k.value = R)
            }, null, 8, ["query"])), [
              [de, l.value === "images"]
            ]) : v("", !0),
            y(u).can_workspaces ? O((o(), T(Zn, {
              key: 2,
              ref_key: "workspaces",
              ref: h,
              query: l.value === "workspaces" ? B.value : "",
              onCount: E[3] || (E[3] = (R) => U.value = R)
            }, null, 8, ["query"])), [
              [de, l.value === "workspaces"]
            ]) : v("", !0),
            l.value === "docker" ? (o(), T(ea, { key: 3 })) : v("", !0),
            l.value === "limits" ? (o(), T(za, {
              key: 4,
              onSaved: y(s)
            }, null, 8, ["onSaved"])) : v("", !0),
            y(u).can_accounts ? O((o(), T(di, {
              key: 5,
              active: l.value === "accounts"
            }, null, 8, ["active"])), [
              [de, l.value === "accounts"]
            ]) : v("", !0)
          ])
        ], 8, bi)
      ])) : (o(), d("p", hi, "Ask an administrator for access to the Autocode settings you need.")) : (o(), d("div", fi, [
        P(y(N), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        E[4] || (E[4] = j(" Loading…", -1))
      ]))
    ]));
  }
}), Si = {
  rootComponent: yi,
  plugins: [We]
};
export {
  Si as mountConfig
};
