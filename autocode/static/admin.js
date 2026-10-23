import { u as Z, a as ee, _ as F, b as te, c as ae, s as le, P as se } from "./styles-cTcHqrbC.js";
import { u as Q, W as oe } from "./index-DaHAsq8-.js";
import { defineComponent as M, inject as ne, ref as v, watch as T, openBlock as s, createElementBlock as o, createElementVNode as e, toDisplayString as f, createVNode as C, unref as y, createTextVNode as A, createCommentVNode as w, Fragment as j, withDirectives as L, vModelText as E, normalizeClass as O, renderList as R, vModelCheckbox as ie, computed as J, onMounted as ue, createBlock as B, withCtx as G } from "vue";
import { Icon as D } from "@iconify/vue";
import { loadByTagName as re, host as K, define as ce } from "@wippy-fe/proxy";
import { a as I, e as N, s as de, b as X, p as ve, g as pe } from "./api-xHIs_Oef.js";
const me = { class: "ac-form" }, ke = { class: "ac-card-head" }, fe = { class: "ac-muted" }, be = { class: "ac-field" }, ge = { class: "ac-seg" }, ye = {
  key: 0,
  class: "ac-field"
}, he = {
  key: 1,
  class: "ac-muted ac-mono"
}, we = { class: "ac-field" }, $e = { class: "ac-field" }, _e = { class: "ac-row-fields" }, Ce = { class: "ac-field" }, xe = { class: "ac-field" }, De = { class: "ac-field" }, Ue = { class: "ac-row-fields" }, Ve = { class: "ac-field" }, Ae = { class: "ac-field" }, Se = {
  key: 2,
  class: "ac-field"
}, Le = { class: "ac-checks" }, Ee = ["value"], Ie = { class: "ac-field" }, Pe = { class: "ac-dialog-foot" }, Ne = ["disabled"], qe = {
  key: 3,
  class: "ac-error"
}, je = /* @__PURE__ */ M({
  __name: "image-form",
  props: {
    edit: {},
    capabilities: {}
  },
  emits: ["saved", "cancel"],
  setup(x, { emit: V }) {
    const p = x, U = V, S = ne("catalog");
    function c() {
      return {
        ref: "",
        mode: "pull",
        dockerfile: "",
        label: "",
        home: S.value.default_image.home,
        memory: "4g",
        cpus: "2",
        pids_limit: 1024,
        gpus: "",
        network: "bridge",
        extra_args: [],
        extra: "",
        allows: [...p.capabilities ?? []]
      };
    }
    const a = v(c()), d = v(!1);
    T(() => a.value.ref, (l) => {
      !p.edit && !d.value && (a.value.label = l);
    });
    const k = v(!1), h = v("");
    T(() => p.edit, (l) => {
      if (h.value = "", d.value = !!l, !l?.settings) {
        a.value = c();
        return;
      }
      const t = l.settings;
      a.value = {
        ...c(),
        ...t,
        ref: l.image.ref,
        label: l.image.label,
        home: l.image.home,
        extra: t.extra_args.join(`
`),
        allows: [...t.allows]
      };
    }, { immediate: !0 }), T(() => p.capabilities, (l) => {
      !p.edit && l && (a.value.allows = [...l]);
    });
    function $() {
      const l = S.value.default_image;
      d.value = !1, a.value = { ...c(), ref: l.ref, label: l.ref, home: l.home, mode: "build", dockerfile: l.dockerfile };
    }
    function P() {
      const l = a.value;
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
    async function b() {
      h.value = "", k.value = !0;
      try {
        if (p.edit)
          await I.updateImage(p.edit.image.id, P());
        else {
          const l = a.value;
          await I.createImage({ ...P(), ref: l.ref, dockerfile: l.mode === "build" ? l.dockerfile : "" }), a.value = c();
        }
        U("saved");
      } catch (l) {
        h.value = N(l, "Could not save the image.");
      } finally {
        k.value = !1;
      }
    }
    return (l, t) => (s(), o("section", me, [
      e("div", ke, [
        e("span", fe, f(x.edit ? "Container run settings" : "Use an image reference or the default agent recipe."), 1),
        x.edit ? w("", !0) : (s(), o("button", {
          key: 0,
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: $
        }, [
          C(y(D), { icon: "tabler:sparkles" }),
          t[15] || (t[15] = A(" Default agent image", -1))
        ]))
      ]),
      x.edit ? (s(), o("p", he, f(x.edit.image.ref), 1)) : (s(), o(j, { key: 0 }, [
        e("label", be, [
          t[16] || (t[16] = e("span", null, "Image reference", -1)),
          L(e("input", {
            "onUpdate:modelValue": t[0] || (t[0] = (u) => a.value.ref = u),
            class: "ac-mono kx-focus-halo",
            placeholder: "registry/name:tag"
          }, null, 512), [
            [E, a.value.ref]
          ])
        ]),
        e("div", ge, [
          e("button", {
            type: "button",
            class: O(["kx-focus-outline", { active: a.value.mode === "pull" }]),
            onClick: t[1] || (t[1] = (u) => a.value.mode = "pull")
          }, "Use or pull existing", 2),
          e("button", {
            type: "button",
            class: O(["kx-focus-outline", { active: a.value.mode === "build" }]),
            onClick: t[2] || (t[2] = (u) => a.value.mode = "build")
          }, "Build from Dockerfile", 2)
        ]),
        a.value.mode === "build" ? (s(), o("label", ye, [
          t[17] || (t[17] = e("span", null, "Dockerfile", -1)),
          L(e("textarea", {
            "onUpdate:modelValue": t[3] || (t[3] = (u) => a.value.dockerfile = u),
            rows: "9",
            class: "ac-mono kx-focus-halo"
          }, null, 512), [
            [E, a.value.dockerfile]
          ]),
          t[18] || (t[18] = e("small", { class: "ac-hint" }, [
            A("Include "),
            e("code", null, "sh"),
            A(" and the agent CLIs; use a non-root user with the home below.")
          ], -1))
        ])) : w("", !0)
      ], 64)),
      e("label", we, [
        t[19] || (t[19] = e("span", null, "Label", -1)),
        L(e("input", {
          "onUpdate:modelValue": t[4] || (t[4] = (u) => a.value.label = u),
          class: "kx-focus-halo",
          onInput: t[5] || (t[5] = (u) => d.value = !0)
        }, null, 544), [
          [E, a.value.label]
        ])
      ]),
      e("label", $e, [
        t[20] || (t[20] = e("span", null, "Home directory in the image", -1)),
        L(e("input", {
          "onUpdate:modelValue": t[6] || (t[6] = (u) => a.value.home = u),
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [E, a.value.home]
        ])
      ]),
      e("div", _e, [
        e("label", Ce, [
          t[21] || (t[21] = e("span", null, "Memory", -1)),
          L(e("input", {
            "onUpdate:modelValue": t[7] || (t[7] = (u) => a.value.memory = u),
            class: "ac-mono kx-focus-halo",
            placeholder: "4g"
          }, null, 512), [
            [E, a.value.memory]
          ])
        ]),
        e("label", xe, [
          t[22] || (t[22] = e("span", null, "CPUs", -1)),
          L(e("input", {
            "onUpdate:modelValue": t[8] || (t[8] = (u) => a.value.cpus = u),
            class: "ac-mono kx-focus-halo",
            placeholder: "2"
          }, null, 512), [
            [E, a.value.cpus]
          ])
        ]),
        e("label", De, [
          t[23] || (t[23] = e("span", null, "PIDs limit", -1)),
          L(e("input", {
            "onUpdate:modelValue": t[9] || (t[9] = (u) => a.value.pids_limit = u),
            type: "number",
            min: "0",
            class: "ac-mono kx-focus-halo"
          }, null, 512), [
            [
              E,
              a.value.pids_limit,
              void 0,
              { number: !0 }
            ]
          ])
        ])
      ]),
      e("div", Ue, [
        e("label", Ve, [
          t[24] || (t[24] = e("span", null, "GPUs", -1)),
          L(e("input", {
            "onUpdate:modelValue": t[10] || (t[10] = (u) => a.value.gpus = u),
            class: "ac-mono kx-focus-halo",
            placeholder: "all, or device=0"
          }, null, 512), [
            [E, a.value.gpus]
          ])
        ]),
        e("label", Ae, [
          t[25] || (t[25] = e("span", null, "Network", -1)),
          L(e("input", {
            "onUpdate:modelValue": t[11] || (t[11] = (u) => a.value.network = u),
            class: "ac-mono kx-focus-halo",
            placeholder: "bridge"
          }, null, 512), [
            [E, a.value.network]
          ])
        ])
      ]),
      x.capabilities?.length ? (s(), o("div", Se, [
        t[26] || (t[26] = e("span", null, "Agents may", -1)),
        e("div", Le, [
          (s(!0), o(j, null, R(x.capabilities, (u) => (s(), o("label", {
            key: u,
            class: "ac-check ac-mono"
          }, [
            L(e("input", {
              "onUpdate:modelValue": t[12] || (t[12] = (W) => a.value.allows = W),
              type: "checkbox",
              class: "kx-focus-outline",
              value: u
            }, null, 8, Ee), [
              [ie, a.value.allows]
            ]),
            A(" " + f(u), 1)
          ]))), 128))
        ])
      ])) : w("", !0),
      e("label", Ie, [
        t[27] || (t[27] = e("span", null, "Extra docker run arguments", -1)),
        L(e("textarea", {
          "onUpdate:modelValue": t[13] || (t[13] = (u) => a.value.extra = u),
          rows: "3",
          class: "ac-mono kx-focus-halo",
          placeholder: `One argument per line, e.g.
--device=/dev/dri
--shm-size=2g`
        }, null, 512), [
          [E, a.value.extra]
        ])
      ]),
      e("footer", Pe, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: t[14] || (t[14] = (u) => U("cancel"))
        }, "Cancel"),
        e("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: k.value || !x.capabilities || !x.edit && !a.value.ref,
          onClick: b
        }, [
          C(y(D), { icon: "tabler:box" }),
          A(" " + f(k.value ? "Saving…" : x.edit ? "Save settings" : a.value.mode === "build" ? "Build image" : "Add image"), 1)
        ], 8, Ne)
      ]),
      h.value ? (s(), o("p", qe, f(h.value), 1)) : w("", !0)
    ]));
  }
}), Be = ["^config"], Te = {
  key: 1,
  class: "kx-err inline"
}, Y = /* @__PURE__ */ M({
  __name: "share-dialog",
  props: {
    id: {},
    title: {}
  },
  emits: ["close", "changed"],
  setup(x, { emit: V }) {
    const p = x, U = V, S = v(!1), c = v(""), a = J(() => JSON.stringify(de(p.id, p.title)));
    return ue(async () => {
      try {
        await re("kickside-share", { timeoutMs: 8e3 }), S.value = !0;
      } catch (d) {
        c.value = N(d, "The share dialog could not load.");
      }
    }), (d, k) => S.value ? (s(), o("kickside-share", {
      key: 0,
      "^config": a.value,
      onClose: k[0] || (k[0] = (h) => U("close")),
      onChanged: k[1] || (k[1] = (h) => U("changed"))
    }, null, 40, Be)) : c.value ? (s(), o("p", Te, f(c.value), 1)) : w("", !0);
  }
}), Re = { class: "ac-stack" }, Me = {
  key: 0,
  class: "ac-error",
  role: "alert"
}, We = {
  key: 1,
  class: "kx-empty"
}, Oe = { class: "kx-empty-ico" }, He = {
  key: 2,
  class: "kx-empty"
}, Ke = { class: "ac-list ac-resource-list" }, ze = { class: "ac-resource-icon" }, Fe = { class: "ac-account-main" }, Ge = { class: "ac-row-title" }, Je = { class: "ac-muted ac-mono" }, Qe = { class: "ac-chips" }, Xe = { class: "ac-muted" }, Ye = {
  key: 0,
  class: "ac-error ac-small"
}, Ze = { class: "ac-row-actions" }, et = ["disabled", "onClick"], tt = ["onClick"], at = ["onClick"], lt = ["onClick"], st = ["onClick"], ot = { class: "ac-form" }, nt = { class: "ac-mono" }, it = { class: "ac-pre ac-build-log" }, ut = /* @__PURE__ */ M({
  __name: "images",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(x, { expose: V, emit: p }) {
    const U = x, S = p, c = v(!1), a = v({});
    V({ open: () => {
      c.value = !0;
    } });
    const d = v([]), k = v(""), h = v(null), $ = v(null), P = v(null), b = v(null);
    async function l(i) {
      const g = await I.image(i);
      $.value = { id: i, ref: g.image.ref, text: g.build_log || "(empty)" };
    }
    const t = X(async () => {
      try {
        d.value = await I.images();
        const i = await ve([...new Set(d.value.map((n) => n.owner))]), g = await Promise.all(d.value.map(async (n) => [n.id, n.shareable ? `Owner: ${i[n.owner] || n.owner} · shared with ${await pe(n.id)}` : `Shared with you by ${i[n.owner] || n.owner}`]));
        a.value = Object.fromEntries(g), $.value && d.value.some((n) => n.id === $.value?.id) && await l($.value.id);
      } catch (i) {
        k.value = N(i, "Could not load images.");
      }
    });
    Z(() => d.value.map((i) => i.id), () => {
      t();
    }), Q(async () => {
      if (await t(), !P.value)
        try {
          const i = await I.drivers();
          P.value = [...new Set(i.flatMap((g) => g.capabilities))].sort();
        } catch (i) {
          k.value = N(i, "Could not load driver capabilities.");
        }
    });
    async function u(i, g) {
      k.value = "";
      try {
        await i(), await t();
      } catch (n) {
        k.value = N(n, g);
      }
    }
    const W = (i) => u(async () => {
      h.value = await I.image(i.id);
    }, "Could not load the image settings."), z = (i) => u(() => I.prepareImage(i.id), "Could not start the image preparation."), H = (i) => u(() => l(i.id), "Could not load the log.");
    async function _() {
      h.value = null, c.value = !1, await t();
    }
    async function r(i) {
      if (!await K.confirm({
        header: "Delete image",
        message: `Delete image "${i.label}"? Runs keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) return;
      const n = await K.confirm({
        header: "Docker image",
        message: `Also remove ${i.ref} from Docker on the host? Keeping it lets a later image with the same reference reuse it.`,
        icon: "tabler:brand-docker",
        acceptLabel: "Remove from Docker",
        rejectLabel: "Keep in Docker",
        acceptClass: "p-button-danger"
      });
      h.value?.image.id === i.id && (h.value = null), $.value?.id === i.id && ($.value = null), await u(() => I.deleteImage(i.id, n), "Could not delete the image.");
    }
    const m = J(() => d.value.filter((i) => [i.label, i.ref, ...i.agents].join(" ").toLowerCase().includes(U.query.toLowerCase())));
    return T(d, (i) => S("count", i.length)), (i, g) => (s(), o("div", Re, [
      g[8] || (g[8] = e("p", { class: "ac-hint" }, "Share an image with READ access to let people run agents on it.", -1)),
      k.value ? (s(), o("p", Me, f(k.value), 1)) : w("", !0),
      d.value.length ? m.value.length ? w("", !0) : (s(), o("div", He, [...g[7] || (g[7] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1)
      ])])) : (s(), o("div", We, [
        e("div", Oe, [
          C(y(D), { icon: "tabler:box" })
        ]),
        g[5] || (g[5] = e("div", { class: "kx-empty-title" }, "No images yet", -1)),
        g[6] || (g[6] = e("div", { class: "kx-empty-sub" }, "Start with the default agent recipe or use an existing image.", -1)),
        e("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: g[0] || (g[0] = (n) => c.value = !0)
        }, "Add image")
      ])),
      e("ul", Ke, [
        (s(!0), o(j, null, R(m.value, (n) => (s(), o("li", {
          key: n.id,
          class: "ac-row ac-resource"
        }, [
          e("span", ze, [
            C(y(D), { icon: "tabler:box" })
          ]),
          e("div", Fe, [
            e("div", Ge, [
              A(f(n.label), 1),
              e("span", {
                class: O(["kx-tag-sm ac-tone", n.status])
              }, f(n.status), 3)
            ]),
            e("div", Je, f(n.ref) + " · " + f(n.home), 1),
            e("div", Qe, [
              (s(!0), o(j, null, R(n.agents, (q) => (s(), o("span", {
                key: q,
                class: "kx-tag-sm ac-tone"
              }, [
                C(y(D), {
                  icon: y(ee)(q)
                }, null, 8, ["icon"]),
                A(f(q), 1)
              ]))), 128))
            ]),
            e("div", Xe, f(a.value[n.id]), 1),
            n.last_error ? (s(), o("div", Ye, f(n.last_error), 1)) : w("", !0)
          ]),
          e("div", Ze, [
            n.writable ? (s(), o("button", {
              key: 0,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Prepare image",
              "aria-label": "Prepare image",
              disabled: n.status === "preparing",
              onClick: (q) => z(n)
            }, [
              C(y(D), { icon: "tabler:refresh" })
            ], 8, et)) : w("", !0),
            e("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Build log",
              "aria-label": "Build log",
              onClick: (q) => H(n)
            }, [
              C(y(D), { icon: "tabler:file-text" })
            ], 8, tt),
            n.writable ? (s(), o("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Edit settings",
              "aria-label": "Edit settings",
              onClick: (q) => W(n)
            }, [
              C(y(D), { icon: "tabler:pencil" })
            ], 8, at)) : w("", !0),
            n.shareable ? (s(), o("button", {
              key: 2,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Share image",
              "aria-label": "Share image",
              onClick: (q) => b.value = n
            }, [
              C(y(D), { icon: "tabler:user-share" })
            ], 8, lt)) : w("", !0),
            n.writable ? (s(), o("button", {
              key: 3,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete image",
              "aria-label": "Delete image",
              onClick: (q) => r(n)
            }, [
              C(y(D), { icon: "tabler:trash" })
            ], 8, st)) : w("", !0)
          ])
        ]))), 128))
      ]),
      c.value || h.value ? (s(), B(F, {
        key: 3,
        title: h.value ? "Edit image" : "Add image",
        wide: "",
        onClose: g[2] || (g[2] = (n) => {
          c.value = !1, h.value = null;
        })
      }, {
        default: G(() => [
          C(je, {
            edit: h.value,
            capabilities: P.value,
            onSaved: _,
            onCancel: g[1] || (g[1] = (n) => {
              c.value = !1, h.value = null;
            })
          }, null, 8, ["edit", "capabilities"])
        ]),
        _: 1
      }, 8, ["title"])) : w("", !0),
      $.value ? (s(), B(F, {
        key: 4,
        title: "Build log",
        wide: "",
        onClose: g[3] || (g[3] = (n) => $.value = null)
      }, {
        default: G(() => [
          e("div", ot, [
            e("strong", nt, f($.value.ref), 1),
            e("pre", it, f($.value.text), 1)
          ])
        ]),
        _: 1
      })) : w("", !0),
      b.value ? (s(), B(Y, {
        key: 5,
        id: b.value.id,
        title: b.value.label,
        onClose: g[4] || (g[4] = (n) => b.value = null),
        onChanged: y(t)
      }, null, 8, ["id", "title", "onChanged"])) : w("", !0)
    ]));
  }
}), rt = { class: "ac-stack" }, ct = {
  key: 0,
  class: "ac-error",
  role: "alert"
}, dt = { class: "ac-chips" }, vt = {
  key: 1,
  class: "kx-empty"
}, pt = { class: "kx-empty-ico" }, mt = {
  key: 2,
  class: "kx-empty"
}, kt = { class: "ac-list ac-resource-list" }, ft = { class: "ac-resource-icon" }, bt = { class: "ac-account-main" }, gt = { class: "ac-row-title" }, yt = { class: "kx-tag-sm ac-tone" }, ht = {
  key: 0,
  class: "ac-muted ac-mono"
}, wt = { class: "ac-row-actions" }, $t = ["onClick"], _t = ["onClick"], Ct = { class: "ac-form" }, xt = {
  key: 0,
  class: "ac-muted"
}, Dt = {
  key: 1,
  class: "ac-field"
}, Ut = { class: "ac-chips" }, Vt = ["onClick"], At = { class: "ac-field" }, St = { class: "ac-field" }, Lt = ["placeholder"], Et = {
  key: 2,
  class: "ac-error",
  role: "alert"
}, It = { class: "ac-dialog-foot" }, Pt = ["disabled"], Nt = /* @__PURE__ */ M({
  __name: "workspaces",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(x, { expose: V, emit: p }) {
    const U = x, S = p, c = v(!1);
    V({ open: () => {
      c.value = !0;
    } });
    const a = v([]), d = v([]), k = v(""), h = v(!1), $ = v(""), P = v(!1), b = v(""), l = v(null);
    function t(_) {
      return _.replace(/\/+$/, "") + "/";
    }
    T([c, d], () => {
      c.value && !b.value && d.value.length && (b.value = t(d.value[0]));
    }), T(b, (_) => {
      P.value || ($.value = _.trim().split("/").filter(Boolean).pop() ?? "");
    });
    const u = X(async () => {
      try {
        const _ = await I.workspaces();
        a.value = _.workspaces, d.value = _.roots;
      } catch (_) {
        k.value = N(_, "Could not load workspaces.");
      }
    });
    Q(u);
    async function W() {
      k.value = "", h.value = !0;
      try {
        await I.createWorkspace({ name: $.value, host_path: b.value }), P.value = !1, $.value = "", b.value = "", c.value = !1, await u();
      } catch (_) {
        k.value = N(_, "Could not save the workspace.");
      } finally {
        h.value = !1;
      }
    }
    async function z(_) {
      if (await K.confirm({
        header: "Delete workspace",
        message: `Delete workspace "${_.name}"? The host directory stays untouched.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) {
        k.value = "";
        try {
          await I.deleteWorkspace(_.id), await u();
        } catch (m) {
          k.value = N(m, "Could not delete the workspace.");
        }
      }
    }
    const H = J(() => a.value.filter((_) => [_.name, _.host_path].join(" ").toLowerCase().includes(U.query.toLowerCase())));
    return T(a, (_) => S("count", _.length)), (_, r) => (s(), o("div", rt, [
      r[15] || (r[15] = e("p", { class: "ac-hint" }, "READ mounts a workspace read-only; WRITE allows changes.", -1)),
      k.value && !c.value ? (s(), o("p", ct, f(k.value), 1)) : w("", !0),
      e("div", dt, [
        r[7] || (r[7] = e("span", { class: "ac-muted" }, "Allowed roots", -1)),
        (s(!0), o(j, null, R(d.value, (m) => (s(), o("span", {
          key: m,
          class: "ac-hint-chip ac-mono"
        }, f(m), 1))), 128))
      ]),
      a.value.length ? H.value.length ? w("", !0) : (s(), o("div", mt, [...r[10] || (r[10] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1)
      ])])) : (s(), o("div", vt, [
        e("div", pt, [
          C(y(D), { icon: "tabler:folder" })
        ]),
        r[8] || (r[8] = e("div", { class: "kx-empty-title" }, "No workspaces yet", -1)),
        r[9] || (r[9] = e("div", { class: "kx-empty-sub" }, "Add a host directory, or let tasks use a scratch directory.", -1)),
        e("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: r[0] || (r[0] = (m) => c.value = !0)
        }, "Add workspace")
      ])),
      e("ul", kt, [
        (s(!0), o(j, null, R(H.value, (m) => (s(), o("li", {
          key: m.id,
          class: "ac-row ac-resource"
        }, [
          e("span", ft, [
            C(y(D), { icon: "tabler:folder" })
          ]),
          e("div", bt, [
            e("div", gt, [
              A(f(m.name), 1),
              e("span", yt, f(m.writable ? "read-write" : "read-only"), 1)
            ]),
            m.host_path ? (s(), o("div", ht, f(m.host_path), 1)) : w("", !0)
          ]),
          e("div", wt, [
            m.shareable ? (s(), o("button", {
              key: 0,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Share workspace",
              "aria-label": "Share workspace",
              onClick: (i) => l.value = m
            }, [
              C(y(D), { icon: "tabler:user-share" })
            ], 8, $t)) : w("", !0),
            m.writable ? (s(), o("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete workspace",
              "aria-label": "Delete workspace",
              onClick: (i) => z(m)
            }, [
              C(y(D), { icon: "tabler:trash" })
            ], 8, _t)) : w("", !0)
          ])
        ]))), 128))
      ]),
      c.value ? (s(), B(F, {
        key: 3,
        title: "Add workspace",
        onClose: r[5] || (r[5] = (m) => c.value = !1)
      }, {
        default: G(() => [
          e("div", Ct, [
            d.value.length ? (s(), o("div", Dt, [
              r[11] || (r[11] = e("span", null, "Allowed roots", -1)),
              e("div", Ut, [
                (s(!0), o(j, null, R(d.value, (m) => (s(), o("button", {
                  key: m,
                  type: "button",
                  class: "ac-chip ac-mono kx-focus-halo",
                  title: "Start from this root",
                  onClick: (i) => b.value = t(m)
                }, f(m), 9, Vt))), 128))
              ])
            ])) : (s(), o("p", xt, "The host administrator configures allowed workspace roots.")),
            e("label", At, [
              r[12] || (r[12] = e("span", null, "Name", -1)),
              L(e("input", {
                "onUpdate:modelValue": r[1] || (r[1] = (m) => $.value = m),
                onInput: r[2] || (r[2] = (m) => P.value = !0),
                autofocus: "",
                class: "kx-focus-halo",
                placeholder: "e.g. Kickside checkout"
              }, null, 544), [
                [E, $.value]
              ])
            ]),
            e("label", St, [
              r[13] || (r[13] = e("span", null, "Host directory", -1)),
              L(e("input", {
                "onUpdate:modelValue": r[3] || (r[3] = (m) => b.value = m),
                class: "ac-mono kx-focus-halo",
                placeholder: (d.value[0] ?? "/srv/work") + "/project"
              }, null, 8, Lt), [
                [E, b.value]
              ]),
              r[14] || (r[14] = e("small", { class: "ac-hint" }, [
                A("An existing directory, mounted at "),
                e("code", null, "/workspace"),
                A(".")
              ], -1))
            ]),
            k.value ? (s(), o("p", Et, f(k.value), 1)) : w("", !0),
            e("footer", It, [
              e("button", {
                class: "ac-btn kx-focus-halo",
                onClick: r[4] || (r[4] = (m) => c.value = !1)
              }, "Cancel"),
              e("button", {
                type: "button",
                class: "ac-btn primary kx-focus-halo",
                disabled: h.value || !$.value || !b.value,
                onClick: W
              }, [
                C(y(D), { icon: "tabler:folder-plus" }),
                A(f(h.value ? "Saving…" : "Add workspace"), 1)
              ], 8, Pt)
            ])
          ])
        ]),
        _: 1
      })) : w("", !0),
      l.value ? (s(), B(Y, {
        key: 4,
        id: l.value.id,
        title: l.value.name,
        onClose: r[6] || (r[6] = (m) => l.value = null)
      }, null, 8, ["id", "title"])) : w("", !0)
    ]));
  }
}), qt = { class: "ac-card ac-narrow" }, jt = { class: "ac-card-head" }, Bt = { class: "ac-card-title" }, Tt = ["disabled"], Rt = {
  key: 0,
  class: "ac-error"
}, Mt = {
  key: 1,
  class: "ac-pre"
}, Wt = /* @__PURE__ */ M({
  __name: "maintenance",
  setup(x) {
    const V = v(!1), p = v(""), U = v("");
    async function S() {
      if (await K.confirm({
        header: "Clean up Docker",
        message: "Run the Docker cleanup on the host now?",
        icon: "tabler:trash-x",
        acceptLabel: "Clean up",
        rejectLabel: "Cancel"
      })) {
        U.value = "", V.value = !0;
        try {
          p.value = await I.prune();
        } catch (a) {
          U.value = N(a, "Cleanup failed.");
        } finally {
          V.value = !1;
        }
      }
    }
    return (c, a) => (s(), o("section", qt, [
      e("div", jt, [
        e("h2", Bt, [
          C(y(D), { icon: "tabler:brand-docker" }),
          a[0] || (a[0] = A("Docker cleanup", -1))
        ]),
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          disabled: V.value,
          onClick: S
        }, [
          C(y(D), {
            icon: V.value ? "tabler:loader-2" : "tabler:trash-x",
            class: O({ spin: V.value })
          }, null, 8, ["icon", "class"]),
          A(" " + f(V.value ? "Cleaning…" : "Clean up Docker"), 1)
        ], 8, Tt)
      ]),
      a[1] || (a[1] = e("p", { class: "ac-hint" }, "Prune stopped autocode containers, dangling layers and build cache older than a day; keep tagged images.", -1)),
      U.value ? (s(), o("p", Rt, f(U.value), 1)) : w("", !0),
      p.value ? (s(), o("pre", Mt, f(p.value), 1)) : w("", !0)
    ]));
  }
}), Ot = { class: "ac" }, Ht = { class: "ac-bar" }, Kt = { class: "ac-tabs" }, zt = ["aria-pressed", "onClick"], Ft = {
  key: 0,
  class: "kx-err"
}, Gt = {
  key: 1,
  class: "kx-loading"
}, Jt = {
  key: 2,
  class: "ac-body"
}, Qt = /* @__PURE__ */ M({
  __name: "admin",
  setup(x) {
    const V = [
      { id: "images", label: "Images", icon: "tabler:box" },
      { id: "workspaces", label: "Workspaces", icon: "tabler:folder" },
      { id: "docker", label: "Docker", icon: "tabler:brand-docker" }
    ], p = v("images"), { catalog: U, error: S, load: c } = te(), a = v(""), d = v(0), k = v(null), h = v(null);
    function $() {
      p.value === "images" ? k.value?.open() : h.value?.open();
    }
    return (P, b) => (s(), o("div", Ot, [
      C(ae, {
        title: "Autocode",
        subtitle: "Manage agent images, workspaces and Docker.",
        count: p.value !== "docker" ? `${d.value} ${d.value === 1 ? p.value.slice(0, -1) : p.value}` : void 0,
        action: p.value === "images" ? "Add image" : p.value === "workspaces" ? "Add workspace" : void 0,
        query: a.value,
        "onUpdate:query": b[0] || (b[0] = (l) => a.value = l),
        placeholder: "Search resources…",
        onCreate: $
      }, null, 8, ["count", "action", "query"]),
      e("div", Ht, [
        e("nav", Kt, [
          (s(), o(j, null, R(V, (l) => e("button", {
            key: l.id,
            type: "button",
            class: O(["ac-tab kx-focus-outline", { active: p.value === l.id }]),
            "aria-pressed": p.value === l.id,
            onClick: (t) => {
              p.value = l.id, a.value = "", d.value = 0;
            }
          }, [
            C(y(D), {
              icon: l.icon
            }, null, 8, ["icon"]),
            A(" " + f(l.label), 1)
          ], 10, zt)), 64))
        ])
      ]),
      y(S) && !y(U) ? (s(), o("p", Ft, [
        A(f(y(S)) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: b[1] || (b[1] = //@ts-ignore
          (...l) => y(c) && y(c)(...l))
        }, "Retry")
      ])) : y(U) ? (s(), o("main", Jt, [
        p.value === "images" ? (s(), B(ut, {
          key: 0,
          ref_key: "images",
          ref: k,
          query: a.value,
          onCount: b[2] || (b[2] = (l) => d.value = l)
        }, null, 8, ["query"])) : p.value === "workspaces" ? (s(), B(Nt, {
          key: 1,
          ref_key: "workspaces",
          ref: h,
          query: a.value,
          onCount: b[3] || (b[3] = (l) => d.value = l)
        }, null, 8, ["query"])) : (s(), B(Wt, { key: 2 }))
      ])) : (s(), o("div", Gt, [
        C(y(D), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        b[4] || (b[4] = A(" Loading…", -1))
      ]))
    ]));
  }
}), Xt = { type: "object", properties: {} };
class Yt extends oe {
  static get wippyConfig() {
    return { propsSchema: Xt, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"], inlineCss: le };
  }
  static get vueConfig() {
    return { rootComponent: Qt, plugins: [se] };
  }
}
ce(import.meta.url, Yt);
//# sourceMappingURL=admin.js.map
