import { u as ee, _ as Y, a as pe, b as me, s as ke, P as fe } from "./styles-BK6emoe6.js";
import { u as se, W as be } from "./dto-B0C2sWl2.js";
import { defineComponent as K, ref as v, watch as M, openBlock as l, createElementBlock as o, Fragment as O, createElementVNode as e, createVNode as C, unref as k, createCommentVNode as b, toDisplayString as g, createTextVNode as L, withDirectives as N, vModelText as B, normalizeClass as F, createStaticVNode as ge, renderList as G, vModelCheckbox as ye, computed as J, onUnmounted as he, createBlock as H, withCtx as Z, vModelSelect as _e } from "vue";
import { Icon as A } from "@iconify/vue";
import { loadByTagName as we, host as Q, define as xe } from "@wippy-fe/proxy";
import { e as q, a as j, u as oe, b as $e, s as ne, r as ie, p as Ce, c as De } from "./presentation-BuuH51nX.js";
const Ue = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, re = /* @__PURE__ */ K({
  __name: "share-control",
  props: {
    id: {},
    title: {}
  },
  setup(U) {
    const E = U, d = v(!1), f = v(null), h = v("");
    function V() {
      d.value = !1;
    }
    return M(f, async (s) => {
      if (s) {
        h.value = "";
        try {
          if (customElements.get("kickside-share") || await we("kickside-share", { timeoutMs: 8e3 }), f.value !== s) return;
          const u = document.createElement("kickside-share");
          u.setAttribute("config", JSON.stringify({
            resource_id: E.id,
            title: E.title,
            access_url: `/api/v1/component-access/grants/${encodeURIComponent(E.id)}`,
            share_url: `/api/v1/component-access/share/${encodeURIComponent(E.id)}`
          })), u.style.display = "block", u.addEventListener("close", V), s.appendChild(u);
        } catch (u) {
          h.value = q(u, "Could not open sharing.");
        }
      }
    }), (s, u) => (l(), o(O, null, [
      e("button", {
        type: "button",
        class: "ac-icon-btn kx-focus-outline",
        title: "Share",
        "aria-label": "Share",
        onClick: u[0] || (u[0] = ($) => d.value = !0)
      }, [
        C(k(A), { icon: "tabler:share" })
      ]),
      d.value ? (l(), o("div", {
        key: 0,
        ref_key: "shareHost",
        ref: f
      }, null, 512)) : b("", !0),
      h.value ? (l(), o("span", Ue, g(h.value), 1)) : b("", !0)
    ], 64));
  }
}), Ae = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Le = ["disabled"], Ve = { class: "ac-card-head" }, Ie = { class: "ac-muted" }, Se = { class: "ac-field" }, Ee = { class: "ac-seg" }, Pe = {
  key: 0,
  class: "ac-field"
}, Ne = {
  key: 1,
  class: "ac-muted"
}, Te = { class: "ac-field" }, Be = { class: "ac-field" }, qe = { class: "ac-row-fields" }, je = { class: "ac-field" }, Re = ["placeholder"], Me = { class: "ac-field" }, Oe = ["placeholder"], He = { class: "ac-field" }, We = { class: "ac-row-fields" }, Ge = { class: "ac-field" }, Ke = { class: "ac-field" }, ze = ["placeholder"], Fe = {
  key: 2,
  class: "ac-field"
}, Je = { class: "ac-checks" }, Qe = ["value"], Xe = { class: "ac-field" }, Ye = { class: "ac-dialog-foot" }, Ze = ["disabled"], ea = {
  key: 3,
  class: "kx-err"
}, aa = /* @__PURE__ */ K({
  __name: "image-form",
  props: {
    edit: {},
    capabilities: {}
  },
  emits: ["saved", "cancel", "busy"],
  setup(U, { emit: E }) {
    const d = U, f = E, h = ee();
    function V(t = h.value.default_image.settings) {
      return t ? {
        ref: "",
        mode: "pull",
        dockerfile: "",
        label: "",
        home: h.value.default_image.home,
        ...t,
        extra_args: [...t.extra_args],
        allows: [...t.allows],
        extra: ""
      } : null;
    }
    const s = v(V()), u = v(!1);
    M(() => s.value?.ref, (t) => {
      s.value && !d.edit && !u.value && t !== void 0 && (s.value.label = t);
    });
    const $ = v(!1), _ = v("");
    M(() => d.edit, (t) => {
      if (_.value = "", u.value = !!t, !t) {
        s.value = V();
        return;
      }
      if (!t.settings) {
        s.value = null;
        return;
      }
      const a = t.settings;
      s.value = {
        ...a,
        ref: t.image.ref,
        label: t.image.label,
        home: t.image.home,
        mode: t.dockerfile ? "build" : "pull",
        dockerfile: t.dockerfile ?? "",
        extra: a.extra_args.join(`
`),
        allows: [...a.allows]
      };
    }, { immediate: !0 });
    function D() {
      const t = h.value.default_image;
      u.value = !0;
      const a = V();
      s.value = a ? { ...a, ref: t.ref, label: t.label, home: t.home, mode: "build", dockerfile: t.dockerfile } : null;
    }
    function y() {
      const t = s.value;
      if (!t) throw new Error("Image settings are unavailable.");
      return {
        label: t.label,
        home: t.home,
        memory: t.memory,
        cpus: t.cpus,
        pids_limit: Number(t.pids_limit) || 0,
        gpus: t.gpus,
        network: t.network,
        extra_args: t.extra.split(`
`).map((a) => a.trim()).filter(Boolean),
        allows: [...t.allows]
      };
    }
    async function x() {
      if (!(!s.value || $.value)) {
        _.value = "", $.value = !0, f("busy", !0);
        try {
          let t;
          if (d.edit) {
            const a = await j.updateImage(d.edit.image.id, { ...y(), ref: s.value.ref, dockerfile: s.value.mode === "build" ? s.value.dockerfile : "" });
            a.build_error && (t = `Settings saved. Build preparation has not started: ${a.build_error.message}. Use Prepare image to retry.`);
          } else {
            const a = s.value, r = await j.createImage({ ...y(), ref: a.ref, dockerfile: a.mode === "build" ? a.dockerfile : "" });
            r.build_error && (t = `Image created. Build preparation has not started: ${r.build_error.message}. Use Prepare image to retry.`), s.value = V();
          }
          f("saved", t);
        } catch (t) {
          _.value = q(t, "Could not save the image.");
        } finally {
          $.value = !1, f("busy", !1);
        }
      }
    }
    return (t, a) => s.value ? (l(), o("fieldset", {
      key: 1,
      class: "ac-form",
      disabled: $.value
    }, [
      e("div", Ve, [
        e("span", Ie, g(U.edit ? "Container settings" : "Use an image reference or the default agent recipe."), 1),
        U.edit ? b("", !0) : (l(), o("button", {
          key: 0,
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: D
        }, [
          C(k(A), { icon: "tabler:sparkles" }),
          a[15] || (a[15] = L(" Default agent image", -1))
        ]))
      ]),
      e("label", Se, [
        a[16] || (a[16] = e("span", null, "Image reference", -1)),
        N(e("input", {
          "onUpdate:modelValue": a[0] || (a[0] = (r) => s.value.ref = r),
          class: "ac-mono kx-focus-halo",
          placeholder: "registry/name:tag"
        }, null, 512), [
          [B, s.value.ref]
        ])
      ]),
      e("div", Ee, [
        e("button", {
          type: "button",
          class: F(["kx-focus-outline", { active: s.value.mode === "pull" }]),
          onClick: a[1] || (a[1] = (r) => s.value.mode = "pull")
        }, "Use or pull existing", 2),
        e("button", {
          type: "button",
          class: F(["kx-focus-outline", { active: s.value.mode === "build" }]),
          onClick: a[2] || (a[2] = (r) => s.value.mode = "build")
        }, "Build from Dockerfile", 2)
      ]),
      s.value.mode === "build" ? (l(), o("label", Pe, [
        a[17] || (a[17] = e("span", null, "Dockerfile", -1)),
        N(e("textarea", {
          "onUpdate:modelValue": a[3] || (a[3] = (r) => s.value.dockerfile = r),
          rows: "9",
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [B, s.value.dockerfile]
        ]),
        a[18] || (a[18] = ge('<small class="ac-hint">Include <code>sh</code>, <code>git</code>, <code>mkdir</code>, <code>dirname</code>, a <code>timeout</code> that supports <code>-k</code>, and the agent CLIs. The image user needs writable home and work directories.</small>', 1))
      ])) : b("", !0),
      U.edit ? (l(), o("p", Ne, "Saving container settings prepares the image automatically.")) : b("", !0),
      e("label", Te, [
        a[19] || (a[19] = e("span", null, "Label", -1)),
        N(e("input", {
          "onUpdate:modelValue": a[4] || (a[4] = (r) => s.value.label = r),
          class: "kx-focus-halo",
          onInput: a[5] || (a[5] = (r) => u.value = !0)
        }, null, 544), [
          [B, s.value.label]
        ])
      ]),
      e("label", Be, [
        a[20] || (a[20] = e("span", null, "Home directory in the image", -1)),
        N(e("input", {
          "onUpdate:modelValue": a[6] || (a[6] = (r) => s.value.home = r),
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [B, s.value.home]
        ])
      ]),
      e("div", qe, [
        e("label", je, [
          a[21] || (a[21] = e("span", null, "Memory", -1)),
          N(e("input", {
            "onUpdate:modelValue": a[7] || (a[7] = (r) => s.value.memory = r),
            class: "ac-mono kx-focus-halo",
            placeholder: k(h).default_image.settings?.memory
          }, null, 8, Re), [
            [B, s.value.memory]
          ])
        ]),
        e("label", Me, [
          a[22] || (a[22] = e("span", null, "CPUs", -1)),
          N(e("input", {
            "onUpdate:modelValue": a[8] || (a[8] = (r) => s.value.cpus = r),
            class: "ac-mono kx-focus-halo",
            placeholder: k(h).default_image.settings?.cpus
          }, null, 8, Oe), [
            [B, s.value.cpus]
          ])
        ]),
        e("label", He, [
          a[23] || (a[23] = e("span", null, "PIDs limit", -1)),
          N(e("input", {
            "onUpdate:modelValue": a[9] || (a[9] = (r) => s.value.pids_limit = r),
            type: "number",
            min: "0",
            class: "ac-mono kx-focus-halo"
          }, null, 512), [
            [
              B,
              s.value.pids_limit,
              void 0,
              { number: !0 }
            ]
          ])
        ])
      ]),
      e("div", We, [
        e("label", Ge, [
          a[24] || (a[24] = e("span", null, "GPUs", -1)),
          N(e("input", {
            "onUpdate:modelValue": a[10] || (a[10] = (r) => s.value.gpus = r),
            class: "ac-mono kx-focus-halo",
            placeholder: "all, or device=0"
          }, null, 512), [
            [B, s.value.gpus]
          ])
        ]),
        e("label", Ke, [
          a[25] || (a[25] = e("span", null, "Network", -1)),
          N(e("input", {
            "onUpdate:modelValue": a[11] || (a[11] = (r) => s.value.network = r),
            class: "ac-mono kx-focus-halo",
            placeholder: k(h).default_image.settings?.network
          }, null, 8, ze), [
            [B, s.value.network]
          ])
        ])
      ]),
      U.capabilities?.length ? (l(), o("div", Fe, [
        a[26] || (a[26] = e("span", null, "Agents may", -1)),
        e("div", Je, [
          (l(!0), o(O, null, G(U.capabilities, (r) => (l(), o("label", {
            key: r,
            class: "ac-check ac-mono"
          }, [
            N(e("input", {
              "onUpdate:modelValue": a[12] || (a[12] = (I) => s.value.allows = I),
              type: "checkbox",
              class: "kx-focus-outline",
              value: r
            }, null, 8, Qe), [
              [ye, s.value.allows]
            ]),
            L(" " + g(r), 1)
          ]))), 128))
        ])
      ])) : b("", !0),
      e("label", Xe, [
        a[27] || (a[27] = e("span", null, "Extra docker run arguments", -1)),
        N(e("textarea", {
          "onUpdate:modelValue": a[13] || (a[13] = (r) => s.value.extra = r),
          rows: "3",
          class: "ac-mono kx-focus-halo",
          placeholder: `One argument per line, e.g.
--device=/dev/dri
--shm-size=2g`
        }, null, 512), [
          [B, s.value.extra]
        ])
      ]),
      e("footer", Ye, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: a[14] || (a[14] = (r) => f("cancel"))
        }, "Cancel"),
        e("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: $.value || !U.capabilities || !s.value.ref,
          onClick: x
        }, [
          C(k(A), { icon: "tabler:box" }),
          L(" " + g($.value ? "Saving…" : U.edit ? "Save settings" : s.value.mode === "build" ? "Build image" : "Add image"), 1)
        ], 8, Ze)
      ]),
      _.value ? (l(), o("p", ea, g(_.value), 1)) : b("", !0)
    ], 8, Le)) : (l(), o("p", Ae, g(U.edit ? "Image settings are unavailable." : "Image defaults are unavailable.") + " Ask an administrator to update the image configuration.", 1));
  }
}), ta = { class: "ac-stack" }, la = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, sa = {
  key: 1,
  class: "kx-loading"
}, oa = {
  key: 2,
  class: "kx-empty"
}, na = { class: "kx-empty-ico" }, ia = {
  key: 3,
  class: "kx-empty"
}, ra = { class: "ac-list ac-resource-list" }, ua = { class: "ac-resource-icon" }, ca = { class: "ac-account-main" }, da = { class: "ac-row-title" }, va = {
  key: 0,
  class: "kx-tag-sm ac-tone ready"
}, pa = { class: "ac-muted ac-mono" }, ma = { class: "ac-chips" }, ka = { class: "ac-muted" }, fa = {
  key: 0,
  class: "kx-err ac-small"
}, ba = { class: "ac-row-actions" }, ga = ["disabled", "onClick"], ya = ["onClick"], ha = ["onClick"], _a = ["onClick"], wa = { class: "ac-form" }, xa = { class: "ac-mono" }, $a = { class: "ac-pre ac-build-log" }, Ca = /* @__PURE__ */ K({
  __name: "images",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(U, { expose: E, emit: d }) {
    const f = ee(), h = U, V = d, s = v(!1), u = v(!1), $ = v({});
    E({ open: ae });
    const _ = v([]), D = v([]), y = v(""), x = v(null), t = v(null), a = J(() => [...new Set(f.value.agents.flatMap((c) => c.capabilities))].sort()), r = v(!1);
    let I = !0, R = 0, P = 0, z = 0;
    he(() => {
      I = !1, R++, P++;
    });
    async function X(c) {
      const m = R, n = await j.image(c);
      !I || m !== R || t.value?.id !== c || (t.value = { id: c, ref: n.image.ref, text: n.build_log || "(empty)" });
    }
    const T = ne(async () => {
      try {
        const c = await ie(j.images, (m) => m.map((n) => n.id), D, () => I, (m) => {
          _.value = m, r.value = !0, y.value = "";
        }, () => {
          T();
        });
        if (!I) return;
        _.value = c, w(c, ++z), t.value && c.some((m) => m.id === t.value?.id) && await X(t.value.id), r.value = !0, y.value = "";
      } catch (c) {
        y.value = q(c, "Could not load images.");
      }
    });
    async function w(c, m) {
      try {
        const n = await Ce([...new Set(c.map((S) => S.owner))]);
        if (!I || m !== z) return;
        $.value = Object.fromEntries(c.map((S) => [S.id, `Owner: ${n[S.owner] || S.owner}`]));
      } catch (n) {
        I && m === z && (y.value = q(n, "Could not load image owners."));
      }
    }
    oe(() => D.value, () => {
      T();
    }), se(T);
    async function i(c, m) {
      y.value = "";
      try {
        await c(), await T();
      } catch (n) {
        y.value = q(n, m);
      }
    }
    async function p(c) {
      const m = ++P;
      y.value = "";
      try {
        const n = await j.image(c.id);
        I && m === P && (x.value = n);
      } catch (n) {
        I && m === P && (y.value = q(n, "Could not load the image settings."));
      }
    }
    function W() {
      P++, s.value = !1, x.value = null;
    }
    function ae() {
      W(), s.value = !0;
    }
    const ue = (c) => i(() => j.prepareImage(c.id), "Could not start the image preparation.");
    function ce(c) {
      R++, t.value = { id: c.id, ref: c.ref, text: "Loading…" }, T();
    }
    function te() {
      R++, t.value = null;
    }
    async function de(c) {
      W(), await T(), c && (y.value = c);
    }
    async function ve(c) {
      if (!await Q.confirm({
        header: "Delete image",
        message: `Delete image "${c.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) return;
      const n = await Q.confirm({
        header: "Docker image",
        message: `Also remove ${c.ref} from Docker on the host? Keeping it lets a later image with the same reference reuse it.`,
        icon: "tabler:brand-docker",
        acceptLabel: "Remove from Docker",
        rejectLabel: "Keep in Docker",
        acceptClass: "p-button-danger"
      });
      P++, x.value?.image.id === c.id && W(), t.value?.id === c.id && te(), y.value = "";
      try {
        await j.deleteImage(c.id, n), await T();
      } catch (S) {
        y.value = q(S, "Could not delete the image.");
      }
    }
    const le = J(() => _.value.filter((c) => [c.label, c.ref, ...c.agents].join(" ").toLowerCase().includes(h.query.toLowerCase())));
    return M(_, (c) => V("count", c.length)), (c, m) => (l(), o("div", ta, [
      m[7] || (m[7] = e("p", { class: "ac-hint" }, "Share ready images to make them available for tasks.", -1)),
      y.value ? (l(), o("p", la, [
        L(g(y.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: m[0] || (m[0] = //@ts-ignore
          (...n) => k(T) && k(T)(...n))
        }, "Retry")
      ])) : b("", !0),
      !r.value && !y.value ? (l(), o("div", sa, "Loading images…")) : b("", !0),
      r.value && !_.value.length ? (l(), o("div", oa, [
        e("div", na, [
          C(k(A), { icon: "tabler:box" })
        ]),
        m[4] || (m[4] = e("div", { class: "kx-empty-title" }, "No images yet", -1)),
        m[5] || (m[5] = e("div", { class: "kx-empty-sub" }, "Start with the default agent recipe or use an existing image.", -1)),
        e("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: ae
        }, "Add image")
      ])) : r.value && !le.value.length ? (l(), o("div", ia, [...m[6] || (m[6] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another image, reference or agent.", -1)
      ])])) : b("", !0),
      e("ul", ra, [
        (l(!0), o(O, null, G(le.value, (n) => (l(), o("li", {
          key: n.id,
          class: "ac-row ac-resource"
        }, [
          e("span", ua, [
            C(k(A), { icon: "tabler:box" })
          ]),
          e("div", ca, [
            e("div", da, [
              L(g(n.label), 1),
              e("span", {
                class: F(["kx-tag-sm ac-tone", n.status])
              }, g(n.status === "unprepared" ? "Needs preparation" : n.status.charAt(0).toUpperCase() + n.status.slice(1)), 3),
              n.usable ? (l(), o("span", va, "Usable")) : b("", !0)
            ]),
            e("div", pa, g(n.ref) + " · " + g(n.home), 1),
            e("div", ma, [
              (l(!0), o(O, null, G(n.agents, (S) => (l(), o("span", {
                key: S,
                class: "kx-tag-sm ac-tone"
              }, [
                C(k(A), {
                  icon: k($e)(S, k(f).agents)
                }, null, 8, ["icon"]),
                L(g(S), 1)
              ]))), 128))
            ]),
            e("div", ka, g($.value[n.id]), 1),
            n.last_error ? (l(), o("div", fa, g(n.last_error), 1)) : b("", !0)
          ]),
          e("div", ba, [
            n.shareable ? (l(), H(re, {
              key: 0,
              id: n.id,
              title: n.label
            }, null, 8, ["id", "title"])) : b("", !0),
            n.writable ? (l(), o("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Prepare image",
              "aria-label": "Prepare image",
              disabled: n.status === "preparing",
              onClick: (S) => ue(n)
            }, [
              C(k(A), { icon: "tabler:refresh" })
            ], 8, ga)) : b("", !0),
            e("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Build log",
              "aria-label": "Build log",
              onClick: (S) => ce(n)
            }, [
              C(k(A), { icon: "tabler:file-text" })
            ], 8, ya),
            n.writable ? (l(), o("button", {
              key: 2,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Edit settings",
              "aria-label": "Edit settings",
              onClick: (S) => p(n)
            }, [
              C(k(A), { icon: "tabler:pencil" })
            ], 8, ha)) : b("", !0),
            n.deletable ? (l(), o("button", {
              key: 3,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete image",
              "aria-label": "Delete image",
              onClick: (S) => ve(n)
            }, [
              C(k(A), { icon: "tabler:trash" })
            ], 8, _a)) : b("", !0)
          ])
        ]))), 128))
      ]),
      s.value || x.value ? (l(), H(Y, {
        key: 4,
        title: x.value ? "Edit image" : "Add image",
        busy: u.value,
        wide: "",
        onClose: m[3] || (m[3] = (n) => W())
      }, {
        default: Z(() => [
          C(aa, {
            onBusy: m[1] || (m[1] = (n) => u.value = n),
            edit: x.value,
            capabilities: a.value,
            onSaved: de,
            onCancel: m[2] || (m[2] = (n) => W())
          }, null, 8, ["edit", "capabilities"])
        ]),
        _: 1
      }, 8, ["title", "busy"])) : b("", !0),
      t.value ? (l(), H(Y, {
        key: 5,
        title: "Build log",
        wide: "",
        onClose: te
      }, {
        default: Z(() => [
          e("div", wa, [
            e("strong", xa, g(t.value.ref), 1),
            e("pre", $a, g(t.value.text), 1)
          ])
        ]),
        _: 1
      })) : b("", !0)
    ]));
  }
}), Da = { class: "ac-stack" }, Ua = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Aa = {
  key: 1,
  class: "kx-loading"
}, La = {
  key: 2,
  class: "ac-chips"
}, Va = {
  key: 3,
  class: "kx-empty"
}, Ia = { class: "kx-empty-ico" }, Sa = {
  key: 4,
  class: "kx-empty"
}, Ea = { class: "ac-list ac-resource-list" }, Pa = { class: "ac-resource-icon" }, Na = { class: "ac-account-main" }, Ta = { class: "ac-row-title" }, Ba = { class: "kx-tag-sm ac-tone" }, qa = {
  key: 0,
  class: "ac-muted ac-mono"
}, ja = { class: "ac-row-actions" }, Ra = ["onClick"], Ma = ["disabled"], Oa = {
  key: 0,
  class: "ac-muted"
}, Ha = {
  key: 1,
  class: "ac-field"
}, Wa = { class: "ac-chips" }, Ga = ["onClick"], Ka = { class: "ac-field" }, za = { class: "ac-field" }, Fa = ["placeholder"], Ja = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Qa = { class: "ac-field" }, Xa = { class: "ac-dialog-foot" }, Ya = ["disabled"], Za = ["disabled"], et = /* @__PURE__ */ K({
  __name: "workspaces",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(U, { expose: E, emit: d }) {
    const f = De(), h = v([]), V = U, s = d, u = v(!1);
    E({ open: () => {
      u.value = !0;
    } });
    const $ = v([]), _ = v([]), D = v(""), y = v(!1), x = v(""), t = v(!1), a = v(""), r = v("shared"), I = v(!1);
    function R(w) {
      return w.replace(/\/+$/, "") + "/";
    }
    M([u, _], () => {
      u.value && !a.value && _.value.length && (a.value = R(_.value[0]));
    }), M(a, (w) => {
      t.value || (x.value = w.trim().split("/").filter(Boolean).pop() ?? "");
    });
    const P = ne(async () => {
      try {
        await ie(j.workspaces, (w) => w.workspaces.map((i) => i.id), h, f, (w) => {
          $.value = w.workspaces, _.value = w.roots ?? [], I.value = !0, D.value = "";
        }, () => {
          P();
        });
      } catch (w) {
        f() && (D.value = q(w, "Could not load workspaces."));
      }
    }, f);
    oe(() => h.value, () => {
      P();
    }), se(P);
    async function z() {
      D.value = "", y.value = !0;
      try {
        if (await j.createWorkspace({ name: x.value, isolation: r.value, host_path: a.value }), !f()) return;
        t.value = !1, x.value = "", a.value = "", u.value = !1, await P();
      } catch (w) {
        f() && (D.value = q(w, "Could not save the workspace."));
      } finally {
        f() && (y.value = !1);
      }
    }
    async function X(w) {
      const i = await Q.confirm({
        header: "Delete workspace",
        message: `Delete workspace "${w.name}"? The host directory stays untouched.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      });
      if (!(!f() || !i)) {
        D.value = "";
        try {
          await j.deleteWorkspace(w.id), await P();
        } catch (p) {
          f() && (D.value = q(p, "Could not delete the workspace."));
        }
      }
    }
    const T = J(() => $.value.filter((w) => [w.name, w.host_path].join(" ").toLowerCase().includes(V.query.toLowerCase())));
    return M($, (w) => s("count", w.length)), (w, i) => (l(), o("div", Da, [
      i[18] || (i[18] = e("p", { class: "ac-hint" }, "Tasks use shared workspaces with the access you grant.", -1)),
      D.value && !u.value ? (l(), o("p", Ua, [
        L(g(D.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: i[0] || (i[0] = //@ts-ignore
          (...p) => k(P) && k(P)(...p))
        }, "Retry")
      ])) : b("", !0),
      !I.value && !D.value ? (l(), o("div", Aa, "Loading workspaces…")) : b("", !0),
      _.value.length ? (l(), o("div", La, [
        i[8] || (i[8] = e("span", { class: "ac-muted" }, "Allowed roots", -1)),
        (l(!0), o(O, null, G(_.value, (p) => (l(), o("span", {
          key: p,
          class: "ac-hint-chip ac-mono"
        }, g(p), 1))), 128))
      ])) : b("", !0),
      I.value && !$.value.length ? (l(), o("div", Va, [
        e("div", Ia, [
          C(k(A), { icon: "tabler:folder" })
        ]),
        i[9] || (i[9] = e("div", { class: "kx-empty-title" }, "No workspaces yet", -1)),
        i[10] || (i[10] = e("div", { class: "kx-empty-sub" }, "Add a host directory, or let tasks use a scratch directory.", -1)),
        e("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: i[1] || (i[1] = (p) => u.value = !0)
        }, "Add workspace")
      ])) : I.value && !T.value.length ? (l(), o("div", Sa, [...i[11] || (i[11] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another workspace name or path.", -1)
      ])])) : b("", !0),
      e("ul", Ea, [
        (l(!0), o(O, null, G(T.value, (p) => (l(), o("li", {
          key: p.id,
          class: "ac-row ac-resource"
        }, [
          e("span", Pa, [
            C(k(A), { icon: "tabler:folder" })
          ]),
          e("div", Na, [
            e("div", Ta, [
              L(g(p.name), 1),
              e("span", Ba, g(p.writable ? "read-write" : "read-only"), 1)
            ]),
            p.host_path ? (l(), o("div", qa, g(p.host_path), 1)) : b("", !0)
          ]),
          e("div", ja, [
            p.shareable ? (l(), H(re, {
              key: 0,
              id: p.id,
              title: p.name
            }, null, 8, ["id", "title"])) : b("", !0),
            p.deletable ? (l(), o("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete workspace",
              "aria-label": "Delete workspace",
              onClick: (W) => X(p)
            }, [
              C(k(A), { icon: "tabler:trash" })
            ], 8, Ra)) : b("", !0)
          ])
        ]))), 128))
      ]),
      u.value ? (l(), H(Y, {
        key: 5,
        title: "Add workspace",
        busy: y.value,
        onClose: i[7] || (i[7] = (p) => u.value = !1)
      }, {
        default: Z(() => [
          e("fieldset", {
            class: "ac-form",
            disabled: y.value
          }, [
            _.value.length ? (l(), o("div", Ha, [
              i[12] || (i[12] = e("span", null, "Allowed roots", -1)),
              e("div", Wa, [
                (l(!0), o(O, null, G(_.value, (p) => (l(), o("button", {
                  key: p,
                  type: "button",
                  class: "ac-chip ac-mono kx-focus-halo",
                  title: "Start from this root",
                  onClick: (W) => a.value = R(p)
                }, g(p), 9, Ga))), 128))
              ])
            ])) : (l(), o("p", Oa, "The host administrator configures allowed workspace roots.")),
            e("label", Ka, [
              i[13] || (i[13] = e("span", null, "Name", -1)),
              N(e("input", {
                "onUpdate:modelValue": i[2] || (i[2] = (p) => x.value = p),
                onInput: i[3] || (i[3] = (p) => t.value = !0),
                autofocus: "",
                class: "kx-focus-halo",
                placeholder: "e.g. Kickside checkout"
              }, null, 544), [
                [B, x.value]
              ])
            ]),
            e("label", za, [
              i[14] || (i[14] = e("span", null, "Host directory", -1)),
              N(e("input", {
                "onUpdate:modelValue": i[4] || (i[4] = (p) => a.value = p),
                class: "ac-mono kx-focus-halo",
                placeholder: (_.value[0] ?? "/srv/work") + "/project"
              }, null, 8, Fa), [
                [B, a.value]
              ]),
              i[15] || (i[15] = e("small", { class: "ac-hint" }, [
                L("An existing directory, mounted at "),
                e("code", null, "/workspace"),
                L(".")
              ], -1))
            ]),
            D.value ? (l(), o("p", Ja, g(D.value), 1)) : b("", !0),
            e("label", Qa, [
              i[17] || (i[17] = e("span", null, "Isolation", -1)),
              N(e("select", {
                "onUpdate:modelValue": i[5] || (i[5] = (p) => r.value = p),
                class: "kx-focus-halo",
                "aria-label": "Workspace isolation"
              }, [...i[16] || (i[16] = [
                e("option", { value: "shared" }, "Shared checkout", -1),
                e("option", { value: "worktree" }, "Private git worktree", -1)
              ])], 512), [
                [_e, r.value]
              ])
            ]),
            e("footer", Xa, [
              e("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                disabled: y.value,
                onClick: i[6] || (i[6] = (p) => u.value = !1)
              }, "Cancel", 8, Ya),
              e("button", {
                type: "button",
                class: "ac-btn primary kx-focus-halo",
                disabled: y.value || !x.value.trim() || !a.value.trim(),
                onClick: z
              }, [
                C(k(A), { icon: "tabler:folder-plus" }),
                L(g(y.value ? "Saving…" : "Add workspace"), 1)
              ], 8, Za)
            ])
          ], 8, Ma)
        ]),
        _: 1
      }, 8, ["busy"])) : b("", !0)
    ]));
  }
}), at = { class: "ac-card ac-narrow" }, tt = { class: "ac-card-head" }, lt = { class: "ac-card-title" }, st = ["disabled"], ot = {
  key: 0,
  class: "kx-err"
}, nt = {
  key: 1,
  class: "ac-pre"
}, it = /* @__PURE__ */ K({
  __name: "maintenance",
  setup(U) {
    const E = ee(), d = v(!1), f = v(""), h = v("");
    async function V() {
      if (await Q.confirm({
        header: "Clean up Docker",
        message: `Prune stopped Autocode containers, unused images and build cache older than ${E.value.build_cache_retention} across this Docker host? Other modules may use the shared image cache.`,
        icon: "tabler:trash-x",
        acceptLabel: "Clean up",
        rejectLabel: "Cancel"
      })) {
        h.value = "", d.value = !0;
        try {
          f.value = await j.prune();
        } catch (u) {
          h.value = q(u, "Cleanup failed.");
        } finally {
          d.value = !1;
        }
      }
    }
    return (s, u) => (l(), o("section", at, [
      e("div", tt, [
        e("h2", lt, [
          C(k(A), { icon: "tabler:brand-docker" }),
          u[0] || (u[0] = L("Docker cleanup", -1))
        ]),
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          disabled: d.value,
          onClick: V
        }, [
          C(k(A), {
            icon: d.value ? "tabler:loader-2" : "tabler:trash-x",
            class: F({ spin: d.value })
          }, null, 8, ["icon", "class"]),
          L(" " + g(d.value ? "Cleaning…" : "Clean up Docker"), 1)
        ], 8, st)
      ]),
      u[1] || (u[1] = e("p", { class: "ac-hint" }, "Prune stopped Autocode containers, dangling images and build cache across the Docker host. Tagged images stay.", -1)),
      h.value ? (l(), o("p", ot, g(h.value), 1)) : b("", !0),
      f.value ? (l(), o("pre", nt, g(f.value), 1)) : b("", !0)
    ]));
  }
}), rt = { class: "ac" }, ut = { class: "ac-bar" }, ct = {
  class: "ac-tabs",
  "aria-label": "Autocode management"
}, dt = ["aria-pressed", "onClick"], vt = {
  key: 0,
  class: "kx-err"
}, pt = {
  key: 1,
  class: "kx-loading"
}, mt = {
  key: 2,
  class: "ac-body"
}, kt = {
  key: 3,
  class: "ac-muted"
}, ft = /* @__PURE__ */ K({
  __name: "admin",
  setup(U) {
    const E = [
      { id: "images", label: "Images", icon: "tabler:box" },
      { id: "workspaces", label: "Workspaces", icon: "tabler:folder" },
      { id: "docker", label: "Docker", icon: "tabler:brand-docker" }
    ], d = v(), { catalog: f, error: h, load: V } = pe(), s = J(() => E.filter((x) => x.id === "images" ? f.value?.can_images : x.id === "workspaces" ? f.value?.can_workspaces : f.value?.can_prune));
    M(s, (x) => {
      x.some((t) => t.id === d.value) || (d.value = x[0]?.id);
    }, { immediate: !0 });
    const u = v(""), $ = v(0), _ = v(null), D = v(null);
    function y() {
      d.value === "images" ? _.value?.open() : D.value?.open();
    }
    return (x, t) => (l(), o("div", rt, [
      C(me, {
        title: "Autocode",
        subtitle: "Manage agent images, workspaces and Docker.",
        count: d.value && d.value !== "docker" ? `${$.value} ${$.value === 1 ? d.value.slice(0, -1) : d.value}` : void 0,
        action: d.value === "images" ? "Add image" : d.value === "workspaces" ? "Add workspace" : void 0,
        query: u.value,
        "onUpdate:query": t[0] || (t[0] = (a) => u.value = a),
        placeholder: d.value === "docker" ? void 0 : "Search resources…",
        onCreate: y
      }, null, 8, ["count", "action", "query", "placeholder"]),
      e("div", ut, [
        e("nav", ct, [
          (l(!0), o(O, null, G(s.value, (a) => (l(), o("button", {
            key: a.id,
            type: "button",
            class: F(["ac-tab kx-focus-outline", { active: d.value === a.id }]),
            "aria-pressed": d.value === a.id,
            onClick: (r) => {
              d.value !== a.id && (d.value = a.id, u.value = "", $.value = 0);
            }
          }, [
            C(k(A), {
              icon: a.icon
            }, null, 8, ["icon"]),
            L(" " + g(a.label), 1)
          ], 10, dt))), 128))
        ])
      ]),
      k(h) && !k(f) ? (l(), o("p", vt, [
        L(g(k(h)) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: t[1] || (t[1] = //@ts-ignore
          (...a) => k(V) && k(V)(...a))
        }, "Retry")
      ])) : k(f) ? (l(), o("main", mt, [
        d.value === "images" ? (l(), H(Ca, {
          key: 0,
          ref_key: "images",
          ref: _,
          query: u.value,
          onCount: t[2] || (t[2] = (a) => $.value = a)
        }, null, 8, ["query"])) : d.value === "workspaces" ? (l(), H(et, {
          key: 1,
          ref_key: "workspaces",
          ref: D,
          query: u.value,
          onCount: t[3] || (t[3] = (a) => $.value = a)
        }, null, 8, ["query"])) : d.value === "docker" ? (l(), H(it, { key: 2 })) : (l(), o("p", kt, "No management areas are available."))
      ])) : (l(), o("div", pt, [
        C(k(A), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        t[4] || (t[4] = L(" Loading…", -1))
      ]))
    ]));
  }
}), bt = { type: "object", properties: {} };
class gt extends be {
  static get wippyConfig() {
    return { propsSchema: bt, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"], inlineCss: ke };
  }
  static get vueConfig() {
    return { rootComponent: ft, plugins: [fe] };
  }
}
xe(import.meta.url, gt);
