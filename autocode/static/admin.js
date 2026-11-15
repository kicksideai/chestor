import { u as ee, _ as Y, a as pe, b as me, s as ke, P as fe } from "./styles-C4tJ2C9e.js";
import { u as le, W as be } from "./dto-BNKl23sa.js";
import { defineComponent as G, ref as v, watch as O, openBlock as t, createElementBlock as o, Fragment as j, createElementVNode as e, createVNode as $, unref as m, createCommentVNode as k, toDisplayString as b, createTextVNode as V, withDirectives as P, vModelText as T, normalizeClass as z, createStaticVNode as ge, renderList as M, vModelCheckbox as ye, computed as J, onUnmounted as he, createBlock as H, withCtx as Z, vShow as _e } from "vue";
import { Icon as L } from "@iconify/vue";
import { loadByTagName as we, host as X, define as xe } from "@wippy-fe/proxy";
import { e as B, a as q, u as oe, b as $e, s as ne, r as ie, p as Ce, c as De } from "./presentation-zvMeYiCQ.js";
const Ue = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, re = /* @__PURE__ */ G({
  __name: "share-control",
  props: {
    id: {},
    title: {}
  },
  setup(D) {
    const E = D, u = v(!1), g = v(null), w = v("");
    function I() {
      u.value = !1;
    }
    return O(g, async (s) => {
      if (s) {
        w.value = "";
        try {
          if (customElements.get("kickside-share") || await we("kickside-share", { timeoutMs: 8e3 }), g.value !== s) return;
          const r = document.createElement("kickside-share");
          r.setAttribute("config", JSON.stringify({
            resource_id: E.id,
            title: E.title,
            access_url: `/api/v1/component-access/grants/${encodeURIComponent(E.id)}`,
            share_url: `/api/v1/component-access/share/${encodeURIComponent(E.id)}`
          })), r.style.display = "block", r.addEventListener("close", I), s.appendChild(r);
        } catch (r) {
          w.value = B(r, "Could not open sharing.");
        }
      }
    }), (s, r) => (t(), o(j, null, [
      e("button", {
        type: "button",
        class: "ac-icon-btn kx-focus-outline",
        title: "Share",
        "aria-label": "Share",
        onClick: r[0] || (r[0] = (U) => u.value = !0)
      }, [
        $(m(L), { icon: "tabler:share" })
      ]),
      u.value ? (t(), o("div", {
        key: 0,
        ref_key: "shareHost",
        ref: g
      }, null, 512)) : k("", !0),
      w.value ? (t(), o("span", Ue, b(w.value), 1)) : k("", !0)
    ], 64));
  }
}), Ae = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Le = ["disabled"], Ve = { class: "ac-card-head" }, Ie = { class: "ac-muted" }, Se = { class: "ac-field" }, Ee = { class: "ac-seg" }, Ne = {
  key: 0,
  class: "ac-field"
}, Pe = {
  key: 1,
  class: "ac-muted"
}, Te = { class: "ac-field" }, Be = { class: "ac-field" }, qe = { class: "ac-row-fields" }, je = { class: "ac-field" }, Re = ["placeholder"], Me = { class: "ac-field" }, Oe = ["placeholder"], He = { class: "ac-field" }, We = { class: "ac-row-fields" }, Ge = { class: "ac-field" }, Ke = { class: "ac-field" }, Fe = ["placeholder"], ze = {
  key: 2,
  class: "ac-field"
}, Je = { class: "ac-checks" }, Qe = ["value"], Xe = { class: "ac-field" }, Ye = { class: "ac-dialog-foot" }, Ze = ["disabled"], ea = {
  key: 3,
  class: "kx-err"
}, aa = /* @__PURE__ */ G({
  __name: "image-form",
  props: {
    edit: {},
    capabilities: {}
  },
  emits: ["saved", "cancel", "busy"],
  setup(D, { emit: E }) {
    const u = D, g = E, w = ee();
    function I(l = w.value.default_image.settings) {
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
    const s = v(I()), r = v(!1);
    O(() => s.value?.ref, (l) => {
      s.value && !u.edit && !r.value && l !== void 0 && (s.value.label = l);
    });
    const U = v(!1), x = v("");
    O(() => u.edit, (l) => {
      if (x.value = "", r.value = !!l, !l) {
        s.value = I();
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
      const a = I();
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
    async function A() {
      if (!(!s.value || U.value)) {
        x.value = "", U.value = !0, g("busy", !0);
        try {
          let l;
          if (u.edit) {
            const a = await q.updateImage(u.edit.image.id, { ..._(), ref: s.value.ref, dockerfile: s.value.mode === "build" ? s.value.dockerfile : "" });
            a.build_error && (l = `Settings saved. Build preparation has not started: ${a.build_error.message}. Use Prepare image to retry.`);
          } else {
            const a = s.value, n = await q.createImage({ ..._(), ref: a.ref, dockerfile: a.mode === "build" ? a.dockerfile : "" });
            n.build_error && (l = `Image created. Build preparation has not started: ${n.build_error.message}. Use Prepare image to retry.`), s.value = I();
          }
          g("saved", l);
        } catch (l) {
          x.value = B(l, "Could not save the image.");
        } finally {
          U.value = !1, g("busy", !1);
        }
      }
    }
    return (l, a) => s.value ? (t(), o("fieldset", {
      key: 1,
      class: "ac-form",
      disabled: U.value
    }, [
      e("div", Ve, [
        e("span", Ie, b(D.edit ? "Container settings" : "Use an image reference or the default agent recipe."), 1),
        D.edit ? k("", !0) : (t(), o("button", {
          key: 0,
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: C
        }, [
          $(m(L), { icon: "tabler:sparkles" }),
          a[15] || (a[15] = V(" Default agent image", -1))
        ]))
      ]),
      e("label", Se, [
        a[16] || (a[16] = e("span", null, "Image reference", -1)),
        P(e("input", {
          "onUpdate:modelValue": a[0] || (a[0] = (n) => s.value.ref = n),
          class: "ac-mono kx-focus-halo",
          placeholder: "registry/name:tag"
        }, null, 512), [
          [T, s.value.ref]
        ])
      ]),
      e("div", Ee, [
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
      s.value.mode === "build" ? (t(), o("label", Ne, [
        a[17] || (a[17] = e("span", null, "Dockerfile", -1)),
        P(e("textarea", {
          "onUpdate:modelValue": a[3] || (a[3] = (n) => s.value.dockerfile = n),
          rows: "9",
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [T, s.value.dockerfile]
        ]),
        a[18] || (a[18] = ge('<small class="ac-hint">Include <code>sh</code>, <code>git</code>, <code>mkdir</code>, <code>dirname</code>, a <code>timeout</code> that supports <code>-k</code>, and the agent CLIs. The image user needs writable home and work directories.</small>', 1))
      ])) : k("", !0),
      D.edit ? (t(), o("p", Pe, "Saving container settings prepares the image automatically.")) : k("", !0),
      e("label", Te, [
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
      e("div", qe, [
        e("label", je, [
          a[21] || (a[21] = e("span", null, "Memory", -1)),
          P(e("input", {
            "onUpdate:modelValue": a[7] || (a[7] = (n) => s.value.memory = n),
            class: "ac-mono kx-focus-halo",
            placeholder: m(w).default_image.settings?.memory
          }, null, 8, Re), [
            [T, s.value.memory]
          ])
        ]),
        e("label", Me, [
          a[22] || (a[22] = e("span", null, "CPUs", -1)),
          P(e("input", {
            "onUpdate:modelValue": a[8] || (a[8] = (n) => s.value.cpus = n),
            class: "ac-mono kx-focus-halo",
            placeholder: m(w).default_image.settings?.cpus
          }, null, 8, Oe), [
            [T, s.value.cpus]
          ])
        ]),
        e("label", He, [
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
      e("div", We, [
        e("label", Ge, [
          a[24] || (a[24] = e("span", null, "GPUs", -1)),
          P(e("input", {
            "onUpdate:modelValue": a[10] || (a[10] = (n) => s.value.gpus = n),
            class: "ac-mono kx-focus-halo",
            placeholder: "all, or device=0"
          }, null, 512), [
            [T, s.value.gpus]
          ])
        ]),
        e("label", Ke, [
          a[25] || (a[25] = e("span", null, "Network", -1)),
          P(e("input", {
            "onUpdate:modelValue": a[11] || (a[11] = (n) => s.value.network = n),
            class: "ac-mono kx-focus-halo",
            placeholder: m(w).default_image.settings?.network
          }, null, 8, Fe), [
            [T, s.value.network]
          ])
        ])
      ]),
      D.capabilities?.length ? (t(), o("div", ze, [
        a[26] || (a[26] = e("span", null, "Agents may", -1)),
        e("div", Je, [
          (t(!0), o(j, null, M(D.capabilities, (n) => (t(), o("label", {
            key: n,
            class: "ac-check ac-mono"
          }, [
            P(e("input", {
              "onUpdate:modelValue": a[12] || (a[12] = (h) => s.value.allows = h),
              type: "checkbox",
              class: "kx-focus-outline",
              value: n
            }, null, 8, Qe), [
              [ye, s.value.allows]
            ]),
            V(" " + b(n), 1)
          ]))), 128))
        ])
      ])) : k("", !0),
      e("label", Xe, [
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
      e("footer", Ye, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: a[14] || (a[14] = (n) => g("cancel"))
        }, "Cancel"),
        e("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: U.value || !D.capabilities || !s.value.ref,
          onClick: A
        }, [
          $(m(L), { icon: "tabler:box" }),
          V(" " + b(U.value ? "Saving…" : D.edit ? "Save settings" : s.value.mode === "build" ? "Build image" : "Add image"), 1)
        ], 8, Ze)
      ]),
      x.value ? (t(), o("p", ea, b(x.value), 1)) : k("", !0)
    ], 8, Le)) : (t(), o("p", Ae, b(D.edit ? "Image settings are unavailable." : "Image defaults are unavailable.") + " Ask an administrator to update the image configuration.", 1));
  }
}), ta = { class: "ac-stack" }, sa = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, la = {
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
}, ba = { class: "ac-row-actions" }, ga = ["disabled", "onClick"], ya = ["onClick"], ha = ["onClick"], _a = ["onClick"], wa = { class: "ac-form" }, xa = { class: "ac-mono" }, $a = { class: "ac-pre ac-build-log" }, Ca = /* @__PURE__ */ G({
  __name: "images",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(D, { expose: E, emit: u }) {
    const g = ee(), w = D, I = u, s = v(!1), r = v(!1), U = v({});
    E({ open: ae });
    const x = v([]), C = v([]), _ = v(""), A = v(null), l = v(null), a = J(() => [...new Set(g.value.agents.flatMap((c) => c.capabilities))].sort()), n = v(!1);
    let h = !0, N = 0, R = 0, K = 0;
    he(() => {
      h = !1, N++, R++;
    });
    async function Q(c) {
      const f = N, i = await q.image(c);
      !h || f !== N || l.value?.id !== c || (l.value = { id: c, ref: i.image.ref, text: i.build_log || "(empty)" });
    }
    const y = ne(async () => {
      try {
        const c = await ie(q.images, (f) => f.map((i) => i.id), C, () => h, (f) => {
          x.value = f, n.value = !0, _.value = "";
        }, () => {
          y();
        });
        if (!h) return;
        x.value = c, d(c, ++K), l.value && c.some((f) => f.id === l.value?.id) && await Q(l.value.id), n.value = !0, _.value = "";
      } catch (c) {
        _.value = B(c, "Could not load images.");
      }
    });
    async function d(c, f) {
      try {
        const i = await Ce([...new Set(c.map((S) => S.owner_user_id))]);
        if (!h || f !== K) return;
        U.value = Object.fromEntries(c.map((S) => [S.id, `Owner: ${i[S.owner_user_id] || S.owner_user_id}`]));
      } catch (i) {
        h && f === K && (_.value = B(i, "Could not load image owners."));
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
        _.value = B(i, f);
      }
    }
    async function W(c) {
      const f = ++R;
      _.value = "";
      try {
        const i = await q.image(c.id);
        h && f === R && (A.value = i);
      } catch (i) {
        h && f === R && (_.value = B(i, "Could not load the image settings."));
      }
    }
    function F() {
      R++, s.value = !1, A.value = null;
    }
    function ae() {
      F(), s.value = !0;
    }
    const ue = (c) => p(() => q.prepareImage(c.id), "Could not start the image preparation.");
    function ce(c) {
      N++, l.value = { id: c.id, ref: c.ref, text: "Loading…" }, y();
    }
    function te() {
      N++, l.value = null;
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
      R++, A.value?.image.id === c.id && F(), l.value?.id === c.id && te(), _.value = "";
      try {
        await q.deleteImage(c.id, i), await y();
      } catch (S) {
        _.value = B(S, "Could not delete the image.");
      }
    }
    const se = J(() => x.value.filter((c) => [c.label, c.ref, ...c.agents].join(" ").toLowerCase().includes(w.query.toLowerCase())));
    return O(x, (c) => I("count", c.length)), (c, f) => (t(), o("div", ta, [
      f[7] || (f[7] = e("p", { class: "ac-hint" }, "Share ready images to make them available for tasks.", -1)),
      _.value ? (t(), o("p", sa, [
        V(b(_.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: f[0] || (f[0] = //@ts-ignore
          (...i) => m(y) && m(y)(...i))
        }, "Retry")
      ])) : k("", !0),
      !n.value && !_.value ? (t(), o("div", la, "Loading images…")) : k("", !0),
      n.value && !x.value.length ? (t(), o("div", oa, [
        e("div", na, [
          $(m(L), { icon: "tabler:box" })
        ]),
        f[4] || (f[4] = e("div", { class: "kx-empty-title" }, "No images yet", -1)),
        f[5] || (f[5] = e("div", { class: "kx-empty-sub" }, "Start with the default agent recipe or use an existing image.", -1)),
        e("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: ae
        }, "Add image")
      ])) : n.value && !se.value.length ? (t(), o("div", ia, [...f[6] || (f[6] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another image, reference or agent.", -1)
      ])])) : k("", !0),
      e("ul", ra, [
        (t(!0), o(j, null, M(se.value, (i) => (t(), o("li", {
          key: i.id,
          class: "ac-row ac-resource"
        }, [
          e("span", ua, [
            $(m(L), { icon: "tabler:box" })
          ]),
          e("div", ca, [
            e("div", da, [
              V(b(i.label), 1),
              e("span", {
                class: z(["kx-tag-sm ac-tone", i.status])
              }, b(i.status === "unprepared" ? "Needs preparation" : i.status.charAt(0).toUpperCase() + i.status.slice(1)), 3),
              i.usable ? (t(), o("span", va, "Usable")) : k("", !0)
            ]),
            e("div", pa, b(i.ref) + " · " + b(i.home), 1),
            e("div", ma, [
              (t(!0), o(j, null, M(i.agents, (S) => (t(), o("span", {
                key: S,
                class: "kx-tag-sm ac-tone"
              }, [
                $(m(L), {
                  icon: m($e)(S, m(g).agents)
                }, null, 8, ["icon"]),
                V(b(S), 1)
              ]))), 128))
            ]),
            e("div", ka, b(U.value[i.id]), 1),
            i.last_error ? (t(), o("div", fa, b(i.last_error), 1)) : k("", !0)
          ]),
          e("div", ba, [
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
            ], 8, ga)) : k("", !0),
            e("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Build log",
              "aria-label": "Build log",
              onClick: (S) => ce(i)
            }, [
              $(m(L), { icon: "tabler:file-text" })
            ], 8, ya),
            i.writable ? (t(), o("button", {
              key: 2,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Edit settings",
              "aria-label": "Edit settings",
              onClick: (S) => W(i)
            }, [
              $(m(L), { icon: "tabler:pencil" })
            ], 8, ha)) : k("", !0),
            i.deletable ? (t(), o("button", {
              key: 3,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete image",
              "aria-label": "Delete image",
              onClick: (S) => ve(i)
            }, [
              $(m(L), { icon: "tabler:trash" })
            ], 8, _a)) : k("", !0)
          ])
        ]))), 128))
      ]),
      s.value || A.value ? (t(), H(Y, {
        key: 4,
        title: A.value ? "Edit image" : "Add image",
        busy: r.value,
        wide: "",
        onClose: f[3] || (f[3] = (i) => F())
      }, {
        default: Z(() => [
          $(aa, {
            onBusy: f[1] || (f[1] = (i) => r.value = i),
            edit: A.value,
            capabilities: a.value,
            onSaved: de,
            onCancel: f[2] || (f[2] = (i) => F())
          }, null, 8, ["edit", "capabilities"])
        ]),
        _: 1
      }, 8, ["title", "busy"])) : k("", !0),
      l.value ? (t(), H(Y, {
        key: 5,
        title: "Build log",
        wide: "",
        onClose: te
      }, {
        default: Z(() => [
          e("div", wa, [
            e("strong", xa, b(l.value.ref), 1),
            e("pre", $a, b(l.value.text), 1)
          ])
        ]),
        _: 1
      })) : k("", !0)
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
}, Ea = { class: "ac-list ac-resource-list" }, Na = { class: "ac-resource-icon" }, Pa = { class: "ac-account-main" }, Ta = { class: "ac-row-title" }, Ba = { class: "kx-tag-sm ac-tone" }, qa = {
  key: 0,
  class: "ac-muted"
}, ja = { class: "ac-mono" }, Ra = {
  key: 1,
  class: "ac-muted ac-mono"
}, Ma = { class: "ac-row-actions" }, Oa = ["onClick"], Ha = ["disabled"], Wa = {
  key: 0,
  class: "ac-muted"
}, Ga = {
  key: 1,
  class: "ac-field"
}, Ka = { class: "ac-chips" }, Fa = ["onClick"], za = { class: "ac-field" }, Ja = { class: "ac-field" }, Qa = ["placeholder"], Xa = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Ya = { class: "ac-dialog-foot" }, Za = ["disabled"], et = ["disabled"], at = /* @__PURE__ */ G({
  __name: "workspaces",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(D, { expose: E, emit: u }) {
    const g = De(), w = v([]), I = D, s = u, r = v(!1);
    E({ open: () => {
      r.value = !0;
    } });
    const U = v([]), x = v([]), C = v(""), _ = v(!1), A = v(""), l = v(!1), a = v(""), n = v(!1);
    function h(y) {
      return y.replace(/\/+$/, "") + "/";
    }
    O([r, x], () => {
      r.value && !a.value && x.value.length && (a.value = h(x.value[0]));
    }), O(a, (y) => {
      l.value || (A.value = y.trim().split("/").filter(Boolean).pop() ?? "");
    });
    const N = ne(async () => {
      try {
        await ie(q.workspaces, (y) => y.workspaces.map((d) => d.id), w, g, (y) => {
          U.value = y.workspaces, x.value = y.roots ?? [], n.value = !0, C.value = "";
        }, () => {
          N();
        });
      } catch (y) {
        g() && (C.value = B(y, "Could not load workspaces."));
      }
    }, g);
    oe(() => w.value, () => {
      N();
    }), le(N);
    async function R() {
      C.value = "", _.value = !0;
      try {
        if (await q.createWorkspace({ name: A.value, host_path: a.value }), !g()) return;
        l.value = !1, A.value = "", a.value = "", r.value = !1, await N();
      } catch (y) {
        g() && (C.value = B(y, "Could not save the workspace."));
      } finally {
        g() && (_.value = !1);
      }
    }
    async function K(y) {
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
          await q.deleteWorkspace(y.id), await N();
        } catch (p) {
          g() && (C.value = B(p, "Could not delete the workspace."));
        }
      }
    }
    const Q = J(() => U.value.filter((y) => [y.name, y.host_path].join(" ").toLowerCase().includes(I.query.toLowerCase())));
    return O(U, (y) => {
      s("count", y.length);
    }), (y, d) => (t(), o("div", Da, [
      d[15] || (d[15] = e("p", { class: "ac-hint" }, "Tasks use shared workspaces with the access you grant.", -1)),
      C.value && !r.value ? (t(), o("p", Ua, [
        V(b(C.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: d[0] || (d[0] = //@ts-ignore
          (...p) => m(N) && m(N)(...p))
        }, "Retry")
      ])) : k("", !0),
      !n.value && !C.value ? (t(), o("div", Aa, "Loading workspaces…")) : k("", !0),
      x.value.length ? (t(), o("div", La, [
        d[7] || (d[7] = e("span", { class: "ac-muted" }, "Allowed roots", -1)),
        (t(!0), o(j, null, M(x.value, (p) => (t(), o("span", {
          key: p,
          class: "ac-hint-chip ac-mono"
        }, b(p), 1))), 128))
      ])) : k("", !0),
      n.value && !U.value.length ? (t(), o("div", Va, [
        e("div", Ia, [
          $(m(L), { icon: "tabler:folder" })
        ]),
        d[8] || (d[8] = e("div", { class: "kx-empty-title" }, "No workspaces yet", -1)),
        d[9] || (d[9] = e("div", { class: "kx-empty-sub" }, "Add a host directory, or let tasks use a scratch directory.", -1)),
        e("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: d[1] || (d[1] = (p) => r.value = !0)
        }, "Add workspace")
      ])) : n.value && !Q.value.length ? (t(), o("div", Sa, [...d[10] || (d[10] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another workspace name or path.", -1)
      ])])) : k("", !0),
      e("ul", Ea, [
        (t(!0), o(j, null, M(Q.value, (p) => (t(), o("li", {
          key: p.id,
          class: "ac-row ac-resource"
        }, [
          e("span", Na, [
            $(m(L), { icon: "tabler:folder" })
          ]),
          e("div", Pa, [
            e("div", Ta, [
              V(b(p.name), 1),
              e("span", Ba, b(p.writable ? "read-write" : "read-only"), 1)
            ]),
            p.unavailable_reason ? (t(), o("div", qa, b(p.unavailable_reason), 1)) : k("", !0),
            (t(!0), o(j, null, M(p.conflicts, (W) => (t(), o("div", {
              key: W.id,
              class: "ac-muted"
            }, [
              V("Conflicts with " + b(W.id) + ": ", 1),
              e("span", ja, b(W.host_path), 1)
            ]))), 128)),
            p.host_path ? (t(), o("div", Ra, b(p.host_path), 1)) : k("", !0)
          ]),
          e("div", Ma, [
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
              onClick: (W) => K(p)
            }, [
              $(m(L), { icon: "tabler:trash" })
            ], 8, Oa)) : k("", !0)
          ])
        ]))), 128))
      ]),
      r.value ? (t(), H(Y, {
        key: 5,
        title: "Add workspace",
        busy: _.value,
        onClose: d[6] || (d[6] = (p) => r.value = !1)
      }, {
        default: Z(() => [
          e("fieldset", {
            class: "ac-form",
            disabled: _.value
          }, [
            x.value.length ? (t(), o("div", Ga, [
              d[11] || (d[11] = e("span", null, "Allowed roots", -1)),
              e("div", Ka, [
                (t(!0), o(j, null, M(x.value, (p) => (t(), o("button", {
                  key: p,
                  type: "button",
                  class: "ac-chip ac-mono kx-focus-halo",
                  title: "Start from this root",
                  onClick: (W) => a.value = h(p)
                }, b(p), 9, Fa))), 128))
              ])
            ])) : (t(), o("p", Wa, "The host administrator configures allowed workspace roots.")),
            e("label", za, [
              d[12] || (d[12] = e("span", null, "Name", -1)),
              P(e("input", {
                "onUpdate:modelValue": d[2] || (d[2] = (p) => A.value = p),
                onInput: d[3] || (d[3] = (p) => l.value = !0),
                autofocus: "",
                class: "kx-focus-halo",
                placeholder: "e.g. Kickside checkout"
              }, null, 544), [
                [T, A.value]
              ])
            ]),
            e("label", Ja, [
              d[13] || (d[13] = e("span", null, "Host directory", -1)),
              P(e("input", {
                "onUpdate:modelValue": d[4] || (d[4] = (p) => a.value = p),
                class: "ac-mono kx-focus-halo",
                placeholder: (x.value[0] ?? "/srv/work") + "/project"
              }, null, 8, Qa), [
                [T, a.value]
              ]),
              d[14] || (d[14] = e("small", { class: "ac-hint" }, [
                V("An existing directory, mounted at "),
                e("code", null, "/workspace"),
                V(".")
              ], -1))
            ]),
            C.value ? (t(), o("p", Xa, b(C.value), 1)) : k("", !0),
            e("footer", Ya, [
              e("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                disabled: _.value,
                onClick: d[5] || (d[5] = (p) => r.value = !1)
              }, "Cancel", 8, Za),
              e("button", {
                type: "button",
                class: "ac-btn primary kx-focus-halo",
                disabled: _.value || !A.value.trim() || !a.value.trim(),
                onClick: R
              }, [
                $(m(L), { icon: "tabler:folder-plus" }),
                V(b(_.value ? "Saving…" : "Add workspace"), 1)
              ], 8, et)
            ])
          ], 8, Ha)
        ]),
        _: 1
      }, 8, ["busy"])) : k("", !0)
    ]));
  }
}), tt = { class: "ac-card ac-narrow" }, st = { class: "ac-card-head" }, lt = { class: "ac-card-title" }, ot = ["disabled"], nt = {
  key: 0,
  class: "kx-err"
}, it = {
  key: 1,
  class: "ac-pre"
}, rt = /* @__PURE__ */ G({
  __name: "maintenance",
  setup(D) {
    const E = ee(), u = v(!1), g = v(""), w = v("");
    async function I() {
      if (await X.confirm({
        header: "Clean up Docker",
        message: `Prune stopped Autocode containers, unused images and build cache older than ${E.value.build_cache_retention} across this Docker host? Other modules may use the shared image cache.`,
        icon: "tabler:trash-x",
        acceptLabel: "Clean up",
        rejectLabel: "Cancel"
      })) {
        w.value = "", u.value = !0;
        try {
          g.value = await q.prune();
        } catch (r) {
          w.value = B(r, "Cleanup failed.");
        } finally {
          u.value = !1;
        }
      }
    }
    return (s, r) => (t(), o("section", tt, [
      e("div", st, [
        e("h2", lt, [
          $(m(L), { icon: "tabler:brand-docker" }),
          r[0] || (r[0] = V("Docker cleanup", -1))
        ]),
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          disabled: u.value,
          onClick: I
        }, [
          $(m(L), {
            icon: u.value ? "tabler:loader-2" : "tabler:trash-x",
            class: z({ spin: u.value })
          }, null, 8, ["icon", "class"]),
          V(" " + b(u.value ? "Cleaning…" : "Clean up Docker"), 1)
        ], 8, ot)
      ]),
      r[1] || (r[1] = e("p", { class: "ac-hint" }, "Prune stopped Autocode containers, dangling images and build cache across the Docker host. Tagged images stay.", -1)),
      w.value ? (t(), o("p", nt, b(w.value), 1)) : k("", !0),
      g.value ? (t(), o("pre", it, b(g.value), 1)) : k("", !0)
    ]));
  }
}), ut = { class: "ac" }, ct = { class: "ac-bar" }, dt = {
  class: "ac-tabs",
  "aria-label": "Autocode management"
}, vt = ["aria-pressed", "onClick"], pt = {
  key: 0,
  class: "kx-err"
}, mt = {
  key: 1,
  class: "kx-loading"
}, kt = {
  key: 2,
  class: "ac-body"
}, ft = {
  key: 3,
  class: "ac-muted"
}, bt = /* @__PURE__ */ G({
  __name: "admin",
  setup(D) {
    const E = [
      { id: "images", label: "Images", icon: "tabler:box" },
      { id: "workspaces", label: "Workspaces", icon: "tabler:folder" },
      { id: "docker", label: "Docker", icon: "tabler:brand-docker" }
    ], u = v(), { catalog: g, error: w, load: I } = pe(), s = J(() => E.filter((a) => a.id === "images" ? g.value?.can_images : a.id === "workspaces" ? g.value?.can_workspaces : g.value?.can_prune));
    O(s, (a) => {
      a.some((n) => n.id === u.value) || (u.value = a[0]?.id);
    }, { immediate: !0 });
    const r = v(""), U = v(0), x = v(0), C = J(() => u.value === "images" ? U.value : x.value), _ = v(null), A = v(null);
    function l() {
      u.value === "images" ? _.value?.open() : A.value?.open();
    }
    return (a, n) => (t(), o("div", ut, [
      $(me, {
        title: "Autocode",
        subtitle: "Manage agent images, workspaces and Docker.",
        count: u.value && u.value !== "docker" ? `${C.value} ${C.value === 1 ? u.value.slice(0, -1) : u.value}` : void 0,
        action: u.value === "images" ? "Add image" : u.value === "workspaces" ? "Add workspace" : void 0,
        query: r.value,
        "onUpdate:query": n[0] || (n[0] = (h) => r.value = h),
        placeholder: u.value === "docker" ? void 0 : "Search resources…",
        onCreate: l
      }, null, 8, ["count", "action", "query", "placeholder"]),
      e("div", ct, [
        e("nav", dt, [
          (t(!0), o(j, null, M(s.value, (h) => (t(), o("button", {
            key: h.id,
            type: "button",
            class: z(["ac-tab kx-focus-outline", { active: u.value === h.id }]),
            "aria-pressed": u.value === h.id,
            onClick: (N) => {
              u.value !== h.id && (u.value = h.id, r.value = "");
            }
          }, [
            $(m(L), {
              icon: h.icon
            }, null, 8, ["icon"]),
            V(" " + b(h.label), 1)
          ], 10, vt))), 128))
        ])
      ]),
      m(w) && !m(g) ? (t(), o("p", pt, [
        V(b(m(w)) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: n[1] || (n[1] = //@ts-ignore
          (...h) => m(I) && m(I)(...h))
        }, "Retry")
      ])) : m(g) ? (t(), o("main", kt, [
        u.value === "images" ? (t(), H(Ca, {
          key: 0,
          ref_key: "images",
          ref: _,
          query: r.value,
          onCount: n[2] || (n[2] = (h) => U.value = h)
        }, null, 8, ["query"])) : k("", !0),
        m(g).can_workspaces ? P((t(), H(at, {
          key: 1,
          ref_key: "workspaces",
          ref: A,
          query: r.value,
          onCount: n[3] || (n[3] = (h) => x.value = h)
        }, null, 8, ["query"])), [
          [_e, u.value === "workspaces"]
        ]) : k("", !0),
        u.value === "docker" ? (t(), H(rt, { key: 2 })) : k("", !0),
        u.value ? k("", !0) : (t(), o("p", ft, "No management areas are available."))
      ])) : (t(), o("div", mt, [
        $(m(L), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        n[4] || (n[4] = V(" Loading…", -1))
      ]))
    ]));
  }
}), gt = { type: "object", properties: {} };
class yt extends be {
  static get wippyConfig() {
    return { propsSchema: gt, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"], inlineCss: ke };
  }
  static get vueConfig() {
    return { rootComponent: bt, plugins: [fe] };
  }
}
xe(import.meta.url, yt);
