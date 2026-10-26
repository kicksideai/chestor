import { u as Y, a as le, _ as G, b as se, c as oe, s as ne, P as ie } from "./styles-Dyj6gwe5.js";
import { u as Z, W as ue } from "./dto-BwnY4_Sk.js";
import { defineComponent as K, ref as v, watch as B, openBlock as s, createElementBlock as o, toDisplayString as d, createElementVNode as e, createVNode as C, unref as c, createTextVNode as V, createCommentVNode as y, Fragment as N, withDirectives as P, vModelText as S, normalizeClass as H, createStaticVNode as re, renderList as R, vModelCheckbox as ce, onUnmounted as de, computed as Q, createBlock as W, withCtx as J } from "vue";
import { Icon as U } from "@iconify/vue";
import { host as F, define as ve } from "@wippy-fe/proxy";
import { a as T, e as j, b as me, s as ee, p as pe } from "./presentation-BywIrdSa.js";
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
}, we = {
  key: 1,
  class: "ac-muted ac-mono"
}, xe = { class: "ac-field" }, $e = { class: "ac-field" }, Ce = { class: "ac-row-fields" }, De = { class: "ac-field" }, Ae = ["placeholder"], Le = { class: "ac-field" }, Ue = ["placeholder"], Ve = { class: "ac-field" }, Ie = { class: "ac-row-fields" }, Ee = { class: "ac-field" }, Pe = { class: "ac-field" }, Se = ["placeholder"], Te = {
  key: 2,
  class: "ac-field"
}, qe = { class: "ac-checks" }, Ne = ["value"], Be = { class: "ac-field" }, Re = { class: "ac-dialog-foot" }, je = ["disabled"], Me = {
  key: 3,
  class: "kx-err"
}, We = /* @__PURE__ */ K({
  __name: "image-form",
  props: {
    edit: {},
    capabilities: {}
  },
  emits: ["saved", "cancel"],
  setup(D, { emit: E }) {
    const m = D, A = E, I = Y();
    function h(l = I.value.default_image.settings) {
      return l ? {
        ref: "",
        mode: "pull",
        dockerfile: "",
        label: "",
        home: I.value.default_image.home,
        ...l,
        extra_args: [...l.extra_args],
        allows: [...l.allows],
        extra: ""
      } : null;
    }
    const t = v(h()), b = v(!1);
    B(() => t.value?.ref, (l) => {
      t.value && !m.edit && !b.value && l !== void 0 && (t.value.label = l);
    });
    const p = v(!1), g = v("");
    B(() => m.edit, (l) => {
      if (g.value = "", b.value = !!l, !l) {
        t.value = h();
        return;
      }
      if (!l.settings) {
        t.value = null;
        return;
      }
      const a = l.settings;
      t.value = {
        ...a,
        ref: l.image.ref,
        label: l.image.label,
        home: l.image.home,
        mode: "pull",
        dockerfile: l.dockerfile ?? "",
        extra: a.extra_args.join(`
`),
        allows: [...a.allows]
      };
    }, { immediate: !0 });
    function _() {
      const l = I.value.default_image;
      b.value = !1;
      const a = h();
      t.value = a ? { ...a, ref: l.ref, label: l.label, home: l.home, mode: "build", dockerfile: l.dockerfile } : null;
    }
    function $() {
      const l = t.value;
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
`).map((a) => a.trim()).filter(Boolean),
        allows: [...l.allows]
      };
    }
    async function w() {
      if (t.value) {
        g.value = "", p.value = !0;
        try {
          let l;
          if (m.edit)
            await T.updateImage(m.edit.image.id, $());
          else {
            const a = t.value, n = await T.createImage({ ...$(), ref: a.ref, dockerfile: a.mode === "build" ? a.dockerfile : "" });
            n.build_error && (l = `Image created. Build preparation has not started: ${n.build_error.message}. Use Prepare image to retry.`), t.value = h();
          }
          A("saved", l);
        } catch (l) {
          g.value = j(l, "Could not save the image.");
        } finally {
          p.value = !1;
        }
      }
    }
    return (l, a) => t.value ? (s(), o("section", fe, [
      e("div", be, [
        e("span", ge, d(D.edit ? "Container settings" : "Use an image reference or the default agent recipe."), 1),
        D.edit ? y("", !0) : (s(), o("button", {
          key: 0,
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: _
        }, [
          C(c(U), { icon: "tabler:sparkles" }),
          a[15] || (a[15] = V(" Default agent image", -1))
        ]))
      ]),
      D.edit ? (s(), o("p", we, d(D.edit.image.ref), 1)) : (s(), o(N, { key: 0 }, [
        e("label", ye, [
          a[16] || (a[16] = e("span", null, "Image reference", -1)),
          P(e("input", {
            "onUpdate:modelValue": a[0] || (a[0] = (n) => t.value.ref = n),
            class: "ac-mono kx-focus-halo",
            placeholder: "registry/name:tag"
          }, null, 512), [
            [S, t.value.ref]
          ])
        ]),
        e("div", he, [
          e("button", {
            type: "button",
            class: H(["kx-focus-outline", { active: t.value.mode === "pull" }]),
            onClick: a[1] || (a[1] = (n) => t.value.mode = "pull")
          }, "Use or pull existing", 2),
          e("button", {
            type: "button",
            class: H(["kx-focus-outline", { active: t.value.mode === "build" }]),
            onClick: a[2] || (a[2] = (n) => t.value.mode = "build")
          }, "Build from Dockerfile", 2)
        ]),
        t.value.mode === "build" ? (s(), o("label", _e, [
          a[17] || (a[17] = e("span", null, "Dockerfile", -1)),
          P(e("textarea", {
            "onUpdate:modelValue": a[3] || (a[3] = (n) => t.value.dockerfile = n),
            rows: "9",
            class: "ac-mono kx-focus-halo"
          }, null, 512), [
            [S, t.value.dockerfile]
          ]),
          a[18] || (a[18] = re('<small class="ac-hint">Include <code>sh</code>, <code>git</code>, <code>mkdir</code>, <code>dirname</code>, a <code>timeout</code> that supports <code>-k</code>, and the agent CLIs. The image user needs writable home and work directories.</small>', 1))
        ])) : y("", !0)
      ], 64)),
      e("label", xe, [
        a[19] || (a[19] = e("span", null, "Label", -1)),
        P(e("input", {
          "onUpdate:modelValue": a[4] || (a[4] = (n) => t.value.label = n),
          class: "kx-focus-halo",
          onInput: a[5] || (a[5] = (n) => b.value = !0)
        }, null, 544), [
          [S, t.value.label]
        ])
      ]),
      e("label", $e, [
        a[20] || (a[20] = e("span", null, "Home directory in the image", -1)),
        P(e("input", {
          "onUpdate:modelValue": a[6] || (a[6] = (n) => t.value.home = n),
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [S, t.value.home]
        ])
      ]),
      e("div", Ce, [
        e("label", De, [
          a[21] || (a[21] = e("span", null, "Memory", -1)),
          P(e("input", {
            "onUpdate:modelValue": a[7] || (a[7] = (n) => t.value.memory = n),
            class: "ac-mono kx-focus-halo",
            placeholder: c(I).default_image.settings?.memory
          }, null, 8, Ae), [
            [S, t.value.memory]
          ])
        ]),
        e("label", Le, [
          a[22] || (a[22] = e("span", null, "CPUs", -1)),
          P(e("input", {
            "onUpdate:modelValue": a[8] || (a[8] = (n) => t.value.cpus = n),
            class: "ac-mono kx-focus-halo",
            placeholder: c(I).default_image.settings?.cpus
          }, null, 8, Ue), [
            [S, t.value.cpus]
          ])
        ]),
        e("label", Ve, [
          a[23] || (a[23] = e("span", null, "PIDs limit", -1)),
          P(e("input", {
            "onUpdate:modelValue": a[9] || (a[9] = (n) => t.value.pids_limit = n),
            type: "number",
            min: "0",
            class: "ac-mono kx-focus-halo"
          }, null, 512), [
            [
              S,
              t.value.pids_limit,
              void 0,
              { number: !0 }
            ]
          ])
        ])
      ]),
      e("div", Ie, [
        e("label", Ee, [
          a[24] || (a[24] = e("span", null, "GPUs", -1)),
          P(e("input", {
            "onUpdate:modelValue": a[10] || (a[10] = (n) => t.value.gpus = n),
            class: "ac-mono kx-focus-halo",
            placeholder: "all, or device=0"
          }, null, 512), [
            [S, t.value.gpus]
          ])
        ]),
        e("label", Pe, [
          a[25] || (a[25] = e("span", null, "Network", -1)),
          P(e("input", {
            "onUpdate:modelValue": a[11] || (a[11] = (n) => t.value.network = n),
            class: "ac-mono kx-focus-halo",
            placeholder: c(I).default_image.settings?.network
          }, null, 8, Se), [
            [S, t.value.network]
          ])
        ])
      ]),
      D.capabilities?.length ? (s(), o("div", Te, [
        a[26] || (a[26] = e("span", null, "Agents may", -1)),
        e("div", qe, [
          (s(!0), o(N, null, R(D.capabilities, (n) => (s(), o("label", {
            key: n,
            class: "ac-check ac-mono"
          }, [
            P(e("input", {
              "onUpdate:modelValue": a[12] || (a[12] = (O) => t.value.allows = O),
              type: "checkbox",
              class: "kx-focus-outline",
              value: n
            }, null, 8, Ne), [
              [ce, t.value.allows]
            ]),
            V(" " + d(n), 1)
          ]))), 128))
        ])
      ])) : y("", !0),
      e("label", Be, [
        a[27] || (a[27] = e("span", null, "Extra docker run arguments", -1)),
        P(e("textarea", {
          "onUpdate:modelValue": a[13] || (a[13] = (n) => t.value.extra = n),
          rows: "3",
          class: "ac-mono kx-focus-halo",
          placeholder: `One argument per line, e.g.
--device=/dev/dri
--shm-size=2g`
        }, null, 512), [
          [S, t.value.extra]
        ])
      ]),
      e("footer", Re, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: a[14] || (a[14] = (n) => A("cancel"))
        }, "Cancel"),
        e("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: p.value || !D.capabilities || !D.edit && !t.value.ref,
          onClick: w
        }, [
          C(c(U), { icon: "tabler:box" }),
          V(" " + d(p.value ? "Saving…" : D.edit ? "Save settings" : t.value.mode === "build" ? "Build image" : "Add image"), 1)
        ], 8, je)
      ]),
      g.value ? (s(), o("p", Me, d(g.value), 1)) : y("", !0)
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
}, Je = { class: "ac-list ac-resource-list" }, Qe = { class: "ac-resource-icon" }, Xe = { class: "ac-account-main" }, Ye = { class: "ac-row-title" }, Ze = { class: "ac-muted ac-mono" }, ea = { class: "ac-chips" }, aa = { class: "ac-muted" }, ta = {
  key: 0,
  class: "kx-err ac-small"
}, la = { class: "ac-row-actions" }, sa = ["disabled", "onClick"], oa = ["onClick"], na = ["onClick"], ia = ["onClick"], ua = { class: "ac-form" }, ra = { class: "ac-mono" }, ca = { class: "ac-pre ac-build-log" }, da = /* @__PURE__ */ K({
  __name: "images",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(D, { expose: E, emit: m }) {
    const A = Y(), I = D, h = m, t = v(!1), b = v({});
    E({ open: () => {
      t.value = !0;
    } });
    const p = v([]), g = v(""), _ = v(null), $ = v(null), w = v(null), l = v(!1);
    let a = !0, n = 0;
    de(() => {
      a = !1, n++;
    });
    async function O(i) {
      const f = n, r = await T.image(i);
      !a || f !== n || $.value?.id !== i || ($.value = { id: i, ref: r.image.ref, text: r.build_log || "(empty)" });
    }
    const q = ee(async () => {
      try {
        const [i, f] = await Promise.all([T.images(), T.drivers()]), r = await pe([...new Set(i.map((L) => L.owner))]);
        if (!a) return;
        p.value = i, b.value = Object.fromEntries(i.map((L) => [L.id, `Owner: ${r[L.owner] || L.owner}`])), w.value = [...new Set(f.flatMap((L) => L.capabilities))].sort(), $.value && i.some((L) => L.id === $.value?.id) && await O($.value.id), l.value = !0, g.value = "";
      } catch (i) {
        g.value = j(i, "Could not load images.");
      }
    });
    le(() => p.value.map((i) => i.id), () => {
      q();
    }), Z(q);
    async function M(i, f) {
      g.value = "";
      try {
        await i(), await q();
      } catch (r) {
        g.value = j(r, f);
      }
    }
    const x = (i) => M(async () => {
      _.value = await T.image(i.id);
    }, "Could not load the image settings."), u = (i) => M(() => T.prepareImage(i.id), "Could not start the image preparation.");
    function k(i) {
      n++, $.value = { id: i.id, ref: i.ref, text: "Loading…" }, q();
    }
    function z() {
      n++, $.value = null;
    }
    async function ae(i) {
      _.value = null, t.value = !1, await q(), i && (g.value = i);
    }
    async function te(i) {
      if (!await F.confirm({
        header: "Delete image",
        message: `Delete image "${i.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) return;
      const r = await F.confirm({
        header: "Docker image",
        message: `Also remove ${i.ref} from Docker on the host? Keeping it lets a later image with the same reference reuse it.`,
        icon: "tabler:brand-docker",
        acceptLabel: "Remove from Docker",
        rejectLabel: "Keep in Docker",
        acceptClass: "p-button-danger"
      });
      _.value?.image.id === i.id && (_.value = null), $.value?.id === i.id && z(), await M(() => T.deleteImage(i.id, r), "Could not delete the image.");
    }
    const X = Q(() => p.value.filter((i) => [i.label, i.ref, ...i.agents].join(" ").toLowerCase().includes(I.query.toLowerCase())));
    return B(p, (i) => h("count", i.length)), (i, f) => (s(), o("div", Oe, [
      f[7] || (f[7] = e("p", { class: "ac-hint" }, "Ready images with READ access are available to tasks.", -1)),
      g.value ? (s(), o("p", He, [
        V(d(g.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: f[0] || (f[0] = //@ts-ignore
          (...r) => c(q) && c(q)(...r))
        }, "Retry")
      ])) : y("", !0),
      !l.value && !g.value ? (s(), o("div", Ke, "Loading images…")) : y("", !0),
      l.value && !p.value.length ? (s(), o("div", ze, [
        e("div", Fe, [
          C(c(U), { icon: "tabler:box" })
        ]),
        f[4] || (f[4] = e("div", { class: "kx-empty-title" }, "No images yet", -1)),
        f[5] || (f[5] = e("div", { class: "kx-empty-sub" }, "Start with the default agent recipe or use an existing image.", -1)),
        e("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: f[1] || (f[1] = (r) => t.value = !0)
        }, "Add image")
      ])) : l.value && !X.value.length ? (s(), o("div", Ge, [...f[6] || (f[6] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another image, reference or agent.", -1)
      ])])) : y("", !0),
      e("ul", Je, [
        (s(!0), o(N, null, R(X.value, (r) => (s(), o("li", {
          key: r.id,
          class: "ac-row ac-resource"
        }, [
          e("span", Qe, [
            C(c(U), { icon: "tabler:box" })
          ]),
          e("div", Xe, [
            e("div", Ye, [
              V(d(r.label), 1),
              e("span", {
                class: H(["kx-tag-sm ac-tone", r.status])
              }, d(r.status), 3)
            ]),
            e("div", Ze, d(r.ref) + " · " + d(r.home), 1),
            e("div", ea, [
              (s(!0), o(N, null, R(r.agents, (L) => (s(), o("span", {
                key: L,
                class: "kx-tag-sm ac-tone"
              }, [
                C(c(U), {
                  icon: c(me)(L, c(A).agents)
                }, null, 8, ["icon"]),
                V(d(L), 1)
              ]))), 128))
            ]),
            e("div", aa, d(b.value[r.id]), 1),
            r.last_error ? (s(), o("div", ta, d(r.last_error), 1)) : y("", !0)
          ]),
          e("div", la, [
            r.writable ? (s(), o("button", {
              key: 0,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Prepare image",
              "aria-label": "Prepare image",
              disabled: r.status === "preparing",
              onClick: (L) => u(r)
            }, [
              C(c(U), { icon: "tabler:refresh" })
            ], 8, sa)) : y("", !0),
            e("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Build log",
              "aria-label": "Build log",
              onClick: (L) => k(r)
            }, [
              C(c(U), { icon: "tabler:file-text" })
            ], 8, oa),
            r.writable ? (s(), o("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Edit settings",
              "aria-label": "Edit settings",
              onClick: (L) => x(r)
            }, [
              C(c(U), { icon: "tabler:pencil" })
            ], 8, na)) : y("", !0),
            r.deletable ? (s(), o("button", {
              key: 2,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete image",
              "aria-label": "Delete image",
              onClick: (L) => te(r)
            }, [
              C(c(U), { icon: "tabler:trash" })
            ], 8, ia)) : y("", !0)
          ])
        ]))), 128))
      ]),
      t.value || _.value ? (s(), W(G, {
        key: 4,
        title: _.value ? "Edit image" : "Add image",
        wide: "",
        onClose: f[3] || (f[3] = (r) => {
          t.value = !1, _.value = null;
        })
      }, {
        default: J(() => [
          C(We, {
            edit: _.value,
            capabilities: w.value,
            onSaved: ae,
            onCancel: f[2] || (f[2] = (r) => {
              t.value = !1, _.value = null;
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
          e("div", ua, [
            e("strong", ra, d($.value.ref), 1),
            e("pre", ca, d($.value.text), 1)
          ])
        ]),
        _: 1
      })) : y("", !0)
    ]));
  }
}), va = { class: "ac-stack" }, ma = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, pa = {
  key: 1,
  class: "kx-loading"
}, ka = { class: "ac-chips" }, fa = {
  key: 2,
  class: "kx-empty"
}, ba = { class: "kx-empty-ico" }, ga = {
  key: 3,
  class: "kx-empty"
}, ya = { class: "ac-list ac-resource-list" }, ha = { class: "ac-resource-icon" }, _a = { class: "ac-account-main" }, wa = { class: "ac-row-title" }, xa = { class: "kx-tag-sm ac-tone" }, $a = {
  key: 0,
  class: "ac-muted ac-mono"
}, Ca = { class: "ac-row-actions" }, Da = ["onClick"], Aa = { class: "ac-form" }, La = {
  key: 0,
  class: "ac-muted"
}, Ua = {
  key: 1,
  class: "ac-field"
}, Va = { class: "ac-chips" }, Ia = ["onClick"], Ea = { class: "ac-field" }, Pa = { class: "ac-field" }, Sa = ["placeholder"], Ta = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, qa = { class: "ac-dialog-foot" }, Na = ["disabled"], Ba = /* @__PURE__ */ K({
  __name: "workspaces",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(D, { expose: E, emit: m }) {
    const A = D, I = m, h = v(!1);
    E({ open: () => {
      h.value = !0;
    } });
    const t = v([]), b = v([]), p = v(""), g = v(!1), _ = v(""), $ = v(!1), w = v(""), l = v(!1);
    function a(x) {
      return x.replace(/\/+$/, "") + "/";
    }
    B([h, b], () => {
      h.value && !w.value && b.value.length && (w.value = a(b.value[0]));
    }), B(w, (x) => {
      $.value || (_.value = x.trim().split("/").filter(Boolean).pop() ?? "");
    });
    const n = ee(async () => {
      try {
        const x = await T.workspaces();
        t.value = x.workspaces, b.value = x.roots ?? [], l.value = !0, p.value = "";
      } catch (x) {
        p.value = j(x, "Could not load workspaces.");
      }
    });
    Z(n);
    async function O() {
      p.value = "", g.value = !0;
      try {
        await T.createWorkspace({ name: _.value, host_path: w.value }), $.value = !1, _.value = "", w.value = "", h.value = !1, await n();
      } catch (x) {
        p.value = j(x, "Could not save the workspace.");
      } finally {
        g.value = !1;
      }
    }
    async function q(x) {
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
          await T.deleteWorkspace(x.id), await n();
        } catch (k) {
          p.value = j(k, "Could not delete the workspace.");
        }
      }
    }
    const M = Q(() => t.value.filter((x) => [x.name, x.host_path].join(" ").toLowerCase().includes(A.query.toLowerCase())));
    return B(t, (x) => I("count", x.length)), (x, u) => (s(), o("div", va, [
      u[15] || (u[15] = e("p", { class: "ac-hint" }, "READ mounts a workspace read-only; WRITE allows changes.", -1)),
      p.value && !h.value ? (s(), o("p", ma, [
        V(d(p.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: u[0] || (u[0] = //@ts-ignore
          (...k) => c(n) && c(n)(...k))
        }, "Retry")
      ])) : y("", !0),
      !l.value && !p.value ? (s(), o("div", pa, "Loading workspaces…")) : y("", !0),
      e("div", ka, [
        u[7] || (u[7] = e("span", { class: "ac-muted" }, "Allowed roots", -1)),
        (s(!0), o(N, null, R(b.value, (k) => (s(), o("span", {
          key: k,
          class: "ac-hint-chip ac-mono"
        }, d(k), 1))), 128))
      ]),
      l.value && !t.value.length ? (s(), o("div", fa, [
        e("div", ba, [
          C(c(U), { icon: "tabler:folder" })
        ]),
        u[8] || (u[8] = e("div", { class: "kx-empty-title" }, "No workspaces yet", -1)),
        u[9] || (u[9] = e("div", { class: "kx-empty-sub" }, "Add a host directory, or let tasks use a scratch directory.", -1)),
        e("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: u[1] || (u[1] = (k) => h.value = !0)
        }, "Add workspace")
      ])) : l.value && !M.value.length ? (s(), o("div", ga, [...u[10] || (u[10] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another workspace name or path.", -1)
      ])])) : y("", !0),
      e("ul", ya, [
        (s(!0), o(N, null, R(M.value, (k) => (s(), o("li", {
          key: k.id,
          class: "ac-row ac-resource"
        }, [
          e("span", ha, [
            C(c(U), { icon: "tabler:folder" })
          ]),
          e("div", _a, [
            e("div", wa, [
              V(d(k.name), 1),
              e("span", xa, d(k.writable ? "read-write" : "read-only"), 1)
            ]),
            k.host_path ? (s(), o("div", $a, d(k.host_path), 1)) : y("", !0)
          ]),
          e("div", Ca, [
            k.deletable ? (s(), o("button", {
              key: 0,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete workspace",
              "aria-label": "Delete workspace",
              onClick: (z) => q(k)
            }, [
              C(c(U), { icon: "tabler:trash" })
            ], 8, Da)) : y("", !0)
          ])
        ]))), 128))
      ]),
      h.value ? (s(), W(G, {
        key: 4,
        title: "Add workspace",
        onClose: u[6] || (u[6] = (k) => h.value = !1)
      }, {
        default: J(() => [
          e("div", Aa, [
            b.value.length ? (s(), o("div", Ua, [
              u[11] || (u[11] = e("span", null, "Allowed roots", -1)),
              e("div", Va, [
                (s(!0), o(N, null, R(b.value, (k) => (s(), o("button", {
                  key: k,
                  type: "button",
                  class: "ac-chip ac-mono kx-focus-halo",
                  title: "Start from this root",
                  onClick: (z) => w.value = a(k)
                }, d(k), 9, Ia))), 128))
              ])
            ])) : (s(), o("p", La, "The host administrator configures allowed workspace roots.")),
            e("label", Ea, [
              u[12] || (u[12] = e("span", null, "Name", -1)),
              P(e("input", {
                "onUpdate:modelValue": u[2] || (u[2] = (k) => _.value = k),
                onInput: u[3] || (u[3] = (k) => $.value = !0),
                autofocus: "",
                class: "kx-focus-halo",
                placeholder: "e.g. Kickside checkout"
              }, null, 544), [
                [S, _.value]
              ])
            ]),
            e("label", Pa, [
              u[13] || (u[13] = e("span", null, "Host directory", -1)),
              P(e("input", {
                "onUpdate:modelValue": u[4] || (u[4] = (k) => w.value = k),
                class: "ac-mono kx-focus-halo",
                placeholder: (b.value[0] ?? "/srv/work") + "/project"
              }, null, 8, Sa), [
                [S, w.value]
              ]),
              u[14] || (u[14] = e("small", { class: "ac-hint" }, [
                V("An existing directory, mounted at "),
                e("code", null, "/workspace"),
                V(".")
              ], -1))
            ]),
            p.value ? (s(), o("p", Ta, d(p.value), 1)) : y("", !0),
            e("footer", qa, [
              e("button", {
                class: "ac-btn kx-focus-halo",
                onClick: u[5] || (u[5] = (k) => h.value = !1)
              }, "Cancel"),
              e("button", {
                type: "button",
                class: "ac-btn primary kx-focus-halo",
                disabled: g.value || !_.value || !w.value,
                onClick: O
              }, [
                C(c(U), { icon: "tabler:folder-plus" }),
                V(d(g.value ? "Saving…" : "Add workspace"), 1)
              ], 8, Na)
            ])
          ])
        ]),
        _: 1
      })) : y("", !0)
    ]));
  }
}), Ra = { class: "ac-card ac-narrow" }, ja = { class: "ac-card-head" }, Ma = { class: "ac-card-title" }, Wa = ["disabled"], Oa = {
  key: 0,
  class: "kx-err"
}, Ha = {
  key: 1,
  class: "ac-pre"
}, Ka = /* @__PURE__ */ K({
  __name: "maintenance",
  setup(D) {
    const E = v(!1), m = v(""), A = v("");
    async function I() {
      if (await F.confirm({
        header: "Clean up Docker",
        message: "Prune stopped Autocode containers and unused images and build cache across this Docker host? Other modules may use the shared image cache.",
        icon: "tabler:trash-x",
        acceptLabel: "Clean up",
        rejectLabel: "Cancel"
      })) {
        A.value = "", E.value = !0;
        try {
          m.value = await T.prune();
        } catch (t) {
          A.value = j(t, "Cleanup failed.");
        } finally {
          E.value = !1;
        }
      }
    }
    return (h, t) => (s(), o("section", Ra, [
      e("div", ja, [
        e("h2", Ma, [
          C(c(U), { icon: "tabler:brand-docker" }),
          t[0] || (t[0] = V("Docker cleanup", -1))
        ]),
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          disabled: E.value,
          onClick: I
        }, [
          C(c(U), {
            icon: E.value ? "tabler:loader-2" : "tabler:trash-x",
            class: H({ spin: E.value })
          }, null, 8, ["icon", "class"]),
          V(" " + d(E.value ? "Cleaning…" : "Clean up Docker"), 1)
        ], 8, Wa)
      ]),
      t[1] || (t[1] = e("p", { class: "ac-hint" }, "Prune stopped Autocode containers, dangling images and build cache across the Docker host. Tagged images stay.", -1)),
      A.value ? (s(), o("p", Oa, d(A.value), 1)) : y("", !0),
      m.value ? (s(), o("pre", Ha, d(m.value), 1)) : y("", !0)
    ]));
  }
}), za = { class: "ac" }, Fa = { class: "ac-bar" }, Ga = { class: "ac-tabs" }, Ja = ["aria-pressed", "onClick"], Qa = {
  key: 0,
  class: "kx-err"
}, Xa = {
  key: 1,
  class: "kx-loading"
}, Ya = {
  key: 2,
  class: "ac-body"
}, Za = {
  key: 3,
  class: "ac-muted"
}, et = /* @__PURE__ */ K({
  __name: "admin",
  setup(D) {
    const E = [
      { id: "images", label: "Images", icon: "tabler:box" },
      { id: "workspaces", label: "Workspaces", icon: "tabler:folder" },
      { id: "docker", label: "Docker", icon: "tabler:brand-docker" }
    ], m = v(), { catalog: A, error: I, load: h } = se(), t = Q(() => E.filter((w) => w.id === "images" ? A.value?.can_images : w.id === "workspaces" ? A.value?.can_workspaces : A.value?.can_prune));
    B(t, (w) => {
      w.some((l) => l.id === m.value) || (m.value = w[0]?.id);
    }, { immediate: !0 });
    const b = v(""), p = v(0), g = v(null), _ = v(null);
    function $() {
      m.value === "images" ? g.value?.open() : _.value?.open();
    }
    return (w, l) => (s(), o("div", za, [
      C(oe, {
        title: "Autocode",
        subtitle: "Manage agent images, workspaces and Docker.",
        count: m.value && m.value !== "docker" ? `${p.value} ${p.value === 1 ? m.value.slice(0, -1) : m.value}` : void 0,
        action: m.value === "images" ? "Add image" : m.value === "workspaces" ? "Add workspace" : void 0,
        query: b.value,
        "onUpdate:query": l[0] || (l[0] = (a) => b.value = a),
        placeholder: "Search resources…",
        onCreate: $
      }, null, 8, ["count", "action", "query"]),
      e("div", Fa, [
        e("nav", Ga, [
          (s(!0), o(N, null, R(t.value, (a) => (s(), o("button", {
            key: a.id,
            type: "button",
            class: H(["ac-tab kx-focus-outline", { active: m.value === a.id }]),
            "aria-pressed": m.value === a.id,
            onClick: (n) => {
              m.value = a.id, b.value = "", p.value = 0;
            }
          }, [
            C(c(U), {
              icon: a.icon
            }, null, 8, ["icon"]),
            V(" " + d(a.label), 1)
          ], 10, Ja))), 128))
        ])
      ]),
      c(I) && !c(A) ? (s(), o("p", Qa, [
        V(d(c(I)) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: l[1] || (l[1] = //@ts-ignore
          (...a) => c(h) && c(h)(...a))
        }, "Retry")
      ])) : c(A) ? (s(), o("main", Ya, [
        m.value === "images" ? (s(), W(da, {
          key: 0,
          ref_key: "images",
          ref: g,
          query: b.value,
          onCount: l[2] || (l[2] = (a) => p.value = a)
        }, null, 8, ["query"])) : m.value === "workspaces" ? (s(), W(Ba, {
          key: 1,
          ref_key: "workspaces",
          ref: _,
          query: b.value,
          onCount: l[3] || (l[3] = (a) => p.value = a)
        }, null, 8, ["query"])) : m.value === "docker" ? (s(), W(Ka, { key: 2 })) : (s(), o("p", Za, "No management areas are available."))
      ])) : (s(), o("div", Xa, [
        C(c(U), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        l[4] || (l[4] = V(" Loading…", -1))
      ]))
    ]));
  }
}), at = { type: "object", properties: {} };
class tt extends ue {
  static get wippyConfig() {
    return { propsSchema: at, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"], inlineCss: ne };
  }
  static get vueConfig() {
    return { rootComponent: et, plugins: [ie] };
  }
}
ve(import.meta.url, tt);
