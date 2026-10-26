import { u as X, a as le, _ as G, b as se, c as oe, s as ne, P as ie } from "./styles-DEgY6oCi.js";
import { u as Y, W as ue } from "./dto-FYq6oVap.js";
import { defineComponent as K, ref as v, watch as M, openBlock as s, createElementBlock as o, toDisplayString as d, createElementVNode as e, createVNode as C, unref as c, createTextVNode as U, createCommentVNode as y, Fragment as N, withDirectives as P, vModelText as S, normalizeClass as H, createStaticVNode as re, renderList as R, vModelCheckbox as ce, onUnmounted as de, computed as Z, createBlock as W, withCtx as J } from "vue";
import { Icon as L } from "@iconify/vue";
import { host as F, define as ve } from "@wippy-fe/proxy";
import { a as q, e as j, b as me, s as ee, p as pe } from "./presentation-E5H7E21K.js";
const ke = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, fe = {
  key: 1,
  class: "ac-form"
}, be = { class: "ac-card-head" }, ge = { class: "ac-muted" }, ye = { class: "ac-field" }, he = { class: "ac-seg" }, _e = {
  key: 0,
  class: "ac-field"
}, xe = {
  key: 1,
  class: "ac-muted ac-mono"
}, we = { class: "ac-field" }, $e = { class: "ac-field" }, Ce = { class: "ac-row-fields" }, De = { class: "ac-field" }, Ae = ["placeholder"], Le = { class: "ac-field" }, Ue = ["placeholder"], Ve = { class: "ac-field" }, Ie = { class: "ac-row-fields" }, Ee = { class: "ac-field" }, Pe = { class: "ac-field" }, Se = ["placeholder"], qe = {
  key: 2,
  class: "ac-field"
}, Te = { class: "ac-checks" }, Ne = ["value"], Re = { class: "ac-field" }, je = { class: "ac-dialog-foot" }, Be = ["disabled"], Me = {
  key: 3,
  class: "kx-err"
}, We = /* @__PURE__ */ K({
  __name: "image-form",
  props: {
    edit: {},
    capabilities: {}
  },
  emits: ["saved", "cancel"],
  setup(D, { emit: I }) {
    const f = D, E = I, V = X();
    function h(l = V.value.default_image.settings) {
      return l ? {
        ref: "",
        mode: "pull",
        dockerfile: "",
        label: "",
        home: V.value.default_image.home,
        ...l,
        extra_args: [...l.extra_args],
        allows: [...l.allows],
        extra: ""
      } : null;
    }
    const a = v(h()), g = v(!1);
    M(() => a.value?.ref, (l) => {
      a.value && !f.edit && !g.value && l !== void 0 && (a.value.label = l);
    });
    const p = v(!1), _ = v("");
    M(() => f.edit, (l) => {
      if (_.value = "", g.value = !!l, !l) {
        a.value = h();
        return;
      }
      if (!l.settings) {
        a.value = null;
        return;
      }
      const t = l.settings;
      a.value = {
        ...t,
        ref: l.image.ref,
        label: l.image.label,
        home: l.image.home,
        mode: "pull",
        dockerfile: l.dockerfile ?? "",
        extra: t.extra_args.join(`
`),
        allows: [...t.allows]
      };
    }, { immediate: !0 });
    function w() {
      const l = V.value.default_image;
      g.value = !1;
      const t = h();
      a.value = t ? { ...t, ref: l.ref, label: l.label, home: l.home, mode: "build", dockerfile: l.dockerfile } : null;
    }
    function $() {
      const l = a.value;
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
`).map((t) => t.trim()).filter(Boolean),
        allows: [...l.allows]
      };
    }
    async function k() {
      if (a.value) {
        _.value = "", p.value = !0;
        try {
          if (f.edit)
            await q.updateImage(f.edit.image.id, $());
          else {
            const l = a.value;
            await q.createImage({ ...$(), ref: l.ref, dockerfile: l.mode === "build" ? l.dockerfile : "" }), a.value = h();
          }
          E("saved");
        } catch (l) {
          _.value = j(l, "Could not save the image.");
        } finally {
          p.value = !1;
        }
      }
    }
    return (l, t) => a.value ? (s(), o("section", fe, [
      e("div", be, [
        e("span", ge, d(D.edit ? "Container settings" : "Use an image reference or the default agent recipe."), 1),
        D.edit ? y("", !0) : (s(), o("button", {
          key: 0,
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: w
        }, [
          C(c(L), { icon: "tabler:sparkles" }),
          t[15] || (t[15] = U(" Default agent image", -1))
        ]))
      ]),
      D.edit ? (s(), o("p", xe, d(D.edit.image.ref), 1)) : (s(), o(N, { key: 0 }, [
        e("label", ye, [
          t[16] || (t[16] = e("span", null, "Image reference", -1)),
          P(e("input", {
            "onUpdate:modelValue": t[0] || (t[0] = (n) => a.value.ref = n),
            class: "ac-mono kx-focus-halo",
            placeholder: "registry/name:tag"
          }, null, 512), [
            [S, a.value.ref]
          ])
        ]),
        e("div", he, [
          e("button", {
            type: "button",
            class: H(["kx-focus-outline", { active: a.value.mode === "pull" }]),
            onClick: t[1] || (t[1] = (n) => a.value.mode = "pull")
          }, "Use or pull existing", 2),
          e("button", {
            type: "button",
            class: H(["kx-focus-outline", { active: a.value.mode === "build" }]),
            onClick: t[2] || (t[2] = (n) => a.value.mode = "build")
          }, "Build from Dockerfile", 2)
        ]),
        a.value.mode === "build" ? (s(), o("label", _e, [
          t[17] || (t[17] = e("span", null, "Dockerfile", -1)),
          P(e("textarea", {
            "onUpdate:modelValue": t[3] || (t[3] = (n) => a.value.dockerfile = n),
            rows: "9",
            class: "ac-mono kx-focus-halo"
          }, null, 512), [
            [S, a.value.dockerfile]
          ]),
          t[18] || (t[18] = re('<small class="ac-hint">Include <code>sh</code>, <code>git</code>, <code>mkdir</code>, <code>dirname</code>, a <code>timeout</code> that supports <code>-k</code>, and the agent CLIs. The image user needs writable home and work directories.</small>', 1))
        ])) : y("", !0)
      ], 64)),
      e("label", we, [
        t[19] || (t[19] = e("span", null, "Label", -1)),
        P(e("input", {
          "onUpdate:modelValue": t[4] || (t[4] = (n) => a.value.label = n),
          class: "kx-focus-halo",
          onInput: t[5] || (t[5] = (n) => g.value = !0)
        }, null, 544), [
          [S, a.value.label]
        ])
      ]),
      e("label", $e, [
        t[20] || (t[20] = e("span", null, "Home directory in the image", -1)),
        P(e("input", {
          "onUpdate:modelValue": t[6] || (t[6] = (n) => a.value.home = n),
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [S, a.value.home]
        ])
      ]),
      e("div", Ce, [
        e("label", De, [
          t[21] || (t[21] = e("span", null, "Memory", -1)),
          P(e("input", {
            "onUpdate:modelValue": t[7] || (t[7] = (n) => a.value.memory = n),
            class: "ac-mono kx-focus-halo",
            placeholder: c(V).default_image.settings?.memory
          }, null, 8, Ae), [
            [S, a.value.memory]
          ])
        ]),
        e("label", Le, [
          t[22] || (t[22] = e("span", null, "CPUs", -1)),
          P(e("input", {
            "onUpdate:modelValue": t[8] || (t[8] = (n) => a.value.cpus = n),
            class: "ac-mono kx-focus-halo",
            placeholder: c(V).default_image.settings?.cpus
          }, null, 8, Ue), [
            [S, a.value.cpus]
          ])
        ]),
        e("label", Ve, [
          t[23] || (t[23] = e("span", null, "PIDs limit", -1)),
          P(e("input", {
            "onUpdate:modelValue": t[9] || (t[9] = (n) => a.value.pids_limit = n),
            type: "number",
            min: "0",
            class: "ac-mono kx-focus-halo"
          }, null, 512), [
            [
              S,
              a.value.pids_limit,
              void 0,
              { number: !0 }
            ]
          ])
        ])
      ]),
      e("div", Ie, [
        e("label", Ee, [
          t[24] || (t[24] = e("span", null, "GPUs", -1)),
          P(e("input", {
            "onUpdate:modelValue": t[10] || (t[10] = (n) => a.value.gpus = n),
            class: "ac-mono kx-focus-halo",
            placeholder: "all, or device=0"
          }, null, 512), [
            [S, a.value.gpus]
          ])
        ]),
        e("label", Pe, [
          t[25] || (t[25] = e("span", null, "Network", -1)),
          P(e("input", {
            "onUpdate:modelValue": t[11] || (t[11] = (n) => a.value.network = n),
            class: "ac-mono kx-focus-halo",
            placeholder: c(V).default_image.settings?.network
          }, null, 8, Se), [
            [S, a.value.network]
          ])
        ])
      ]),
      D.capabilities?.length ? (s(), o("div", qe, [
        t[26] || (t[26] = e("span", null, "Agents may", -1)),
        e("div", Te, [
          (s(!0), o(N, null, R(D.capabilities, (n) => (s(), o("label", {
            key: n,
            class: "ac-check ac-mono"
          }, [
            P(e("input", {
              "onUpdate:modelValue": t[12] || (t[12] = (O) => a.value.allows = O),
              type: "checkbox",
              class: "kx-focus-outline",
              value: n
            }, null, 8, Ne), [
              [ce, a.value.allows]
            ]),
            U(" " + d(n), 1)
          ]))), 128))
        ])
      ])) : y("", !0),
      e("label", Re, [
        t[27] || (t[27] = e("span", null, "Extra docker run arguments", -1)),
        P(e("textarea", {
          "onUpdate:modelValue": t[13] || (t[13] = (n) => a.value.extra = n),
          rows: "3",
          class: "ac-mono kx-focus-halo",
          placeholder: `One argument per line, e.g.
--device=/dev/dri
--shm-size=2g`
        }, null, 512), [
          [S, a.value.extra]
        ])
      ]),
      e("footer", je, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: t[14] || (t[14] = (n) => E("cancel"))
        }, "Cancel"),
        e("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: p.value || !D.capabilities || !D.edit && !a.value.ref,
          onClick: k
        }, [
          C(c(L), { icon: "tabler:box" }),
          U(" " + d(p.value ? "Saving…" : D.edit ? "Save settings" : a.value.mode === "build" ? "Build image" : "Add image"), 1)
        ], 8, Be)
      ]),
      _.value ? (s(), o("p", Me, d(_.value), 1)) : y("", !0)
    ])) : (s(), o("p", ke, d(D.edit ? "Image settings are unavailable." : "Image defaults are unavailable.") + " Ask an administrator to update the image configuration.", 1));
  }
}), Oe = { class: "ac-stack" }, He = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ke = {
  key: 1,
  class: "kx-loading"
}, ze = {
  key: 2,
  class: "kx-empty"
}, Fe = { class: "kx-empty-ico" }, Ge = {
  key: 3,
  class: "kx-empty"
}, Je = { class: "ac-list ac-resource-list" }, Qe = { class: "ac-resource-icon" }, Xe = { class: "ac-account-main" }, Ye = { class: "ac-row-title" }, Ze = { class: "ac-muted ac-mono" }, et = { class: "ac-chips" }, tt = { class: "ac-muted" }, at = {
  key: 0,
  class: "kx-err ac-small"
}, lt = { class: "ac-row-actions" }, st = ["disabled", "onClick"], ot = ["onClick"], nt = ["onClick"], it = ["onClick"], ut = { class: "ac-form" }, rt = { class: "ac-mono" }, ct = { class: "ac-pre ac-build-log" }, dt = /* @__PURE__ */ K({
  __name: "images",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(D, { expose: I, emit: f }) {
    const E = X(), V = D, h = f, a = v(!1), g = v({});
    I({ open: () => {
      a.value = !0;
    } });
    const p = v([]), _ = v(""), w = v(null), $ = v(null), k = v(null), l = v(!1);
    let t = !0, n = 0;
    de(() => {
      t = !1, n++;
    });
    async function O(u) {
      const b = n, r = await q.image(u);
      !t || b !== n || $.value?.id !== u || ($.value = { id: u, ref: r.image.ref, text: r.build_log || "(empty)" });
    }
    const T = ee(async () => {
      try {
        const [u, b] = await Promise.all([q.images(), q.drivers()]), r = await pe([...new Set(u.map((A) => A.owner))]);
        if (!t) return;
        p.value = u, g.value = Object.fromEntries(u.map((A) => [A.id, `Owner: ${r[A.owner] || A.owner}`])), k.value = [...new Set(b.flatMap((A) => A.capabilities))].sort(), $.value && u.some((A) => A.id === $.value?.id) && await O($.value.id), l.value = !0, _.value = "";
      } catch (u) {
        _.value = j(u, "Could not load images.");
      }
    });
    le(() => p.value.map((u) => u.id), () => {
      T();
    }), Y(T);
    async function B(u, b) {
      _.value = "";
      try {
        await u(), await T();
      } catch (r) {
        _.value = j(r, b);
      }
    }
    const x = (u) => B(async () => {
      w.value = await q.image(u.id);
    }, "Could not load the image settings."), i = (u) => B(() => q.prepareImage(u.id), "Could not start the image preparation.");
    function m(u) {
      n++, $.value = { id: u.id, ref: u.ref, text: "Loading…" }, T();
    }
    function z() {
      n++, $.value = null;
    }
    async function te() {
      w.value = null, a.value = !1, await T();
    }
    async function ae(u) {
      if (!await F.confirm({
        header: "Delete image",
        message: `Delete image "${u.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) return;
      const r = await F.confirm({
        header: "Docker image",
        message: `Also remove ${u.ref} from Docker on the host? Keeping it lets a later image with the same reference reuse it.`,
        icon: "tabler:brand-docker",
        acceptLabel: "Remove from Docker",
        rejectLabel: "Keep in Docker",
        acceptClass: "p-button-danger"
      });
      w.value?.image.id === u.id && (w.value = null), $.value?.id === u.id && z(), await B(() => q.deleteImage(u.id, r), "Could not delete the image.");
    }
    const Q = Z(() => p.value.filter((u) => [u.label, u.ref, ...u.agents].join(" ").toLowerCase().includes(V.query.toLowerCase())));
    return M(p, (u) => h("count", u.length)), (u, b) => (s(), o("div", Oe, [
      b[7] || (b[7] = e("p", { class: "ac-hint" }, "Ready images with READ access are available to tasks.", -1)),
      _.value ? (s(), o("p", He, [
        U(d(_.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: b[0] || (b[0] = //@ts-ignore
          (...r) => c(T) && c(T)(...r))
        }, "Retry")
      ])) : y("", !0),
      !l.value && !_.value ? (s(), o("div", Ke, "Loading images…")) : y("", !0),
      l.value && !p.value.length ? (s(), o("div", ze, [
        e("div", Fe, [
          C(c(L), { icon: "tabler:box" })
        ]),
        b[4] || (b[4] = e("div", { class: "kx-empty-title" }, "No images yet", -1)),
        b[5] || (b[5] = e("div", { class: "kx-empty-sub" }, "Start with the default agent recipe or use an existing image.", -1)),
        e("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: b[1] || (b[1] = (r) => a.value = !0)
        }, "Add image")
      ])) : l.value && !Q.value.length ? (s(), o("div", Ge, [...b[6] || (b[6] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another image, reference or agent.", -1)
      ])])) : y("", !0),
      e("ul", Je, [
        (s(!0), o(N, null, R(Q.value, (r) => (s(), o("li", {
          key: r.id,
          class: "ac-row ac-resource"
        }, [
          e("span", Qe, [
            C(c(L), { icon: "tabler:box" })
          ]),
          e("div", Xe, [
            e("div", Ye, [
              U(d(r.label), 1),
              e("span", {
                class: H(["kx-tag-sm ac-tone", r.status])
              }, d(r.status), 3)
            ]),
            e("div", Ze, d(r.ref) + " · " + d(r.home), 1),
            e("div", et, [
              (s(!0), o(N, null, R(r.agents, (A) => (s(), o("span", {
                key: A,
                class: "kx-tag-sm ac-tone"
              }, [
                C(c(L), {
                  icon: c(me)(A, c(E).agents)
                }, null, 8, ["icon"]),
                U(d(A), 1)
              ]))), 128))
            ]),
            e("div", tt, d(g.value[r.id]), 1),
            r.last_error ? (s(), o("div", at, d(r.last_error), 1)) : y("", !0)
          ]),
          e("div", lt, [
            r.writable ? (s(), o("button", {
              key: 0,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Prepare image",
              "aria-label": "Prepare image",
              disabled: r.status === "preparing",
              onClick: (A) => i(r)
            }, [
              C(c(L), { icon: "tabler:refresh" })
            ], 8, st)) : y("", !0),
            e("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Build log",
              "aria-label": "Build log",
              onClick: (A) => m(r)
            }, [
              C(c(L), { icon: "tabler:file-text" })
            ], 8, ot),
            r.writable ? (s(), o("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Edit settings",
              "aria-label": "Edit settings",
              onClick: (A) => x(r)
            }, [
              C(c(L), { icon: "tabler:pencil" })
            ], 8, nt)) : y("", !0),
            r.deletable ? (s(), o("button", {
              key: 2,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete image",
              "aria-label": "Delete image",
              onClick: (A) => ae(r)
            }, [
              C(c(L), { icon: "tabler:trash" })
            ], 8, it)) : y("", !0)
          ])
        ]))), 128))
      ]),
      a.value || w.value ? (s(), W(G, {
        key: 4,
        title: w.value ? "Edit image" : "Add image",
        wide: "",
        onClose: b[3] || (b[3] = (r) => {
          a.value = !1, w.value = null;
        })
      }, {
        default: J(() => [
          C(We, {
            edit: w.value,
            capabilities: k.value,
            onSaved: te,
            onCancel: b[2] || (b[2] = (r) => {
              a.value = !1, w.value = null;
            })
          }, null, 8, ["edit", "capabilities"])
        ]),
        _: 1
      }, 8, ["title"])) : y("", !0),
      $.value ? (s(), W(G, {
        key: 5,
        title: "Build log",
        wide: "",
        onClose: z
      }, {
        default: J(() => [
          e("div", ut, [
            e("strong", rt, d($.value.ref), 1),
            e("pre", ct, d($.value.text), 1)
          ])
        ]),
        _: 1
      })) : y("", !0)
    ]));
  }
}), vt = { class: "ac-stack" }, mt = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, pt = {
  key: 1,
  class: "kx-loading"
}, kt = { class: "ac-chips" }, ft = {
  key: 2,
  class: "kx-empty"
}, bt = { class: "kx-empty-ico" }, gt = {
  key: 3,
  class: "kx-empty"
}, yt = { class: "ac-list ac-resource-list" }, ht = { class: "ac-resource-icon" }, _t = { class: "ac-account-main" }, xt = { class: "ac-row-title" }, wt = { class: "kx-tag-sm ac-tone" }, $t = {
  key: 0,
  class: "ac-muted ac-mono"
}, Ct = { class: "ac-row-actions" }, Dt = ["onClick"], At = { class: "ac-form" }, Lt = {
  key: 0,
  class: "ac-muted"
}, Ut = {
  key: 1,
  class: "ac-field"
}, Vt = { class: "ac-chips" }, It = ["onClick"], Et = { class: "ac-field" }, Pt = { class: "ac-field" }, St = ["placeholder"], qt = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Tt = { class: "ac-dialog-foot" }, Nt = ["disabled"], Rt = /* @__PURE__ */ K({
  __name: "workspaces",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(D, { expose: I, emit: f }) {
    const E = D, V = f, h = v(!1);
    I({ open: () => {
      h.value = !0;
    } });
    const a = v([]), g = v([]), p = v(""), _ = v(!1), w = v(""), $ = v(!1), k = v(""), l = v(!1);
    function t(x) {
      return x.replace(/\/+$/, "") + "/";
    }
    M([h, g], () => {
      h.value && !k.value && g.value.length && (k.value = t(g.value[0]));
    }), M(k, (x) => {
      $.value || (w.value = x.trim().split("/").filter(Boolean).pop() ?? "");
    });
    const n = ee(async () => {
      try {
        const x = await q.workspaces();
        a.value = x.workspaces, g.value = x.roots, l.value = !0, p.value = "";
      } catch (x) {
        p.value = j(x, "Could not load workspaces.");
      }
    });
    Y(n);
    async function O() {
      p.value = "", _.value = !0;
      try {
        await q.createWorkspace({ name: w.value, host_path: k.value }), $.value = !1, w.value = "", k.value = "", h.value = !1, await n();
      } catch (x) {
        p.value = j(x, "Could not save the workspace.");
      } finally {
        _.value = !1;
      }
    }
    async function T(x) {
      if (await F.confirm({
        header: "Delete workspace",
        message: `Delete workspace "${x.name}"? The host directory stays untouched.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) {
        p.value = "";
        try {
          await q.deleteWorkspace(x.id), await n();
        } catch (m) {
          p.value = j(m, "Could not delete the workspace.");
        }
      }
    }
    const B = Z(() => a.value.filter((x) => [x.name, x.host_path].join(" ").toLowerCase().includes(E.query.toLowerCase())));
    return M(a, (x) => V("count", x.length)), (x, i) => (s(), o("div", vt, [
      i[15] || (i[15] = e("p", { class: "ac-hint" }, "READ mounts a workspace read-only; WRITE allows changes.", -1)),
      p.value && !h.value ? (s(), o("p", mt, [
        U(d(p.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: i[0] || (i[0] = //@ts-ignore
          (...m) => c(n) && c(n)(...m))
        }, "Retry")
      ])) : y("", !0),
      !l.value && !p.value ? (s(), o("div", pt, "Loading workspaces…")) : y("", !0),
      e("div", kt, [
        i[7] || (i[7] = e("span", { class: "ac-muted" }, "Allowed roots", -1)),
        (s(!0), o(N, null, R(g.value, (m) => (s(), o("span", {
          key: m,
          class: "ac-hint-chip ac-mono"
        }, d(m), 1))), 128))
      ]),
      l.value && !a.value.length ? (s(), o("div", ft, [
        e("div", bt, [
          C(c(L), { icon: "tabler:folder" })
        ]),
        i[8] || (i[8] = e("div", { class: "kx-empty-title" }, "No workspaces yet", -1)),
        i[9] || (i[9] = e("div", { class: "kx-empty-sub" }, "Add a host directory, or let tasks use a scratch directory.", -1)),
        e("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: i[1] || (i[1] = (m) => h.value = !0)
        }, "Add workspace")
      ])) : l.value && !B.value.length ? (s(), o("div", gt, [...i[10] || (i[10] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another workspace name or path.", -1)
      ])])) : y("", !0),
      e("ul", yt, [
        (s(!0), o(N, null, R(B.value, (m) => (s(), o("li", {
          key: m.id,
          class: "ac-row ac-resource"
        }, [
          e("span", ht, [
            C(c(L), { icon: "tabler:folder" })
          ]),
          e("div", _t, [
            e("div", xt, [
              U(d(m.name), 1),
              e("span", wt, d(m.writable ? "read-write" : "read-only"), 1)
            ]),
            m.host_path ? (s(), o("div", $t, d(m.host_path), 1)) : y("", !0)
          ]),
          e("div", Ct, [
            m.deletable ? (s(), o("button", {
              key: 0,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete workspace",
              "aria-label": "Delete workspace",
              onClick: (z) => T(m)
            }, [
              C(c(L), { icon: "tabler:trash" })
            ], 8, Dt)) : y("", !0)
          ])
        ]))), 128))
      ]),
      h.value ? (s(), W(G, {
        key: 4,
        title: "Add workspace",
        onClose: i[6] || (i[6] = (m) => h.value = !1)
      }, {
        default: J(() => [
          e("div", At, [
            g.value.length ? (s(), o("div", Ut, [
              i[11] || (i[11] = e("span", null, "Allowed roots", -1)),
              e("div", Vt, [
                (s(!0), o(N, null, R(g.value, (m) => (s(), o("button", {
                  key: m,
                  type: "button",
                  class: "ac-chip ac-mono kx-focus-halo",
                  title: "Start from this root",
                  onClick: (z) => k.value = t(m)
                }, d(m), 9, It))), 128))
              ])
            ])) : (s(), o("p", Lt, "The host administrator configures allowed workspace roots.")),
            e("label", Et, [
              i[12] || (i[12] = e("span", null, "Name", -1)),
              P(e("input", {
                "onUpdate:modelValue": i[2] || (i[2] = (m) => w.value = m),
                onInput: i[3] || (i[3] = (m) => $.value = !0),
                autofocus: "",
                class: "kx-focus-halo",
                placeholder: "e.g. Kickside checkout"
              }, null, 544), [
                [S, w.value]
              ])
            ]),
            e("label", Pt, [
              i[13] || (i[13] = e("span", null, "Host directory", -1)),
              P(e("input", {
                "onUpdate:modelValue": i[4] || (i[4] = (m) => k.value = m),
                class: "ac-mono kx-focus-halo",
                placeholder: (g.value[0] ?? "/srv/work") + "/project"
              }, null, 8, St), [
                [S, k.value]
              ]),
              i[14] || (i[14] = e("small", { class: "ac-hint" }, [
                U("An existing directory, mounted at "),
                e("code", null, "/workspace"),
                U(".")
              ], -1))
            ]),
            p.value ? (s(), o("p", qt, d(p.value), 1)) : y("", !0),
            e("footer", Tt, [
              e("button", {
                class: "ac-btn kx-focus-halo",
                onClick: i[5] || (i[5] = (m) => h.value = !1)
              }, "Cancel"),
              e("button", {
                type: "button",
                class: "ac-btn primary kx-focus-halo",
                disabled: _.value || !w.value || !k.value,
                onClick: O
              }, [
                C(c(L), { icon: "tabler:folder-plus" }),
                U(d(_.value ? "Saving…" : "Add workspace"), 1)
              ], 8, Nt)
            ])
          ])
        ]),
        _: 1
      })) : y("", !0)
    ]));
  }
}), jt = { class: "ac-card ac-narrow" }, Bt = { class: "ac-card-head" }, Mt = { class: "ac-card-title" }, Wt = ["disabled"], Ot = {
  key: 0,
  class: "kx-err"
}, Ht = {
  key: 1,
  class: "ac-pre"
}, Kt = /* @__PURE__ */ K({
  __name: "maintenance",
  setup(D) {
    const I = v(!1), f = v(""), E = v("");
    async function V() {
      if (await F.confirm({
        header: "Clean up Docker",
        message: "Prune stopped Autocode containers and unused images and build cache across this Docker host? Other modules may use the shared image cache.",
        icon: "tabler:trash-x",
        acceptLabel: "Clean up",
        rejectLabel: "Cancel"
      })) {
        E.value = "", I.value = !0;
        try {
          f.value = await q.prune();
        } catch (a) {
          E.value = j(a, "Cleanup failed.");
        } finally {
          I.value = !1;
        }
      }
    }
    return (h, a) => (s(), o("section", jt, [
      e("div", Bt, [
        e("h2", Mt, [
          C(c(L), { icon: "tabler:brand-docker" }),
          a[0] || (a[0] = U("Docker cleanup", -1))
        ]),
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          disabled: I.value,
          onClick: V
        }, [
          C(c(L), {
            icon: I.value ? "tabler:loader-2" : "tabler:trash-x",
            class: H({ spin: I.value })
          }, null, 8, ["icon", "class"]),
          U(" " + d(I.value ? "Cleaning…" : "Clean up Docker"), 1)
        ], 8, Wt)
      ]),
      a[1] || (a[1] = e("p", { class: "ac-hint" }, "Prune stopped Autocode containers, dangling images and build cache across the Docker host. Tagged images stay.", -1)),
      E.value ? (s(), o("p", Ot, d(E.value), 1)) : y("", !0),
      f.value ? (s(), o("pre", Ht, d(f.value), 1)) : y("", !0)
    ]));
  }
}), zt = { class: "ac" }, Ft = { class: "ac-bar" }, Gt = { class: "ac-tabs" }, Jt = ["aria-pressed", "onClick"], Qt = {
  key: 0,
  class: "kx-err"
}, Xt = {
  key: 1,
  class: "kx-loading"
}, Yt = {
  key: 2,
  class: "ac-body"
}, Zt = /* @__PURE__ */ K({
  __name: "admin",
  setup(D) {
    const I = [
      { id: "images", label: "Images", icon: "tabler:box" },
      { id: "workspaces", label: "Workspaces", icon: "tabler:folder" },
      { id: "docker", label: "Docker", icon: "tabler:brand-docker" }
    ], f = v("images"), { catalog: E, error: V, load: h } = se(), a = v(""), g = v(0), p = v(null), _ = v(null);
    function w() {
      f.value === "images" ? p.value?.open() : _.value?.open();
    }
    return ($, k) => (s(), o("div", zt, [
      C(oe, {
        title: "Autocode",
        subtitle: "Manage agent images, workspaces and Docker.",
        count: f.value !== "docker" ? `${g.value} ${g.value === 1 ? f.value.slice(0, -1) : f.value}` : void 0,
        action: f.value === "images" ? "Add image" : f.value === "workspaces" ? "Add workspace" : void 0,
        query: a.value,
        "onUpdate:query": k[0] || (k[0] = (l) => a.value = l),
        placeholder: "Search resources…",
        onCreate: w
      }, null, 8, ["count", "action", "query"]),
      e("div", Ft, [
        e("nav", Gt, [
          (s(), o(N, null, R(I, (l) => e("button", {
            key: l.id,
            type: "button",
            class: H(["ac-tab kx-focus-outline", { active: f.value === l.id }]),
            "aria-pressed": f.value === l.id,
            onClick: (t) => {
              f.value = l.id, a.value = "", g.value = 0;
            }
          }, [
            C(c(L), {
              icon: l.icon
            }, null, 8, ["icon"]),
            U(" " + d(l.label), 1)
          ], 10, Jt)), 64))
        ])
      ]),
      c(V) && !c(E) ? (s(), o("p", Qt, [
        U(d(c(V)) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: k[1] || (k[1] = //@ts-ignore
          (...l) => c(h) && c(h)(...l))
        }, "Retry")
      ])) : c(E) ? (s(), o("main", Yt, [
        f.value === "images" ? (s(), W(dt, {
          key: 0,
          ref_key: "images",
          ref: p,
          query: a.value,
          onCount: k[2] || (k[2] = (l) => g.value = l)
        }, null, 8, ["query"])) : f.value === "workspaces" ? (s(), W(Rt, {
          key: 1,
          ref_key: "workspaces",
          ref: _,
          query: a.value,
          onCount: k[3] || (k[3] = (l) => g.value = l)
        }, null, 8, ["query"])) : (s(), W(Kt, { key: 2 }))
      ])) : (s(), o("div", Xt, [
        C(c(L), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        k[4] || (k[4] = U(" Loading…", -1))
      ]))
    ]));
  }
}), ea = { type: "object", properties: {} };
class ta extends ue {
  static get wippyConfig() {
    return { propsSchema: ea, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"], inlineCss: ne };
  }
  static get vueConfig() {
    return { rootComponent: Zt, plugins: [ie] };
  }
}
ve(import.meta.url, ta);
