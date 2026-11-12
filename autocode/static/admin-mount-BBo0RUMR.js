import { u as ee, _ as Y, a as pe, b as me, P as ke } from "./app-dialog.vue_vue_type_script_setup_true_lang-DkqLDGJK.js";
import { defineComponent as G, ref as v, watch as R, openBlock as l, createElementBlock as o, Fragment as M, createElementVNode as a, createVNode as C, unref as m, createCommentVNode as b, toDisplayString as g, createTextVNode as I, withDirectives as B, vModelText as P, normalizeClass as z, createStaticVNode as fe, renderList as H, vModelCheckbox as be, computed as J, onUnmounted as ge, createBlock as O, withCtx as Z } from "vue";
import { Icon as L } from "@iconify/vue";
import { loadByTagName as ye, host as Q } from "@wippy-fe/proxy";
import { a as se } from "./wc-runtime-ClNbKZcC.js";
import { e as T, a as q, u as oe, b as he, s as ne, r as ie, p as _e, c as xe } from "./presentation-CaNB3T5F.js";
const we = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, re = /* @__PURE__ */ G({
  __name: "share-control",
  props: {
    id: {},
    title: {}
  },
  setup(A) {
    const S = A, d = v(!1), k = v(null), _ = v("");
    function V() {
      d.value = !1;
    }
    return R(k, async (s) => {
      if (s) {
        _.value = "";
        try {
          if (customElements.get("kickside-share") || await ye("kickside-share", { timeoutMs: 8e3 }), k.value !== s) return;
          const r = document.createElement("kickside-share");
          r.setAttribute("config", JSON.stringify({
            resource_id: S.id,
            title: S.title,
            access_url: `/api/v1/component-access/grants/${encodeURIComponent(S.id)}`,
            share_url: `/api/v1/component-access/share/${encodeURIComponent(S.id)}`
          })), r.style.display = "block", r.addEventListener("close", V), s.appendChild(r);
        } catch (r) {
          _.value = T(r, "Could not open sharing.");
        }
      }
    }), (s, r) => (l(), o(M, null, [
      a("button", {
        type: "button",
        class: "ac-icon-btn kx-focus-outline",
        title: "Share",
        "aria-label": "Share",
        onClick: r[0] || (r[0] = ($) => d.value = !0)
      }, [
        C(m(L), { icon: "tabler:share" })
      ]),
      d.value ? (l(), o("div", {
        key: 0,
        ref_key: "shareHost",
        ref: k
      }, null, 512)) : b("", !0),
      _.value ? (l(), o("span", we, g(_.value), 1)) : b("", !0)
    ], 64));
  }
}), $e = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ce = ["disabled"], De = { class: "ac-card-head" }, Ue = { class: "ac-muted" }, Le = { class: "ac-field" }, Ae = { class: "ac-seg" }, Ie = {
  key: 0,
  class: "ac-field"
}, Ve = {
  key: 1,
  class: "ac-muted"
}, Se = { class: "ac-field" }, Ne = { class: "ac-field" }, Be = { class: "ac-row-fields" }, Ee = { class: "ac-field" }, Pe = ["placeholder"], Te = { class: "ac-field" }, qe = ["placeholder"], je = { class: "ac-field" }, Re = { class: "ac-row-fields" }, Me = { class: "ac-field" }, Oe = { class: "ac-field" }, He = ["placeholder"], Ge = {
  key: 2,
  class: "ac-field"
}, Ke = { class: "ac-checks" }, We = ["value"], ze = { class: "ac-field" }, Fe = { class: "ac-dialog-foot" }, Je = ["disabled"], Qe = {
  key: 3,
  class: "kx-err"
}, Xe = /* @__PURE__ */ G({
  __name: "image-form",
  props: {
    edit: {},
    capabilities: {}
  },
  emits: ["saved", "cancel", "busy"],
  setup(A, { emit: S }) {
    const d = A, k = S, _ = ee();
    function V(t = _.value.default_image.settings) {
      return t ? {
        ref: "",
        mode: "pull",
        dockerfile: "",
        label: "",
        home: _.value.default_image.home,
        ...t,
        extra_args: [...t.extra_args],
        allows: [...t.allows],
        extra: ""
      } : null;
    }
    const s = v(V()), r = v(!1);
    R(() => s.value?.ref, (t) => {
      s.value && !d.edit && !r.value && t !== void 0 && (s.value.label = t);
    });
    const $ = v(!1), x = v("");
    R(() => d.edit, (t) => {
      if (x.value = "", r.value = !!t, !t) {
        s.value = V();
        return;
      }
      if (!t.settings) {
        s.value = null;
        return;
      }
      const e = t.settings;
      s.value = {
        ...e,
        ref: t.image.ref,
        label: t.image.label,
        home: t.image.home,
        mode: t.dockerfile ? "build" : "pull",
        dockerfile: t.dockerfile ?? "",
        extra: e.extra_args.join(`
`),
        allows: [...e.allows]
      };
    }, { immediate: !0 });
    function D() {
      const t = _.value.default_image;
      r.value = !0;
      const e = V();
      s.value = e ? { ...e, ref: t.ref, label: t.label, home: t.home, mode: "build", dockerfile: t.dockerfile } : null;
    }
    function h() {
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
`).map((e) => e.trim()).filter(Boolean),
        allows: [...t.allows]
      };
    }
    async function w() {
      if (!(!s.value || $.value)) {
        x.value = "", $.value = !0, k("busy", !0);
        try {
          let t;
          if (d.edit) {
            const e = await q.updateImage(d.edit.image.id, { ...h(), ref: s.value.ref, dockerfile: s.value.mode === "build" ? s.value.dockerfile : "" });
            e.build_error && (t = `Settings saved. Build preparation has not started: ${e.build_error.message}. Use Prepare image to retry.`);
          } else {
            const e = s.value, i = await q.createImage({ ...h(), ref: e.ref, dockerfile: e.mode === "build" ? e.dockerfile : "" });
            i.build_error && (t = `Image created. Build preparation has not started: ${i.build_error.message}. Use Prepare image to retry.`), s.value = V();
          }
          k("saved", t);
        } catch (t) {
          x.value = T(t, "Could not save the image.");
        } finally {
          $.value = !1, k("busy", !1);
        }
      }
    }
    return (t, e) => s.value ? (l(), o("fieldset", {
      key: 1,
      class: "ac-form",
      disabled: $.value
    }, [
      a("div", De, [
        a("span", Ue, g(A.edit ? "Container settings" : "Use an image reference or the default agent recipe."), 1),
        A.edit ? b("", !0) : (l(), o("button", {
          key: 0,
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: D
        }, [
          C(m(L), { icon: "tabler:sparkles" }),
          e[15] || (e[15] = I(" Default agent image", -1))
        ]))
      ]),
      a("label", Le, [
        e[16] || (e[16] = a("span", null, "Image reference", -1)),
        B(a("input", {
          "onUpdate:modelValue": e[0] || (e[0] = (i) => s.value.ref = i),
          class: "ac-mono kx-focus-halo",
          placeholder: "registry/name:tag"
        }, null, 512), [
          [P, s.value.ref]
        ])
      ]),
      a("div", Ae, [
        a("button", {
          type: "button",
          class: z(["kx-focus-outline", { active: s.value.mode === "pull" }]),
          onClick: e[1] || (e[1] = (i) => s.value.mode = "pull")
        }, "Use or pull existing", 2),
        a("button", {
          type: "button",
          class: z(["kx-focus-outline", { active: s.value.mode === "build" }]),
          onClick: e[2] || (e[2] = (i) => s.value.mode = "build")
        }, "Build from Dockerfile", 2)
      ]),
      s.value.mode === "build" ? (l(), o("label", Ie, [
        e[17] || (e[17] = a("span", null, "Dockerfile", -1)),
        B(a("textarea", {
          "onUpdate:modelValue": e[3] || (e[3] = (i) => s.value.dockerfile = i),
          rows: "9",
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [P, s.value.dockerfile]
        ]),
        e[18] || (e[18] = fe('<small class="ac-hint">Include <code>sh</code>, <code>git</code>, <code>mkdir</code>, <code>dirname</code>, a <code>timeout</code> that supports <code>-k</code>, and the agent CLIs. The image user needs writable home and work directories.</small>', 1))
      ])) : b("", !0),
      A.edit ? (l(), o("p", Ve, "Saving container settings prepares the image automatically.")) : b("", !0),
      a("label", Se, [
        e[19] || (e[19] = a("span", null, "Label", -1)),
        B(a("input", {
          "onUpdate:modelValue": e[4] || (e[4] = (i) => s.value.label = i),
          class: "kx-focus-halo",
          onInput: e[5] || (e[5] = (i) => r.value = !0)
        }, null, 544), [
          [P, s.value.label]
        ])
      ]),
      a("label", Ne, [
        e[20] || (e[20] = a("span", null, "Home directory in the image", -1)),
        B(a("input", {
          "onUpdate:modelValue": e[6] || (e[6] = (i) => s.value.home = i),
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [P, s.value.home]
        ])
      ]),
      a("div", Be, [
        a("label", Ee, [
          e[21] || (e[21] = a("span", null, "Memory", -1)),
          B(a("input", {
            "onUpdate:modelValue": e[7] || (e[7] = (i) => s.value.memory = i),
            class: "ac-mono kx-focus-halo",
            placeholder: m(_).default_image.settings?.memory
          }, null, 8, Pe), [
            [P, s.value.memory]
          ])
        ]),
        a("label", Te, [
          e[22] || (e[22] = a("span", null, "CPUs", -1)),
          B(a("input", {
            "onUpdate:modelValue": e[8] || (e[8] = (i) => s.value.cpus = i),
            class: "ac-mono kx-focus-halo",
            placeholder: m(_).default_image.settings?.cpus
          }, null, 8, qe), [
            [P, s.value.cpus]
          ])
        ]),
        a("label", je, [
          e[23] || (e[23] = a("span", null, "PIDs limit", -1)),
          B(a("input", {
            "onUpdate:modelValue": e[9] || (e[9] = (i) => s.value.pids_limit = i),
            type: "number",
            min: "0",
            class: "ac-mono kx-focus-halo"
          }, null, 512), [
            [
              P,
              s.value.pids_limit,
              void 0,
              { number: !0 }
            ]
          ])
        ])
      ]),
      a("div", Re, [
        a("label", Me, [
          e[24] || (e[24] = a("span", null, "GPUs", -1)),
          B(a("input", {
            "onUpdate:modelValue": e[10] || (e[10] = (i) => s.value.gpus = i),
            class: "ac-mono kx-focus-halo",
            placeholder: "all, or device=0"
          }, null, 512), [
            [P, s.value.gpus]
          ])
        ]),
        a("label", Oe, [
          e[25] || (e[25] = a("span", null, "Network", -1)),
          B(a("input", {
            "onUpdate:modelValue": e[11] || (e[11] = (i) => s.value.network = i),
            class: "ac-mono kx-focus-halo",
            placeholder: m(_).default_image.settings?.network
          }, null, 8, He), [
            [P, s.value.network]
          ])
        ])
      ]),
      A.capabilities?.length ? (l(), o("div", Ge, [
        e[26] || (e[26] = a("span", null, "Agents may", -1)),
        a("div", Ke, [
          (l(!0), o(M, null, H(A.capabilities, (i) => (l(), o("label", {
            key: i,
            class: "ac-check ac-mono"
          }, [
            B(a("input", {
              "onUpdate:modelValue": e[12] || (e[12] = (N) => s.value.allows = N),
              type: "checkbox",
              class: "kx-focus-outline",
              value: i
            }, null, 8, We), [
              [be, s.value.allows]
            ]),
            I(" " + g(i), 1)
          ]))), 128))
        ])
      ])) : b("", !0),
      a("label", ze, [
        e[27] || (e[27] = a("span", null, "Extra docker run arguments", -1)),
        B(a("textarea", {
          "onUpdate:modelValue": e[13] || (e[13] = (i) => s.value.extra = i),
          rows: "3",
          class: "ac-mono kx-focus-halo",
          placeholder: `One argument per line, e.g.
--device=/dev/dri
--shm-size=2g`
        }, null, 512), [
          [P, s.value.extra]
        ])
      ]),
      a("footer", Fe, [
        a("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: e[14] || (e[14] = (i) => k("cancel"))
        }, "Cancel"),
        a("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: $.value || !A.capabilities || !s.value.ref,
          onClick: w
        }, [
          C(m(L), { icon: "tabler:box" }),
          I(" " + g($.value ? "Saving…" : A.edit ? "Save settings" : s.value.mode === "build" ? "Build image" : "Add image"), 1)
        ], 8, Je)
      ]),
      x.value ? (l(), o("p", Qe, g(x.value), 1)) : b("", !0)
    ], 8, Ce)) : (l(), o("p", $e, g(A.edit ? "Image settings are unavailable." : "Image defaults are unavailable.") + " Ask an administrator to update the image configuration.", 1));
  }
}), Ye = { class: "ac-stack" }, Ze = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ea = {
  key: 1,
  class: "kx-loading"
}, aa = {
  key: 2,
  class: "kx-empty"
}, ta = { class: "kx-empty-ico" }, la = {
  key: 3,
  class: "kx-empty"
}, sa = { class: "ac-list ac-resource-list" }, oa = { class: "ac-resource-icon" }, na = { class: "ac-account-main" }, ia = { class: "ac-row-title" }, ra = {
  key: 0,
  class: "kx-tag-sm ac-tone ready"
}, ua = { class: "ac-muted ac-mono" }, ca = { class: "ac-chips" }, da = { class: "ac-muted" }, va = {
  key: 0,
  class: "kx-err ac-small"
}, pa = { class: "ac-row-actions" }, ma = ["disabled", "onClick"], ka = ["onClick"], fa = ["onClick"], ba = ["onClick"], ga = { class: "ac-form" }, ya = { class: "ac-mono" }, ha = { class: "ac-pre ac-build-log" }, _a = /* @__PURE__ */ G({
  __name: "images",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(A, { expose: S, emit: d }) {
    const k = ee(), _ = A, V = d, s = v(!1), r = v(!1), $ = v({});
    S({ open: ae });
    const x = v([]), D = v([]), h = v(""), w = v(null), t = v(null), e = J(() => [...new Set(k.value.agents.flatMap((u) => u.capabilities))].sort()), i = v(!1);
    let N = !0, E = 0, j = 0, K = 0;
    ge(() => {
      N = !1, E++, j++;
    });
    async function F(u) {
      const f = E, n = await q.image(u);
      !N || f !== E || t.value?.id !== u || (t.value = { id: u, ref: n.image.ref, text: n.build_log || "(empty)" });
    }
    const y = ne(async () => {
      try {
        const u = await ie(q.images, (f) => f.map((n) => n.id), D, () => N);
        if (!N) return;
        x.value = u, c(u, ++K), t.value && u.some((f) => f.id === t.value?.id) && await F(t.value.id), i.value = !0, h.value = "";
      } catch (u) {
        h.value = T(u, "Could not load images.");
      }
    });
    async function c(u, f) {
      try {
        const n = await _e([...new Set(u.map((U) => U.owner))]);
        if (!N || f !== K) return;
        $.value = Object.fromEntries(u.map((U) => [U.id, `Owner: ${n[U.owner] || U.owner}`]));
      } catch (n) {
        N && f === K && (h.value = T(n, "Could not load image owners."));
      }
    }
    oe(() => D.value, () => {
      y();
    }), se(y);
    async function p(u, f) {
      h.value = "";
      try {
        await u(), await y();
      } catch (n) {
        h.value = T(n, f);
      }
    }
    async function X(u) {
      const f = ++j;
      h.value = "";
      try {
        const n = await q.image(u.id);
        N && f === j && (w.value = n);
      } catch (n) {
        N && f === j && (h.value = T(n, "Could not load the image settings."));
      }
    }
    function W() {
      j++, s.value = !1, w.value = null;
    }
    function ae() {
      W(), s.value = !0;
    }
    const ue = (u) => p(() => q.prepareImage(u.id), "Could not start the image preparation.");
    function ce(u) {
      E++, t.value = { id: u.id, ref: u.ref, text: "Loading…" }, y();
    }
    function te() {
      E++, t.value = null;
    }
    async function de(u) {
      W(), await y(), u && (h.value = u);
    }
    async function ve(u) {
      if (!await Q.confirm({
        header: "Delete image",
        message: `Delete image "${u.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) return;
      const n = await Q.confirm({
        header: "Docker image",
        message: `Also remove ${u.ref} from Docker on the host? Keeping it lets a later image with the same reference reuse it.`,
        icon: "tabler:brand-docker",
        acceptLabel: "Remove from Docker",
        rejectLabel: "Keep in Docker",
        acceptClass: "p-button-danger"
      });
      j++, w.value?.image.id === u.id && W(), t.value?.id === u.id && te(), h.value = "";
      try {
        const U = await q.deleteImage(u.id, n);
        await y(), U.docker_error && (h.value = `Image deleted. Docker cleanup failed: ${U.docker_error.message}. Docker prune covers removal of unused images.`);
      } catch (U) {
        h.value = T(U, "Could not delete the image.");
      }
    }
    const le = J(() => x.value.filter((u) => [u.label, u.ref, ...u.agents].join(" ").toLowerCase().includes(_.query.toLowerCase())));
    return R(x, (u) => V("count", u.length)), (u, f) => (l(), o("div", Ye, [
      f[7] || (f[7] = a("p", { class: "ac-hint" }, "Share ready images to make them available for tasks.", -1)),
      h.value ? (l(), o("p", Ze, [
        I(g(h.value) + " ", 1),
        a("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: f[0] || (f[0] = //@ts-ignore
          (...n) => m(y) && m(y)(...n))
        }, "Retry")
      ])) : b("", !0),
      !i.value && !h.value ? (l(), o("div", ea, "Loading images…")) : b("", !0),
      i.value && !x.value.length ? (l(), o("div", aa, [
        a("div", ta, [
          C(m(L), { icon: "tabler:box" })
        ]),
        f[4] || (f[4] = a("div", { class: "kx-empty-title" }, "No images yet", -1)),
        f[5] || (f[5] = a("div", { class: "kx-empty-sub" }, "Start with the default agent recipe or use an existing image.", -1)),
        a("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: ae
        }, "Add image")
      ])) : i.value && !le.value.length ? (l(), o("div", la, [...f[6] || (f[6] = [
        a("div", { class: "kx-empty-title" }, "No matches", -1),
        a("div", { class: "kx-empty-sub" }, "Try another image, reference or agent.", -1)
      ])])) : b("", !0),
      a("ul", sa, [
        (l(!0), o(M, null, H(le.value, (n) => (l(), o("li", {
          key: n.id,
          class: "ac-row ac-resource"
        }, [
          a("span", oa, [
            C(m(L), { icon: "tabler:box" })
          ]),
          a("div", na, [
            a("div", ia, [
              I(g(n.label), 1),
              a("span", {
                class: z(["kx-tag-sm ac-tone", n.status])
              }, g(n.status === "unprepared" ? "Needs preparation" : n.status.charAt(0).toUpperCase() + n.status.slice(1)), 3),
              n.usable ? (l(), o("span", ra, "Usable")) : b("", !0)
            ]),
            a("div", ua, g(n.ref) + " · " + g(n.home), 1),
            a("div", ca, [
              (l(!0), o(M, null, H(n.agents, (U) => (l(), o("span", {
                key: U,
                class: "kx-tag-sm ac-tone"
              }, [
                C(m(L), {
                  icon: m(he)(U, m(k).agents)
                }, null, 8, ["icon"]),
                I(g(U), 1)
              ]))), 128))
            ]),
            a("div", da, g($.value[n.id]), 1),
            n.last_error ? (l(), o("div", va, g(n.last_error), 1)) : b("", !0)
          ]),
          a("div", pa, [
            n.shareable ? (l(), O(re, {
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
              onClick: (U) => ue(n)
            }, [
              C(m(L), { icon: "tabler:refresh" })
            ], 8, ma)) : b("", !0),
            a("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Build log",
              "aria-label": "Build log",
              onClick: (U) => ce(n)
            }, [
              C(m(L), { icon: "tabler:file-text" })
            ], 8, ka),
            n.writable ? (l(), o("button", {
              key: 2,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Edit settings",
              "aria-label": "Edit settings",
              onClick: (U) => X(n)
            }, [
              C(m(L), { icon: "tabler:pencil" })
            ], 8, fa)) : b("", !0),
            n.deletable ? (l(), o("button", {
              key: 3,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete image",
              "aria-label": "Delete image",
              onClick: (U) => ve(n)
            }, [
              C(m(L), { icon: "tabler:trash" })
            ], 8, ba)) : b("", !0)
          ])
        ]))), 128))
      ]),
      s.value || w.value ? (l(), O(Y, {
        key: 4,
        title: w.value ? "Edit image" : "Add image",
        busy: r.value,
        wide: "",
        onClose: f[3] || (f[3] = (n) => W())
      }, {
        default: Z(() => [
          C(Xe, {
            onBusy: f[1] || (f[1] = (n) => r.value = n),
            edit: w.value,
            capabilities: e.value,
            onSaved: de,
            onCancel: f[2] || (f[2] = (n) => W())
          }, null, 8, ["edit", "capabilities"])
        ]),
        _: 1
      }, 8, ["title", "busy"])) : b("", !0),
      t.value ? (l(), O(Y, {
        key: 5,
        title: "Build log",
        wide: "",
        onClose: te
      }, {
        default: Z(() => [
          a("div", ga, [
            a("strong", ya, g(t.value.ref), 1),
            a("pre", ha, g(t.value.text), 1)
          ])
        ]),
        _: 1
      })) : b("", !0)
    ]));
  }
}), xa = { class: "ac-stack" }, wa = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, $a = {
  key: 1,
  class: "kx-loading"
}, Ca = {
  key: 2,
  class: "ac-chips"
}, Da = {
  key: 3,
  class: "kx-empty"
}, Ua = { class: "kx-empty-ico" }, La = {
  key: 4,
  class: "kx-empty"
}, Aa = { class: "ac-list ac-resource-list" }, Ia = { class: "ac-resource-icon" }, Va = { class: "ac-account-main" }, Sa = { class: "ac-row-title" }, Na = { class: "kx-tag-sm ac-tone" }, Ba = {
  key: 0,
  class: "ac-muted ac-mono"
}, Ea = { class: "ac-row-actions" }, Pa = ["onClick"], Ta = ["disabled"], qa = {
  key: 0,
  class: "ac-muted"
}, ja = {
  key: 1,
  class: "ac-field"
}, Ra = { class: "ac-chips" }, Ma = ["onClick"], Oa = { class: "ac-field" }, Ha = { class: "ac-field" }, Ga = ["placeholder"], Ka = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Wa = { class: "ac-dialog-foot" }, za = ["disabled"], Fa = ["disabled"], Ja = /* @__PURE__ */ G({
  __name: "workspaces",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(A, { expose: S, emit: d }) {
    const k = xe(), _ = v([]), V = A, s = d, r = v(!1);
    S({ open: () => {
      r.value = !0;
    } });
    const $ = v([]), x = v([]), D = v(""), h = v(!1), w = v(""), t = v(!1), e = v(""), i = v(!1);
    function N(y) {
      return y.replace(/\/+$/, "") + "/";
    }
    R([r, x], () => {
      r.value && !e.value && x.value.length && (e.value = N(x.value[0]));
    }), R(e, (y) => {
      t.value || (w.value = y.trim().split("/").filter(Boolean).pop() ?? "");
    });
    const E = ne(async () => {
      try {
        const y = await ie(q.workspaces, (c) => c.workspaces.map((p) => p.id), _, k);
        if (!k()) return;
        $.value = y.workspaces, x.value = y.roots ?? [], i.value = !0, D.value = "";
      } catch (y) {
        k() && (D.value = T(y, "Could not load workspaces."));
      }
    }, k);
    oe(() => _.value, () => {
      E();
    }), se(E);
    async function j() {
      D.value = "", h.value = !0;
      try {
        if (await q.createWorkspace({ name: w.value, host_path: e.value }), !k()) return;
        t.value = !1, w.value = "", e.value = "", r.value = !1, await E();
      } catch (y) {
        k() && (D.value = T(y, "Could not save the workspace."));
      } finally {
        k() && (h.value = !1);
      }
    }
    async function K(y) {
      const c = await Q.confirm({
        header: "Delete workspace",
        message: `Delete workspace "${y.name}"? The host directory stays untouched.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      });
      if (!(!k() || !c)) {
        D.value = "";
        try {
          await q.deleteWorkspace(y.id), await E();
        } catch (p) {
          k() && (D.value = T(p, "Could not delete the workspace."));
        }
      }
    }
    const F = J(() => $.value.filter((y) => [y.name, y.host_path].join(" ").toLowerCase().includes(V.query.toLowerCase())));
    return R($, (y) => s("count", y.length)), (y, c) => (l(), o("div", xa, [
      c[15] || (c[15] = a("p", { class: "ac-hint" }, "Tasks use shared workspaces with the access you grant.", -1)),
      D.value && !r.value ? (l(), o("p", wa, [
        I(g(D.value) + " ", 1),
        a("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: c[0] || (c[0] = //@ts-ignore
          (...p) => m(E) && m(E)(...p))
        }, "Retry")
      ])) : b("", !0),
      !i.value && !D.value ? (l(), o("div", $a, "Loading workspaces…")) : b("", !0),
      x.value.length ? (l(), o("div", Ca, [
        c[7] || (c[7] = a("span", { class: "ac-muted" }, "Allowed roots", -1)),
        (l(!0), o(M, null, H(x.value, (p) => (l(), o("span", {
          key: p,
          class: "ac-hint-chip ac-mono"
        }, g(p), 1))), 128))
      ])) : b("", !0),
      i.value && !$.value.length ? (l(), o("div", Da, [
        a("div", Ua, [
          C(m(L), { icon: "tabler:folder" })
        ]),
        c[8] || (c[8] = a("div", { class: "kx-empty-title" }, "No workspaces yet", -1)),
        c[9] || (c[9] = a("div", { class: "kx-empty-sub" }, "Add a host directory, or let tasks use a scratch directory.", -1)),
        a("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: c[1] || (c[1] = (p) => r.value = !0)
        }, "Add workspace")
      ])) : i.value && !F.value.length ? (l(), o("div", La, [...c[10] || (c[10] = [
        a("div", { class: "kx-empty-title" }, "No matches", -1),
        a("div", { class: "kx-empty-sub" }, "Try another workspace name or path.", -1)
      ])])) : b("", !0),
      a("ul", Aa, [
        (l(!0), o(M, null, H(F.value, (p) => (l(), o("li", {
          key: p.id,
          class: "ac-row ac-resource"
        }, [
          a("span", Ia, [
            C(m(L), { icon: "tabler:folder" })
          ]),
          a("div", Va, [
            a("div", Sa, [
              I(g(p.name), 1),
              a("span", Na, g(p.writable ? "read-write" : "read-only"), 1)
            ]),
            p.host_path ? (l(), o("div", Ba, g(p.host_path), 1)) : b("", !0)
          ]),
          a("div", Ea, [
            p.shareable ? (l(), O(re, {
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
              onClick: (X) => K(p)
            }, [
              C(m(L), { icon: "tabler:trash" })
            ], 8, Pa)) : b("", !0)
          ])
        ]))), 128))
      ]),
      r.value ? (l(), O(Y, {
        key: 5,
        title: "Add workspace",
        busy: h.value,
        onClose: c[6] || (c[6] = (p) => r.value = !1)
      }, {
        default: Z(() => [
          a("fieldset", {
            class: "ac-form",
            disabled: h.value
          }, [
            x.value.length ? (l(), o("div", ja, [
              c[11] || (c[11] = a("span", null, "Allowed roots", -1)),
              a("div", Ra, [
                (l(!0), o(M, null, H(x.value, (p) => (l(), o("button", {
                  key: p,
                  type: "button",
                  class: "ac-chip ac-mono kx-focus-halo",
                  title: "Start from this root",
                  onClick: (X) => e.value = N(p)
                }, g(p), 9, Ma))), 128))
              ])
            ])) : (l(), o("p", qa, "The host administrator configures allowed workspace roots.")),
            a("label", Oa, [
              c[12] || (c[12] = a("span", null, "Name", -1)),
              B(a("input", {
                "onUpdate:modelValue": c[2] || (c[2] = (p) => w.value = p),
                onInput: c[3] || (c[3] = (p) => t.value = !0),
                autofocus: "",
                class: "kx-focus-halo",
                placeholder: "e.g. Kickside checkout"
              }, null, 544), [
                [P, w.value]
              ])
            ]),
            a("label", Ha, [
              c[13] || (c[13] = a("span", null, "Host directory", -1)),
              B(a("input", {
                "onUpdate:modelValue": c[4] || (c[4] = (p) => e.value = p),
                class: "ac-mono kx-focus-halo",
                placeholder: (x.value[0] ?? "/srv/work") + "/project"
              }, null, 8, Ga), [
                [P, e.value]
              ]),
              c[14] || (c[14] = a("small", { class: "ac-hint" }, [
                I("An existing directory, mounted at "),
                a("code", null, "/workspace"),
                I(".")
              ], -1))
            ]),
            D.value ? (l(), o("p", Ka, g(D.value), 1)) : b("", !0),
            a("footer", Wa, [
              a("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                disabled: h.value,
                onClick: c[5] || (c[5] = (p) => r.value = !1)
              }, "Cancel", 8, za),
              a("button", {
                type: "button",
                class: "ac-btn primary kx-focus-halo",
                disabled: h.value || !w.value.trim() || !e.value.trim(),
                onClick: j
              }, [
                C(m(L), { icon: "tabler:folder-plus" }),
                I(g(h.value ? "Saving…" : "Add workspace"), 1)
              ], 8, Fa)
            ])
          ], 8, Ta)
        ]),
        _: 1
      }, 8, ["busy"])) : b("", !0)
    ]));
  }
}), Qa = { class: "ac-card ac-narrow" }, Xa = { class: "ac-card-head" }, Ya = { class: "ac-card-title" }, Za = ["disabled"], et = {
  key: 0,
  class: "kx-err"
}, at = {
  key: 1,
  class: "ac-pre"
}, tt = /* @__PURE__ */ G({
  __name: "maintenance",
  setup(A) {
    const S = ee(), d = v(!1), k = v(""), _ = v("");
    async function V() {
      if (await Q.confirm({
        header: "Clean up Docker",
        message: `Prune stopped Autocode containers, unused images and build cache older than ${S.value.build_cache_retention} across this Docker host? Other modules may use the shared image cache.`,
        icon: "tabler:trash-x",
        acceptLabel: "Clean up",
        rejectLabel: "Cancel"
      })) {
        _.value = "", d.value = !0;
        try {
          k.value = await q.prune();
        } catch (r) {
          _.value = T(r, "Cleanup failed.");
        } finally {
          d.value = !1;
        }
      }
    }
    return (s, r) => (l(), o("section", Qa, [
      a("div", Xa, [
        a("h2", Ya, [
          C(m(L), { icon: "tabler:brand-docker" }),
          r[0] || (r[0] = I("Docker cleanup", -1))
        ]),
        a("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          disabled: d.value,
          onClick: V
        }, [
          C(m(L), {
            icon: d.value ? "tabler:loader-2" : "tabler:trash-x",
            class: z({ spin: d.value })
          }, null, 8, ["icon", "class"]),
          I(" " + g(d.value ? "Cleaning…" : "Clean up Docker"), 1)
        ], 8, Za)
      ]),
      r[1] || (r[1] = a("p", { class: "ac-hint" }, "Prune stopped Autocode containers, dangling images and build cache across the Docker host. Tagged images stay.", -1)),
      _.value ? (l(), o("p", et, g(_.value), 1)) : b("", !0),
      k.value ? (l(), o("pre", at, g(k.value), 1)) : b("", !0)
    ]));
  }
}), lt = { class: "ac" }, st = { class: "ac-bar" }, ot = {
  class: "ac-tabs",
  "aria-label": "Autocode management"
}, nt = ["aria-pressed", "onClick"], it = {
  key: 0,
  class: "kx-err"
}, rt = {
  key: 1,
  class: "kx-loading"
}, ut = {
  key: 2,
  class: "ac-body"
}, ct = {
  key: 3,
  class: "ac-muted"
}, dt = /* @__PURE__ */ G({
  __name: "admin",
  setup(A) {
    const S = [
      { id: "images", label: "Images", icon: "tabler:box" },
      { id: "workspaces", label: "Workspaces", icon: "tabler:folder" },
      { id: "docker", label: "Docker", icon: "tabler:brand-docker" }
    ], d = v(), { catalog: k, error: _, load: V } = pe(), s = J(() => S.filter((w) => w.id === "images" ? k.value?.can_images : w.id === "workspaces" ? k.value?.can_workspaces : k.value?.can_prune));
    R(s, (w) => {
      w.some((t) => t.id === d.value) || (d.value = w[0]?.id);
    }, { immediate: !0 });
    const r = v(""), $ = v(0), x = v(null), D = v(null);
    function h() {
      d.value === "images" ? x.value?.open() : D.value?.open();
    }
    return (w, t) => (l(), o("div", lt, [
      C(me, {
        title: "Autocode",
        subtitle: "Manage agent images, workspaces and Docker.",
        count: d.value && d.value !== "docker" ? `${$.value} ${$.value === 1 ? d.value.slice(0, -1) : d.value}` : void 0,
        action: d.value === "images" ? "Add image" : d.value === "workspaces" ? "Add workspace" : void 0,
        query: r.value,
        "onUpdate:query": t[0] || (t[0] = (e) => r.value = e),
        placeholder: d.value === "docker" ? void 0 : "Search resources…",
        onCreate: h
      }, null, 8, ["count", "action", "query", "placeholder"]),
      a("div", st, [
        a("nav", ot, [
          (l(!0), o(M, null, H(s.value, (e) => (l(), o("button", {
            key: e.id,
            type: "button",
            class: z(["ac-tab kx-focus-outline", { active: d.value === e.id }]),
            "aria-pressed": d.value === e.id,
            onClick: (i) => {
              d.value !== e.id && (d.value = e.id, r.value = "", $.value = 0);
            }
          }, [
            C(m(L), {
              icon: e.icon
            }, null, 8, ["icon"]),
            I(" " + g(e.label), 1)
          ], 10, nt))), 128))
        ])
      ]),
      m(_) && !m(k) ? (l(), o("p", it, [
        I(g(m(_)) + " ", 1),
        a("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: t[1] || (t[1] = //@ts-ignore
          (...e) => m(V) && m(V)(...e))
        }, "Retry")
      ])) : m(k) ? (l(), o("main", ut, [
        d.value === "images" ? (l(), O(_a, {
          key: 0,
          ref_key: "images",
          ref: x,
          query: r.value,
          onCount: t[2] || (t[2] = (e) => $.value = e)
        }, null, 8, ["query"])) : d.value === "workspaces" ? (l(), O(Ja, {
          key: 1,
          ref_key: "workspaces",
          ref: D,
          query: r.value,
          onCount: t[3] || (t[3] = (e) => $.value = e)
        }, null, 8, ["query"])) : d.value === "docker" ? (l(), O(tt, { key: 2 })) : (l(), o("p", ct, "No management areas are available."))
      ])) : (l(), o("div", rt, [
        C(m(L), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        t[4] || (t[4] = I(" Loading…", -1))
      ]))
    ]));
  }
}), gt = {
  rootComponent: dt,
  plugins: [ke]
};
export {
  gt as mountConfig
};
