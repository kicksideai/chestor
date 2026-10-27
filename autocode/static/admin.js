import { u as Z, a as se, _ as G, b as oe, c as ne, s as ie, P as ue } from "./styles-7hidlKti.js";
import { u as ee, W as re } from "./dto-BHfrzLGW.js";
import { defineComponent as H, ref as v, watch as j, openBlock as s, createElementBlock as o, toDisplayString as p, createElementVNode as e, createVNode as C, unref as c, createTextVNode as V, createCommentVNode as h, Fragment as B, withDirectives as S, vModelText as T, normalizeClass as W, createStaticVNode as ce, renderList as R, vModelCheckbox as de, onUnmounted as ve, computed as Q, createBlock as O, withCtx as J } from "vue";
import { Icon as A } from "@iconify/vue";
import { host as K, define as me } from "@wippy-fe/proxy";
import { a as q, e as M, b as pe, s as ae, p as ke } from "./presentation-Qrstrb4O.js";
const fe = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, be = ["disabled"], ge = { class: "ac-card-head" }, ye = { class: "ac-muted" }, he = { class: "ac-field" }, _e = { class: "ac-seg" }, we = {
  key: 0,
  class: "ac-field"
}, xe = {
  key: 1,
  class: "ac-muted ac-mono"
}, $e = { class: "ac-field" }, Ce = { class: "ac-field" }, De = { class: "ac-row-fields" }, Le = { class: "ac-field" }, Ue = ["placeholder"], Ae = { class: "ac-field" }, Ve = ["placeholder"], Ie = { class: "ac-field" }, Pe = { class: "ac-row-fields" }, Se = { class: "ac-field" }, Te = { class: "ac-field" }, qe = ["placeholder"], Ee = {
  key: 2,
  class: "ac-field"
}, Ne = { class: "ac-checks" }, Be = ["value"], je = { class: "ac-field" }, Re = { class: "ac-dialog-foot" }, Me = ["disabled"], Oe = {
  key: 3,
  class: "kx-err"
}, We = /* @__PURE__ */ H({
  __name: "image-form",
  props: {
    edit: {},
    capabilities: {}
  },
  emits: ["saved", "cancel", "busy"],
  setup(D, { emit: P }) {
    const m = D, $ = P, I = Z();
    function w(l = I.value.default_image.settings) {
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
    const t = v(w()), g = v(!1);
    j(() => t.value?.ref, (l) => {
      t.value && !m.edit && !g.value && l !== void 0 && (t.value.label = l);
    });
    const f = v(!1), _ = v("");
    j(() => m.edit, (l) => {
      if (_.value = "", g.value = !!l, !l) {
        t.value = w();
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
    function x() {
      const l = I.value.default_image;
      g.value = !1;
      const a = w();
      t.value = a ? { ...a, ref: l.ref, label: l.label, home: l.home, mode: "build", dockerfile: l.dockerfile } : null;
    }
    function L() {
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
    async function d() {
      if (!(!t.value || f.value)) {
        _.value = "", f.value = !0, $("busy", !0);
        try {
          let l;
          if (m.edit)
            await q.updateImage(m.edit.image.id, L());
          else {
            const a = t.value, n = await q.createImage({ ...L(), ref: a.ref, dockerfile: a.mode === "build" ? a.dockerfile : "" });
            n.build_error && (l = `Image created. Build preparation has not started: ${n.build_error.message}. Use Prepare image to retry.`), t.value = w();
          }
          $("saved", l);
        } catch (l) {
          _.value = M(l, "Could not save the image.");
        } finally {
          f.value = !1, $("busy", !1);
        }
      }
    }
    return (l, a) => t.value ? (s(), o("fieldset", {
      key: 1,
      class: "ac-form",
      disabled: f.value
    }, [
      e("div", ge, [
        e("span", ye, p(D.edit ? "Container settings" : "Use an image reference or the default agent recipe."), 1),
        D.edit ? h("", !0) : (s(), o("button", {
          key: 0,
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: x
        }, [
          C(c(A), { icon: "tabler:sparkles" }),
          a[15] || (a[15] = V(" Default agent image", -1))
        ]))
      ]),
      D.edit ? (s(), o("p", xe, p(D.edit.image.ref), 1)) : (s(), o(B, { key: 0 }, [
        e("label", he, [
          a[16] || (a[16] = e("span", null, "Image reference", -1)),
          S(e("input", {
            "onUpdate:modelValue": a[0] || (a[0] = (n) => t.value.ref = n),
            class: "ac-mono kx-focus-halo",
            placeholder: "registry/name:tag"
          }, null, 512), [
            [T, t.value.ref]
          ])
        ]),
        e("div", _e, [
          e("button", {
            type: "button",
            class: W(["kx-focus-outline", { active: t.value.mode === "pull" }]),
            onClick: a[1] || (a[1] = (n) => t.value.mode = "pull")
          }, "Use or pull existing", 2),
          e("button", {
            type: "button",
            class: W(["kx-focus-outline", { active: t.value.mode === "build" }]),
            onClick: a[2] || (a[2] = (n) => t.value.mode = "build")
          }, "Build from Dockerfile", 2)
        ]),
        t.value.mode === "build" ? (s(), o("label", we, [
          a[17] || (a[17] = e("span", null, "Dockerfile", -1)),
          S(e("textarea", {
            "onUpdate:modelValue": a[3] || (a[3] = (n) => t.value.dockerfile = n),
            rows: "9",
            class: "ac-mono kx-focus-halo"
          }, null, 512), [
            [T, t.value.dockerfile]
          ]),
          a[18] || (a[18] = ce('<small class="ac-hint">Include <code>sh</code>, <code>git</code>, <code>mkdir</code>, <code>dirname</code>, a <code>timeout</code> that supports <code>-k</code>, and the agent CLIs. The image user needs writable home and work directories.</small>', 1))
        ])) : h("", !0)
      ], 64)),
      e("label", $e, [
        a[19] || (a[19] = e("span", null, "Label", -1)),
        S(e("input", {
          "onUpdate:modelValue": a[4] || (a[4] = (n) => t.value.label = n),
          class: "kx-focus-halo",
          onInput: a[5] || (a[5] = (n) => g.value = !0)
        }, null, 544), [
          [T, t.value.label]
        ])
      ]),
      e("label", Ce, [
        a[20] || (a[20] = e("span", null, "Home directory in the image", -1)),
        S(e("input", {
          "onUpdate:modelValue": a[6] || (a[6] = (n) => t.value.home = n),
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [T, t.value.home]
        ])
      ]),
      e("div", De, [
        e("label", Le, [
          a[21] || (a[21] = e("span", null, "Memory", -1)),
          S(e("input", {
            "onUpdate:modelValue": a[7] || (a[7] = (n) => t.value.memory = n),
            class: "ac-mono kx-focus-halo",
            placeholder: c(I).default_image.settings?.memory
          }, null, 8, Ue), [
            [T, t.value.memory]
          ])
        ]),
        e("label", Ae, [
          a[22] || (a[22] = e("span", null, "CPUs", -1)),
          S(e("input", {
            "onUpdate:modelValue": a[8] || (a[8] = (n) => t.value.cpus = n),
            class: "ac-mono kx-focus-halo",
            placeholder: c(I).default_image.settings?.cpus
          }, null, 8, Ve), [
            [T, t.value.cpus]
          ])
        ]),
        e("label", Ie, [
          a[23] || (a[23] = e("span", null, "PIDs limit", -1)),
          S(e("input", {
            "onUpdate:modelValue": a[9] || (a[9] = (n) => t.value.pids_limit = n),
            type: "number",
            min: "0",
            class: "ac-mono kx-focus-halo"
          }, null, 512), [
            [
              T,
              t.value.pids_limit,
              void 0,
              { number: !0 }
            ]
          ])
        ])
      ]),
      e("div", Pe, [
        e("label", Se, [
          a[24] || (a[24] = e("span", null, "GPUs", -1)),
          S(e("input", {
            "onUpdate:modelValue": a[10] || (a[10] = (n) => t.value.gpus = n),
            class: "ac-mono kx-focus-halo",
            placeholder: "all, or device=0"
          }, null, 512), [
            [T, t.value.gpus]
          ])
        ]),
        e("label", Te, [
          a[25] || (a[25] = e("span", null, "Network", -1)),
          S(e("input", {
            "onUpdate:modelValue": a[11] || (a[11] = (n) => t.value.network = n),
            class: "ac-mono kx-focus-halo",
            placeholder: c(I).default_image.settings?.network
          }, null, 8, qe), [
            [T, t.value.network]
          ])
        ])
      ]),
      D.capabilities?.length ? (s(), o("div", Ee, [
        a[26] || (a[26] = e("span", null, "Agents may", -1)),
        e("div", Ne, [
          (s(!0), o(B, null, R(D.capabilities, (n) => (s(), o("label", {
            key: n,
            class: "ac-check ac-mono"
          }, [
            S(e("input", {
              "onUpdate:modelValue": a[12] || (a[12] = (N) => t.value.allows = N),
              type: "checkbox",
              class: "kx-focus-outline",
              value: n
            }, null, 8, Be), [
              [de, t.value.allows]
            ]),
            V(" " + p(n), 1)
          ]))), 128))
        ])
      ])) : h("", !0),
      e("label", je, [
        a[27] || (a[27] = e("span", null, "Extra docker run arguments", -1)),
        S(e("textarea", {
          "onUpdate:modelValue": a[13] || (a[13] = (n) => t.value.extra = n),
          rows: "3",
          class: "ac-mono kx-focus-halo",
          placeholder: `One argument per line, e.g.
--device=/dev/dri
--shm-size=2g`
        }, null, 512), [
          [T, t.value.extra]
        ])
      ]),
      e("footer", Re, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: a[14] || (a[14] = (n) => $("cancel"))
        }, "Cancel"),
        e("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: f.value || !D.capabilities || !D.edit && !t.value.ref,
          onClick: d
        }, [
          C(c(A), { icon: "tabler:box" }),
          V(" " + p(f.value ? "Saving…" : D.edit ? "Save settings" : t.value.mode === "build" ? "Build image" : "Add image"), 1)
        ], 8, Me)
      ]),
      _.value ? (s(), o("p", Oe, p(_.value), 1)) : h("", !0)
    ], 8, be)) : (s(), o("p", fe, p(D.edit ? "Image settings are unavailable." : "Image defaults are unavailable.") + " Ask an administrator to update the image configuration.", 1));
  }
}), He = { class: "ac-stack" }, Ke = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ze = {
  key: 1,
  class: "kx-loading"
}, Fe = {
  key: 2,
  class: "kx-empty"
}, Ge = { class: "kx-empty-ico" }, Je = {
  key: 3,
  class: "kx-empty"
}, Qe = { class: "ac-list ac-resource-list" }, Xe = { class: "ac-resource-icon" }, Ye = { class: "ac-account-main" }, Ze = { class: "ac-row-title" }, ea = { class: "ac-muted ac-mono" }, aa = { class: "ac-chips" }, ta = { class: "ac-muted" }, la = {
  key: 0,
  class: "kx-err ac-small"
}, sa = { class: "ac-row-actions" }, oa = ["disabled", "onClick"], na = ["onClick"], ia = ["onClick"], ua = ["onClick"], ra = { class: "ac-form" }, ca = { class: "ac-mono" }, da = { class: "ac-pre ac-build-log" }, va = /* @__PURE__ */ H({
  __name: "images",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(D, { expose: P, emit: m }) {
    const $ = Z(), I = D, w = m, t = v(!1), g = v(!1), f = v({});
    P({ open: () => {
      t.value = !0;
    } });
    const _ = v([]), x = v(""), L = v(null), d = v(null), l = v(null), a = v(!1);
    let n = !0, N = 0;
    ve(() => {
      n = !1, N++;
    });
    async function z(i) {
      const b = N, r = await q.image(i);
      !n || b !== N || d.value?.id !== i || (d.value = { id: i, ref: r.image.ref, text: r.build_log || "(empty)" });
    }
    const E = ae(async () => {
      try {
        const [i, b] = await Promise.all([q.images(), q.drivers()]), r = await ke([...new Set(i.map((U) => U.owner))]);
        if (!n) return;
        _.value = i, f.value = Object.fromEntries(i.map((U) => [U.id, `Owner: ${r[U.owner] || U.owner}`])), l.value = [...new Set(b.flatMap((U) => U.capabilities))].sort(), d.value && i.some((U) => U.id === d.value?.id) && await z(d.value.id), a.value = !0, x.value = "";
      } catch (i) {
        x.value = M(i, "Could not load images.");
      }
    });
    se(() => _.value.map((i) => i.id), () => {
      E();
    }), ee(E);
    async function y(i, b) {
      x.value = "";
      try {
        await i(), await E();
      } catch (r) {
        x.value = M(r, b);
      }
    }
    const u = (i) => y(async () => {
      L.value = await q.image(i.id);
    }, "Could not load the image settings."), k = (i) => y(() => q.prepareImage(i.id), "Could not start the image preparation.");
    function F(i) {
      N++, d.value = { id: i.id, ref: i.ref, text: "Loading…" }, E();
    }
    function X() {
      N++, d.value = null;
    }
    async function te(i) {
      L.value = null, t.value = !1, await E(), i && (x.value = i);
    }
    async function le(i) {
      if (!await K.confirm({
        header: "Delete image",
        message: `Delete image "${i.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) return;
      const r = await K.confirm({
        header: "Docker image",
        message: `Also remove ${i.ref} from Docker on the host? Keeping it lets a later image with the same reference reuse it.`,
        icon: "tabler:brand-docker",
        acceptLabel: "Remove from Docker",
        rejectLabel: "Keep in Docker",
        acceptClass: "p-button-danger"
      });
      L.value?.image.id === i.id && (L.value = null), d.value?.id === i.id && X(), await y(() => q.deleteImage(i.id, r), "Could not delete the image.");
    }
    const Y = Q(() => _.value.filter((i) => [i.label, i.ref, ...i.agents].join(" ").toLowerCase().includes(I.query.toLowerCase())));
    return j(_, (i) => w("count", i.length)), (i, b) => (s(), o("div", He, [
      b[8] || (b[8] = e("p", { class: "ac-hint" }, "Share ready images to make them available for tasks.", -1)),
      x.value ? (s(), o("p", Ke, [
        V(p(x.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: b[0] || (b[0] = //@ts-ignore
          (...r) => c(E) && c(E)(...r))
        }, "Retry")
      ])) : h("", !0),
      !a.value && !x.value ? (s(), o("div", ze, "Loading images…")) : h("", !0),
      a.value && !_.value.length ? (s(), o("div", Fe, [
        e("div", Ge, [
          C(c(A), { icon: "tabler:box" })
        ]),
        b[5] || (b[5] = e("div", { class: "kx-empty-title" }, "No images yet", -1)),
        b[6] || (b[6] = e("div", { class: "kx-empty-sub" }, "Start with the default agent recipe or use an existing image.", -1)),
        e("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: b[1] || (b[1] = (r) => t.value = !0)
        }, "Add image")
      ])) : a.value && !Y.value.length ? (s(), o("div", Je, [...b[7] || (b[7] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another image, reference or agent.", -1)
      ])])) : h("", !0),
      e("ul", Qe, [
        (s(!0), o(B, null, R(Y.value, (r) => (s(), o("li", {
          key: r.id,
          class: "ac-row ac-resource"
        }, [
          e("span", Xe, [
            C(c(A), { icon: "tabler:box" })
          ]),
          e("div", Ye, [
            e("div", Ze, [
              V(p(r.label), 1),
              e("span", {
                class: W(["kx-tag-sm ac-tone", r.status])
              }, p(r.status), 3)
            ]),
            e("div", ea, p(r.ref) + " · " + p(r.home), 1),
            e("div", aa, [
              (s(!0), o(B, null, R(r.agents, (U) => (s(), o("span", {
                key: U,
                class: "kx-tag-sm ac-tone"
              }, [
                C(c(A), {
                  icon: c(pe)(U, c($).agents)
                }, null, 8, ["icon"]),
                V(p(U), 1)
              ]))), 128))
            ]),
            e("div", ta, p(f.value[r.id]), 1),
            r.last_error ? (s(), o("div", la, p(r.last_error), 1)) : h("", !0)
          ]),
          e("div", sa, [
            r.writable ? (s(), o("button", {
              key: 0,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Prepare image",
              "aria-label": "Prepare image",
              disabled: r.status === "preparing",
              onClick: (U) => k(r)
            }, [
              C(c(A), { icon: "tabler:refresh" })
            ], 8, oa)) : h("", !0),
            e("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Build log",
              "aria-label": "Build log",
              onClick: (U) => F(r)
            }, [
              C(c(A), { icon: "tabler:file-text" })
            ], 8, na),
            r.writable ? (s(), o("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Edit settings",
              "aria-label": "Edit settings",
              onClick: (U) => u(r)
            }, [
              C(c(A), { icon: "tabler:pencil" })
            ], 8, ia)) : h("", !0),
            r.deletable ? (s(), o("button", {
              key: 2,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete image",
              "aria-label": "Delete image",
              onClick: (U) => le(r)
            }, [
              C(c(A), { icon: "tabler:trash" })
            ], 8, ua)) : h("", !0)
          ])
        ]))), 128))
      ]),
      t.value || L.value ? (s(), O(G, {
        key: 4,
        title: L.value ? "Edit image" : "Add image",
        busy: g.value,
        wide: "",
        onClose: b[4] || (b[4] = (r) => {
          t.value = !1, L.value = null;
        })
      }, {
        default: J(() => [
          C(We, {
            onBusy: b[2] || (b[2] = (r) => g.value = r),
            edit: L.value,
            capabilities: l.value,
            onSaved: te,
            onCancel: b[3] || (b[3] = (r) => {
              t.value = !1, L.value = null;
            })
          }, null, 8, ["edit", "capabilities"])
        ]),
        _: 1
      }, 8, ["title", "busy"])) : h("", !0),
      d.value ? (s(), O(G, {
        key: 5,
        title: "Build log",
        wide: "",
        onClose: X
      }, {
        default: J(() => [
          e("div", ra, [
            e("strong", ca, p(d.value.ref), 1),
            e("pre", da, p(d.value.text), 1)
          ])
        ]),
        _: 1
      })) : h("", !0)
    ]));
  }
}), ma = { class: "ac-stack" }, pa = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ka = {
  key: 1,
  class: "kx-loading"
}, fa = {
  key: 2,
  class: "ac-chips"
}, ba = {
  key: 3,
  class: "kx-empty"
}, ga = { class: "kx-empty-ico" }, ya = {
  key: 4,
  class: "kx-empty"
}, ha = { class: "ac-list ac-resource-list" }, _a = { class: "ac-resource-icon" }, wa = { class: "ac-account-main" }, xa = { class: "ac-row-title" }, $a = { class: "kx-tag-sm ac-tone" }, Ca = {
  key: 0,
  class: "ac-muted ac-mono"
}, Da = { class: "ac-row-actions" }, La = ["onClick"], Ua = ["disabled"], Aa = {
  key: 0,
  class: "ac-muted"
}, Va = {
  key: 1,
  class: "ac-field"
}, Ia = { class: "ac-chips" }, Pa = ["onClick"], Sa = { class: "ac-field" }, Ta = { class: "ac-field" }, qa = ["placeholder"], Ea = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Na = { class: "ac-dialog-foot" }, Ba = ["disabled"], ja = ["disabled"], Ra = /* @__PURE__ */ H({
  __name: "workspaces",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(D, { expose: P, emit: m }) {
    const $ = D, I = m, w = v(!1);
    P({ open: () => {
      w.value = !0;
    } });
    const t = v([]), g = v([]), f = v(""), _ = v(!1), x = v(""), L = v(!1), d = v(""), l = v(!1);
    function a(y) {
      return y.replace(/\/+$/, "") + "/";
    }
    j([w, g], () => {
      w.value && !d.value && g.value.length && (d.value = a(g.value[0]));
    }), j(d, (y) => {
      L.value || (x.value = y.trim().split("/").filter(Boolean).pop() ?? "");
    });
    const n = ae(async () => {
      try {
        const y = await q.workspaces();
        t.value = y.workspaces, g.value = y.roots ?? [], l.value = !0, f.value = "";
      } catch (y) {
        f.value = M(y, "Could not load workspaces.");
      }
    });
    ee(n);
    async function N() {
      f.value = "", _.value = !0;
      try {
        await q.createWorkspace({ name: x.value, host_path: d.value }), L.value = !1, x.value = "", d.value = "", w.value = !1, await n();
      } catch (y) {
        f.value = M(y, "Could not save the workspace.");
      } finally {
        _.value = !1;
      }
    }
    async function z(y) {
      if (await K.confirm({
        header: "Delete workspace",
        message: `Delete workspace "${y.name}"? The host directory stays untouched.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) {
        f.value = "";
        try {
          await q.deleteWorkspace(y.id), await n();
        } catch (k) {
          f.value = M(k, "Could not delete the workspace.");
        }
      }
    }
    const E = Q(() => t.value.filter((y) => [y.name, y.host_path].join(" ").toLowerCase().includes($.query.toLowerCase())));
    return j(t, (y) => I("count", y.length)), (y, u) => (s(), o("div", ma, [
      u[15] || (u[15] = e("p", { class: "ac-hint" }, "Tasks use shared workspaces with the access you grant.", -1)),
      f.value && !w.value ? (s(), o("p", pa, [
        V(p(f.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: u[0] || (u[0] = //@ts-ignore
          (...k) => c(n) && c(n)(...k))
        }, "Retry")
      ])) : h("", !0),
      !l.value && !f.value ? (s(), o("div", ka, "Loading workspaces…")) : h("", !0),
      g.value.length ? (s(), o("div", fa, [
        u[7] || (u[7] = e("span", { class: "ac-muted" }, "Allowed roots", -1)),
        (s(!0), o(B, null, R(g.value, (k) => (s(), o("span", {
          key: k,
          class: "ac-hint-chip ac-mono"
        }, p(k), 1))), 128))
      ])) : h("", !0),
      l.value && !t.value.length ? (s(), o("div", ba, [
        e("div", ga, [
          C(c(A), { icon: "tabler:folder" })
        ]),
        u[8] || (u[8] = e("div", { class: "kx-empty-title" }, "No workspaces yet", -1)),
        u[9] || (u[9] = e("div", { class: "kx-empty-sub" }, "Add a host directory, or let tasks use a scratch directory.", -1)),
        e("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: u[1] || (u[1] = (k) => w.value = !0)
        }, "Add workspace")
      ])) : l.value && !E.value.length ? (s(), o("div", ya, [...u[10] || (u[10] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another workspace name or path.", -1)
      ])])) : h("", !0),
      e("ul", ha, [
        (s(!0), o(B, null, R(E.value, (k) => (s(), o("li", {
          key: k.id,
          class: "ac-row ac-resource"
        }, [
          e("span", _a, [
            C(c(A), { icon: "tabler:folder" })
          ]),
          e("div", wa, [
            e("div", xa, [
              V(p(k.name), 1),
              e("span", $a, p(k.writable ? "read-write" : "read-only"), 1)
            ]),
            k.host_path ? (s(), o("div", Ca, p(k.host_path), 1)) : h("", !0)
          ]),
          e("div", Da, [
            k.deletable ? (s(), o("button", {
              key: 0,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete workspace",
              "aria-label": "Delete workspace",
              onClick: (F) => z(k)
            }, [
              C(c(A), { icon: "tabler:trash" })
            ], 8, La)) : h("", !0)
          ])
        ]))), 128))
      ]),
      w.value ? (s(), O(G, {
        key: 5,
        title: "Add workspace",
        busy: _.value,
        onClose: u[6] || (u[6] = (k) => w.value = !1)
      }, {
        default: J(() => [
          e("fieldset", {
            class: "ac-form",
            disabled: _.value
          }, [
            g.value.length ? (s(), o("div", Va, [
              u[11] || (u[11] = e("span", null, "Allowed roots", -1)),
              e("div", Ia, [
                (s(!0), o(B, null, R(g.value, (k) => (s(), o("button", {
                  key: k,
                  type: "button",
                  class: "ac-chip ac-mono kx-focus-halo",
                  title: "Start from this root",
                  onClick: (F) => d.value = a(k)
                }, p(k), 9, Pa))), 128))
              ])
            ])) : (s(), o("p", Aa, "The host administrator configures allowed workspace roots.")),
            e("label", Sa, [
              u[12] || (u[12] = e("span", null, "Name", -1)),
              S(e("input", {
                "onUpdate:modelValue": u[2] || (u[2] = (k) => x.value = k),
                onInput: u[3] || (u[3] = (k) => L.value = !0),
                autofocus: "",
                class: "kx-focus-halo",
                placeholder: "e.g. Kickside checkout"
              }, null, 544), [
                [T, x.value]
              ])
            ]),
            e("label", Ta, [
              u[13] || (u[13] = e("span", null, "Host directory", -1)),
              S(e("input", {
                "onUpdate:modelValue": u[4] || (u[4] = (k) => d.value = k),
                class: "ac-mono kx-focus-halo",
                placeholder: (g.value[0] ?? "/srv/work") + "/project"
              }, null, 8, qa), [
                [T, d.value]
              ]),
              u[14] || (u[14] = e("small", { class: "ac-hint" }, [
                V("An existing directory, mounted at "),
                e("code", null, "/workspace"),
                V(".")
              ], -1))
            ]),
            f.value ? (s(), o("p", Ea, p(f.value), 1)) : h("", !0),
            e("footer", Na, [
              e("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                disabled: _.value,
                onClick: u[5] || (u[5] = (k) => w.value = !1)
              }, "Cancel", 8, Ba),
              e("button", {
                type: "button",
                class: "ac-btn primary kx-focus-halo",
                disabled: _.value || !x.value.trim() || !d.value.trim(),
                onClick: N
              }, [
                C(c(A), { icon: "tabler:folder-plus" }),
                V(p(_.value ? "Saving…" : "Add workspace"), 1)
              ], 8, ja)
            ])
          ], 8, Ua)
        ]),
        _: 1
      }, 8, ["busy"])) : h("", !0)
    ]));
  }
}), Ma = { class: "ac-card ac-narrow" }, Oa = { class: "ac-card-head" }, Wa = { class: "ac-card-title" }, Ha = ["disabled"], Ka = {
  key: 0,
  class: "kx-err"
}, za = {
  key: 1,
  class: "ac-pre"
}, Fa = /* @__PURE__ */ H({
  __name: "maintenance",
  setup(D) {
    const P = v(!1), m = v(""), $ = v("");
    async function I() {
      if (await K.confirm({
        header: "Clean up Docker",
        message: "Prune stopped Autocode containers and unused images and build cache across this Docker host? Other modules may use the shared image cache.",
        icon: "tabler:trash-x",
        acceptLabel: "Clean up",
        rejectLabel: "Cancel"
      })) {
        $.value = "", P.value = !0;
        try {
          m.value = await q.prune();
        } catch (t) {
          $.value = M(t, "Cleanup failed.");
        } finally {
          P.value = !1;
        }
      }
    }
    return (w, t) => (s(), o("section", Ma, [
      e("div", Oa, [
        e("h2", Wa, [
          C(c(A), { icon: "tabler:brand-docker" }),
          t[0] || (t[0] = V("Docker cleanup", -1))
        ]),
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          disabled: P.value,
          onClick: I
        }, [
          C(c(A), {
            icon: P.value ? "tabler:loader-2" : "tabler:trash-x",
            class: W({ spin: P.value })
          }, null, 8, ["icon", "class"]),
          V(" " + p(P.value ? "Cleaning…" : "Clean up Docker"), 1)
        ], 8, Ha)
      ]),
      t[1] || (t[1] = e("p", { class: "ac-hint" }, "Prune stopped Autocode containers, dangling images and build cache across the Docker host. Tagged images stay.", -1)),
      $.value ? (s(), o("p", Ka, p($.value), 1)) : h("", !0),
      m.value ? (s(), o("pre", za, p(m.value), 1)) : h("", !0)
    ]));
  }
}), Ga = { class: "ac" }, Ja = { class: "ac-bar" }, Qa = {
  class: "ac-tabs",
  "aria-label": "Autocode management"
}, Xa = ["aria-pressed", "onClick"], Ya = {
  key: 0,
  class: "kx-err"
}, Za = {
  key: 1,
  class: "kx-loading"
}, et = {
  key: 2,
  class: "ac-body"
}, at = {
  key: 3,
  class: "ac-muted"
}, tt = /* @__PURE__ */ H({
  __name: "admin",
  setup(D) {
    const P = [
      { id: "images", label: "Images", icon: "tabler:box" },
      { id: "workspaces", label: "Workspaces", icon: "tabler:folder" },
      { id: "docker", label: "Docker", icon: "tabler:brand-docker" }
    ], m = v(), { catalog: $, error: I, load: w } = oe(), t = Q(() => P.filter((d) => d.id === "images" ? $.value?.can_images : d.id === "workspaces" ? $.value?.can_workspaces : $.value?.can_prune));
    j(t, (d) => {
      d.some((l) => l.id === m.value) || (m.value = d[0]?.id);
    }, { immediate: !0 });
    const g = v(""), f = v(0), _ = v(null), x = v(null);
    function L() {
      m.value === "images" ? _.value?.open() : x.value?.open();
    }
    return (d, l) => (s(), o("div", Ga, [
      C(ne, {
        title: "Autocode",
        subtitle: "Manage agent images, workspaces and Docker.",
        count: m.value && m.value !== "docker" ? `${f.value} ${f.value === 1 ? m.value.slice(0, -1) : m.value}` : void 0,
        action: m.value === "images" ? "Add image" : m.value === "workspaces" ? "Add workspace" : void 0,
        query: g.value,
        "onUpdate:query": l[0] || (l[0] = (a) => g.value = a),
        placeholder: m.value === "docker" ? void 0 : "Search resources…",
        onCreate: L
      }, null, 8, ["count", "action", "query", "placeholder"]),
      e("div", Ja, [
        e("nav", Qa, [
          (s(!0), o(B, null, R(t.value, (a) => (s(), o("button", {
            key: a.id,
            type: "button",
            class: W(["ac-tab kx-focus-outline", { active: m.value === a.id }]),
            "aria-pressed": m.value === a.id,
            onClick: (n) => {
              m.value = a.id, g.value = "", f.value = 0;
            }
          }, [
            C(c(A), {
              icon: a.icon
            }, null, 8, ["icon"]),
            V(" " + p(a.label), 1)
          ], 10, Xa))), 128))
        ])
      ]),
      c(I) && !c($) ? (s(), o("p", Ya, [
        V(p(c(I)) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: l[1] || (l[1] = //@ts-ignore
          (...a) => c(w) && c(w)(...a))
        }, "Retry")
      ])) : c($) ? (s(), o("main", et, [
        m.value === "images" ? (s(), O(va, {
          key: 0,
          ref_key: "images",
          ref: _,
          query: g.value,
          onCount: l[2] || (l[2] = (a) => f.value = a)
        }, null, 8, ["query"])) : m.value === "workspaces" ? (s(), O(Ra, {
          key: 1,
          ref_key: "workspaces",
          ref: x,
          query: g.value,
          onCount: l[3] || (l[3] = (a) => f.value = a)
        }, null, 8, ["query"])) : m.value === "docker" ? (s(), O(Fa, { key: 2 })) : (s(), o("p", at, "No management areas are available."))
      ])) : (s(), o("div", Za, [
        C(c(A), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        l[4] || (l[4] = V(" Loading…", -1))
      ]))
    ]));
  }
}), lt = { type: "object", properties: {} };
class st extends re {
  static get wippyConfig() {
    return { propsSchema: lt, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"], inlineCss: ie };
  }
  static get vueConfig() {
    return { rootComponent: tt, plugins: [ue] };
  }
}
me(import.meta.url, st);
