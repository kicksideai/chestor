import { a as le, P as pe } from "./wc-runtime-6vw183jT.js";
import { defineComponent as K, ref as v, watch as O, openBlock as t, createElementBlock as o, Fragment as j, createElementVNode as e, createVNode as D, unref as p, createCommentVNode as m, toDisplayString as f, createTextVNode as I, withDirectives as P, vModelText as T, normalizeClass as z, createStaticVNode as me, renderList as M, vModelCheckbox as ke, computed as J, onUnmounted as fe, createBlock as H, withCtx as Y, vShow as be } from "vue";
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
  setup(V) {
    const B = V, u = v(!1), g = v(null), x = v("");
    function N() {
      u.value = !1;
    }
    return O(g, async (s) => {
      if (s) {
        x.value = "";
        try {
          if (customElements.get("kickside-share") || await he("kickside-share", { timeoutMs: 8e3 }), g.value !== s) return;
          const r = document.createElement("kickside-share");
          r.setAttribute("config", JSON.stringify({
            resource_id: B.id,
            title: B.title,
            access_url: `/api/v1/component-access/grants/${encodeURIComponent(B.id)}`,
            share_url: `/api/v1/component-access/share/${encodeURIComponent(B.id)}`
          })), r.style.display = "block", r.addEventListener("close", N), s.appendChild(r);
        } catch (r) {
          x.value = q(r, "Could not open sharing.");
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
        D(p(L), { icon: "tabler:share" })
      ]),
      u.value ? (t(), o("div", {
        key: 0,
        ref_key: "shareHost",
        ref: g
      }, null, 512)) : m("", !0),
      x.value ? (t(), o("span", $e, f(x.value), 1)) : m("", !0)
    ], 64));
  }
}), Ce = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, De = ["disabled"], Ue = { class: "ac-card-head" }, Ae = { class: "ac-muted" }, Le = { class: "ac-field" }, Ie = { class: "ac-seg" }, Ve = {
  key: 0,
  class: "ac-field"
}, Ne = {
  key: 1,
  class: "ac-muted"
}, Se = { class: "ac-field" }, Be = { class: "ac-field" }, Pe = { class: "ac-row-fields" }, Te = { class: "ac-field" }, qe = ["placeholder"], Ee = { class: "ac-field" }, Re = ["placeholder"], je = { class: "ac-field" }, Me = { class: "ac-row-fields" }, Oe = { class: "ac-field" }, He = { class: "ac-field" }, Ge = ["placeholder"], Ke = {
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
  setup(V, { emit: B }) {
    const u = V, g = B, x = ee();
    function N(l = x.value.default_image.settings) {
      return l ? {
        ref: "",
        mode: "pull",
        dockerfile: "",
        label: "",
        home: x.value.default_image.home,
        ...l,
        extra_args: [...l.extra_args],
        allows: [...l.allows],
        extra: ""
      } : null;
    }
    const s = v(N()), r = v(!1);
    O(() => s.value?.ref, (l) => {
      s.value && !u.edit && !r.value && l !== void 0 && (s.value.label = l);
    });
    const U = v(!1), $ = v("");
    O(() => u.edit, (l) => {
      if ($.value = "", r.value = !!l, !l) {
        s.value = N();
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
      const l = x.value.default_image;
      r.value = !0;
      const a = N();
      s.value = a ? { ...a, ref: l.ref, label: l.label, home: l.home, mode: "build", dockerfile: l.dockerfile } : null;
    }
    function w() {
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
        $.value = "", U.value = !0, g("busy", !0);
        try {
          let l;
          if (u.edit) {
            const a = await E.updateImage(u.edit.image.id, { ...w(), ref: s.value.ref, dockerfile: s.value.mode === "build" ? s.value.dockerfile : "" });
            a.build_error && (l = `Settings saved. Build preparation has not started: ${a.build_error.message}. Use Prepare image to retry.`);
          } else {
            const a = s.value, n = await E.createImage({ ...w(), ref: a.ref, dockerfile: a.mode === "build" ? a.dockerfile : "" });
            n.build_error && (l = `Image created. Build preparation has not started: ${n.build_error.message}. Use Prepare image to retry.`), s.value = N();
          }
          g("saved", l);
        } catch (l) {
          $.value = q(l, "Could not save the image.");
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
      e("div", Ue, [
        e("span", Ae, f(V.edit ? "Container settings" : "Use an image reference or the default agent recipe."), 1),
        V.edit ? m("", !0) : (t(), o("button", {
          key: 0,
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: C
        }, [
          D(p(L), { icon: "tabler:sparkles" }),
          a[15] || (a[15] = I(" Default agent image", -1))
        ]))
      ]),
      e("label", Le, [
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
      ])) : m("", !0),
      V.edit ? (t(), o("p", Ne, "Saving container settings prepares the image automatically.")) : m("", !0),
      e("label", Se, [
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
            placeholder: p(x).default_image.settings?.memory
          }, null, 8, qe), [
            [T, s.value.memory]
          ])
        ]),
        e("label", Ee, [
          a[22] || (a[22] = e("span", null, "CPUs", -1)),
          P(e("input", {
            "onUpdate:modelValue": a[8] || (a[8] = (n) => s.value.cpus = n),
            class: "ac-mono kx-focus-halo",
            placeholder: p(x).default_image.settings?.cpus
          }, null, 8, Re), [
            [T, s.value.cpus]
          ])
        ]),
        e("label", je, [
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
            placeholder: p(x).default_image.settings?.network
          }, null, 8, Ge), [
            [T, s.value.network]
          ])
        ])
      ]),
      V.capabilities?.length ? (t(), o("div", Ke, [
        a[26] || (a[26] = e("span", null, "Agents may", -1)),
        e("div", We, [
          (t(!0), o(j, null, M(V.capabilities, (n) => (t(), o("label", {
            key: n,
            class: "ac-check ac-mono"
          }, [
            P(e("input", {
              "onUpdate:modelValue": a[12] || (a[12] = (_) => s.value.allows = _),
              type: "checkbox",
              class: "kx-focus-outline",
              value: n
            }, null, 8, Fe), [
              [ke, s.value.allows]
            ]),
            I(" " + f(n), 1)
          ]))), 128))
        ])
      ])) : m("", !0),
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
          disabled: U.value || !V.capabilities || !s.value.ref,
          onClick: A
        }, [
          D(p(L), { icon: "tabler:box" }),
          I(" " + f(U.value ? "Saving…" : V.edit ? "Save settings" : s.value.mode === "build" ? "Build image" : "Add image"), 1)
        ], 8, Qe)
      ]),
      $.value ? (t(), o("p", Xe, f($.value), 1)) : m("", !0)
    ], 8, De)) : (t(), o("p", Ce, f(V.edit ? "Image settings are unavailable." : "Image defaults are unavailable.") + " Ask an administrator to update the image configuration.", 1));
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
  setup(V, { expose: B, emit: u }) {
    const g = ee(), x = V, N = u, s = v(!1), r = v(!1), U = v({});
    B({ open: ae });
    const $ = v([]), C = v([]), w = v(""), A = v(null), l = v(null), a = J(() => [...new Set(g.value.agents.flatMap((d) => d.capabilities))].sort()), n = v(!1);
    let _ = !0, y = 0, R = 0, W = 0;
    fe(() => {
      _ = !1, y++, R++;
    });
    async function Q(d) {
      const b = y, i = await E.image(d);
      !_ || b !== y || l.value?.id !== d || (l.value = { id: d, ref: i.image.ref, text: i.build_log || "(empty)" });
    }
    const h = ne(async () => {
      try {
        const d = await ie(E.images, (b) => b.map((i) => i.id), C, () => _, (b) => {
          $.value = b, n.value = !0, w.value = "";
        }, () => {
          h();
        });
        if (!_) return;
        $.value = d, c(d, ++W), l.value && d.some((b) => b.id === l.value?.id) && await Q(l.value.id), n.value = !0, w.value = "";
      } catch (d) {
        w.value = q(d, "Could not load images.");
      }
    });
    async function c(d, b) {
      try {
        const i = await we([...new Set(d.map((S) => S.owner_user_id))]);
        if (!_ || b !== W) return;
        U.value = Object.fromEntries(d.map((S) => [S.id, `Owner: ${i[S.owner_user_id] || S.owner_user_id}`]));
      } catch (i) {
        _ && b === W && (w.value = q(i, "Could not load image owners."));
      }
    }
    oe(() => C.value, () => {
      h();
    }), le(h);
    async function k(d, b) {
      w.value = "";
      try {
        await d(), await h();
      } catch (i) {
        w.value = q(i, b);
      }
    }
    async function G(d) {
      const b = ++R;
      w.value = "";
      try {
        const i = await E.image(d.id);
        _ && b === R && (A.value = i);
      } catch (i) {
        _ && b === R && (w.value = q(i, "Could not load the image settings."));
      }
    }
    function F() {
      R++, s.value = !1, A.value = null;
    }
    function ae() {
      F(), s.value = !0;
    }
    const ue = (d) => k(() => E.prepareImage(d.id), "Could not start the image preparation.");
    function ce(d) {
      y++, l.value = { id: d.id, ref: d.ref, text: "Loading…" }, h();
    }
    function te() {
      y++, l.value = null;
    }
    async function de(d) {
      F(), await h(), d && (w.value = d);
    }
    async function ve(d) {
      if (!await X.confirm({
        header: "Delete image",
        message: `Delete image "${d.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) return;
      const i = await X.confirm({
        header: "Docker image",
        message: `Also remove ${d.ref} from Docker on the host? Keeping it lets a later image with the same reference reuse it.`,
        icon: "tabler:brand-docker",
        acceptLabel: "Remove from Docker",
        rejectLabel: "Keep in Docker",
        acceptClass: "p-button-danger"
      });
      R++, A.value?.image.id === d.id && F(), l.value?.id === d.id && te(), w.value = "";
      try {
        await E.deleteImage(d.id, i), await h();
      } catch (S) {
        w.value = q(S, "Could not delete the image.");
      }
    }
    const se = J(() => $.value.filter((d) => [d.label, d.ref, ...d.agents].join(" ").toLowerCase().includes(x.query.toLowerCase())));
    return O($, (d) => N("count", d.length)), (d, b) => (t(), o("div", Ze, [
      b[7] || (b[7] = e("p", { class: "ac-hint" }, "Share ready images to make them available for tasks.", -1)),
      w.value ? (t(), o("p", ea, [
        I(f(w.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: b[0] || (b[0] = //@ts-ignore
          (...i) => p(h) && p(h)(...i))
        }, "Retry")
      ])) : m("", !0),
      !n.value && !w.value ? (t(), o("div", aa, "Loading images…")) : m("", !0),
      n.value && !$.value.length ? (t(), o("div", ta, [
        e("div", sa, [
          D(p(L), { icon: "tabler:box" })
        ]),
        b[4] || (b[4] = e("div", { class: "kx-empty-title" }, "No images yet", -1)),
        b[5] || (b[5] = e("div", { class: "kx-empty-sub" }, "Start with the default agent recipe or use an existing image.", -1)),
        e("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: ae
        }, "Add image")
      ])) : n.value && !se.value.length ? (t(), o("div", la, [...b[6] || (b[6] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another image, reference or agent.", -1)
      ])])) : m("", !0),
      e("ul", oa, [
        (t(!0), o(j, null, M(se.value, (i) => (t(), o("li", {
          key: i.id,
          class: "ac-row ac-resource"
        }, [
          e("span", na, [
            D(p(L), { icon: "tabler:box" })
          ]),
          e("div", ia, [
            e("div", ra, [
              I(f(i.label), 1),
              e("span", {
                class: z(["kx-tag-sm ac-tone", i.status])
              }, f(i.status === "unprepared" ? "Needs preparation" : i.status.charAt(0).toUpperCase() + i.status.slice(1)), 3),
              i.usable ? (t(), o("span", ua, "Usable")) : m("", !0)
            ]),
            e("div", ca, f(i.ref) + " · " + f(i.home), 1),
            e("div", da, [
              (t(!0), o(j, null, M(i.agents, (S) => (t(), o("span", {
                key: S,
                class: "kx-tag-sm ac-tone"
              }, [
                D(p(L), {
                  icon: p(_e)(S, p(g).agents)
                }, null, 8, ["icon"]),
                I(f(S), 1)
              ]))), 128))
            ]),
            e("div", va, f(U.value[i.id]), 1),
            i.last_error ? (t(), o("div", pa, f(i.last_error), 1)) : m("", !0)
          ]),
          e("div", ma, [
            i.shareable ? (t(), H(re, {
              key: 0,
              id: i.id,
              title: i.label
            }, null, 8, ["id", "title"])) : m("", !0),
            i.writable ? (t(), o("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Prepare image",
              "aria-label": "Prepare image",
              disabled: i.status === "preparing",
              onClick: (S) => ue(i)
            }, [
              D(p(L), { icon: "tabler:refresh" })
            ], 8, ka)) : m("", !0),
            e("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Build log",
              "aria-label": "Build log",
              onClick: (S) => ce(i)
            }, [
              D(p(L), { icon: "tabler:file-text" })
            ], 8, fa),
            i.writable ? (t(), o("button", {
              key: 2,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Edit settings",
              "aria-label": "Edit settings",
              onClick: (S) => G(i)
            }, [
              D(p(L), { icon: "tabler:pencil" })
            ], 8, ba)) : m("", !0),
            i.deletable ? (t(), o("button", {
              key: 3,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete image",
              "aria-label": "Delete image",
              onClick: (S) => ve(i)
            }, [
              D(p(L), { icon: "tabler:trash" })
            ], 8, ga)) : m("", !0)
          ])
        ]))), 128))
      ]),
      s.value || A.value ? (t(), H(Z, {
        key: 4,
        title: A.value ? "Edit image" : "Add image",
        busy: r.value,
        wide: "",
        onClose: b[3] || (b[3] = (i) => F())
      }, {
        default: Y(() => [
          D(Ye, {
            onBusy: b[1] || (b[1] = (i) => r.value = i),
            edit: A.value,
            capabilities: a.value,
            onSaved: de,
            onCancel: b[2] || (b[2] = (i) => F())
          }, null, 8, ["edit", "capabilities"])
        ]),
        _: 1
      }, 8, ["title", "busy"])) : m("", !0),
      l.value ? (t(), H(Z, {
        key: 5,
        title: "Build log",
        wide: "",
        onClose: te
      }, {
        default: Y(() => [
          e("div", ya, [
            e("strong", ha, f(l.value.ref), 1),
            e("pre", _a, f(l.value.text), 1)
          ])
        ]),
        _: 1
      })) : m("", !0)
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
}, Aa = { class: "kx-empty-ico" }, La = {
  key: 4,
  class: "kx-empty"
}, Ia = { class: "ac-list ac-resource-list" }, Va = { class: "ac-resource-icon" }, Na = { class: "ac-account-main" }, Sa = { class: "ac-row-title" }, Ba = { class: "kx-tag-sm ac-tone" }, Pa = {
  key: 0,
  class: "ac-muted"
}, Ta = { class: "ac-mono" }, qa = {
  key: 1,
  class: "ac-muted ac-mono"
}, Ea = { class: "ac-row-actions" }, Ra = ["onClick"], ja = ["disabled"], Ma = {
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
  emits: ["count", "registration-needed"],
  setup(V, { expose: B, emit: u }) {
    const g = xe(), x = v([]), N = V, s = u, r = v(!1);
    B({ open: () => {
      r.value = !0;
    } });
    const U = v([]), $ = v([]), C = v(""), w = v(!1), A = v(""), l = v(!1), a = v(""), n = v(!1);
    function _(h) {
      return h.replace(/\/+$/, "") + "/";
    }
    O([r, $], () => {
      r.value && !a.value && $.value.length && (a.value = _($.value[0]));
    }), O(a, (h) => {
      l.value || (A.value = h.trim().split("/").filter(Boolean).pop() ?? "");
    });
    const y = ne(async () => {
      try {
        await ie(E.workspaces, (h) => h.workspaces.map((c) => c.id), x, g, (h) => {
          U.value = h.workspaces, $.value = h.roots ?? [], n.value = !0, C.value = "";
        }, () => {
          y();
        });
      } catch (h) {
        g() && (C.value = q(h, "Could not load workspaces."));
      }
    }, g);
    oe(() => x.value, () => {
      y();
    }), le(y);
    async function R() {
      C.value = "", w.value = !0;
      try {
        if (await E.createWorkspace({ name: A.value, host_path: a.value }), !g()) return;
        l.value = !1, A.value = "", a.value = "", r.value = !1, await y();
      } catch (h) {
        g() && (C.value = q(h, "Could not save the workspace."));
      } finally {
        g() && (w.value = !1);
      }
    }
    async function W(h) {
      const c = await X.confirm({
        header: "Delete workspace",
        message: `Delete workspace "${h.name}"? The host directory stays untouched.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      });
      if (!(!g() || !c)) {
        C.value = "";
        try {
          await E.deleteWorkspace(h.id), await y();
        } catch (k) {
          g() && (C.value = q(k, "Could not delete the workspace."));
        }
      }
    }
    const Q = J(() => U.value.filter((h) => [h.name, h.host_path].join(" ").toLowerCase().includes(N.query.toLowerCase())));
    return O(U, (h) => {
      s("count", h.length), s("registration-needed", h.filter((c) => c.unavailable_reason).length);
    }), (h, c) => (t(), o("div", xa, [
      c[15] || (c[15] = e("p", { class: "ac-hint" }, "Tasks use shared workspaces with the access you grant.", -1)),
      C.value && !r.value ? (t(), o("p", $a, [
        I(f(C.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: c[0] || (c[0] = //@ts-ignore
          (...k) => p(y) && p(y)(...k))
        }, "Retry")
      ])) : m("", !0),
      !n.value && !C.value ? (t(), o("div", Ca, "Loading workspaces…")) : m("", !0),
      $.value.length ? (t(), o("div", Da, [
        c[7] || (c[7] = e("span", { class: "ac-muted" }, "Allowed roots", -1)),
        (t(!0), o(j, null, M($.value, (k) => (t(), o("span", {
          key: k,
          class: "ac-hint-chip ac-mono"
        }, f(k), 1))), 128))
      ])) : m("", !0),
      n.value && !U.value.length ? (t(), o("div", Ua, [
        e("div", Aa, [
          D(p(L), { icon: "tabler:folder" })
        ]),
        c[8] || (c[8] = e("div", { class: "kx-empty-title" }, "No workspaces yet", -1)),
        c[9] || (c[9] = e("div", { class: "kx-empty-sub" }, "Add a host directory, or let tasks use a scratch directory.", -1)),
        e("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: c[1] || (c[1] = (k) => r.value = !0)
        }, "Add workspace")
      ])) : n.value && !Q.value.length ? (t(), o("div", La, [...c[10] || (c[10] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another workspace name or path.", -1)
      ])])) : m("", !0),
      e("ul", Ia, [
        (t(!0), o(j, null, M(Q.value, (k) => (t(), o("li", {
          key: k.id,
          class: "ac-row ac-resource"
        }, [
          e("span", Va, [
            D(p(L), { icon: "tabler:folder" })
          ]),
          e("div", Na, [
            e("div", Sa, [
              I(f(k.name), 1),
              e("span", Ba, f(k.writable ? "read-write" : "read-only"), 1)
            ]),
            k.unavailable_reason ? (t(), o("div", Pa, f(k.unavailable_reason), 1)) : m("", !0),
            (t(!0), o(j, null, M(k.conflicts, (G) => (t(), o("div", {
              key: G.id,
              class: "ac-muted"
            }, [
              I("Conflicts with " + f(G.id) + ": ", 1),
              e("span", Ta, f(G.host_path), 1)
            ]))), 128)),
            k.host_path ? (t(), o("div", qa, f(k.host_path), 1)) : m("", !0)
          ]),
          e("div", Ea, [
            k.shareable ? (t(), H(re, {
              key: 0,
              id: k.id,
              title: k.name
            }, null, 8, ["id", "title"])) : m("", !0),
            k.deletable ? (t(), o("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete workspace",
              "aria-label": "Delete workspace",
              onClick: (G) => W(k)
            }, [
              D(p(L), { icon: "tabler:trash" })
            ], 8, Ra)) : m("", !0)
          ])
        ]))), 128))
      ]),
      r.value ? (t(), H(Z, {
        key: 5,
        title: "Add workspace",
        busy: w.value,
        onClose: c[6] || (c[6] = (k) => r.value = !1)
      }, {
        default: Y(() => [
          e("fieldset", {
            class: "ac-form",
            disabled: w.value
          }, [
            $.value.length ? (t(), o("div", Oa, [
              c[11] || (c[11] = e("span", null, "Allowed roots", -1)),
              e("div", Ha, [
                (t(!0), o(j, null, M($.value, (k) => (t(), o("button", {
                  key: k,
                  type: "button",
                  class: "ac-chip ac-mono kx-focus-halo",
                  title: "Start from this root",
                  onClick: (G) => a.value = _(k)
                }, f(k), 9, Ga))), 128))
              ])
            ])) : (t(), o("p", Ma, "The host administrator configures allowed workspace roots.")),
            e("label", Ka, [
              c[12] || (c[12] = e("span", null, "Name", -1)),
              P(e("input", {
                "onUpdate:modelValue": c[2] || (c[2] = (k) => A.value = k),
                onInput: c[3] || (c[3] = (k) => l.value = !0),
                autofocus: "",
                class: "kx-focus-halo",
                placeholder: "e.g. Kickside checkout"
              }, null, 544), [
                [T, A.value]
              ])
            ]),
            e("label", Wa, [
              c[13] || (c[13] = e("span", null, "Host directory", -1)),
              P(e("input", {
                "onUpdate:modelValue": c[4] || (c[4] = (k) => a.value = k),
                class: "ac-mono kx-focus-halo",
                placeholder: ($.value[0] ?? "/srv/work") + "/project"
              }, null, 8, Fa), [
                [T, a.value]
              ]),
              c[14] || (c[14] = e("small", { class: "ac-hint" }, [
                I("An existing directory, mounted at "),
                e("code", null, "/workspace"),
                I(".")
              ], -1))
            ]),
            C.value ? (t(), o("p", za, f(C.value), 1)) : m("", !0),
            e("footer", Ja, [
              e("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                disabled: w.value,
                onClick: c[5] || (c[5] = (k) => r.value = !1)
              }, "Cancel", 8, Qa),
              e("button", {
                type: "button",
                class: "ac-btn primary kx-focus-halo",
                disabled: w.value || !A.value.trim() || !a.value.trim(),
                onClick: R
              }, [
                D(p(L), { icon: "tabler:folder-plus" }),
                I(f(w.value ? "Saving…" : "Add workspace"), 1)
              ], 8, Xa)
            ])
          ], 8, ja)
        ]),
        _: 1
      }, 8, ["busy"])) : m("", !0)
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
  setup(V) {
    const B = ee(), u = v(!1), g = v(""), x = v("");
    async function N() {
      if (await X.confirm({
        header: "Clean up Docker",
        message: `Prune stopped Autocode containers, unused images and build cache older than ${B.value.build_cache_retention} across this Docker host? Other modules may use the shared image cache.`,
        icon: "tabler:trash-x",
        acceptLabel: "Clean up",
        rejectLabel: "Cancel"
      })) {
        x.value = "", u.value = !0;
        try {
          g.value = await E.prune();
        } catch (r) {
          x.value = q(r, "Cleanup failed.");
        } finally {
          u.value = !1;
        }
      }
    }
    return (s, r) => (t(), o("section", Za, [
      e("div", et, [
        e("h2", at, [
          D(p(L), { icon: "tabler:brand-docker" }),
          r[0] || (r[0] = I("Docker cleanup", -1))
        ]),
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          disabled: u.value,
          onClick: N
        }, [
          D(p(L), {
            icon: u.value ? "tabler:loader-2" : "tabler:trash-x",
            class: z({ spin: u.value })
          }, null, 8, ["icon", "class"]),
          I(" " + f(u.value ? "Cleaning…" : "Clean up Docker"), 1)
        ], 8, tt)
      ]),
      r[1] || (r[1] = e("p", { class: "ac-hint" }, "Prune stopped Autocode containers, dangling images and build cache across the Docker host. Tagged images stay.", -1)),
      x.value ? (t(), o("p", st, f(x.value), 1)) : m("", !0),
      g.value ? (t(), o("pre", lt, f(g.value), 1)) : m("", !0)
    ]));
  }
}), nt = { class: "ac" }, it = { class: "ac-bar" }, rt = {
  class: "ac-tabs",
  "aria-label": "Autocode management"
}, ut = ["aria-pressed", "onClick"], ct = {
  key: 0,
  class: "ac-hint",
  role: "status"
}, dt = {
  key: 1,
  class: "kx-err"
}, vt = {
  key: 2,
  class: "kx-loading"
}, pt = {
  key: 3,
  class: "ac-body"
}, mt = {
  key: 3,
  class: "ac-muted"
}, kt = /* @__PURE__ */ K({
  __name: "admin",
  setup(V) {
    const B = [
      { id: "images", label: "Images", icon: "tabler:box" },
      { id: "workspaces", label: "Workspaces", icon: "tabler:folder" },
      { id: "docker", label: "Docker", icon: "tabler:brand-docker" }
    ], u = v(), { catalog: g, error: x, load: N } = ge(), s = J(() => B.filter((n) => n.id === "images" ? g.value?.can_images : n.id === "workspaces" ? g.value?.can_workspaces : g.value?.can_prune));
    O(s, (n) => {
      n.some((_) => _.id === u.value) || (u.value = n[0]?.id);
    }, { immediate: !0 });
    const r = v(""), U = v(0), $ = v(0), C = v(0), w = J(() => u.value === "images" ? U.value : $.value), A = v(null), l = v(null);
    function a() {
      u.value === "images" ? A.value?.open() : l.value?.open();
    }
    return (n, _) => (t(), o("div", nt, [
      D(ye, {
        title: "Autocode",
        subtitle: "Manage agent images, workspaces and Docker.",
        count: u.value && u.value !== "docker" ? `${w.value} ${w.value === 1 ? u.value.slice(0, -1) : u.value}` : void 0,
        action: u.value === "images" ? "Add image" : u.value === "workspaces" ? "Add workspace" : void 0,
        query: r.value,
        "onUpdate:query": _[0] || (_[0] = (y) => r.value = y),
        placeholder: u.value === "docker" ? void 0 : "Search resources…",
        onCreate: a
      }, null, 8, ["count", "action", "query", "placeholder"]),
      e("div", it, [
        e("nav", rt, [
          (t(!0), o(j, null, M(s.value, (y) => (t(), o("button", {
            key: y.id,
            type: "button",
            class: z(["ac-tab kx-focus-outline", { active: u.value === y.id }]),
            "aria-pressed": u.value === y.id,
            onClick: (R) => {
              u.value !== y.id && (u.value = y.id, r.value = "");
            }
          }, [
            D(p(L), {
              icon: y.icon
            }, null, 8, ["icon"]),
            I(" " + f(y.label), 1)
          ], 10, ut))), 128))
        ])
      ]),
      p(g)?.can_workspaces && C.value ? (t(), o("p", ct, [
        I(f(C.value) + " " + f(C.value === 1 ? "workspace needs" : "workspaces need") + " re-registration. Review the refusal reason, settle any active runs, then delete the old workspace and add it through Autocode. Update saved references to the new workspace. ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: _[1] || (_[1] = (y) => {
            u.value = "workspaces", r.value = "";
          })
        }, "Review workspaces")
      ])) : m("", !0),
      p(x) && !p(g) ? (t(), o("p", dt, [
        I(f(p(x)) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: _[2] || (_[2] = //@ts-ignore
          (...y) => p(N) && p(N)(...y))
        }, "Retry")
      ])) : p(g) ? (t(), o("main", pt, [
        u.value === "images" ? (t(), H(wa, {
          key: 0,
          ref_key: "images",
          ref: A,
          query: r.value,
          onCount: _[3] || (_[3] = (y) => U.value = y)
        }, null, 8, ["query"])) : m("", !0),
        p(g).can_workspaces ? P((t(), H(Ya, {
          key: 1,
          ref_key: "workspaces",
          ref: l,
          query: r.value,
          onCount: _[4] || (_[4] = (y) => $.value = y),
          onRegistrationNeeded: _[5] || (_[5] = (y) => C.value = y)
        }, null, 8, ["query"])), [
          [be, u.value === "workspaces"]
        ]) : m("", !0),
        u.value === "docker" ? (t(), H(ot, { key: 2 })) : m("", !0),
        u.value ? m("", !0) : (t(), o("p", mt, "No management areas are available."))
      ])) : (t(), o("div", vt, [
        D(p(L), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        _[6] || (_[6] = I(" Loading…", -1))
      ]))
    ]));
  }
}), wt = {
  rootComponent: kt,
  plugins: [pe]
};
export {
  wt as mountConfig
};
