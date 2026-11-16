import { a as le, P as pe } from "./wc-runtime-6vw183jT.js";
import { defineComponent as K, ref as v, watch as O, openBlock as t, createElementBlock as o, Fragment as j, createElementVNode as e, createVNode as $, unref as m, createCommentVNode as k, toDisplayString as b, createTextVNode as I, withDirectives as P, vModelText as T, normalizeClass as z, createStaticVNode as me, renderList as M, vModelCheckbox as ke, computed as J, onUnmounted as fe, createBlock as H, withCtx as Y, vShow as be } from "vue";
import { Icon as L } from "@iconify/vue";
import { u as ee, _ as Z, a as ge, b as ye } from "./app-dialog.vue_vue_type_script_setup_true_lang-BYmYQVPn.js";
import { loadByTagName as he, host as X } from "@wippy-fe/proxy";
import { e as q, a as E, u as oe, b as _e, s as ne, r as ie, p as we, c as xe } from "./presentation-OrVVgi7e.js";
const $e = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, re = /* @__PURE__ */ K({
  __name: "share-control",
  props: {
    id: {},
    title: {}
  },
  setup(A) {
    const N = A, u = v(!1), g = v(null), w = v("");
    function V() {
      u.value = !1;
    }
    return O(g, async (s) => {
      if (s) {
        w.value = "";
        try {
          if (customElements.get("kickside-share") || await he("kickside-share", { timeoutMs: 8e3 }), g.value !== s) return;
          const r = document.createElement("kickside-share");
          r.setAttribute("config", JSON.stringify({
            resource_id: N.id,
            title: N.title,
            access_url: `/api/v1/component-access/grants/${encodeURIComponent(N.id)}`,
            share_url: `/api/v1/component-access/share/${encodeURIComponent(N.id)}`
          })), r.style.display = "block", r.addEventListener("close", V), s.appendChild(r);
        } catch (r) {
          w.value = q(r, "Could not open sharing.");
        }
      }
    }), (s, r) => (t(), o(j, null, [
      e("button", {
        type: "button",
        class: "ac-icon-btn kx-focus-outline",
        title: "Share",
        "aria-label": "Share",
        onClick: r[0] || (r[0] = (D) => u.value = !0)
      }, [
        $(m(L), { icon: "tabler:share" })
      ]),
      u.value ? (t(), o("div", {
        key: 0,
        ref_key: "shareHost",
        ref: g
      }, null, 512)) : k("", !0),
      w.value ? (t(), o("span", $e, b(w.value), 1)) : k("", !0)
    ], 64));
  }
}), Ce = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, De = ["disabled"], Ue = { class: "ac-card-head" }, Le = { class: "ac-muted" }, Ae = { class: "ac-field" }, Ie = { class: "ac-seg" }, Ve = {
  key: 0,
  class: "ac-field"
}, Se = {
  key: 1,
  class: "ac-muted"
}, Ne = { class: "ac-field" }, Be = { class: "ac-field" }, Pe = { class: "ac-row-fields" }, Te = { class: "ac-field" }, qe = ["placeholder"], Ee = { class: "ac-field" }, je = ["placeholder"], Re = { class: "ac-field" }, Me = { class: "ac-row-fields" }, Oe = { class: "ac-field" }, He = { class: "ac-field" }, Ge = ["placeholder"], Ke = {
  key: 2,
  class: "ac-field"
}, We = { class: "ac-checks" }, Fe = ["value"], ze = { class: "ac-field" }, Je = { class: "ac-dialog-foot" }, Qe = ["disabled"], Xe = {
  key: 3,
  class: "kx-err"
}, Ye = /* @__PURE__ */ K({
  __name: "image-form",
  props: {
    edit: {},
    capabilities: {}
  },
  emits: ["saved", "cancel", "busy"],
  setup(A, { emit: N }) {
    const u = A, g = N, w = ee();
    function V(l = w.value.default_image.settings) {
      return l ? {
        ref: "",
        mode: "pull",
        dockerfile: "",
        label: "",
        home: w.value.default_image.home,
        ...l,
        extra_args: [...l.extra_args],
        allows: [...l.allows],
        extra: ""
      } : null;
    }
    const s = v(V()), r = v(!1);
    O(() => s.value?.ref, (l) => {
      s.value && !u.edit && !r.value && l !== void 0 && (s.value.label = l);
    });
    const D = v(!1), x = v("");
    O(() => u.edit, (l) => {
      if (x.value = "", r.value = !!l, !l) {
        s.value = V();
        return;
      }
      if (!l.settings) {
        s.value = null;
        return;
      }
      const a = l.settings;
      s.value = {
        ...a,
        ref: l.image.ref,
        label: l.image.label,
        home: l.image.home,
        mode: l.dockerfile ? "build" : "pull",
        dockerfile: l.dockerfile ?? "",
        extra: a.extra_args.join(`
`),
        allows: [...a.allows]
      };
    }, { immediate: !0 });
    function C() {
      const l = w.value.default_image;
      r.value = !0;
      const a = V();
      s.value = a ? { ...a, ref: l.ref, label: l.label, home: l.home, mode: "build", dockerfile: l.dockerfile } : null;
    }
    function _() {
      const l = s.value;
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
    async function U() {
      if (!(!s.value || D.value)) {
        x.value = "", D.value = !0, g("busy", !0);
        try {
          let l;
          if (u.edit) {
            const a = await E.updateImage(u.edit.image.id, { ..._(), ref: s.value.ref, dockerfile: s.value.mode === "build" ? s.value.dockerfile : "" });
            a.build_error && (l = `Settings saved. Build preparation has not started: ${a.build_error.message}. Use Prepare image to retry.`);
          } else {
            const a = s.value, n = await E.createImage({ ..._(), ref: a.ref, dockerfile: a.mode === "build" ? a.dockerfile : "" });
            n.build_error && (l = `Image created. Build preparation has not started: ${n.build_error.message}. Use Prepare image to retry.`), s.value = V();
          }
          g("saved", l);
        } catch (l) {
          x.value = q(l, "Could not save the image.");
        } finally {
          D.value = !1, g("busy", !1);
        }
      }
    }
    return (l, a) => s.value ? (t(), o("fieldset", {
      key: 1,
      class: "ac-form",
      disabled: D.value
    }, [
      e("div", Ue, [
        e("span", Le, b(A.edit ? "Container settings" : "Use an image reference or the default agent recipe."), 1),
        A.edit ? k("", !0) : (t(), o("button", {
          key: 0,
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: C
        }, [
          $(m(L), { icon: "tabler:sparkles" }),
          a[15] || (a[15] = I(" Default agent image", -1))
        ]))
      ]),
      e("label", Ae, [
        a[16] || (a[16] = e("span", null, "Image reference", -1)),
        P(e("input", {
          "onUpdate:modelValue": a[0] || (a[0] = (n) => s.value.ref = n),
          class: "ac-mono kx-focus-halo",
          placeholder: "registry/name:tag"
        }, null, 512), [
          [T, s.value.ref]
        ])
      ]),
      e("div", Ie, [
        e("button", {
          type: "button",
          class: z(["kx-focus-outline", { active: s.value.mode === "pull" }]),
          onClick: a[1] || (a[1] = (n) => s.value.mode = "pull")
        }, "Use or pull existing", 2),
        e("button", {
          type: "button",
          class: z(["kx-focus-outline", { active: s.value.mode === "build" }]),
          onClick: a[2] || (a[2] = (n) => s.value.mode = "build")
        }, "Build from Dockerfile", 2)
      ]),
      s.value.mode === "build" ? (t(), o("label", Ve, [
        a[17] || (a[17] = e("span", null, "Dockerfile", -1)),
        P(e("textarea", {
          "onUpdate:modelValue": a[3] || (a[3] = (n) => s.value.dockerfile = n),
          rows: "9",
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [T, s.value.dockerfile]
        ]),
        a[18] || (a[18] = me('<small class="ac-hint">Include <code>sh</code>, <code>git</code>, <code>mkdir</code>, <code>dirname</code>, a <code>timeout</code> that supports <code>-k</code>, and the agent CLIs. The image user needs writable home and work directories.</small>', 1))
      ])) : k("", !0),
      A.edit ? (t(), o("p", Se, "Saving container settings prepares the image automatically.")) : k("", !0),
      e("label", Ne, [
        a[19] || (a[19] = e("span", null, "Label", -1)),
        P(e("input", {
          "onUpdate:modelValue": a[4] || (a[4] = (n) => s.value.label = n),
          class: "kx-focus-halo",
          onInput: a[5] || (a[5] = (n) => r.value = !0)
        }, null, 544), [
          [T, s.value.label]
        ])
      ]),
      e("label", Be, [
        a[20] || (a[20] = e("span", null, "Home directory in the image", -1)),
        P(e("input", {
          "onUpdate:modelValue": a[6] || (a[6] = (n) => s.value.home = n),
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [T, s.value.home]
        ])
      ]),
      e("div", Pe, [
        e("label", Te, [
          a[21] || (a[21] = e("span", null, "Memory", -1)),
          P(e("input", {
            "onUpdate:modelValue": a[7] || (a[7] = (n) => s.value.memory = n),
            class: "ac-mono kx-focus-halo",
            placeholder: m(w).default_image.settings?.memory
          }, null, 8, qe), [
            [T, s.value.memory]
          ])
        ]),
        e("label", Ee, [
          a[22] || (a[22] = e("span", null, "CPUs", -1)),
          P(e("input", {
            "onUpdate:modelValue": a[8] || (a[8] = (n) => s.value.cpus = n),
            class: "ac-mono kx-focus-halo",
            placeholder: m(w).default_image.settings?.cpus
          }, null, 8, je), [
            [T, s.value.cpus]
          ])
        ]),
        e("label", Re, [
          a[23] || (a[23] = e("span", null, "PIDs limit", -1)),
          P(e("input", {
            "onUpdate:modelValue": a[9] || (a[9] = (n) => s.value.pids_limit = n),
            type: "number",
            min: "0",
            class: "ac-mono kx-focus-halo"
          }, null, 512), [
            [
              T,
              s.value.pids_limit,
              void 0,
              { number: !0 }
            ]
          ])
        ])
      ]),
      e("div", Me, [
        e("label", Oe, [
          a[24] || (a[24] = e("span", null, "GPUs", -1)),
          P(e("input", {
            "onUpdate:modelValue": a[10] || (a[10] = (n) => s.value.gpus = n),
            class: "ac-mono kx-focus-halo",
            placeholder: "all, or device=0"
          }, null, 512), [
            [T, s.value.gpus]
          ])
        ]),
        e("label", He, [
          a[25] || (a[25] = e("span", null, "Network", -1)),
          P(e("input", {
            "onUpdate:modelValue": a[11] || (a[11] = (n) => s.value.network = n),
            class: "ac-mono kx-focus-halo",
            placeholder: m(w).default_image.settings?.network
          }, null, 8, Ge), [
            [T, s.value.network]
          ])
        ])
      ]),
      A.capabilities?.length ? (t(), o("div", Ke, [
        a[26] || (a[26] = e("span", null, "Agents may", -1)),
        e("div", We, [
          (t(!0), o(j, null, M(A.capabilities, (n) => (t(), o("label", {
            key: n,
            class: "ac-check ac-mono"
          }, [
            P(e("input", {
              "onUpdate:modelValue": a[12] || (a[12] = (h) => s.value.allows = h),
              type: "checkbox",
              class: "kx-focus-outline",
              value: n
            }, null, 8, Fe), [
              [ke, s.value.allows]
            ]),
            I(" " + b(n), 1)
          ]))), 128))
        ])
      ])) : k("", !0),
      e("label", ze, [
        a[27] || (a[27] = e("span", null, "Docker host aliases", -1)),
        P(e("textarea", {
          "onUpdate:modelValue": a[13] || (a[13] = (n) => s.value.extra = n),
          rows: "3",
          class: "ac-mono kx-focus-halo",
          placeholder: `One argument per line, e.g.
--add-host
host.docker.internal:host-gateway`
        }, null, 512), [
          [T, s.value.extra]
        ])
      ]),
      e("footer", Je, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: a[14] || (a[14] = (n) => g("cancel"))
        }, "Cancel"),
        e("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: D.value || !A.capabilities || !s.value.ref,
          onClick: U
        }, [
          $(m(L), { icon: "tabler:box" }),
          I(" " + b(D.value ? "Saving…" : A.edit ? "Save settings" : s.value.mode === "build" ? "Build image" : "Add image"), 1)
        ], 8, Qe)
      ]),
      x.value ? (t(), o("p", Xe, b(x.value), 1)) : k("", !0)
    ], 8, De)) : (t(), o("p", Ce, b(A.edit ? "Image settings are unavailable." : "Image defaults are unavailable.") + " Ask an administrator to update the image configuration.", 1));
  }
}), Ze = { class: "ac-stack" }, ea = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, aa = {
  key: 1,
  class: "kx-loading"
}, ta = {
  key: 2,
  class: "kx-empty"
}, sa = { class: "kx-empty-ico" }, la = {
  key: 3,
  class: "kx-empty"
}, oa = { class: "ac-list ac-resource-list" }, na = { class: "ac-resource-icon" }, ia = { class: "ac-account-main" }, ra = { class: "ac-row-title" }, ua = {
  key: 0,
  class: "kx-tag-sm ac-tone ready"
}, ca = { class: "ac-muted ac-mono" }, da = { class: "ac-chips" }, va = { class: "ac-muted" }, pa = {
  key: 0,
  class: "kx-err ac-small"
}, ma = { class: "ac-row-actions" }, ka = ["disabled", "onClick"], fa = ["onClick"], ba = ["onClick"], ga = ["onClick"], ya = { class: "ac-form" }, ha = { class: "ac-mono" }, _a = { class: "ac-pre ac-build-log" }, wa = /* @__PURE__ */ K({
  __name: "images",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(A, { expose: N, emit: u }) {
    const g = ee(), w = A, V = u, s = v(!1), r = v(!1), D = v({});
    N({ open: ae });
    const x = v([]), C = v([]), _ = v(""), U = v(null), l = v(null), a = J(() => [...new Set(g.value.agents.flatMap((c) => c.capabilities))].sort()), n = v(!1);
    let h = !0, B = 0, R = 0, W = 0;
    fe(() => {
      h = !1, B++, R++;
    });
    async function Q(c) {
      const f = B, i = await E.image(c);
      !h || f !== B || l.value?.id !== c || (l.value = { id: c, ref: i.image.ref, text: i.build_log || "(empty)" });
    }
    const y = ne(async () => {
      try {
        const c = await ie(E.images, (f) => f.map((i) => i.id), C, () => h, (f) => {
          x.value = f, n.value = !0, _.value = "";
        }, () => {
          y();
        });
        if (!h) return;
        x.value = c, d(c, ++W), l.value && c.some((f) => f.id === l.value?.id) && await Q(l.value.id), n.value = !0, _.value = "";
      } catch (c) {
        _.value = q(c, "Could not load images.");
      }
    });
    async function d(c, f) {
      try {
        const i = await we([...new Set(c.map((S) => S.owner_user_id))]);
        if (!h || f !== W) return;
        D.value = Object.fromEntries(c.map((S) => [S.id, `Owner: ${i[S.owner_user_id] || S.owner_user_id}`]));
      } catch (i) {
        h && f === W && (_.value = q(i, "Could not load image owners."));
      }
    }
    oe(() => C.value, () => {
      y();
    }), le(y);
    async function p(c, f) {
      _.value = "";
      try {
        await c(), await y();
      } catch (i) {
        _.value = q(i, f);
      }
    }
    async function G(c) {
      const f = ++R;
      _.value = "";
      try {
        const i = await E.image(c.id);
        h && f === R && (U.value = i);
      } catch (i) {
        h && f === R && (_.value = q(i, "Could not load the image settings."));
      }
    }
    function F() {
      R++, s.value = !1, U.value = null;
    }
    function ae() {
      F(), s.value = !0;
    }
    const ue = (c) => p(() => E.prepareImage(c.id), "Could not start the image preparation.");
    function ce(c) {
      B++, l.value = { id: c.id, ref: c.ref, text: "Loading…" }, y();
    }
    function te() {
      B++, l.value = null;
    }
    async function de(c) {
      F(), await y(), c && (_.value = c);
    }
    async function ve(c) {
      if (!await X.confirm({
        header: "Delete image",
        message: `Delete image "${c.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) return;
      const i = await X.confirm({
        header: "Docker image",
        message: `Also remove ${c.ref} from Docker on the host? Keeping it lets a later image with the same reference reuse it.`,
        icon: "tabler:brand-docker",
        acceptLabel: "Remove from Docker",
        rejectLabel: "Keep in Docker",
        acceptClass: "p-button-danger"
      });
      R++, U.value?.image.id === c.id && F(), l.value?.id === c.id && te(), _.value = "";
      try {
        await E.deleteImage(c.id, i), await y();
      } catch (S) {
        _.value = q(S, "Could not delete the image.");
      }
    }
    const se = J(() => x.value.filter((c) => [c.label, c.ref, ...c.agents].join(" ").toLowerCase().includes(w.query.toLowerCase())));
    return O(x, (c) => V("count", c.length)), (c, f) => (t(), o("div", Ze, [
      f[7] || (f[7] = e("p", { class: "ac-hint" }, "Share ready images to make them available for tasks.", -1)),
      _.value ? (t(), o("p", ea, [
        I(b(_.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: f[0] || (f[0] = //@ts-ignore
          (...i) => m(y) && m(y)(...i))
        }, "Retry")
      ])) : k("", !0),
      !n.value && !_.value ? (t(), o("div", aa, "Loading images…")) : k("", !0),
      n.value && !x.value.length ? (t(), o("div", ta, [
        e("div", sa, [
          $(m(L), { icon: "tabler:box" })
        ]),
        f[4] || (f[4] = e("div", { class: "kx-empty-title" }, "No images yet", -1)),
        f[5] || (f[5] = e("div", { class: "kx-empty-sub" }, "Start with the default agent recipe or use an existing image.", -1)),
        e("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: ae
        }, "Add image")
      ])) : n.value && !se.value.length ? (t(), o("div", la, [...f[6] || (f[6] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another image, reference or agent.", -1)
      ])])) : k("", !0),
      e("ul", oa, [
        (t(!0), o(j, null, M(se.value, (i) => (t(), o("li", {
          key: i.id,
          class: "ac-row ac-resource"
        }, [
          e("span", na, [
            $(m(L), { icon: "tabler:box" })
          ]),
          e("div", ia, [
            e("div", ra, [
              I(b(i.label), 1),
              e("span", {
                class: z(["kx-tag-sm ac-tone", i.status])
              }, b(i.status === "unprepared" ? "Needs preparation" : i.status.charAt(0).toUpperCase() + i.status.slice(1)), 3),
              i.usable ? (t(), o("span", ua, "Usable")) : k("", !0)
            ]),
            e("div", ca, b(i.ref) + " · " + b(i.home), 1),
            e("div", da, [
              (t(!0), o(j, null, M(i.agents, (S) => (t(), o("span", {
                key: S,
                class: "kx-tag-sm ac-tone"
              }, [
                $(m(L), {
                  icon: m(_e)(S, m(g).agents)
                }, null, 8, ["icon"]),
                I(b(S), 1)
              ]))), 128))
            ]),
            e("div", va, b(D.value[i.id]), 1),
            i.last_error ? (t(), o("div", pa, b(i.last_error), 1)) : k("", !0)
          ]),
          e("div", ma, [
            i.shareable ? (t(), H(re, {
              key: 0,
              id: i.id,
              title: i.label
            }, null, 8, ["id", "title"])) : k("", !0),
            i.writable ? (t(), o("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Prepare image",
              "aria-label": "Prepare image",
              disabled: i.status === "preparing",
              onClick: (S) => ue(i)
            }, [
              $(m(L), { icon: "tabler:refresh" })
            ], 8, ka)) : k("", !0),
            e("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Build log",
              "aria-label": "Build log",
              onClick: (S) => ce(i)
            }, [
              $(m(L), { icon: "tabler:file-text" })
            ], 8, fa),
            i.writable ? (t(), o("button", {
              key: 2,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Edit settings",
              "aria-label": "Edit settings",
              onClick: (S) => G(i)
            }, [
              $(m(L), { icon: "tabler:pencil" })
            ], 8, ba)) : k("", !0),
            i.deletable ? (t(), o("button", {
              key: 3,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete image",
              "aria-label": "Delete image",
              onClick: (S) => ve(i)
            }, [
              $(m(L), { icon: "tabler:trash" })
            ], 8, ga)) : k("", !0)
          ])
        ]))), 128))
      ]),
      s.value || U.value ? (t(), H(Z, {
        key: 4,
        title: U.value ? "Edit image" : "Add image",
        busy: r.value,
        wide: "",
        onClose: f[3] || (f[3] = (i) => F())
      }, {
        default: Y(() => [
          $(Ye, {
            onBusy: f[1] || (f[1] = (i) => r.value = i),
            edit: U.value,
            capabilities: a.value,
            onSaved: de,
            onCancel: f[2] || (f[2] = (i) => F())
          }, null, 8, ["edit", "capabilities"])
        ]),
        _: 1
      }, 8, ["title", "busy"])) : k("", !0),
      l.value ? (t(), H(Z, {
        key: 5,
        title: "Build log",
        wide: "",
        onClose: te
      }, {
        default: Y(() => [
          e("div", ya, [
            e("strong", ha, b(l.value.ref), 1),
            e("pre", _a, b(l.value.text), 1)
          ])
        ]),
        _: 1
      })) : k("", !0)
    ]));
  }
}), xa = { class: "ac-stack" }, $a = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ca = {
  key: 1,
  class: "kx-loading"
}, Da = {
  key: 2,
  class: "ac-chips"
}, Ua = {
  key: 3,
  class: "kx-empty"
}, La = { class: "kx-empty-ico" }, Aa = {
  key: 4,
  class: "kx-empty"
}, Ia = { class: "ac-list ac-resource-list" }, Va = { class: "ac-resource-icon" }, Sa = { class: "ac-account-main" }, Na = { class: "ac-row-title" }, Ba = { class: "kx-tag-sm ac-tone" }, Pa = {
  key: 0,
  class: "ac-muted"
}, Ta = { class: "ac-mono" }, qa = {
  key: 1,
  class: "ac-muted ac-mono"
}, Ea = { class: "ac-row-actions" }, ja = ["onClick"], Ra = ["disabled"], Ma = {
  key: 0,
  class: "ac-muted"
}, Oa = {
  key: 1,
  class: "ac-field"
}, Ha = { class: "ac-chips" }, Ga = ["onClick"], Ka = { class: "ac-field" }, Wa = { class: "ac-field" }, Fa = ["placeholder"], za = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Ja = { class: "ac-dialog-foot" }, Qa = ["disabled"], Xa = ["disabled"], Ya = /* @__PURE__ */ K({
  __name: "workspaces",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(A, { expose: N, emit: u }) {
    const g = xe(), w = v([]), V = A, s = u, r = v(!1);
    N({ open: () => {
      r.value = !0;
    } });
    const D = v([]), x = v([]), C = v(""), _ = v(!1), U = v(""), l = v(!1), a = v(""), n = v(!1);
    function h(y) {
      return y.replace(/\/+$/, "") + "/";
    }
    O([r, x], () => {
      r.value && !a.value && x.value.length && (a.value = h(x.value[0]));
    }), O(a, (y) => {
      l.value || (U.value = y.trim().split("/").filter(Boolean).pop() ?? "");
    });
    const B = ne(async () => {
      try {
        await ie(E.workspaces, (y) => y.workspaces.map((d) => d.id), w, g, (y) => {
          D.value = y.workspaces, x.value = y.roots ?? [], n.value = !0, C.value = "";
        }, () => {
          B();
        });
      } catch (y) {
        g() && (C.value = q(y, "Could not load workspaces."));
      }
    }, g);
    oe(() => w.value, () => {
      B();
    }), le(B);
    async function R() {
      C.value = "", _.value = !0;
      try {
        if (await E.createWorkspace({ name: U.value, host_path: a.value }), !g()) return;
        l.value = !1, U.value = "", a.value = "", r.value = !1, await B();
      } catch (y) {
        g() && (C.value = q(y, "Could not save the workspace."));
      } finally {
        g() && (_.value = !1);
      }
    }
    async function W(y) {
      const d = await X.confirm({
        header: "Delete workspace",
        message: `Delete workspace "${y.name}"? The host directory stays untouched.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      });
      if (!(!g() || !d)) {
        C.value = "";
        try {
          await E.deleteWorkspace(y.id), await B();
        } catch (p) {
          g() && (C.value = q(p, "Could not delete the workspace."));
        }
      }
    }
    const Q = J(() => D.value.filter((y) => [y.name, y.host_path].join(" ").toLowerCase().includes(V.query.toLowerCase())));
    return O(D, (y) => {
      s("count", y.length);
    }), (y, d) => (t(), o("div", xa, [
      d[15] || (d[15] = e("p", { class: "ac-hint" }, "Tasks use shared workspaces with the access you grant.", -1)),
      C.value && !r.value ? (t(), o("p", $a, [
        I(b(C.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: d[0] || (d[0] = //@ts-ignore
          (...p) => m(B) && m(B)(...p))
        }, "Retry")
      ])) : k("", !0),
      !n.value && !C.value ? (t(), o("div", Ca, "Loading workspaces…")) : k("", !0),
      x.value.length ? (t(), o("div", Da, [
        d[7] || (d[7] = e("span", { class: "ac-muted" }, "Allowed roots", -1)),
        (t(!0), o(j, null, M(x.value, (p) => (t(), o("span", {
          key: p,
          class: "ac-hint-chip ac-mono"
        }, b(p), 1))), 128))
      ])) : k("", !0),
      n.value && !D.value.length ? (t(), o("div", Ua, [
        e("div", La, [
          $(m(L), { icon: "tabler:folder" })
        ]),
        d[8] || (d[8] = e("div", { class: "kx-empty-title" }, "No workspaces yet", -1)),
        d[9] || (d[9] = e("div", { class: "kx-empty-sub" }, "Add a host directory, or let tasks use a scratch directory.", -1)),
        e("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: d[1] || (d[1] = (p) => r.value = !0)
        }, "Add workspace")
      ])) : n.value && !Q.value.length ? (t(), o("div", Aa, [...d[10] || (d[10] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another workspace name or path.", -1)
      ])])) : k("", !0),
      e("ul", Ia, [
        (t(!0), o(j, null, M(Q.value, (p) => (t(), o("li", {
          key: p.id,
          class: "ac-row ac-resource"
        }, [
          e("span", Va, [
            $(m(L), { icon: "tabler:folder" })
          ]),
          e("div", Sa, [
            e("div", Na, [
              I(b(p.name), 1),
              e("span", Ba, b(p.writable ? "read-write" : "read-only"), 1)
            ]),
            p.unavailable_reason ? (t(), o("div", Pa, b(p.unavailable_reason), 1)) : k("", !0),
            (t(!0), o(j, null, M(p.conflicts, (G) => (t(), o("div", {
              key: G.id,
              class: "ac-muted"
            }, [
              I("Conflicts with " + b(G.id) + ": ", 1),
              e("span", Ta, b(G.host_path), 1)
            ]))), 128)),
            p.host_path ? (t(), o("div", qa, b(p.host_path), 1)) : k("", !0)
          ]),
          e("div", Ea, [
            p.shareable ? (t(), H(re, {
              key: 0,
              id: p.id,
              title: p.name
            }, null, 8, ["id", "title"])) : k("", !0),
            p.deletable ? (t(), o("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete workspace",
              "aria-label": "Delete workspace",
              onClick: (G) => W(p)
            }, [
              $(m(L), { icon: "tabler:trash" })
            ], 8, ja)) : k("", !0)
          ])
        ]))), 128))
      ]),
      r.value ? (t(), H(Z, {
        key: 5,
        title: "Add workspace",
        busy: _.value,
        onClose: d[6] || (d[6] = (p) => r.value = !1)
      }, {
        default: Y(() => [
          e("fieldset", {
            class: "ac-form",
            disabled: _.value
          }, [
            x.value.length ? (t(), o("div", Oa, [
              d[11] || (d[11] = e("span", null, "Allowed roots", -1)),
              e("div", Ha, [
                (t(!0), o(j, null, M(x.value, (p) => (t(), o("button", {
                  key: p,
                  type: "button",
                  class: "ac-chip ac-mono kx-focus-halo",
                  title: "Start from this root",
                  onClick: (G) => a.value = h(p)
                }, b(p), 9, Ga))), 128))
              ])
            ])) : (t(), o("p", Ma, "The host administrator configures allowed workspace roots.")),
            e("label", Ka, [
              d[12] || (d[12] = e("span", null, "Name", -1)),
              P(e("input", {
                "onUpdate:modelValue": d[2] || (d[2] = (p) => U.value = p),
                onInput: d[3] || (d[3] = (p) => l.value = !0),
                autofocus: "",
                class: "kx-focus-halo",
                placeholder: "e.g. Kickside checkout"
              }, null, 544), [
                [T, U.value]
              ])
            ]),
            e("label", Wa, [
              d[13] || (d[13] = e("span", null, "Host directory", -1)),
              P(e("input", {
                "onUpdate:modelValue": d[4] || (d[4] = (p) => a.value = p),
                class: "ac-mono kx-focus-halo",
                placeholder: (x.value[0] ?? "/srv/work") + "/project"
              }, null, 8, Fa), [
                [T, a.value]
              ]),
              d[14] || (d[14] = e("small", { class: "ac-hint" }, [
                I("An existing directory, mounted at "),
                e("code", null, "/workspace"),
                I(".")
              ], -1))
            ]),
            C.value ? (t(), o("p", za, b(C.value), 1)) : k("", !0),
            e("footer", Ja, [
              e("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                disabled: _.value,
                onClick: d[5] || (d[5] = (p) => r.value = !1)
              }, "Cancel", 8, Qa),
              e("button", {
                type: "button",
                class: "ac-btn primary kx-focus-halo",
                disabled: _.value || !U.value.trim() || !a.value.trim(),
                onClick: R
              }, [
                $(m(L), { icon: "tabler:folder-plus" }),
                I(b(_.value ? "Saving…" : "Add workspace"), 1)
              ], 8, Xa)
            ])
          ], 8, Ra)
        ]),
        _: 1
      }, 8, ["busy"])) : k("", !0)
    ]));
  }
}), Za = { class: "ac-card ac-narrow" }, et = { class: "ac-card-head" }, at = { class: "ac-card-title" }, tt = ["disabled"], st = {
  key: 0,
  class: "kx-err"
}, lt = {
  key: 1,
  class: "ac-pre"
}, ot = /* @__PURE__ */ K({
  __name: "maintenance",
  setup(A) {
    const N = ee(), u = v(!1), g = v(""), w = v("");
    async function V() {
      if (await X.confirm({
        header: "Clean up Docker",
        message: `Prune stopped Autocode containers, unused images and build cache older than ${N.value.build_cache_retention} across this Docker host? Other modules may use the shared image cache.`,
        icon: "tabler:trash-x",
        acceptLabel: "Clean up",
        rejectLabel: "Cancel"
      })) {
        w.value = "", u.value = !0;
        try {
          g.value = await E.prune();
        } catch (r) {
          w.value = q(r, "Cleanup failed.");
        } finally {
          u.value = !1;
        }
      }
    }
    return (s, r) => (t(), o("section", Za, [
      e("div", et, [
        e("h2", at, [
          $(m(L), { icon: "tabler:brand-docker" }),
          r[0] || (r[0] = I("Docker cleanup", -1))
        ]),
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          disabled: u.value,
          onClick: V
        }, [
          $(m(L), {
            icon: u.value ? "tabler:loader-2" : "tabler:trash-x",
            class: z({ spin: u.value })
          }, null, 8, ["icon", "class"]),
          I(" " + b(u.value ? "Cleaning…" : "Clean up Docker"), 1)
        ], 8, tt)
      ]),
      r[1] || (r[1] = e("p", { class: "ac-hint" }, "Prune stopped Autocode containers, dangling images and build cache across the Docker host. Tagged images stay.", -1)),
      w.value ? (t(), o("p", st, b(w.value), 1)) : k("", !0),
      g.value ? (t(), o("pre", lt, b(g.value), 1)) : k("", !0)
    ]));
  }
}), nt = { class: "ac" }, it = { class: "ac-bar" }, rt = {
  class: "ac-tabs",
  "aria-label": "Autocode management"
}, ut = ["aria-pressed", "onClick"], ct = {
  key: 0,
  class: "kx-err"
}, dt = {
  key: 1,
  class: "kx-loading"
}, vt = {
  key: 2,
  class: "ac-body"
}, pt = {
  key: 3,
  class: "ac-muted"
}, mt = /* @__PURE__ */ K({
  __name: "admin",
  setup(A) {
    const N = [
      { id: "images", label: "Images", icon: "tabler:box" },
      { id: "workspaces", label: "Workspaces", icon: "tabler:folder" },
      { id: "docker", label: "Docker", icon: "tabler:brand-docker" }
    ], u = v(), { catalog: g, error: w, load: V } = ge(), s = J(() => N.filter((a) => a.id === "images" ? g.value?.can_images : a.id === "workspaces" ? g.value?.can_workspaces : g.value?.can_prune));
    O(s, (a) => {
      a.some((n) => n.id === u.value) || (u.value = a[0]?.id);
    }, { immediate: !0 });
    const r = v(""), D = v(0), x = v(0), C = J(() => u.value === "images" ? D.value : x.value), _ = v(null), U = v(null);
    function l() {
      u.value === "images" ? _.value?.open() : U.value?.open();
    }
    return (a, n) => (t(), o("div", nt, [
      $(ye, {
        title: "Autocode",
        subtitle: "Manage agent images, workspaces and Docker.",
        count: u.value && u.value !== "docker" ? `${C.value} ${C.value === 1 ? u.value.slice(0, -1) : u.value}` : void 0,
        action: u.value === "images" ? "Add image" : u.value === "workspaces" ? "Add workspace" : void 0,
        query: r.value,
        "onUpdate:query": n[0] || (n[0] = (h) => r.value = h),
        placeholder: u.value === "docker" ? void 0 : "Search resources…",
        onCreate: l
      }, null, 8, ["count", "action", "query", "placeholder"]),
      e("div", it, [
        e("nav", rt, [
          (t(!0), o(j, null, M(s.value, (h) => (t(), o("button", {
            key: h.id,
            type: "button",
            class: z(["ac-tab kx-focus-outline", { active: u.value === h.id }]),
            "aria-pressed": u.value === h.id,
            onClick: (B) => {
              u.value !== h.id && (u.value = h.id, r.value = "");
            }
          }, [
            $(m(L), {
              icon: h.icon
            }, null, 8, ["icon"]),
            I(" " + b(h.label), 1)
          ], 10, ut))), 128))
        ])
      ]),
      m(w) && !m(g) ? (t(), o("p", ct, [
        I(b(m(w)) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: n[1] || (n[1] = //@ts-ignore
          (...h) => m(V) && m(V)(...h))
        }, "Retry")
      ])) : m(g) ? (t(), o("main", vt, [
        u.value === "images" ? (t(), H(wa, {
          key: 0,
          ref_key: "images",
          ref: _,
          query: r.value,
          onCount: n[2] || (n[2] = (h) => D.value = h)
        }, null, 8, ["query"])) : k("", !0),
        m(g).can_workspaces ? P((t(), H(Ya, {
          key: 1,
          ref_key: "workspaces",
          ref: U,
          query: r.value,
          onCount: n[3] || (n[3] = (h) => x.value = h)
        }, null, 8, ["query"])), [
          [be, u.value === "workspaces"]
        ]) : k("", !0),
        u.value === "docker" ? (t(), H(ot, { key: 2 })) : k("", !0),
        u.value ? k("", !0) : (t(), o("p", pt, "No management areas are available."))
      ])) : (t(), o("div", dt, [
        $(m(L), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        n[4] || (n[4] = I(" Loading…", -1))
      ]))
    ]));
  }
}), _t = {
  rootComponent: mt,
  plugins: [pe]
};
export {
  _t as mountConfig
};
