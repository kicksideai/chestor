import { a as le, P as pe } from "./wc-runtime-6vw183jT.js";
import { defineComponent as K, ref as m, watch as O, openBlock as t, createElementBlock as o, Fragment as R, createElementVNode as e, createVNode as $, unref as v, createCommentVNode as p, toDisplayString as g, createTextVNode as I, withDirectives as E, vModelText as P, normalizeClass as z, createStaticVNode as me, renderList as M, vModelCheckbox as ke, computed as J, onUnmounted as fe, createBlock as H, withCtx as Y, withModifiers as be, vShow as ge } from "vue";
import { Icon as L } from "@iconify/vue";
import { loadByTagName as he, host as Q } from "@wippy-fe/proxy";
import { u as ee, _ as Z, a as ye, b as _e } from "./app-dialog.vue_vue_type_script_setup_true_lang-DJ1OFCgX.js";
import { e as T, a as q, u as oe, b as we, s as ne, r as ie, p as xe, c as $e } from "./presentation-Cex1VGvG.js";
const Ce = {
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
    const N = A, u = m(!1), k = m(null), w = m("");
    function V() {
      u.value = !1;
    }
    return O(k, async (s) => {
      if (s) {
        w.value = "";
        try {
          if (customElements.get("kickside-share") || await he("kickside-share", { timeoutMs: 8e3 }), k.value !== s) return;
          const r = document.createElement("kickside-share");
          r.setAttribute("config", JSON.stringify({
            resource_id: N.id,
            title: N.title,
            access_url: `/api/v1/component-access/grants/${encodeURIComponent(N.id)}`,
            share_url: `/api/v1/component-access/share/${encodeURIComponent(N.id)}`
          })), r.style.display = "block", r.addEventListener("close", V), s.appendChild(r);
        } catch (r) {
          w.value = T(r, "Could not open sharing.");
        }
      }
    }), (s, r) => (t(), o(R, null, [
      e("button", {
        type: "button",
        class: "ac-icon-btn kx-focus-outline",
        title: "Share",
        "aria-label": "Share",
        onClick: r[0] || (r[0] = (D) => u.value = !0)
      }, [
        $(v(L), { icon: "tabler:share" })
      ]),
      u.value ? (t(), o("div", {
        key: 0,
        ref_key: "shareHost",
        ref: k
      }, null, 512)) : p("", !0),
      w.value ? (t(), o("span", Ce, g(w.value), 1)) : p("", !0)
    ], 64));
  }
}), De = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ue = ["disabled"], Le = { class: "ac-card-head" }, Ae = { class: "ac-muted" }, Ie = { class: "ac-field" }, Ve = { class: "ac-seg" }, Se = {
  key: 0,
  class: "ac-field"
}, Ne = {
  key: 1,
  class: "ac-muted"
}, Be = { class: "ac-field" }, Ee = { class: "ac-field" }, Pe = { class: "ac-row-fields" }, Te = { class: "ac-field" }, qe = ["placeholder"], Re = { class: "ac-field" }, je = ["placeholder"], Me = { class: "ac-field" }, Oe = { class: "ac-row-fields" }, He = { class: "ac-field" }, Ge = { class: "ac-field" }, Ke = ["placeholder"], We = {
  key: 2,
  class: "ac-field"
}, Fe = { class: "ac-checks" }, ze = ["value"], Je = { class: "ac-field" }, Qe = { class: "ac-dialog-foot" }, Xe = ["disabled"], Ye = {
  key: 3,
  class: "kx-err"
}, Ze = /* @__PURE__ */ K({
  __name: "image-form",
  props: {
    edit: {},
    capabilities: {}
  },
  emits: ["saved", "cancel", "busy"],
  setup(A, { emit: N }) {
    const u = A, k = N, w = ee();
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
    const s = m(V()), r = m(!1);
    O(() => s.value?.ref, (l) => {
      s.value && !u.edit && !r.value && l !== void 0 && (s.value.label = l);
    });
    const D = m(!1), x = m("");
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
        x.value = "", D.value = !0, k("busy", !0);
        try {
          let l;
          if (u.edit) {
            const a = await q.updateImage(u.edit.image.id, { ..._(), ref: s.value.ref, dockerfile: s.value.mode === "build" ? s.value.dockerfile : "" });
            a.build_error && (l = `Settings saved. Build preparation has not started: ${a.build_error.message}. Use Prepare image to retry.`);
          } else {
            const a = s.value, n = await q.createImage({ ..._(), ref: a.ref, dockerfile: a.mode === "build" ? a.dockerfile : "" });
            n.build_error && (l = `Image created. Build preparation has not started: ${n.build_error.message}. Use Prepare image to retry.`), s.value = V();
          }
          k("saved", l);
        } catch (l) {
          x.value = T(l, "Could not save the image.");
        } finally {
          D.value = !1, k("busy", !1);
        }
      }
    }
    return (l, a) => s.value ? (t(), o("fieldset", {
      key: 1,
      class: "ac-form",
      disabled: D.value
    }, [
      e("div", Le, [
        e("span", Ae, g(A.edit ? "Container settings" : "Use an image reference or the default agent recipe."), 1),
        A.edit ? p("", !0) : (t(), o("button", {
          key: 0,
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: C
        }, [
          $(v(L), { icon: "tabler:sparkles" }),
          a[15] || (a[15] = I(" Default agent image", -1))
        ]))
      ]),
      e("label", Ie, [
        a[16] || (a[16] = e("span", null, "Image reference", -1)),
        E(e("input", {
          "onUpdate:modelValue": a[0] || (a[0] = (n) => s.value.ref = n),
          class: "ac-mono kx-focus-halo",
          placeholder: "registry/name:tag"
        }, null, 512), [
          [P, s.value.ref]
        ])
      ]),
      e("div", Ve, [
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
      s.value.mode === "build" ? (t(), o("label", Se, [
        a[17] || (a[17] = e("span", null, "Dockerfile", -1)),
        E(e("textarea", {
          "onUpdate:modelValue": a[3] || (a[3] = (n) => s.value.dockerfile = n),
          rows: "9",
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [P, s.value.dockerfile]
        ]),
        a[18] || (a[18] = me('<small class="ac-hint">Include <code>sh</code>, <code>git</code>, <code>mkdir</code>, <code>dirname</code>, a <code>timeout</code> that supports <code>-k</code>, and the agent CLIs. The image user needs writable home and work directories.</small>', 1))
      ])) : p("", !0),
      A.edit ? (t(), o("p", Ne, "Saving container settings prepares the image automatically.")) : p("", !0),
      e("label", Be, [
        a[19] || (a[19] = e("span", null, "Label", -1)),
        E(e("input", {
          "onUpdate:modelValue": a[4] || (a[4] = (n) => s.value.label = n),
          class: "kx-focus-halo",
          onInput: a[5] || (a[5] = (n) => r.value = !0)
        }, null, 544), [
          [P, s.value.label]
        ])
      ]),
      e("label", Ee, [
        a[20] || (a[20] = e("span", null, "Home directory in the image", -1)),
        E(e("input", {
          "onUpdate:modelValue": a[6] || (a[6] = (n) => s.value.home = n),
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [P, s.value.home]
        ])
      ]),
      e("div", Pe, [
        e("label", Te, [
          a[21] || (a[21] = e("span", null, "Memory", -1)),
          E(e("input", {
            "onUpdate:modelValue": a[7] || (a[7] = (n) => s.value.memory = n),
            class: "ac-mono kx-focus-halo",
            placeholder: v(w).default_image.settings?.memory
          }, null, 8, qe), [
            [P, s.value.memory]
          ])
        ]),
        e("label", Re, [
          a[22] || (a[22] = e("span", null, "CPUs", -1)),
          E(e("input", {
            "onUpdate:modelValue": a[8] || (a[8] = (n) => s.value.cpus = n),
            class: "ac-mono kx-focus-halo",
            placeholder: v(w).default_image.settings?.cpus
          }, null, 8, je), [
            [P, s.value.cpus]
          ])
        ]),
        e("label", Me, [
          a[23] || (a[23] = e("span", null, "PIDs limit", -1)),
          E(e("input", {
            "onUpdate:modelValue": a[9] || (a[9] = (n) => s.value.pids_limit = n),
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
      e("div", Oe, [
        e("label", He, [
          a[24] || (a[24] = e("span", null, "GPUs", -1)),
          E(e("input", {
            "onUpdate:modelValue": a[10] || (a[10] = (n) => s.value.gpus = n),
            class: "ac-mono kx-focus-halo",
            placeholder: "all, or device=0"
          }, null, 512), [
            [P, s.value.gpus]
          ])
        ]),
        e("label", Ge, [
          a[25] || (a[25] = e("span", null, "Network", -1)),
          E(e("input", {
            "onUpdate:modelValue": a[11] || (a[11] = (n) => s.value.network = n),
            class: "ac-mono kx-focus-halo",
            placeholder: v(w).default_image.settings?.network
          }, null, 8, Ke), [
            [P, s.value.network]
          ])
        ])
      ]),
      A.capabilities?.length ? (t(), o("div", We, [
        a[26] || (a[26] = e("span", null, "Agents may", -1)),
        e("div", Fe, [
          (t(!0), o(R, null, M(A.capabilities, (n) => (t(), o("label", {
            key: n,
            class: "ac-check ac-mono"
          }, [
            E(e("input", {
              "onUpdate:modelValue": a[12] || (a[12] = (y) => s.value.allows = y),
              type: "checkbox",
              class: "kx-focus-outline",
              value: n
            }, null, 8, ze), [
              [ke, s.value.allows]
            ]),
            I(" " + g(n), 1)
          ]))), 128))
        ])
      ])) : p("", !0),
      e("label", Je, [
        a[27] || (a[27] = e("span", null, "Extra Docker arguments", -1)),
        E(e("textarea", {
          "onUpdate:modelValue": a[13] || (a[13] = (n) => s.value.extra = n),
          rows: "3",
          class: "ac-mono kx-focus-halo",
          placeholder: `One argument per line, e.g.
--add-host
host.docker.internal:host-gateway`
        }, null, 512), [
          [P, s.value.extra]
        ])
      ]),
      a[28] || (a[28] = e("p", { class: "ac-hint" }, [
        e("a", {
          class: "ac-link kx-focus-outline",
          href: "https://github.com/kicksideai/chestor/blob/main/autocode/docs/docker-options.md#settings-limits-and-docker-warnings",
          target: "_blank",
          rel: "noopener noreferrer"
        }, "Container limits and isolation")
      ], -1)),
      e("footer", Qe, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: a[14] || (a[14] = (n) => k("cancel"))
        }, "Cancel"),
        e("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: D.value || !A.capabilities || !s.value.ref,
          onClick: U
        }, [
          $(v(L), { icon: "tabler:box" }),
          I(" " + g(D.value ? "Saving…" : A.edit ? "Save settings" : s.value.mode === "build" ? "Build image" : "Add image"), 1)
        ], 8, Xe)
      ]),
      x.value ? (t(), o("p", Ye, g(x.value), 1)) : p("", !0)
    ], 8, Ue)) : (t(), o("p", De, g(A.edit ? "Image settings are unavailable." : "Image defaults are unavailable.") + " Ask an administrator to update the image configuration.", 1));
  }
}), ea = { class: "ac-stack" }, aa = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ta = {
  key: 1,
  class: "kx-loading"
}, sa = {
  key: 2,
  class: "kx-empty"
}, la = { class: "kx-empty-ico" }, oa = {
  key: 3,
  class: "kx-empty"
}, na = { class: "ac-list ac-resource-list" }, ia = { class: "ac-resource-icon" }, ra = { class: "ac-account-main" }, ua = { class: "ac-row-title" }, ca = {
  key: 0,
  class: "kx-tag-sm ac-tone ready"
}, da = { class: "ac-muted ac-mono" }, va = { class: "ac-chips" }, pa = { class: "ac-muted" }, ma = {
  key: 0,
  class: "kx-err ac-small"
}, ka = { class: "ac-row-actions" }, fa = ["disabled", "onClick"], ba = ["onClick"], ga = ["onClick"], ha = ["onClick"], ya = { class: "ac-form" }, _a = { class: "ac-mono" }, wa = { class: "ac-pre ac-build-log" }, xa = /* @__PURE__ */ K({
  __name: "images",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(A, { expose: N, emit: u }) {
    const k = ee(), w = A, V = u, s = m(!1), r = m(!1), D = m({});
    N({ open: ae });
    const x = m([]), C = m([]), _ = m(""), U = m(null), l = m(null), a = J(() => [...new Set(k.value.agents.flatMap((c) => c.capabilities))].sort()), n = m(!1);
    let y = !0, B = 0, j = 0, W = 0;
    fe(() => {
      y = !1, B++, j++;
    });
    async function X(c) {
      const b = B, i = await q.image(c);
      !y || b !== B || l.value?.id !== c || (l.value = { id: c, ref: i.image.ref, text: i.build_log || "(empty)" });
    }
    const h = ne(async () => {
      try {
        const c = await ie(q.images, (b) => b.map((i) => i.id), C, () => y, (b) => {
          x.value = b, n.value = !0, _.value = "";
        }, () => {
          h();
        });
        if (!y) return;
        x.value = c, d(c, ++W), l.value && c.some((b) => b.id === l.value?.id) && await X(l.value.id), n.value = !0, _.value = "";
      } catch (c) {
        _.value = T(c, "Could not load images.");
      }
    });
    async function d(c, b) {
      try {
        const i = await xe([...new Set(c.map((S) => S.owner_user_id))]);
        if (!y || b !== W) return;
        D.value = Object.fromEntries(c.map((S) => [S.id, `Owner: ${i[S.owner_user_id] || S.owner_user_id}`]));
      } catch (i) {
        y && b === W && (_.value = T(i, "Could not load image owners."));
      }
    }
    oe(() => C.value, () => {
      h();
    }), le(h);
    async function f(c, b) {
      _.value = "";
      try {
        await c(), await h();
      } catch (i) {
        _.value = T(i, b);
      }
    }
    async function G(c) {
      const b = ++j;
      _.value = "";
      try {
        const i = await q.image(c.id);
        y && b === j && (U.value = i);
      } catch (i) {
        y && b === j && (_.value = T(i, "Could not load the image settings."));
      }
    }
    function F() {
      j++, s.value = !1, U.value = null;
    }
    function ae() {
      F(), s.value = !0;
    }
    const ue = (c) => f(() => q.prepareImage(c.id), "Could not start the image preparation.");
    function ce(c) {
      B++, l.value = { id: c.id, ref: c.ref, text: "Loading…" }, h();
    }
    function te() {
      B++, l.value = null;
    }
    async function de(c) {
      F(), await h(), c && (_.value = c);
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
      const i = await Q.confirm({
        header: "Docker image",
        message: `Also remove ${c.ref} from Docker on the host? Keeping it lets a later image with the same reference reuse it.`,
        icon: "tabler:brand-docker",
        acceptLabel: "Remove from Docker",
        rejectLabel: "Keep in Docker",
        acceptClass: "p-button-danger"
      });
      j++, U.value?.image.id === c.id && F(), l.value?.id === c.id && te(), _.value = "";
      try {
        await q.deleteImage(c.id, i), await h();
      } catch (S) {
        _.value = T(S, "Could not delete the image.");
      }
    }
    const se = J(() => x.value.filter((c) => [c.label, c.ref, ...c.agents].join(" ").toLowerCase().includes(w.query.toLowerCase())));
    return O(x, (c) => V("count", c.length)), (c, b) => (t(), o("div", ea, [
      b[7] || (b[7] = e("p", { class: "ac-hint" }, "Ready means preparation finished. Usable means you can run tasks with the image. Share ready images to make them available to others.", -1)),
      _.value ? (t(), o("p", aa, [
        I(g(_.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: b[0] || (b[0] = //@ts-ignore
          (...i) => v(h) && v(h)(...i))
        }, "Retry")
      ])) : p("", !0),
      !n.value && !_.value ? (t(), o("div", ta, "Loading images…")) : p("", !0),
      n.value && !x.value.length ? (t(), o("div", sa, [
        e("div", la, [
          $(v(L), { icon: "tabler:box" })
        ]),
        b[4] || (b[4] = e("div", { class: "kx-empty-title" }, "No images yet", -1)),
        b[5] || (b[5] = e("div", { class: "kx-empty-sub" }, "Start with the default agent recipe or use an existing image.", -1)),
        e("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: ae
        }, "Add image")
      ])) : n.value && !se.value.length ? (t(), o("div", oa, [...b[6] || (b[6] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another image, reference or agent.", -1)
      ])])) : p("", !0),
      e("ul", na, [
        (t(!0), o(R, null, M(se.value, (i) => (t(), o("li", {
          key: i.id,
          class: "ac-row ac-resource"
        }, [
          e("span", ia, [
            $(v(L), { icon: "tabler:box" })
          ]),
          e("div", ra, [
            e("div", ua, [
              I(g(i.label), 1),
              e("span", {
                class: z(["kx-tag-sm ac-tone", i.status])
              }, g(i.status === "unprepared" ? "Needs preparation" : i.status.charAt(0).toUpperCase() + i.status.slice(1)), 3),
              i.usable ? (t(), o("span", ca, "Usable")) : p("", !0)
            ]),
            e("div", da, g(i.ref) + " · " + g(i.home), 1),
            e("div", va, [
              (t(!0), o(R, null, M(i.agents, (S) => (t(), o("span", {
                key: S,
                class: "kx-tag-sm ac-tone"
              }, [
                $(v(L), {
                  icon: v(we)(S, v(k).agents)
                }, null, 8, ["icon"]),
                I(g(S), 1)
              ]))), 128))
            ]),
            e("div", pa, g(D.value[i.id]), 1),
            i.last_error ? (t(), o("div", ma, g(i.last_error), 1)) : p("", !0)
          ]),
          e("div", ka, [
            i.shareable ? (t(), H(re, {
              key: 0,
              id: i.id,
              title: i.label
            }, null, 8, ["id", "title"])) : p("", !0),
            i.writable ? (t(), o("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Prepare image",
              "aria-label": "Prepare image",
              disabled: i.status === "preparing",
              onClick: (S) => ue(i)
            }, [
              $(v(L), { icon: "tabler:refresh" })
            ], 8, fa)) : p("", !0),
            e("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Build log",
              "aria-label": "Build log",
              onClick: (S) => ce(i)
            }, [
              $(v(L), { icon: "tabler:file-text" })
            ], 8, ba),
            i.writable ? (t(), o("button", {
              key: 2,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Edit settings",
              "aria-label": "Edit settings",
              onClick: (S) => G(i)
            }, [
              $(v(L), { icon: "tabler:pencil" })
            ], 8, ga)) : p("", !0),
            i.deletable ? (t(), o("button", {
              key: 3,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete image",
              "aria-label": "Delete image",
              onClick: (S) => ve(i)
            }, [
              $(v(L), { icon: "tabler:trash" })
            ], 8, ha)) : p("", !0)
          ])
        ]))), 128))
      ]),
      s.value || U.value ? (t(), H(Z, {
        key: 4,
        title: U.value ? "Edit image" : "Add image",
        busy: r.value,
        wide: "",
        onClose: b[3] || (b[3] = (i) => F())
      }, {
        default: Y(() => [
          $(Ze, {
            onBusy: b[1] || (b[1] = (i) => r.value = i),
            edit: U.value,
            capabilities: a.value,
            onSaved: de,
            onCancel: b[2] || (b[2] = (i) => F())
          }, null, 8, ["edit", "capabilities"])
        ]),
        _: 1
      }, 8, ["title", "busy"])) : p("", !0),
      l.value ? (t(), H(Z, {
        key: 5,
        title: "Build log",
        wide: "",
        onClose: te
      }, {
        default: Y(() => [
          e("div", ya, [
            e("strong", _a, g(l.value.ref), 1),
            e("pre", wa, g(l.value.text), 1)
          ])
        ]),
        _: 1
      })) : p("", !0)
    ]));
  }
}), $a = { class: "ac-stack" }, Ca = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Da = {
  key: 1,
  class: "kx-loading"
}, Ua = {
  key: 2,
  class: "ac-chips"
}, La = {
  key: 3,
  class: "kx-empty"
}, Aa = { class: "kx-empty-ico" }, Ia = {
  key: 4,
  class: "kx-empty"
}, Va = { class: "ac-list ac-resource-list" }, Sa = { class: "ac-resource-icon" }, Na = { class: "ac-account-main" }, Ba = { class: "ac-row-title" }, Ea = { class: "kx-tag-sm ac-tone" }, Pa = {
  key: 0,
  class: "ac-muted"
}, Ta = { class: "ac-mono" }, qa = {
  key: 1,
  class: "ac-muted ac-mono"
}, Ra = { class: "ac-row-actions" }, ja = ["onClick"], Ma = ["disabled"], Oa = {
  key: 0,
  class: "ac-muted"
}, Ha = {
  key: 1,
  class: "ac-field"
}, Ga = { class: "ac-chips" }, Ka = ["onClick"], Wa = { class: "ac-field" }, Fa = { class: "ac-field" }, za = ["placeholder"], Ja = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Qa = { class: "ac-dialog-foot" }, Xa = ["disabled"], Ya = ["disabled"], Za = /* @__PURE__ */ K({
  __name: "workspaces",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(A, { expose: N, emit: u }) {
    const k = $e(), w = m([]), V = A, s = u, r = m(!1);
    N({ open: () => {
      r.value = !0;
    } });
    const D = m([]), x = m([]), C = m(""), _ = m(!1), U = m(""), l = m(!1), a = m(""), n = m(!1);
    function y(h) {
      return h.replace(/\/+$/, "") + "/";
    }
    O([r, x], () => {
      r.value && !a.value && x.value.length && (a.value = y(x.value[0]));
    }), O(a, (h) => {
      l.value || (U.value = h.trim().split("/").filter(Boolean).pop() ?? "");
    });
    const B = ne(async () => {
      try {
        await ie(q.workspaces, (h) => h.workspaces.map((d) => d.id), w, k, (h) => {
          D.value = h.workspaces, x.value = h.roots ?? [], n.value = !0, C.value = "";
        }, () => {
          B();
        });
      } catch (h) {
        k() && (C.value = T(h, "Could not load workspaces."));
      }
    }, k);
    oe(() => w.value, () => {
      B();
    }), le(B);
    async function j() {
      C.value = "", _.value = !0;
      try {
        if (await q.createWorkspace({ name: U.value, host_path: a.value }), !k()) return;
        l.value = !1, U.value = "", a.value = "", r.value = !1, await B();
      } catch (h) {
        k() && (C.value = T(h, "Could not save the workspace."));
      } finally {
        k() && (_.value = !1);
      }
    }
    async function W(h) {
      const d = await Q.confirm({
        header: "Delete workspace",
        message: `Delete workspace "${h.name}"? The host directory stays untouched.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      });
      if (!(!k() || !d)) {
        C.value = "";
        try {
          await q.deleteWorkspace(h.id), await B();
        } catch (f) {
          k() && (C.value = T(f, "Could not delete the workspace."));
        }
      }
    }
    const X = J(() => D.value.filter((h) => [h.name, h.host_path].join(" ").toLowerCase().includes(V.query.toLowerCase())));
    return O(D, (h) => {
      s("count", h.length);
    }), (h, d) => (t(), o("div", $a, [
      d[15] || (d[15] = e("p", { class: "ac-hint" }, "Tasks use shared workspaces with the access you grant.", -1)),
      C.value && !r.value ? (t(), o("p", Ca, [
        I(g(C.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: d[0] || (d[0] = //@ts-ignore
          (...f) => v(B) && v(B)(...f))
        }, "Retry")
      ])) : p("", !0),
      !n.value && !C.value ? (t(), o("div", Da, "Loading workspaces…")) : p("", !0),
      x.value.length ? (t(), o("div", Ua, [
        d[7] || (d[7] = e("span", { class: "ac-muted" }, "Allowed roots", -1)),
        (t(!0), o(R, null, M(x.value, (f) => (t(), o("span", {
          key: f,
          class: "ac-hint-chip ac-mono"
        }, g(f), 1))), 128))
      ])) : p("", !0),
      n.value && !D.value.length ? (t(), o("div", La, [
        e("div", Aa, [
          $(v(L), { icon: "tabler:folder" })
        ]),
        d[8] || (d[8] = e("div", { class: "kx-empty-title" }, "No workspaces yet", -1)),
        d[9] || (d[9] = e("div", { class: "kx-empty-sub" }, "Add a host directory, or let tasks use a scratch directory.", -1)),
        e("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: d[1] || (d[1] = (f) => r.value = !0)
        }, "Add workspace")
      ])) : n.value && !X.value.length ? (t(), o("div", Ia, [...d[10] || (d[10] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another workspace name or path.", -1)
      ])])) : p("", !0),
      e("ul", Va, [
        (t(!0), o(R, null, M(X.value, (f) => (t(), o("li", {
          key: f.id,
          class: "ac-row ac-resource"
        }, [
          e("span", Sa, [
            $(v(L), { icon: "tabler:folder" })
          ]),
          e("div", Na, [
            e("div", Ba, [
              I(g(f.name), 1),
              e("span", Ea, g(f.writable ? "read-write" : "read-only"), 1)
            ]),
            f.unavailable_reason ? (t(), o("div", Pa, g(f.unavailable_reason), 1)) : p("", !0),
            (t(!0), o(R, null, M(f.conflicts, (G) => (t(), o("div", {
              key: G.id,
              class: "ac-muted"
            }, [
              I("Conflicts with " + g(G.id) + ": ", 1),
              e("span", Ta, g(G.host_path), 1)
            ]))), 128)),
            f.host_path ? (t(), o("div", qa, g(f.host_path), 1)) : p("", !0)
          ]),
          e("div", Ra, [
            f.shareable ? (t(), H(re, {
              key: 0,
              id: f.id,
              title: f.name
            }, null, 8, ["id", "title"])) : p("", !0),
            f.deletable ? (t(), o("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete workspace",
              "aria-label": "Delete workspace",
              onClick: (G) => W(f)
            }, [
              $(v(L), { icon: "tabler:trash" })
            ], 8, ja)) : p("", !0)
          ])
        ]))), 128))
      ]),
      r.value ? (t(), H(Z, {
        key: 5,
        title: "Add workspace",
        busy: _.value,
        onClose: d[6] || (d[6] = (f) => r.value = !1)
      }, {
        default: Y(() => [
          e("fieldset", {
            class: "ac-form",
            disabled: _.value
          }, [
            x.value.length ? (t(), o("div", Ha, [
              d[11] || (d[11] = e("span", null, "Allowed roots", -1)),
              e("div", Ga, [
                (t(!0), o(R, null, M(x.value, (f) => (t(), o("button", {
                  key: f,
                  type: "button",
                  class: "ac-chip ac-mono kx-focus-halo",
                  title: "Start from this root",
                  onClick: (G) => a.value = y(f)
                }, g(f), 9, Ka))), 128))
              ])
            ])) : (t(), o("p", Oa, "The host administrator configures allowed workspace roots.")),
            e("label", Wa, [
              d[12] || (d[12] = e("span", null, "Name", -1)),
              E(e("input", {
                "onUpdate:modelValue": d[2] || (d[2] = (f) => U.value = f),
                onInput: d[3] || (d[3] = (f) => l.value = !0),
                autofocus: "",
                class: "kx-focus-halo",
                placeholder: "e.g. Kickside checkout"
              }, null, 544), [
                [P, U.value]
              ])
            ]),
            e("label", Fa, [
              d[13] || (d[13] = e("span", null, "Host directory", -1)),
              E(e("input", {
                "onUpdate:modelValue": d[4] || (d[4] = (f) => a.value = f),
                class: "ac-mono kx-focus-halo",
                placeholder: (x.value[0] ?? "/srv/work") + "/project"
              }, null, 8, za), [
                [P, a.value]
              ]),
              d[14] || (d[14] = e("small", { class: "ac-hint" }, [
                I("An existing directory, mounted at "),
                e("code", null, "/workspace"),
                I(".")
              ], -1))
            ]),
            C.value ? (t(), o("p", Ja, g(C.value), 1)) : p("", !0),
            e("footer", Qa, [
              e("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                disabled: _.value,
                onClick: d[5] || (d[5] = (f) => r.value = !1)
              }, "Cancel", 8, Xa),
              e("button", {
                type: "button",
                class: "ac-btn primary kx-focus-halo",
                disabled: _.value || !U.value.trim() || !a.value.trim(),
                onClick: j
              }, [
                $(v(L), { icon: "tabler:folder-plus" }),
                I(g(_.value ? "Saving…" : "Add workspace"), 1)
              ], 8, Ya)
            ])
          ], 8, Ma)
        ]),
        _: 1
      }, 8, ["busy"])) : p("", !0)
    ]));
  }
}), et = { class: "ac-card ac-narrow" }, at = { class: "ac-card-head" }, tt = { class: "ac-card-title" }, st = ["disabled"], lt = {
  key: 0,
  class: "kx-err"
}, ot = {
  key: 1,
  class: "ac-pre"
}, nt = /* @__PURE__ */ K({
  __name: "maintenance",
  setup(A) {
    const N = ee(), u = m(!1), k = m(""), w = m("");
    async function V() {
      if (await Q.confirm({
        header: "Clean up Docker",
        message: `Prune stopped Autocode containers, unused images and build cache older than ${N.value.build_cache_retention} across this Docker host? Other modules may use the shared image cache.`,
        icon: "tabler:trash-x",
        acceptLabel: "Clean up",
        rejectLabel: "Cancel"
      })) {
        w.value = "", u.value = !0;
        try {
          k.value = await q.prune();
        } catch (r) {
          w.value = T(r, "Cleanup failed.");
        } finally {
          u.value = !1;
        }
      }
    }
    return (s, r) => (t(), o("section", et, [
      e("div", at, [
        e("h2", tt, [
          $(v(L), { icon: "tabler:brand-docker" }),
          r[0] || (r[0] = I("Docker cleanup", -1))
        ]),
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          disabled: u.value,
          onClick: V
        }, [
          $(v(L), {
            icon: u.value ? "tabler:loader-2" : "tabler:trash-x",
            class: z({ spin: u.value })
          }, null, 8, ["icon", "class"]),
          I(" " + g(u.value ? "Cleaning…" : "Clean up Docker"), 1)
        ], 8, st)
      ]),
      r[1] || (r[1] = e("p", { class: "ac-hint" }, "Prune stopped Autocode containers, dangling images and build cache across the Docker host. Tagged images stay.", -1)),
      w.value ? (t(), o("p", lt, g(w.value), 1)) : p("", !0),
      k.value ? (t(), o("pre", ot, g(k.value), 1)) : p("", !0)
    ]));
  }
}), it = { class: "ac" }, rt = { class: "ac-bar" }, ut = {
  class: "ac-tabs",
  "aria-label": "Autocode management"
}, ct = ["aria-pressed", "onClick"], dt = ["href"], vt = {
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
  setup(A) {
    const N = [
      { id: "images", label: "Images", icon: "tabler:box" },
      { id: "workspaces", label: "Workspaces", icon: "tabler:folder" },
      { id: "docker", label: "Docker", icon: "tabler:brand-docker" }
    ], u = m(), { catalog: k, error: w, load: V } = ye(), s = J(() => N.filter((a) => a.id === "images" ? k.value?.can_images : a.id === "workspaces" ? k.value?.can_workspaces : k.value?.can_prune));
    O(s, (a) => {
      a.some((n) => n.id === u.value) || (u.value = a[0]?.id);
    }, { immediate: !0 });
    const r = m(""), D = m(0), x = m(0), C = J(() => u.value === "images" ? D.value : x.value), _ = m(null), U = m(null);
    function l() {
      u.value === "images" ? _.value?.open() : U.value?.open();
    }
    return (a, n) => (t(), o("div", it, [
      $(_e, {
        title: "Autocode",
        subtitle: "Manage agent images, workspaces and Docker.",
        count: u.value && u.value !== "docker" ? `${C.value} ${C.value === 1 ? u.value.slice(0, -1) : u.value}` : void 0,
        action: u.value === "images" ? "Add image" : u.value === "workspaces" ? "Add workspace" : void 0,
        query: r.value,
        "onUpdate:query": n[0] || (n[0] = (y) => r.value = y),
        placeholder: u.value === "docker" ? void 0 : "Search resources…",
        onCreate: l
      }, null, 8, ["count", "action", "query", "placeholder"]),
      e("div", rt, [
        e("nav", ut, [
          (t(!0), o(R, null, M(s.value, (y) => (t(), o("button", {
            key: y.id,
            type: "button",
            class: z(["ac-tab kx-focus-outline", { active: u.value === y.id }]),
            "aria-pressed": u.value === y.id,
            onClick: (B) => {
              u.value !== y.id && (u.value = y.id, r.value = "");
            }
          }, [
            $(v(L), {
              icon: y.icon
            }, null, 8, ["icon"]),
            I(" " + g(y.label), 1)
          ], 10, ct))), 128))
        ]),
        v(k)?.limits_path ? (t(), o("a", {
          key: 0,
          class: "ac-link kx-focus-outline",
          href: v(k).limits_path,
          onClick: n[1] || (n[1] = be((y) => v(Q).navigate(v(k).limits_path), ["prevent"]))
        }, "Run limits and retention", 8, dt)) : p("", !0)
      ]),
      v(w) && !v(k) ? (t(), o("p", vt, [
        I(g(v(w)) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: n[2] || (n[2] = //@ts-ignore
          (...y) => v(V) && v(V)(...y))
        }, "Retry")
      ])) : v(k) ? (t(), o("main", mt, [
        u.value === "images" ? (t(), H(xa, {
          key: 0,
          ref_key: "images",
          ref: _,
          query: r.value,
          onCount: n[3] || (n[3] = (y) => D.value = y)
        }, null, 8, ["query"])) : p("", !0),
        v(k).can_workspaces ? E((t(), H(Za, {
          key: 1,
          ref_key: "workspaces",
          ref: U,
          query: r.value,
          onCount: n[4] || (n[4] = (y) => x.value = y)
        }, null, 8, ["query"])), [
          [ge, u.value === "workspaces"]
        ]) : p("", !0),
        u.value === "docker" ? (t(), H(nt, { key: 2 })) : p("", !0),
        u.value ? p("", !0) : (t(), o("p", kt, "No management areas are available."))
      ])) : (t(), o("div", pt, [
        $(v(L), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        n[5] || (n[5] = I(" Loading…", -1))
      ]))
    ]));
  }
}), xt = {
  rootComponent: ft,
  plugins: [pe]
};
export {
  xt as mountConfig
};
