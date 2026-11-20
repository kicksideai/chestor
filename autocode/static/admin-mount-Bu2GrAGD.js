import { b as re, s as me, B as De, f as Be, p as Oe, M as $e, c as xe, d as we, P as ze } from "./wc-runtime-DbdXH-lj.js";
import { defineComponent as J, ref as $, watch as Y, openBlock as u, createElementBlock as d, toDisplayString as w, createElementVNode as s, createVNode as P, unref as y, createTextVNode as V, createCommentVNode as g, withDirectives as F, vModelText as z, normalizeClass as Q, createStaticVNode as Ke, Fragment as O, renderList as K, vModelCheckbox as qe, computed as q, onUnmounted as Ge, createBlock as M, withCtx as oe, mergeProps as E, resolveComponent as Ce, normalizeStyle as We, renderSlot as H, toHandlers as ae, resolveDynamicComponent as ie, withModifiers as He, vShow as Ze } from "vue";
import { Icon as U } from "@iconify/vue";
import { u as he, _ as Ae, a as le, s as Ye, b as X, c as _e, d as Je } from "./accounts.vue_vue_type_script_setup_true_lang-C1ytlcgv.js";
import { _ as Qe } from "./page-head.vue_vue_type_script_setup_true_lang-DYjFve-W.js";
import { host as ee, loadByTagName as Xe } from "@wippy-fe/proxy";
import { a as R, e as j, u as Le, b as et, s as se, r as Pe, p as tt, c as ve, d as nt, f as at } from "./presentation-JHHKyan-.js";
const it = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, rt = ["disabled"], st = { class: "ac-card-head" }, ot = { class: "ac-muted" }, lt = { class: "ac-field" }, ut = { class: "ac-seg" }, ct = {
  key: 0,
  class: "ac-field"
}, dt = {
  key: 1,
  class: "ac-muted"
}, pt = { class: "ac-field" }, ft = { class: "ac-field" }, mt = { class: "ac-row-fields" }, ht = { class: "ac-field" }, vt = ["placeholder"], bt = { class: "ac-field" }, gt = ["placeholder"], yt = { class: "ac-field" }, kt = { class: "ac-row-fields" }, $t = { class: "ac-field" }, xt = { class: "ac-field" }, wt = ["placeholder"], Ct = {
  key: 2,
  class: "ac-field"
}, _t = { class: "ac-checks" }, It = ["value"], St = { class: "ac-field" }, Dt = { class: "ac-dialog-foot" }, Bt = ["disabled"], At = {
  key: 3,
  class: "kx-err"
}, Lt = /* @__PURE__ */ J({
  __name: "image-form",
  props: {
    edit: {},
    capabilities: {}
  },
  emits: ["saved", "cancel", "busy"],
  setup(t, { emit: e }) {
    const n = t, a = e, c = he();
    function i(l = c.value.default_image.settings) {
      return l ? {
        ref: "",
        mode: "pull",
        dockerfile: "",
        label: "",
        home: c.value.default_image.home,
        ...l,
        extra_args: [...l.extra_args],
        allows: [...l.allows],
        extra: ""
      } : null;
    }
    const o = $(i()), p = $(!1);
    Y(() => o.value?.ref, (l) => {
      o.value && !n.edit && !p.value && l !== void 0 && (o.value.label = l);
    });
    const h = $(!1), b = $("");
    Y(() => n.edit, (l) => {
      if (b.value = "", p.value = !!l, !l) {
        o.value = i();
        return;
      }
      if (!l.settings) {
        o.value = null;
        return;
      }
      const r = l.settings;
      o.value = {
        ...r,
        ref: l.image.ref,
        label: l.image.label,
        home: l.image.home,
        mode: l.dockerfile ? "build" : "pull",
        dockerfile: l.dockerfile ?? "",
        extra: r.extra_args.join(`
`),
        allows: [...r.allows]
      };
    }, { immediate: !0 });
    function S() {
      const l = c.value.default_image;
      p.value = !0;
      const r = i();
      o.value = r ? { ...r, ref: l.ref, label: l.label, home: l.home, mode: "build", dockerfile: l.dockerfile } : null;
    }
    function C() {
      const l = o.value;
      if (!l) throw new Error("Image settings are unavailable.");
      return {
        label: l.label,
        home: l.home,
        memory: l.memory,
        cpus: l.cpus,
        pids_limit: Number(l.pids_limit) || 0,
        gpus: l.gpus,
        network: l.network,
        extra_args: l.extra.split(`
`).map((r) => r.trim()).filter(Boolean),
        allows: [...l.allows]
      };
    }
    async function v() {
      if (!(!o.value || h.value)) {
        b.value = "", h.value = !0, a("busy", !0);
        try {
          let l;
          if (n.edit) {
            const r = await R.updateImage(n.edit.image.id, { ...C(), ref: o.value.ref, dockerfile: o.value.mode === "build" ? o.value.dockerfile : "" });
            r.build_error && (l = `Settings saved. Build preparation has not started: ${r.build_error.message}. Use Prepare image to retry.`);
          } else {
            const r = o.value, f = await R.createImage({ ...C(), ref: r.ref, dockerfile: r.mode === "build" ? r.dockerfile : "" });
            f.build_error && (l = `Image created. Build preparation has not started: ${f.build_error.message}. Use Prepare image to retry.`), o.value = i();
          }
          a("saved", l);
        } catch (l) {
          b.value = j(l, "Could not save the image.");
        } finally {
          h.value = !1, a("busy", !1);
        }
      }
    }
    return (l, r) => o.value ? (u(), d("fieldset", {
      key: 1,
      class: "ac-form",
      disabled: h.value
    }, [
      s("div", st, [
        s("span", ot, w(t.edit ? "Container settings" : "Use an image reference or the default agent recipe."), 1),
        t.edit ? g("", !0) : (u(), d("button", {
          key: 0,
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: S
        }, [
          P(y(U), { icon: "tabler:sparkles" }),
          r[15] || (r[15] = V(" Default agent image", -1))
        ]))
      ]),
      s("label", lt, [
        r[16] || (r[16] = s("span", null, "Image reference", -1)),
        F(s("input", {
          "onUpdate:modelValue": r[0] || (r[0] = (f) => o.value.ref = f),
          class: "ac-mono kx-focus-halo",
          placeholder: "registry/name:tag"
        }, null, 512), [
          [z, o.value.ref]
        ])
      ]),
      s("div", ut, [
        s("button", {
          type: "button",
          class: Q(["kx-focus-outline", { active: o.value.mode === "pull" }]),
          onClick: r[1] || (r[1] = (f) => o.value.mode = "pull")
        }, "Use or pull existing", 2),
        s("button", {
          type: "button",
          class: Q(["kx-focus-outline", { active: o.value.mode === "build" }]),
          onClick: r[2] || (r[2] = (f) => o.value.mode = "build")
        }, "Build from Dockerfile", 2)
      ]),
      o.value.mode === "build" ? (u(), d("label", ct, [
        r[17] || (r[17] = s("span", null, "Dockerfile", -1)),
        F(s("textarea", {
          "onUpdate:modelValue": r[3] || (r[3] = (f) => o.value.dockerfile = f),
          rows: "9",
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [z, o.value.dockerfile]
        ]),
        r[18] || (r[18] = Ke('<small class="ac-hint">Include <code>sh</code>, <code>git</code>, <code>mkdir</code>, <code>dirname</code>, a <code>timeout</code> that supports <code>-k</code>, and the agent CLIs. The image user needs writable home and work directories.</small>', 1))
      ])) : g("", !0),
      t.edit ? (u(), d("p", dt, "Saving container settings prepares the image automatically.")) : g("", !0),
      s("label", pt, [
        r[19] || (r[19] = s("span", null, "Label", -1)),
        F(s("input", {
          "onUpdate:modelValue": r[4] || (r[4] = (f) => o.value.label = f),
          class: "kx-focus-halo",
          onInput: r[5] || (r[5] = (f) => p.value = !0)
        }, null, 544), [
          [z, o.value.label]
        ])
      ]),
      s("label", ft, [
        r[20] || (r[20] = s("span", null, "Home directory in the image", -1)),
        F(s("input", {
          "onUpdate:modelValue": r[6] || (r[6] = (f) => o.value.home = f),
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [z, o.value.home]
        ])
      ]),
      s("div", mt, [
        s("label", ht, [
          r[21] || (r[21] = s("span", null, "Memory", -1)),
          F(s("input", {
            "onUpdate:modelValue": r[7] || (r[7] = (f) => o.value.memory = f),
            class: "ac-mono kx-focus-halo",
            placeholder: y(c).default_image.settings?.memory
          }, null, 8, vt), [
            [z, o.value.memory]
          ])
        ]),
        s("label", bt, [
          r[22] || (r[22] = s("span", null, "CPUs", -1)),
          F(s("input", {
            "onUpdate:modelValue": r[8] || (r[8] = (f) => o.value.cpus = f),
            class: "ac-mono kx-focus-halo",
            placeholder: y(c).default_image.settings?.cpus
          }, null, 8, gt), [
            [z, o.value.cpus]
          ])
        ]),
        s("label", yt, [
          r[23] || (r[23] = s("span", null, "PIDs limit", -1)),
          F(s("input", {
            "onUpdate:modelValue": r[9] || (r[9] = (f) => o.value.pids_limit = f),
            type: "number",
            min: "0",
            class: "ac-mono kx-focus-halo"
          }, null, 512), [
            [
              z,
              o.value.pids_limit,
              void 0,
              { number: !0 }
            ]
          ])
        ])
      ]),
      s("div", kt, [
        s("label", $t, [
          r[24] || (r[24] = s("span", null, "GPUs", -1)),
          F(s("input", {
            "onUpdate:modelValue": r[10] || (r[10] = (f) => o.value.gpus = f),
            class: "ac-mono kx-focus-halo",
            placeholder: "all, or device=0"
          }, null, 512), [
            [z, o.value.gpus]
          ])
        ]),
        s("label", xt, [
          r[25] || (r[25] = s("span", null, "Network", -1)),
          F(s("input", {
            "onUpdate:modelValue": r[11] || (r[11] = (f) => o.value.network = f),
            class: "ac-mono kx-focus-halo",
            placeholder: y(c).default_image.settings?.network
          }, null, 8, wt), [
            [z, o.value.network]
          ])
        ])
      ]),
      t.capabilities?.length ? (u(), d("div", Ct, [
        r[26] || (r[26] = s("span", null, "Agents may", -1)),
        s("div", _t, [
          (u(!0), d(O, null, K(t.capabilities, (f) => (u(), d("label", {
            key: f,
            class: "ac-check ac-mono"
          }, [
            F(s("input", {
              "onUpdate:modelValue": r[12] || (r[12] = (m) => o.value.allows = m),
              type: "checkbox",
              class: "kx-focus-outline",
              value: f
            }, null, 8, It), [
              [qe, o.value.allows]
            ]),
            V(" " + w(f), 1)
          ]))), 128))
        ])
      ])) : g("", !0),
      s("label", St, [
        r[27] || (r[27] = s("span", null, "Extra Docker arguments", -1)),
        F(s("textarea", {
          "onUpdate:modelValue": r[13] || (r[13] = (f) => o.value.extra = f),
          rows: "3",
          class: "ac-mono kx-focus-halo",
          placeholder: `One argument per line, e.g.
--add-host
host.docker.internal:host-gateway`
        }, null, 512), [
          [z, o.value.extra]
        ])
      ]),
      r[28] || (r[28] = s("p", { class: "ac-hint" }, [
        s("a", {
          class: "ac-link kx-focus-outline",
          href: "https://github.com/kicksideai/chestor/blob/main/autocode/docs/docker-options.md#settings-limits-and-docker-warnings",
          target: "_blank",
          rel: "noopener noreferrer"
        }, "Container limits and isolation")
      ], -1)),
      s("footer", Dt, [
        s("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: r[14] || (r[14] = (f) => a("cancel"))
        }, "Cancel"),
        s("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: h.value || !t.capabilities || !o.value.ref,
          onClick: v
        }, [
          P(y(U), { icon: "tabler:box" }),
          V(" " + w(h.value ? "Saving…" : t.edit ? "Save settings" : o.value.mode === "build" ? "Build image" : "Add image"), 1)
        ], 8, Bt)
      ]),
      b.value ? (u(), d("p", At, w(b.value), 1)) : g("", !0)
    ], 8, rt)) : (u(), d("p", it, w(t.edit ? "Image settings are unavailable." : "Image defaults are unavailable.") + " Ask an administrator to update the image configuration.", 1));
  }
}), Pt = { class: "ac-stack" }, Mt = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Vt = {
  key: 1,
  class: "kx-loading"
}, Tt = {
  key: 2,
  class: "kx-empty"
}, Ut = { class: "kx-empty-ico" }, Et = {
  key: 3,
  class: "kx-empty"
}, Nt = { class: "ac-list ac-resource-list" }, Ft = { class: "ac-resource-icon" }, Rt = { class: "ac-account-main" }, jt = { class: "ac-row-title" }, Ot = {
  key: 0,
  class: "kx-tag-sm ac-tone ready"
}, zt = { class: "ac-muted ac-mono" }, Kt = { class: "ac-chips" }, qt = { class: "ac-muted" }, Gt = {
  key: 0,
  class: "kx-err ac-small"
}, Wt = { class: "ac-row-actions" }, Ht = ["disabled", "onClick"], Zt = ["onClick"], Yt = ["onClick"], Jt = ["onClick"], Qt = { class: "ac-form" }, Xt = { class: "ac-mono" }, en = { class: "ac-pre ac-build-log" }, tn = /* @__PURE__ */ J({
  __name: "images",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(t, { expose: e, emit: n }) {
    const a = he(), c = t, i = n, o = $(!1), p = $(!1), h = $({});
    e({ open: ge });
    const b = $([]), S = $([]), C = $(""), v = $(null), l = $(null), r = q(() => [...new Set(a.value.agents.flatMap((D) => D.capabilities))].sort()), f = $(!1);
    let m = !0, k = 0, _ = 0, T = 0;
    Ge(() => {
      m = !1, k++, _++;
    });
    async function G(D) {
      const L = k, x = await R.image(D);
      !m || L !== k || l.value?.id !== D || (l.value = { id: D, ref: x.image.ref, text: x.build_log || "(empty)" });
    }
    const A = se(async () => {
      try {
        const D = await Pe(R.images, (L) => L.map((x) => x.id), S, () => m, (L) => {
          b.value = L, f.value = !0, C.value = "";
        }, () => {
          A();
        });
        if (!m) return;
        b.value = D, I(D, ++T), l.value && D.some((L) => L.id === l.value?.id) && await G(l.value.id), f.value = !0, C.value = "";
      } catch (D) {
        C.value = j(D, "Could not load images.");
      }
    });
    async function I(D, L) {
      try {
        const x = await tt([...new Set(D.map((N) => N.owner_user_id))]);
        if (!m || L !== T) return;
        h.value = Object.fromEntries(D.map((N) => [N.id, `Owner: ${x[N.owner_user_id] || N.owner_user_id}`]));
      } catch (x) {
        m && L === T && (C.value = j(x, "Could not load image owners."));
      }
    }
    Le(() => S.value, () => {
      A();
    }), re(A);
    async function B(D, L) {
      C.value = "";
      try {
        await D(), await A();
      } catch (x) {
        C.value = j(x, L);
      }
    }
    async function W(D) {
      const L = ++_;
      C.value = "";
      try {
        const x = await R.image(D.id);
        m && L === _ && (v.value = x);
      } catch (x) {
        m && L === _ && (C.value = j(x, "Could not load the image settings."));
      }
    }
    function Z() {
      _++, o.value = !1, v.value = null;
    }
    function ge() {
      Z(), o.value = !0;
    }
    const Ne = (D) => B(() => R.prepareImage(D.id), "Could not start the image preparation.");
    function Fe(D) {
      k++, l.value = { id: D.id, ref: D.ref, text: "Loading…" }, A();
    }
    function ye() {
      k++, l.value = null;
    }
    async function Re(D) {
      Z(), await A(), D && (C.value = D);
    }
    async function je(D) {
      if (!await ee.confirm({
        header: "Delete image",
        message: `Delete image "${D.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) return;
      const x = await ee.confirm({
        header: "Docker image",
        message: `Also remove ${D.ref} from Docker on the host? Keeping it lets a later image with the same reference reuse it.`,
        icon: "tabler:brand-docker",
        acceptLabel: "Remove from Docker",
        rejectLabel: "Keep in Docker",
        acceptClass: "p-button-danger"
      });
      _++, v.value?.image.id === D.id && Z(), l.value?.id === D.id && ye(), C.value = "";
      try {
        await R.deleteImage(D.id, x), await A();
      } catch (N) {
        C.value = j(N, "Could not delete the image.");
      }
    }
    const ke = q(() => b.value.filter((D) => [D.label, D.ref, ...D.agents].join(" ").toLowerCase().includes(c.query.toLowerCase())));
    return Y(b, (D) => i("count", D.length)), (D, L) => (u(), d("div", Pt, [
      L[7] || (L[7] = s("p", { class: "ac-hint" }, "Ready means preparation finished. Usable means you can run tasks with the image. Share ready images to make them available to others.", -1)),
      C.value ? (u(), d("p", Mt, [
        V(w(C.value) + " ", 1),
        s("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: L[0] || (L[0] = //@ts-ignore
          (...x) => y(A) && y(A)(...x))
        }, "Retry")
      ])) : g("", !0),
      !f.value && !C.value ? (u(), d("div", Vt, "Loading images…")) : g("", !0),
      f.value && !b.value.length ? (u(), d("div", Tt, [
        s("div", Ut, [
          P(y(U), { icon: "tabler:box" })
        ]),
        L[4] || (L[4] = s("div", { class: "kx-empty-title" }, "No images yet", -1)),
        L[5] || (L[5] = s("div", { class: "kx-empty-sub" }, "Start with the default agent recipe or use an existing image.", -1)),
        s("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: ge
        }, "Add image")
      ])) : f.value && !ke.value.length ? (u(), d("div", Et, [...L[6] || (L[6] = [
        s("div", { class: "kx-empty-title" }, "No matches", -1),
        s("div", { class: "kx-empty-sub" }, "Try another image, reference or agent.", -1)
      ])])) : g("", !0),
      s("ul", Nt, [
        (u(!0), d(O, null, K(ke.value, (x) => (u(), d("li", {
          key: x.id,
          class: "ac-row ac-resource"
        }, [
          s("span", Ft, [
            P(y(U), { icon: "tabler:box" })
          ]),
          s("div", Rt, [
            s("div", jt, [
              V(w(x.label), 1),
              s("span", {
                class: Q(["kx-tag-sm ac-tone", x.status])
              }, w(x.status === "unprepared" ? "Needs preparation" : x.status.charAt(0).toUpperCase() + x.status.slice(1)), 3),
              x.usable ? (u(), d("span", Ot, "Usable")) : g("", !0)
            ]),
            s("div", zt, w(x.ref) + " · " + w(x.home), 1),
            s("div", Kt, [
              (u(!0), d(O, null, K(x.agents, (N) => (u(), d("span", {
                key: N,
                class: "kx-tag-sm ac-tone"
              }, [
                P(y(U), {
                  icon: y(et)(N, y(a).agents)
                }, null, 8, ["icon"]),
                V(w(N), 1)
              ]))), 128))
            ]),
            s("div", qt, w(h.value[x.id]), 1),
            x.last_error ? (u(), d("div", Gt, w(x.last_error), 1)) : g("", !0)
          ]),
          s("div", Wt, [
            x.shareable ? (u(), M(Ae, {
              key: 0,
              id: x.id,
              title: x.label
            }, null, 8, ["id", "title"])) : g("", !0),
            x.writable ? (u(), d("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Prepare image",
              "aria-label": "Prepare image",
              disabled: x.status === "preparing",
              onClick: (N) => Ne(x)
            }, [
              P(y(U), { icon: "tabler:refresh" })
            ], 8, Ht)) : g("", !0),
            s("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Build log",
              "aria-label": "Build log",
              onClick: (N) => Fe(x)
            }, [
              P(y(U), { icon: "tabler:file-text" })
            ], 8, Zt),
            x.writable ? (u(), d("button", {
              key: 2,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Edit settings",
              "aria-label": "Edit settings",
              onClick: (N) => W(x)
            }, [
              P(y(U), { icon: "tabler:pencil" })
            ], 8, Yt)) : g("", !0),
            x.deletable ? (u(), d("button", {
              key: 3,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete image",
              "aria-label": "Delete image",
              onClick: (N) => je(x)
            }, [
              P(y(U), { icon: "tabler:trash" })
            ], 8, Jt)) : g("", !0)
          ])
        ]))), 128))
      ]),
      o.value || v.value ? (u(), M(le, {
        key: 4,
        title: v.value ? "Edit image" : "Add image",
        busy: p.value,
        wide: "",
        onClose: L[3] || (L[3] = (x) => Z())
      }, {
        default: oe(() => [
          P(Lt, {
            onBusy: L[1] || (L[1] = (x) => p.value = x),
            edit: v.value,
            capabilities: r.value,
            onSaved: Re,
            onCancel: L[2] || (L[2] = (x) => Z())
          }, null, 8, ["edit", "capabilities"])
        ]),
        _: 1
      }, 8, ["title", "busy"])) : g("", !0),
      l.value ? (u(), M(le, {
        key: 5,
        title: "Build log",
        wide: "",
        onClose: ye
      }, {
        default: oe(() => [
          s("div", Qt, [
            s("strong", Xt, w(l.value.ref), 1),
            s("pre", en, w(l.value.text), 1)
          ])
        ]),
        _: 1
      })) : g("", !0)
    ]));
  }
}), nn = { class: "ac-stack" }, an = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, rn = {
  key: 1,
  class: "kx-loading"
}, sn = {
  key: 2,
  class: "ac-chips"
}, on = {
  key: 3,
  class: "kx-empty"
}, ln = { class: "kx-empty-ico" }, un = {
  key: 4,
  class: "kx-empty"
}, cn = { class: "ac-list ac-resource-list" }, dn = { class: "ac-resource-icon" }, pn = { class: "ac-account-main" }, fn = { class: "ac-row-title" }, mn = { class: "kx-tag-sm ac-tone" }, hn = {
  key: 0,
  class: "ac-muted"
}, vn = { class: "ac-mono" }, bn = {
  key: 1,
  class: "ac-muted ac-mono"
}, gn = { class: "ac-row-actions" }, yn = ["onClick"], kn = ["disabled"], $n = {
  key: 0,
  class: "ac-muted"
}, xn = {
  key: 1,
  class: "ac-field"
}, wn = { class: "ac-chips" }, Cn = ["onClick"], _n = { class: "ac-field" }, In = { class: "ac-field" }, Sn = ["placeholder"], Dn = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Bn = { class: "ac-dialog-foot" }, An = ["disabled"], Ln = ["disabled"], Pn = /* @__PURE__ */ J({
  __name: "workspaces",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(t, { expose: e, emit: n }) {
    const a = ve(), c = $([]), i = t, o = n, p = $(!1);
    e({ open: () => {
      p.value = !0;
    } });
    const h = $([]), b = $([]), S = $(""), C = $(!1), v = $(""), l = $(!1), r = $(""), f = $(!1);
    function m(A) {
      return A.replace(/\/+$/, "") + "/";
    }
    Y([p, b], () => {
      p.value && !r.value && b.value.length && (r.value = m(b.value[0]));
    }), Y(r, (A) => {
      l.value || (v.value = A.trim().split("/").filter(Boolean).pop() ?? "");
    });
    const k = se(async () => {
      try {
        await Pe(R.workspaces, (A) => A.workspaces.map((I) => I.id), c, a, (A) => {
          h.value = A.workspaces, b.value = A.roots ?? [], f.value = !0, S.value = "";
        }, () => {
          k();
        });
      } catch (A) {
        a() && (S.value = j(A, "Could not load workspaces."));
      }
    }, a);
    Le(() => c.value, () => {
      k();
    }), re(k);
    async function _() {
      S.value = "", C.value = !0;
      try {
        if (await R.createWorkspace({ name: v.value, host_path: r.value }), !a()) return;
        l.value = !1, v.value = "", r.value = "", p.value = !1, await k();
      } catch (A) {
        a() && (S.value = j(A, "Could not save the workspace."));
      } finally {
        a() && (C.value = !1);
      }
    }
    async function T(A) {
      const I = await ee.confirm({
        header: "Delete workspace",
        message: `Delete workspace "${A.name}"? The host directory stays untouched.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      });
      if (!(!a() || !I)) {
        S.value = "";
        try {
          await R.deleteWorkspace(A.id), await k();
        } catch (B) {
          a() && (S.value = j(B, "Could not delete the workspace."));
        }
      }
    }
    const G = q(() => h.value.filter((A) => [A.name, A.host_path].join(" ").toLowerCase().includes(i.query.toLowerCase())));
    return Y(h, (A) => {
      o("count", A.length);
    }), (A, I) => (u(), d("div", nn, [
      I[15] || (I[15] = s("p", { class: "ac-hint" }, "Tasks use shared workspaces with the access you grant.", -1)),
      S.value && !p.value ? (u(), d("p", an, [
        V(w(S.value) + " ", 1),
        s("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: I[0] || (I[0] = //@ts-ignore
          (...B) => y(k) && y(k)(...B))
        }, "Retry")
      ])) : g("", !0),
      !f.value && !S.value ? (u(), d("div", rn, "Loading workspaces…")) : g("", !0),
      b.value.length ? (u(), d("div", sn, [
        I[7] || (I[7] = s("span", { class: "ac-muted" }, "Allowed roots", -1)),
        (u(!0), d(O, null, K(b.value, (B) => (u(), d("span", {
          key: B,
          class: "ac-hint-chip ac-mono"
        }, w(B), 1))), 128))
      ])) : g("", !0),
      f.value && !h.value.length ? (u(), d("div", on, [
        s("div", ln, [
          P(y(U), { icon: "tabler:folder" })
        ]),
        I[8] || (I[8] = s("div", { class: "kx-empty-title" }, "No workspaces yet", -1)),
        I[9] || (I[9] = s("div", { class: "kx-empty-sub" }, "Add a host directory, or let tasks use a scratch directory.", -1)),
        s("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: I[1] || (I[1] = (B) => p.value = !0)
        }, "Add workspace")
      ])) : f.value && !G.value.length ? (u(), d("div", un, [...I[10] || (I[10] = [
        s("div", { class: "kx-empty-title" }, "No matches", -1),
        s("div", { class: "kx-empty-sub" }, "Try another workspace name or path.", -1)
      ])])) : g("", !0),
      s("ul", cn, [
        (u(!0), d(O, null, K(G.value, (B) => (u(), d("li", {
          key: B.id,
          class: "ac-row ac-resource"
        }, [
          s("span", dn, [
            P(y(U), { icon: "tabler:folder" })
          ]),
          s("div", pn, [
            s("div", fn, [
              V(w(B.name), 1),
              s("span", mn, w(B.writable ? "read-write" : "read-only"), 1)
            ]),
            B.unavailable_reason ? (u(), d("div", hn, w(B.unavailable_reason), 1)) : g("", !0),
            (u(!0), d(O, null, K(B.conflicts, (W) => (u(), d("div", {
              key: W.id,
              class: "ac-muted"
            }, [
              V("Conflicts with " + w(W.id) + ": ", 1),
              s("span", vn, w(W.host_path), 1)
            ]))), 128)),
            B.host_path ? (u(), d("div", bn, w(B.host_path), 1)) : g("", !0)
          ]),
          s("div", gn, [
            B.shareable ? (u(), M(Ae, {
              key: 0,
              id: B.id,
              title: B.name
            }, null, 8, ["id", "title"])) : g("", !0),
            B.deletable ? (u(), d("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete workspace",
              "aria-label": "Delete workspace",
              onClick: (W) => T(B)
            }, [
              P(y(U), { icon: "tabler:trash" })
            ], 8, yn)) : g("", !0)
          ])
        ]))), 128))
      ]),
      p.value ? (u(), M(le, {
        key: 5,
        title: "Add workspace",
        busy: C.value,
        onClose: I[6] || (I[6] = (B) => p.value = !1)
      }, {
        default: oe(() => [
          s("fieldset", {
            class: "ac-form",
            disabled: C.value
          }, [
            b.value.length ? (u(), d("div", xn, [
              I[11] || (I[11] = s("span", null, "Allowed roots", -1)),
              s("div", wn, [
                (u(!0), d(O, null, K(b.value, (B) => (u(), d("button", {
                  key: B,
                  type: "button",
                  class: "ac-chip ac-mono kx-focus-halo",
                  title: "Start from this root",
                  onClick: (W) => r.value = m(B)
                }, w(B), 9, Cn))), 128))
              ])
            ])) : (u(), d("p", $n, "The host administrator configures allowed workspace roots.")),
            s("label", _n, [
              I[12] || (I[12] = s("span", null, "Name", -1)),
              F(s("input", {
                "onUpdate:modelValue": I[2] || (I[2] = (B) => v.value = B),
                onInput: I[3] || (I[3] = (B) => l.value = !0),
                autofocus: "",
                class: "kx-focus-halo",
                placeholder: "e.g. Kickside checkout"
              }, null, 544), [
                [z, v.value]
              ])
            ]),
            s("label", In, [
              I[13] || (I[13] = s("span", null, "Host directory", -1)),
              F(s("input", {
                "onUpdate:modelValue": I[4] || (I[4] = (B) => r.value = B),
                class: "ac-mono kx-focus-halo",
                placeholder: (b.value[0] ?? "/srv/work") + "/project"
              }, null, 8, Sn), [
                [z, r.value]
              ]),
              I[14] || (I[14] = s("small", { class: "ac-hint" }, [
                V("An existing directory, mounted at "),
                s("code", null, "/workspace"),
                V(".")
              ], -1))
            ]),
            S.value ? (u(), d("p", Dn, w(S.value), 1)) : g("", !0),
            s("footer", Bn, [
              s("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                disabled: C.value,
                onClick: I[5] || (I[5] = (B) => p.value = !1)
              }, "Cancel", 8, An),
              s("button", {
                type: "button",
                class: "ac-btn primary kx-focus-halo",
                disabled: C.value || !v.value.trim() || !r.value.trim(),
                onClick: _
              }, [
                P(y(U), { icon: "tabler:folder-plus" }),
                V(w(C.value ? "Saving…" : "Add workspace"), 1)
              ], 8, Ln)
            ])
          ], 8, kn)
        ]),
        _: 1
      }, 8, ["busy"])) : g("", !0)
    ]));
  }
}), Mn = { class: "ac-card ac-narrow" }, Vn = { class: "ac-card-head" }, Tn = { class: "ac-card-title" }, Un = ["disabled"], En = { class: "ac-hint" }, Nn = {
  key: 0,
  class: "kx-err"
}, Fn = {
  key: 1,
  class: "ac-pre"
}, Rn = /* @__PURE__ */ J({
  __name: "maintenance",
  setup(t) {
    const e = he(), n = $(!1), a = $(""), c = $("");
    async function i() {
      if (await ee.confirm({
        header: "Clean up Docker",
        message: `Prune stopped Autocode containers, unused images and build cache older than ${e.value.build_cache_retention} across this Docker host? Other modules may use the shared image cache.`,
        icon: "tabler:trash-x",
        acceptLabel: "Clean up",
        rejectLabel: "Cancel"
      })) {
        c.value = "", n.value = !0;
        try {
          a.value = await R.prune();
        } catch (p) {
          c.value = j(p, "Cleanup failed.");
        } finally {
          n.value = !1;
        }
      }
    }
    return (o, p) => (u(), d("section", Mn, [
      s("div", Vn, [
        s("h2", Tn, [
          P(y(U), { icon: "tabler:brand-docker" }),
          p[0] || (p[0] = V("Docker cleanup", -1))
        ]),
        s("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          disabled: n.value,
          onClick: i
        }, [
          P(y(U), {
            icon: n.value ? "tabler:loader-2" : "tabler:trash-x",
            class: Q({ spin: n.value })
          }, null, 8, ["icon", "class"]),
          V(" " + w(n.value ? "Cleaning…" : "Clean up Docker"), 1)
        ], 8, Un)
      ]),
      s("p", En, "Remove stopped Autocode containers and dangling images. Cleanup keeps unused build cache younger than " + w(y(e).build_cache_retention) + ". Tagged images stay.", 1),
      c.value ? (u(), d("p", Nn, w(c.value), 1)) : g("", !0),
      a.value ? (u(), d("pre", Fn, w(a.value), 1)) : g("", !0)
    ]));
  }
});
var Me = {
  name: "AngleDownIcon",
  extends: me
};
function jn(t) {
  return qn(t) || Kn(t) || zn(t) || On();
}
function On() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function zn(t, e) {
  if (t) {
    if (typeof t == "string") return ue(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ue(t, e) : void 0;
  }
}
function Kn(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function qn(t) {
  if (Array.isArray(t)) return ue(t);
}
function ue(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, a = Array(e); n < e; n++) a[n] = t[n];
  return a;
}
function Gn(t, e, n, a, c, i) {
  return u(), d("svg", E({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), jn(e[0] || (e[0] = [s("path", {
    d: "M3.58659 4.5007C3.68513 4.50023 3.78277 4.51945 3.87379 4.55723C3.9648 4.59501 4.04735 4.65058 4.11659 4.7207L7.11659 7.7207L10.1166 4.7207C10.2619 4.65055 10.4259 4.62911 10.5843 4.65956C10.7427 4.69002 10.8871 4.77074 10.996 4.88976C11.1049 5.00877 11.1726 5.15973 11.1889 5.32022C11.2052 5.48072 11.1693 5.6422 11.0866 5.7807L7.58659 9.2807C7.44597 9.42115 7.25534 9.50004 7.05659 9.50004C6.85784 9.50004 6.66722 9.42115 6.52659 9.2807L3.02659 5.7807C2.88614 5.64007 2.80725 5.44945 2.80725 5.2507C2.80725 5.05195 2.88614 4.86132 3.02659 4.7207C3.09932 4.64685 3.18675 4.58911 3.28322 4.55121C3.37969 4.51331 3.48305 4.4961 3.58659 4.5007Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Me.render = Gn;
var Ve = {
  name: "AngleUpIcon",
  extends: me
};
function Wn(t) {
  return Jn(t) || Yn(t) || Zn(t) || Hn();
}
function Hn() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Zn(t, e) {
  if (t) {
    if (typeof t == "string") return ce(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ce(t, e) : void 0;
  }
}
function Yn(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Jn(t) {
  if (Array.isArray(t)) return ce(t);
}
function ce(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, a = Array(e); n < e; n++) a[n] = t[n];
  return a;
}
function Qn(t, e, n, a, c, i) {
  return u(), d("svg", E({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), Wn(e[0] || (e[0] = [s("path", {
    d: "M10.4134 9.49931C10.3148 9.49977 10.2172 9.48055 10.1262 9.44278C10.0352 9.405 9.95263 9.34942 9.88338 9.27931L6.88338 6.27931L3.88338 9.27931C3.73811 9.34946 3.57409 9.3709 3.41567 9.34044C3.25724 9.30999 3.11286 9.22926 3.00395 9.11025C2.89504 8.99124 2.82741 8.84028 2.8111 8.67978C2.79478 8.51928 2.83065 8.35781 2.91338 8.21931L6.41338 4.71931C6.55401 4.57886 6.74463 4.49997 6.94338 4.49997C7.14213 4.49997 7.33276 4.57886 7.47338 4.71931L10.9734 8.21931C11.1138 8.35994 11.1927 8.55056 11.1927 8.74931C11.1927 8.94806 11.1138 9.13868 10.9734 9.27931C10.9007 9.35315 10.8132 9.41089 10.7168 9.44879C10.6203 9.48669 10.5169 9.5039 10.4134 9.49931Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Ve.render = Qn;
var Te = {
  name: "TimesIcon",
  extends: me
};
function Xn(t) {
  return aa(t) || na(t) || ta(t) || ea();
}
function ea() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ta(t, e) {
  if (t) {
    if (typeof t == "string") return de(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? de(t, e) : void 0;
  }
}
function na(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function aa(t) {
  if (Array.isArray(t)) return de(t);
}
function de(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, a = Array(e); n < e; n++) a[n] = t[n];
  return a;
}
function ia(t, e, n, a, c, i) {
  return u(), d("svg", E({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), Xn(e[0] || (e[0] = [s("path", {
    d: "M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Te.render = ia;
var Ue = {
  name: "BaseInput",
  extends: Ye,
  props: {
    size: {
      type: String,
      default: null
    },
    fluid: {
      type: Boolean,
      default: null
    },
    variant: {
      type: String,
      default: null
    }
  },
  inject: {
    $parentInstance: {
      default: void 0
    },
    $pcFluid: {
      default: void 0
    }
  },
  computed: {
    $variant: function() {
      var e;
      return (e = this.variant) !== null && e !== void 0 ? e : this.$primevue.config.inputStyle || this.$primevue.config.inputVariant;
    },
    $fluid: function() {
      var e;
      return (e = this.fluid) !== null && e !== void 0 ? e : !!this.$pcFluid;
    },
    // @deprecated use $fluid instead
    hasFluid: function() {
      return this.$fluid;
    }
  }
}, ra = `
    .p-inputtext {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('inputtext.color');
        background: dt('inputtext.background');
        padding-block: dt('inputtext.padding.y');
        padding-inline: dt('inputtext.padding.x');
        border: 1px solid dt('inputtext.border.color');
        transition:
            background dt('inputtext.transition.duration'),
            color dt('inputtext.transition.duration'),
            border-color dt('inputtext.transition.duration'),
            outline-color dt('inputtext.transition.duration'),
            box-shadow dt('inputtext.transition.duration');
        appearance: none;
        border-radius: dt('inputtext.border.radius');
        outline-color: transparent;
        box-shadow: dt('inputtext.shadow');
    }

    .p-inputtext:enabled:hover {
        border-color: dt('inputtext.hover.border.color');
    }

    .p-inputtext:enabled:focus {
        border-color: dt('inputtext.focus.border.color');
        box-shadow: dt('inputtext.focus.ring.shadow');
        outline: dt('inputtext.focus.ring.width') dt('inputtext.focus.ring.style') dt('inputtext.focus.ring.color');
        outline-offset: dt('inputtext.focus.ring.offset');
    }

    .p-inputtext.p-invalid {
        border-color: dt('inputtext.invalid.border.color');
    }

    .p-inputtext.p-variant-filled {
        background: dt('inputtext.filled.background');
    }

    .p-inputtext.p-variant-filled:enabled:hover {
        background: dt('inputtext.filled.hover.background');
    }

    .p-inputtext.p-variant-filled:enabled:focus {
        background: dt('inputtext.filled.focus.background');
    }

    .p-inputtext:disabled {
        opacity: 1;
        background: dt('inputtext.disabled.background');
        color: dt('inputtext.disabled.color');
    }

    .p-inputtext::placeholder {
        color: dt('inputtext.placeholder.color');
    }

    .p-inputtext.p-invalid::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }

    .p-inputtext-sm {
        font-size: dt('inputtext.sm.font.size');
        padding-block: dt('inputtext.sm.padding.y');
        padding-inline: dt('inputtext.sm.padding.x');
    }

    .p-inputtext-lg {
        font-size: dt('inputtext.lg.font.size');
        padding-block: dt('inputtext.lg.padding.y');
        padding-inline: dt('inputtext.lg.padding.x');
    }

    .p-inputtext-fluid {
        width: 100%;
    }
`, sa = {
  root: function(e) {
    var n = e.instance, a = e.props;
    return ["p-inputtext p-component", {
      "p-filled": n.$filled,
      "p-inputtext-sm p-inputfield-sm": a.size === "small",
      "p-inputtext-lg p-inputfield-lg": a.size === "large",
      "p-invalid": n.$invalid,
      "p-variant-filled": n.$variant === "filled",
      "p-inputtext-fluid": n.$fluid
    }];
  }
}, oa = De.extend({
  name: "inputtext",
  style: ra,
  classes: sa
}), la = {
  name: "BaseInputText",
  extends: Ue,
  style: oa,
  provide: function() {
    return {
      $pcInputText: this,
      $parentInstance: this
    };
  }
};
function te(t) {
  "@babel/helpers - typeof";
  return te = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, te(t);
}
function ua(t, e, n) {
  return (e = ca(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function ca(t) {
  var e = da(t, "string");
  return te(e) == "symbol" ? e : e + "";
}
function da(t, e) {
  if (te(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var a = n.call(t, e);
    if (te(a) != "object") return a;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var be = {
  name: "InputText",
  extends: la,
  inheritAttrs: !1,
  methods: {
    onInput: function(e) {
      this.writeValue(e.target.value, e);
    }
  },
  computed: {
    attrs: function() {
      return E(this.ptmi("root", {
        context: {
          filled: this.$filled,
          disabled: this.disabled
        }
      }), this.formField);
    },
    dataP: function() {
      return Be(ua({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    }
  }
}, pa = ["value", "name", "disabled", "aria-invalid", "data-p"];
function fa(t, e, n, a, c, i) {
  return u(), d("input", E({
    type: "text",
    class: t.cx("root"),
    value: t.d_value,
    name: t.name,
    disabled: t.disabled,
    "aria-invalid": t.$invalid || void 0,
    "data-p": i.dataP,
    onInput: e[0] || (e[0] = function() {
      return i.onInput && i.onInput.apply(i, arguments);
    })
  }, i.attrs), null, 16, pa);
}
be.render = fa;
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
`, ha = {
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
}, va = De.extend({
  name: "inputnumber",
  style: ma,
  classes: ha
}), ba = {
  name: "BaseInputNumber",
  extends: Ue,
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
  style: va,
  provide: function() {
    return {
      $pcInputNumber: this,
      $parentInstance: this
    };
  }
};
function ne(t) {
  "@babel/helpers - typeof";
  return ne = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, ne(t);
}
function Ie(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(t);
    e && (a = a.filter(function(c) {
      return Object.getOwnPropertyDescriptor(t, c).enumerable;
    })), n.push.apply(n, a);
  }
  return n;
}
function Se(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Ie(Object(n), !0).forEach(function(a) {
      pe(t, a, n[a]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Ie(Object(n)).forEach(function(a) {
      Object.defineProperty(t, a, Object.getOwnPropertyDescriptor(n, a));
    });
  }
  return t;
}
function pe(t, e, n) {
  return (e = ga(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function ga(t) {
  var e = ya(t, "string");
  return ne(e) == "symbol" ? e : e + "";
}
function ya(t, e) {
  if (ne(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var a = n.call(t, e);
    if (ne(a) != "object") return a;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function ka(t) {
  return Ca(t) || wa(t) || xa(t) || $a();
}
function $a() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function xa(t, e) {
  if (t) {
    if (typeof t == "string") return fe(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? fe(t, e) : void 0;
  }
}
function wa(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Ca(t) {
  if (Array.isArray(t)) return fe(t);
}
function fe(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, a = Array(e); n < e; n++) a[n] = t[n];
  return a;
}
var Ee = {
  name: "InputNumber",
  extends: ba,
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
      var e = ka(new Intl.NumberFormat(this.locale, {
        useGrouping: !1
      }).format(9876543210)).reverse(), n = new Map(e.map(function(a, c) {
        return [a, c];
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
      var e = new Intl.NumberFormat(this.locale, Se(Se({}, this.getOptions()), {}, {
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
      var c = this;
      if (!this.readonly) {
        var i = n || 500;
        this.clearTimer(), this.timer = setTimeout(function() {
          c.repeat(e, 40, a);
        }, i), this.spin(e, a);
      }
    },
    addWithPrecision: function(e, n) {
      var a = e.toString(), c = n.toString(), i = a.includes(".") ? a.split(".")[1].length : 0, o = c.includes(".") ? c.split(".")[1].length : 0, p = Math.max(i, o), h = Math.pow(10, p);
      return Math.round((e + n) * h) / h;
    },
    spin: function(e, n) {
      if (this.$refs.input) {
        var a = this.step * n, c = this.parseValue(this.$refs.input.$el.value) || 0, i = this.validateValue(this.addWithPrecision(c, a));
        this.updateInput(i, null, "spin"), this.updateModel(e, i), this.handleOnInput(e, c, i);
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
        var n = e.target.selectionStart, a = e.target.selectionEnd, c = a - n, i = e.target.value, o = null, p = e.code || e.key;
        switch (p) {
          case "ArrowUp":
            this.spin(e, 1), e.preventDefault();
            break;
          case "ArrowDown":
            this.spin(e, -1), e.preventDefault();
            break;
          case "ArrowLeft":
            if (c > 1) {
              var h = this.isNumeralChar(i.charAt(n)) ? n + 1 : n + 2;
              this.$refs.input.$el.setSelectionRange(h, h);
            } else this.isNumeralChar(i.charAt(n - 1)) || e.preventDefault();
            break;
          case "ArrowRight":
            if (c > 1) {
              var b = a - 1;
              this.$refs.input.$el.setSelectionRange(b, b);
            } else this.isNumeralChar(i.charAt(n)) || e.preventDefault();
            break;
          case "Tab":
          case "Enter":
          case "NumpadEnter":
            o = this.validateValue(this.parseValue(i)), this.$refs.input.$el.value = this.formatValue(o), this.$refs.input.$el.setAttribute("aria-valuenow", o), this.updateModel(e, o);
            break;
          case "Backspace": {
            if (e.preventDefault(), n === a) {
              n >= i.length && this.suffixChar !== null && (n = i.length - this.suffixChar.length, this.$refs.input.$el.setSelectionRange(n, n));
              var S = i.charAt(n - 1), C = this.getDecimalCharIndexes(i), v = C.decimalCharIndex, l = C.decimalCharIndexWithoutPrefix;
              if (this.isNumeralChar(S)) {
                var r = this.getDecimalLength(i);
                if (this._group.test(S))
                  this._group.lastIndex = 0, o = i.slice(0, n - 2) + i.slice(n - 1);
                else if (this._decimal.test(S))
                  this._decimal.lastIndex = 0, r ? this.$refs.input.$el.setSelectionRange(n - 1, n - 1) : o = i.slice(0, n - 1) + i.slice(n);
                else if (v > 0 && n > v) {
                  var f = this.isDecimalMode() && (this.minFractionDigits || 0) < r ? "" : "0";
                  o = i.slice(0, n - 1) + f + i.slice(n);
                } else l === 1 ? (o = i.slice(0, n - 1) + "0" + i.slice(n), o = this.parseValue(o) > 0 ? o : "") : o = i.slice(0, n - 1) + i.slice(n);
              }
              this.updateValue(e, o, null, "delete-single");
            } else
              o = this.deleteRange(i, n, a), this.updateValue(e, o, null, "delete-range");
            break;
          }
          case "Delete":
            if (e.preventDefault(), n === a) {
              var m = i.charAt(n), k = this.getDecimalCharIndexes(i), _ = k.decimalCharIndex, T = k.decimalCharIndexWithoutPrefix;
              if (this.isNumeralChar(m)) {
                var G = this.getDecimalLength(i);
                if (this._group.test(m))
                  this._group.lastIndex = 0, o = i.slice(0, n) + i.slice(n + 2);
                else if (this._decimal.test(m))
                  this._decimal.lastIndex = 0, G ? this.$refs.input.$el.setSelectionRange(n + 1, n + 1) : o = i.slice(0, n) + i.slice(n + 1);
                else if (_ > 0 && n > _) {
                  var A = this.isDecimalMode() && (this.minFractionDigits || 0) < G ? "" : "0";
                  o = i.slice(0, n) + A + i.slice(n + 1);
                } else T === 1 ? (o = i.slice(0, n) + "0" + i.slice(n + 1), o = this.parseValue(o) > 0 ? o : "") : o = i.slice(0, n) + i.slice(n + 1);
              }
              this.updateValue(e, o, null, "delete-back-single");
            } else
              o = this.deleteRange(i, n, a), this.updateValue(e, o, null, "delete-range");
            break;
          case "Home":
            e.preventDefault(), we(this.min) && this.updateModel(e, this.min);
            break;
          case "End":
            e.preventDefault(), we(this.max) && this.updateModel(e, this.max);
            break;
        }
      }
    },
    onInputKeyPress: function(e) {
      if (!this.readonly) {
        var n = e.key, a = this.isDecimalSign(n), c = this.isMinusSign(n);
        e.code !== "Enter" && e.preventDefault(), (Number(n) >= 0 && Number(n) <= 9 || c || a) && this.insert(e, n, {
          isDecimalSign: a,
          isMinusSign: c
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
      var a = e.replace(this._prefix, "").trim().replace(/\s/g, "").replace(this._currency, ""), c = a.search(this._decimal);
      return this._decimal.lastIndex = 0, {
        decimalCharIndex: n,
        decimalCharIndexWithoutPrefix: c
      };
    },
    getCharIndexes: function(e) {
      var n = e.search(this._decimal);
      this._decimal.lastIndex = 0;
      var a = e.search(this._minusSign);
      this._minusSign.lastIndex = 0;
      var c = e.search(this._suffix);
      this._suffix.lastIndex = 0;
      var i = e.search(this._currency);
      return this._currency.lastIndex = 0, {
        decimalCharIndex: n,
        minusCharIndex: a,
        suffixCharIndex: c,
        currencyCharIndex: i
      };
    },
    insert: function(e, n) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
        isDecimalSign: !1,
        isMinusSign: !1
      }, c = n.search(this._minusSign);
      if (this._minusSign.lastIndex = 0, !(!this.allowMinusSign() && c !== -1)) {
        var i = this.$refs.input.$el.selectionStart, o = this.$refs.input.$el.selectionEnd, p = this.$refs.input.$el.value.trim(), h = this.getCharIndexes(p), b = h.decimalCharIndex, S = h.minusCharIndex, C = h.suffixCharIndex, v = h.currencyCharIndex, l;
        if (a.isMinusSign) {
          var r = S === -1;
          (i === 0 || i === v + 1) && (l = p, (r || o !== 0) && (l = this.insertText(p, n, 0, o)), this.updateValue(e, l, n, "insert"));
        } else if (a.isDecimalSign)
          b > 0 && i === b ? this.updateValue(e, p, n, "insert") : b > i && b < o ? (l = this.insertText(p, n, i, o), this.updateValue(e, l, n, "insert")) : b === -1 && this.maxFractionDigits && (l = this.insertText(p, n, i, o), this.updateValue(e, l, n, "insert"));
        else {
          var f = this.numberFormat.resolvedOptions().maximumFractionDigits, m = i !== o ? "range-insert" : "insert";
          if (b > 0 && i > b) {
            if (i + n.length - (b + 1) <= f) {
              var k = v >= i ? v - 1 : C >= i ? C : p.length;
              l = p.slice(0, i) + n + p.slice(i + n.length, k) + p.slice(k), this.updateValue(e, l, n, m);
            }
          } else
            l = this.insertText(p, n, i, o), this.updateValue(e, l, n, m);
        }
      }
    },
    insertText: function(e, n, a, c) {
      var i = n === "." ? n : n.split(".");
      if (i.length === 2) {
        var o = e.slice(a, c).search(this._decimal);
        return this._decimal.lastIndex = 0, o > 0 ? e.slice(0, a) + this.formatValue(n) + e.slice(c) : this.formatValue(n) || e;
      } else return c - a === e.length ? this.formatValue(n) : a === 0 ? n + e.slice(c) : c === e.length ? e.slice(0, a) + n : e.slice(0, a) + n + e.slice(c);
    },
    deleteRange: function(e, n, a) {
      var c;
      return a - n === e.length ? c = "" : n === 0 ? c = e.slice(a) : a === e.length ? c = e.slice(0, n) : c = e.slice(0, n) + e.slice(a), c;
    },
    initCursor: function() {
      var e = this.$refs.input.$el.selectionStart, n = this.$refs.input.$el.value, a = n.length, c = null, i = (this.prefixChar || "").length;
      n = n.replace(this._prefix, ""), e = e - i;
      var o = n.charAt(e);
      if (this.isNumeralChar(o))
        return e + i;
      for (var p = e - 1; p >= 0; )
        if (o = n.charAt(p), this.isNumeralChar(o)) {
          c = p + i;
          break;
        } else
          p--;
      if (c !== null)
        this.$refs.input.$el.setSelectionRange(c + 1, c + 1);
      else {
        for (p = e; p < a; )
          if (o = n.charAt(p), this.isNumeralChar(o)) {
            c = p + i;
            break;
          } else
            p++;
        c !== null && this.$refs.input.$el.setSelectionRange(c, c);
      }
      return c || 0;
    },
    onInputClick: function() {
      var e = this.$refs.input.$el.value;
      !this.readonly && e !== $e() && this.initCursor();
    },
    isNumeralChar: function(e) {
      return e.length === 1 && (this._numeral.test(e) || this._decimal.test(e) || this._group.test(e) || this._minusSign.test(e)) ? (this.resetRegex(), !0) : !1;
    },
    resetRegex: function() {
      this._numeral.lastIndex = 0, this._decimal.lastIndex = 0, this._group.lastIndex = 0, this._minusSign.lastIndex = 0;
    },
    updateValue: function(e, n, a, c) {
      var i = this.$refs.input.$el.value, o = null;
      n != null && (o = this.parseValue(n), o = !o && !this.allowEmpty ? 0 : o, this.updateInput(o, a, c, n), this.handleOnInput(e, i, o));
    },
    handleOnInput: function(e, n, a) {
      if (this.isValueChanged(n, a)) {
        var c, i;
        this.$emit("input", {
          originalEvent: e,
          value: a,
          formattedValue: n
        }), (c = (i = this.formField).onInput) === null || c === void 0 || c.call(i, {
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
    updateInput: function(e, n, a, c) {
      var i;
      n = n || "";
      var o = this.$refs.input.$el.value, p = this.formatValue(e), h = o.length;
      if (p !== c && (p = this.concatValues(p, c)), h === 0) {
        this.$refs.input.$el.value = p, this.$refs.input.$el.setSelectionRange(0, 0);
        var b = this.initCursor(), S = b + n.length;
        this.$refs.input.$el.setSelectionRange(S, S);
      } else {
        var C = this.$refs.input.$el.selectionStart, v = this.$refs.input.$el.selectionEnd;
        this.$refs.input.$el.value = p;
        var l = p.length;
        if (a === "range-insert") {
          var r = this.parseValue((o || "").slice(0, C)), f = r !== null ? r.toString() : "", m = f.split("").join("(".concat(this.groupChar, ")?")), k = new RegExp(m, "g");
          k.test(p);
          var _ = n.split("").join("(".concat(this.groupChar, ")?")), T = new RegExp(_, "g");
          T.test(p.slice(k.lastIndex)), v = k.lastIndex + T.lastIndex, this.$refs.input.$el.setSelectionRange(v, v);
        } else if (l === h)
          a === "insert" || a === "delete-back-single" ? this.$refs.input.$el.setSelectionRange(v + 1, v + 1) : a === "delete-single" ? this.$refs.input.$el.setSelectionRange(v - 1, v - 1) : (a === "delete-range" || a === "spin") && this.$refs.input.$el.setSelectionRange(v, v);
        else if (a === "delete-back-single") {
          var G = o.charAt(v - 1), A = o.charAt(v), I = h - l, B = this._group.test(A);
          B && I === 1 ? v += 1 : !B && this.isNumeralChar(G) && (v += -1 * I + 1), this._group.lastIndex = 0, this.$refs.input.$el.setSelectionRange(v, v);
        } else if (o === "-" && a === "insert") {
          this.$refs.input.$el.setSelectionRange(0, 0);
          var W = this.initCursor(), Z = W + n.length + 1;
          this.$refs.input.$el.setSelectionRange(Z, Z);
        } else
          v = v + (l - h), this.$refs.input.$el.setSelectionRange(v, v);
      }
      this.$refs.input.$el.setAttribute("aria-valuenow", e), (i = this.$refs.clearIcon) !== null && i !== void 0 && (i = i.$el) !== null && i !== void 0 && i.style && (this.$refs.clearIcon.$el.style.display = xe(p) ? "none" : "block");
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
      this.focused = !0, !this.disabled && !this.readonly && this.$refs.input.$el.value !== $e() && this.highlightOnFocus && e.target.select(), this.$emit("focus", e);
    },
    onInputBlur: function(e) {
      var n, a;
      this.focused = !1;
      var c = e.target, i = this.validateValue(this.parseValue(c.value));
      this.$emit("blur", {
        originalEvent: e,
        value: c.value
      }), (n = (a = this.formField).onBlur) === null || n === void 0 || n.call(a, e), c.value = this.formatValue(i), c.setAttribute("aria-valuenow", i), this.updateModel(e, i), !this.disabled && !this.readonly && this.highlightOnFocus && Oe();
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
      return Be(pe(pe({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size), this.buttonLayout, this.showButtons && this.buttonLayout));
    }
  },
  components: {
    InputText: be,
    AngleUpIcon: Ve,
    AngleDownIcon: Me,
    TimesIcon: Te
  }
}, _a = ["data-p"], Ia = ["data-p"], Sa = ["disabled", "data-p"], Da = ["disabled", "data-p"], Ba = ["disabled", "data-p"], Aa = ["disabled", "data-p"];
function La(t, e, n, a, c, i) {
  var o = Ce("InputText"), p = Ce("TimesIcon");
  return u(), d("span", E({
    class: t.cx("root")
  }, t.ptmi("root"), {
    "data-p": i.dataP
  }), [P(o, {
    ref: "input",
    id: t.inputId,
    name: t.$formName,
    role: "spinbutton",
    class: Q([t.cx("pcInputText"), t.inputClass]),
    style: We(t.inputStyle),
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
  }, null, 8, ["id", "name", "class", "style", "defaultValue", "aria-valuemin", "aria-valuemax", "aria-valuenow", "inputmode", "disabled", "readonly", "placeholder", "aria-labelledby", "aria-label", "required", "size", "invalid", "variant", "onInput", "onKeydown", "onKeypress", "onPaste", "onClick", "onFocus", "onBlur", "pt", "unstyled", "data-p"]), t.showClear && t.buttonLayout !== "vertical" ? H(t.$slots, "clearicon", {
    key: 0,
    class: Q(t.cx("clearIcon")),
    clearCallback: i.onClearClick
  }, function() {
    return [P(p, E({
      ref: "clearIcon",
      class: [t.cx("clearIcon")],
      onClick: i.onClearClick
    }, t.ptm("clearIcon")), null, 16, ["class", "onClick"])];
  }) : g("", !0), t.showButtons && t.buttonLayout === "stacked" ? (u(), d("span", E({
    key: 1,
    class: t.cx("buttonGroup")
  }, t.ptm("buttonGroup"), {
    "data-p": i.dataP
  }), [H(t.$slots, "incrementbutton", {
    listeners: i.upButtonListeners
  }, function() {
    return [s("button", E({
      class: [t.cx("incrementButton"), t.incrementButtonClass]
    }, ae(i.upButtonListeners, !0), {
      disabled: t.disabled,
      tabindex: -1,
      "aria-hidden": "true",
      type: "button"
    }, t.ptm("incrementButton"), {
      "data-p": i.dataP
    }), [H(t.$slots, t.$slots.incrementicon ? "incrementicon" : "incrementbuttonicon", {}, function() {
      return [(u(), M(ie(t.incrementIcon || t.incrementButtonIcon ? "span" : "AngleUpIcon"), E({
        class: [t.incrementIcon, t.incrementButtonIcon]
      }, t.ptm("incrementIcon"), {
        "data-pc-section": "incrementicon"
      }), null, 16, ["class"]))];
    })], 16, Sa)];
  }), H(t.$slots, "decrementbutton", {
    listeners: i.downButtonListeners
  }, function() {
    return [s("button", E({
      class: [t.cx("decrementButton"), t.decrementButtonClass]
    }, ae(i.downButtonListeners, !0), {
      disabled: t.disabled,
      tabindex: -1,
      "aria-hidden": "true",
      type: "button"
    }, t.ptm("decrementButton"), {
      "data-p": i.dataP
    }), [H(t.$slots, t.$slots.decrementicon ? "decrementicon" : "decrementbuttonicon", {}, function() {
      return [(u(), M(ie(t.decrementIcon || t.decrementButtonIcon ? "span" : "AngleDownIcon"), E({
        class: [t.decrementIcon, t.decrementButtonIcon]
      }, t.ptm("decrementIcon"), {
        "data-pc-section": "decrementicon"
      }), null, 16, ["class"]))];
    })], 16, Da)];
  })], 16, Ia)) : g("", !0), H(t.$slots, "incrementbutton", {
    listeners: i.upButtonListeners
  }, function() {
    return [t.showButtons && t.buttonLayout !== "stacked" ? (u(), d("button", E({
      key: 0,
      class: [t.cx("incrementButton"), t.incrementButtonClass]
    }, ae(i.upButtonListeners, !0), {
      disabled: t.disabled,
      tabindex: -1,
      "aria-hidden": "true",
      type: "button"
    }, t.ptm("incrementButton"), {
      "data-p": i.dataP
    }), [H(t.$slots, t.$slots.incrementicon ? "incrementicon" : "incrementbuttonicon", {}, function() {
      return [(u(), M(ie(t.incrementIcon || t.incrementButtonIcon ? "span" : "AngleUpIcon"), E({
        class: [t.incrementIcon, t.incrementButtonIcon]
      }, t.ptm("incrementIcon"), {
        "data-pc-section": "incrementicon"
      }), null, 16, ["class"]))];
    })], 16, Ba)) : g("", !0)];
  }), H(t.$slots, "decrementbutton", {
    listeners: i.downButtonListeners
  }, function() {
    return [t.showButtons && t.buttonLayout !== "stacked" ? (u(), d("button", E({
      key: 0,
      class: [t.cx("decrementButton"), t.decrementButtonClass]
    }, ae(i.downButtonListeners, !0), {
      disabled: t.disabled,
      tabindex: -1,
      "aria-hidden": "true",
      type: "button"
    }, t.ptm("decrementButton"), {
      "data-p": i.dataP
    }), [H(t.$slots, t.$slots.decrementicon ? "decrementicon" : "decrementbuttonicon", {}, function() {
      return [(u(), M(ie(t.decrementIcon || t.decrementButtonIcon ? "span" : "AngleDownIcon"), E({
        class: [t.decrementIcon, t.decrementButtonIcon]
      }, t.ptm("decrementIcon"), {
        "data-pc-section": "decrementicon"
      }), null, 16, ["class"]))];
    })], 16, Aa)) : g("", !0)];
  })], 16, _a);
}
Ee.render = La;
const Pa = {
  class: "ac-stack ac-limits",
  "aria-labelledby": "ac-limits-title"
}, Ma = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Va = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Ta = {
  key: 2,
  class: "ac-limit-status",
  role: "status"
}, Ua = { class: "ac-card-title" }, Ea = ["onSubmit"], Na = ["for"], Fa = ["id"], Ra = { class: "ac-limit-control" }, ja = { class: "ac-hint" }, Oa = { class: "ac-limit-actions" }, za = {
  key: 0,
  class: "kx-err ac-limit-error",
  role: "alert"
}, Ka = /* @__PURE__ */ J({
  __name: "limits",
  emits: ["saved"],
  setup(t, { emit: e }) {
    const n = e, a = ve(), c = $([]), i = $({}), o = $({}), p = $(""), h = $(""), b = $(!1), S = $(""), C = q(() => {
      const r = /* @__PURE__ */ new Map();
      for (const f of [...c.value].sort((m, k) => m.order - k.order)) {
        const m = r.get(f.category) ?? [];
        m.push(f), r.set(f.category, m);
      }
      return r;
    }), v = se(async () => {
      try {
        const r = await R.limits();
        if (!a()) return;
        if (!r.length) throw new Error("No Autocode limits were found.");
        const f = new Map(c.value.map((m) => [m.key, m.value]));
        for (const m of r) {
          const k = i.value[m.key];
          (k === void 0 || k === f.get(m.key) || h.value === m.key) && (i.value[m.key] = m.value);
        }
        c.value = r, b.value = !0, p.value = "";
      } catch (r) {
        a() && (p.value = j(r, "Could not load limits."));
      }
    }, a);
    re(v);
    async function l(r, f = !1) {
      const m = f ? null : i.value[r.key];
      if (!(h.value || !f && (m == null || m === "" || m === r.value))) {
        h.value = r.key, S.value = "", o.value[r.key] = "";
        try {
          if (r.key === "run_retention" && !await ee.confirm({
            header: "Change run retention?",
            message: "Shorter retention can delete completed runs and their logs.",
            acceptLabel: "Change retention",
            rejectLabel: "Cancel"
          }) || !a() || (await R.saveLimit(r.key, m ?? null), !a()) || (await v(), !a())) return;
          p.value || (S.value = f ? `${r.title} reset to default.` : `${r.title} saved.`), n("saved");
        } catch (k) {
          a() && (o.value[r.key] = j(k, "Could not save this limit."));
        } finally {
          a() && (h.value = "");
        }
      }
    }
    return (r, f) => (u(), d("section", Pa, [
      f[0] || (f[0] = s("div", null, [
        s("h2", {
          id: "ac-limits-title",
          class: "ac-card-title"
        }, "Limits"),
        s("p", { class: "ac-hint" }, "These defaults apply to Autocode tasks. Enter durations like 30m or 2h.")
      ], -1)),
      !b.value && !p.value ? (u(), d("p", Ma, "Loading limits…")) : g("", !0),
      p.value ? (u(), d("div", Va, [
        V(w(p.value) + " ", 1),
        P(y(X), {
          label: "Retry",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: y(v)
        }, null, 8, ["onClick"])
      ])) : g("", !0),
      S.value ? (u(), d("p", Ta, w(S.value), 1)) : g("", !0),
      (u(!0), d(O, null, K(C.value, ([m, k]) => (u(), d("section", {
        key: m,
        class: "ac-card ac-limit-group"
      }, [
        s("h3", Ua, w(m), 1),
        (u(!0), d(O, null, K(k, (_) => (u(), d("form", {
          key: _.key,
          class: "ac-limit-row",
          onSubmit: He((T) => l(_), ["prevent"])
        }, [
          s("div", null, [
            s("label", {
              for: "ac-limit-" + _.key,
              class: "ac-strong"
            }, w(_.title), 9, Na),
            s("p", {
              id: "ac-limit-help-" + _.key,
              class: "ac-hint"
            }, w(_.description), 9, Fa)
          ]),
          s("div", Ra, [
            _.value_type === "int" ? (u(), M(y(Ee), {
              key: 0,
              "input-id": "ac-limit-" + _.key,
              "model-value": typeof i.value[_.key] == "number" ? Number(i.value[_.key]) : null,
              "input-props": { "aria-describedby": "ac-limit-help-" + _.key },
              disabled: !!h.value,
              fluid: "",
              onInput: (T) => i.value[_.key] = typeof T.value == "number" ? T.value : null,
              "onUpdate:modelValue": (T) => i.value[_.key] = T
            }, null, 8, ["input-id", "model-value", "input-props", "disabled", "onInput", "onUpdate:modelValue"])) : (u(), M(y(be), {
              key: 1,
              id: "ac-limit-" + _.key,
              "model-value": String(i.value[_.key] ?? ""),
              "aria-describedby": "ac-limit-help-" + _.key,
              disabled: !!h.value,
              fluid: "",
              "onUpdate:modelValue": (T) => i.value[_.key] = T ?? ""
            }, null, 8, ["id", "model-value", "aria-describedby", "disabled", "onUpdate:modelValue"])),
            s("p", ja, w(_.unit) + " · " + w(_.overridden ? `Override · default ${_.default}` : "Default"), 1)
          ]),
          s("div", Oa, [
            i.value[_.key] !== _.value ? (u(), M(y(X), {
              key: 0,
              type: "submit",
              label: "Save",
              size: "small",
              "aria-label": "Save " + _.title,
              disabled: !!h.value || i.value[_.key] == null || i.value[_.key] === ""
            }, null, 8, ["aria-label", "disabled"])) : g("", !0),
            _.overridden ? (u(), M(y(X), {
              key: 1,
              type: "button",
              label: "Reset",
              size: "small",
              text: "",
              severity: "secondary",
              "aria-label": "Reset " + _.title + " to default",
              disabled: !!h.value,
              onClick: (T) => l(_, !0)
            }, null, 8, ["aria-label", "disabled", "onClick"])) : g("", !0)
          ]),
          o.value[_.key] ? (u(), d("p", za, w(o.value[_.key]), 1)) : g("", !0)
        ], 40, Ea))), 128))
      ]))), 128))
    ]));
  }
}), qa = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Ga = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Wa = /* @__PURE__ */ J({
  __name: "account-provider-mount",
  props: {
    tag: {},
    providerId: {}
  },
  emits: ["changed"],
  setup(t, { emit: e }) {
    const n = t, a = e, c = $(null), i = $(0), o = $(!1), p = $("");
    return Y([c, i], async ([h], b, S) => {
      if (!h) return;
      let C = !0;
      const v = (l) => {
        if (l instanceof CustomEvent && l.detail?.success === !1) {
          p.value = l.detail.error || "Could not complete account setup.";
          return;
        }
        p.value = "", a("changed");
      };
      S(() => {
        C = !1, h.replaceChildren();
      }), o.value = !0, p.value = "";
      try {
        if (await Xe(n.tag, { timeoutMs: 8e3 }), !C) return;
        const l = document.createElement(n.tag);
        l.setAttribute("provider-id", n.providerId), l.addEventListener("connection-saved", v), l.addEventListener("oauth-result", v), h.replaceChildren(l);
      } catch (l) {
        C && (p.value = j(l, "Could not load the provider’s account editor."));
      } finally {
        C && (o.value = !1);
      }
    }), (h, b) => (u(), d(O, null, [
      o.value ? (u(), d("p", qa, "Loading account editor…")) : g("", !0),
      p.value ? (u(), d("div", Ga, [
        V(w(p.value) + " ", 1),
        P(y(X), {
          label: "Retry",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: b[0] || (b[0] = (S) => i.value++)
        })
      ])) : g("", !0),
      s("div", {
        ref_key: "container",
        ref: c
      }, null, 512)
    ], 64));
  }
}), Ha = {
  class: "ac-stack",
  "aria-labelledby": "ac-accounts-title"
}, Za = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Ya = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Ja = {
  key: 2,
  class: "ac-muted"
}, Qa = {
  key: 3,
  class: "ac-provider-layout"
}, Xa = {
  "aria-label": "Account providers",
  class: "ac-provider-list"
}, ei = ["aria-pressed", "onClick"], ti = { class: "ac-muted" }, ni = ["aria-pressed", "onClick"], ai = {
  key: 0,
  class: "ac-card ac-provider-detail"
}, ii = { class: "ac-card-title" }, ri = {
  key: 1,
  class: "ac-card ac-provider-detail"
}, si = { class: "ac-card-title" }, oi = {
  key: 2,
  class: "ac-card ac-provider-detail"
}, li = /* @__PURE__ */ J({
  __name: "account-management",
  setup(t) {
    const e = $([]), n = $([]), a = $(""), c = $(!1), i = $(""), o = nt(), p = ve(), h = q(() => e.value.find((l) => l.provider_id === a.value)), b = q(() => {
      const l = new Set(e.value.map((r) => r.agent));
      return [...new Set(n.value.map((r) => r.agent).filter((r) => !l.has(r)))];
    }), S = q(() => {
      const l = /* @__PURE__ */ new Map();
      for (const r of n.value) {
        const f = l.get(r.agent) ?? { total: 0, ready: 0 };
        f.total++, at(r, o.value) === "ready" && f.ready++, l.set(r.agent, f);
      }
      return l;
    });
    function C(l) {
      const r = S.value.get(l.agent);
      return r ? `${r.ready} of ${r.total} ready` : l.create_ui_id ? "Set up an account" : "Setup unavailable";
    }
    const v = se(async () => {
      try {
        const l = await R.managedAccounts();
        if (!p()) return;
        e.value = l.providers, n.value = l.accounts, c.value = !0, i.value = "";
      } catch (l) {
        p() && (i.value = j(l, "Could not load account providers."));
      }
    }, p);
    return re(v), (l, r) => (u(), d("section", Ha, [
      r[4] || (r[4] = s("header", null, [
        s("h2", {
          id: "ac-accounts-title",
          class: "ac-card-title"
        }, "Accounts"),
        s("p", { class: "ac-hint" }, "Choose a provider to add an account, check its usage or manage access.")
      ], -1)),
      !c.value && !i.value ? (u(), d("p", Za, "Loading account providers…")) : g("", !0),
      i.value ? (u(), d("p", Ya, [
        V(w(i.value) + " ", 1),
        P(y(X), {
          label: "Retry",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: y(v)
        }, null, 8, ["onClick"])
      ])) : g("", !0),
      c.value && !e.value.length && !b.value.length ? (u(), d("p", Ja, "No Autocode providers are installed.")) : g("", !0),
      e.value.length || b.value.length ? (u(), d("div", Qa, [
        s("nav", Xa, [
          (u(!0), d(O, null, K(e.value, (f) => (u(), d("button", {
            key: f.provider_id,
            type: "button",
            class: "ac-provider-choice kx-focus-halo",
            "aria-pressed": a.value === f.provider_id,
            onClick: (m) => a.value = f.provider_id
          }, [
            P(y(U), {
              icon: f.icon || "tabler:terminal-2",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            s("span", null, [
              s("strong", null, w(f.title), 1),
              s("span", ti, w(C(f)), 1)
            ])
          ], 8, ei))), 128)),
          (u(!0), d(O, null, K(b.value, (f) => (u(), d("button", {
            key: f,
            type: "button",
            class: "ac-provider-choice kx-focus-halo",
            "aria-pressed": a.value === f,
            onClick: (m) => a.value = f
          }, [
            P(y(U), {
              icon: "tabler:terminal-off",
              "aria-hidden": "true"
            }),
            s("span", null, [
              s("strong", null, w(f), 1),
              r[0] || (r[0] = s("span", { class: "ac-muted" }, "Provider unavailable", -1))
            ])
          ], 8, ni))), 128))
        ]),
        h.value ? (u(), d("div", ai, [
          s("h3", ii, w(h.value.title), 1),
          h.value.create_ui_id ? (u(), M(Wa, {
            key: h.value.provider_id,
            tag: h.value.create_ui_id,
            "provider-id": h.value.provider_id,
            onChanged: y(v)
          }, null, 8, ["tag", "provider-id", "onChanged"])) : (u(), d(O, { key: 1 }, [
            r[1] || (r[1] = s("p", { class: "ac-hint" }, "This provider hasn't supplied an account setup component.", -1)),
            S.value.has(h.value.agent) ? (u(), M(_e, {
              key: h.value.agent,
              query: "",
              "selected-agent": h.value.agent,
              management: "",
              "allow-setup": !1,
              onChanged: y(v)
            }, null, 8, ["selected-agent", "onChanged"])) : g("", !0)
          ], 64))
        ])) : b.value.includes(a.value) ? (u(), d("div", ri, [
          s("h3", si, w(a.value), 1),
          r[2] || (r[2] = s("p", { class: "ac-hint" }, "This provider is unavailable. You can still manage its existing accounts.", -1)),
          (u(), M(_e, {
            key: a.value,
            query: "",
            "selected-agent": a.value,
            management: "",
            "allow-setup": !1,
            onChanged: y(v)
          }, null, 8, ["selected-agent", "onChanged"]))
        ])) : (u(), d("div", oi, [...r[3] || (r[3] = [
          s("h3", { class: "ac-card-title" }, "Choose a provider", -1),
          s("p", { class: "ac-hint" }, "Each provider shows whether its accounts are ready to run tasks.", -1)
        ])]))
      ])) : g("", !0)
    ]));
  }
}), ui = { class: "ac" }, ci = { class: "ac-bar" }, di = {
  class: "ac-tabs",
  "aria-label": "Autocode management"
}, pi = ["aria-pressed", "onClick"], fi = {
  key: 0,
  class: "kx-err"
}, mi = {
  key: 1,
  class: "kx-loading"
}, hi = {
  key: 2,
  class: "ac-body"
}, vi = {
  key: 5,
  class: "ac-muted"
}, bi = /* @__PURE__ */ J({
  __name: "admin",
  setup(t) {
    const e = [
      { id: "images", label: "Images", icon: "tabler:box", permission: "can_images" },
      { id: "workspaces", label: "Workspaces", icon: "tabler:folder", permission: "can_workspaces" },
      { id: "docker", label: "Docker", icon: "tabler:brand-docker", permission: "can_prune" },
      { id: "limits", label: "Limits", icon: "tabler:adjustments", permission: "can_limits" },
      { id: "accounts", label: "Accounts", icon: "tabler:key", permission: "can_accounts" }
    ], n = $(), { catalog: a, error: c, load: i } = Je(), o = q(() => e.filter((f) => a.value?.[f.permission]));
    Y(o, (f) => {
      f.some((m) => m.id === n.value) || (n.value = f[0]?.id);
    }, { immediate: !0 });
    const p = $(""), h = $(0), b = $(0), S = q(() => n.value === "images" || n.value === "workspaces"), C = q(() => n.value === "images" ? h.value : b.value), v = $(null), l = $(null);
    function r() {
      n.value === "images" ? v.value?.open() : l.value?.open();
    }
    return (f, m) => (u(), d("div", ui, [
      P(Qe, {
        title: "Autocode",
        subtitle: "Configure where tasks run, which accounts they use and what limits apply.",
        count: n.value && S.value ? `${C.value} ${C.value === 1 ? n.value.slice(0, -1) : n.value}` : void 0,
        action: n.value === "images" && h.value ? "Add image" : n.value === "workspaces" && b.value ? "Add workspace" : void 0,
        query: p.value,
        "onUpdate:query": m[0] || (m[0] = (k) => p.value = k),
        placeholder: S.value ? "Search resources…" : void 0,
        onCreate: r
      }, null, 8, ["count", "action", "query", "placeholder"]),
      s("div", ci, [
        s("nav", di, [
          (u(!0), d(O, null, K(o.value, (k) => (u(), d("button", {
            key: k.id,
            type: "button",
            class: Q(["ac-tab kx-focus-outline", { active: n.value === k.id }]),
            "aria-pressed": n.value === k.id,
            onClick: (_) => {
              n.value !== k.id && (n.value = k.id, p.value = "");
            }
          }, [
            P(y(U), {
              icon: k.icon
            }, null, 8, ["icon"]),
            V(" " + w(k.label), 1)
          ], 10, pi))), 128))
        ])
      ]),
      y(c) && !y(a) ? (u(), d("p", fi, [
        V(w(y(c)) + " ", 1),
        s("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: m[1] || (m[1] = //@ts-ignore
          (...k) => y(i) && y(i)(...k))
        }, "Retry")
      ])) : y(a) ? (u(), d("main", hi, [
        n.value === "images" ? (u(), M(tn, {
          key: 0,
          ref_key: "images",
          ref: v,
          query: p.value,
          onCount: m[2] || (m[2] = (k) => h.value = k)
        }, null, 8, ["query"])) : g("", !0),
        y(a).can_workspaces ? F((u(), M(Pn, {
          key: 1,
          ref_key: "workspaces",
          ref: l,
          query: p.value,
          onCount: m[3] || (m[3] = (k) => b.value = k)
        }, null, 8, ["query"])), [
          [Ze, n.value === "workspaces"]
        ]) : g("", !0),
        n.value === "docker" ? (u(), M(Rn, { key: 2 })) : g("", !0),
        n.value === "limits" ? (u(), M(Ka, {
          key: 3,
          onSaved: y(i)
        }, null, 8, ["onSaved"])) : g("", !0),
        n.value === "accounts" ? (u(), M(li, { key: 4 })) : g("", !0),
        n.value ? g("", !0) : (u(), d("p", vi, "No management areas are available."))
      ])) : (u(), d("div", mi, [
        P(y(U), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        m[4] || (m[4] = V(" Loading…", -1))
      ]))
    ]));
  }
}), _i = {
  rootComponent: bi,
  plugins: [ze]
};
export {
  _i as mountConfig
};
