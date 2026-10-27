import { u as ee, _ as Y, a as pe, b as me, s as fe, P as ke } from "./styles-B_GLD-6F.js";
import { u as le, W as be } from "./dto-CcYNmUR0.js";
import { defineComponent as W, ref as v, watch as R, openBlock as s, createElementBlock as o, Fragment as M, createElementVNode as a, createVNode as C, unref as m, createCommentVNode as b, toDisplayString as g, createTextVNode as I, withDirectives as N, vModelText as T, normalizeClass as z, createStaticVNode as ge, renderList as H, vModelCheckbox as ye, computed as J, onUnmounted as he, createBlock as O, withCtx as Z } from "vue";
import { Icon as L } from "@iconify/vue";
import { loadByTagName as _e, host as Q, define as xe } from "@wippy-fe/proxy";
import { e as B, a as q, u as oe, b as we, s as ne, r as ie, p as $e, c as Ce } from "./presentation-Cbft0Qfp.js";
const De = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, re = /* @__PURE__ */ W({
  __name: "share-control",
  props: {
    id: {},
    title: {}
  },
  setup(U) {
    const S = U, d = v(!1), f = v(null), _ = v("");
    function V() {
      d.value = !1;
    }
    return R(f, async (l) => {
      if (l) {
        _.value = "";
        try {
          if (customElements.get("kickside-share") || await _e("kickside-share", { timeoutMs: 8e3 }), f.value !== l) return;
          const r = document.createElement("kickside-share");
          r.setAttribute("config", JSON.stringify({
            resource_id: S.id,
            title: S.title,
            access_url: `/api/v1/component-access/grants/${encodeURIComponent(S.id)}`,
            share_url: `/api/v1/component-access/share/${encodeURIComponent(S.id)}`
          })), r.style.display = "block", r.addEventListener("close", V), l.appendChild(r);
        } catch (r) {
          _.value = B(r, "Could not open sharing.");
        }
      }
    }), (l, r) => (s(), o(M, null, [
      a("button", {
        type: "button",
        class: "ac-icon-btn kx-focus-outline",
        title: "Share",
        "aria-label": "Share",
        onClick: r[0] || (r[0] = ($) => d.value = !0)
      }, [
        C(m(L), { icon: "tabler:share" })
      ]),
      d.value ? (s(), o("div", {
        key: 0,
        ref_key: "shareHost",
        ref: f
      }, null, 512)) : b("", !0),
      _.value ? (s(), o("span", De, g(_.value), 1)) : b("", !0)
    ], 64));
  }
}), Ue = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ae = ["disabled"], Le = { class: "ac-card-head" }, Ie = { class: "ac-muted" }, Ve = { class: "ac-field" }, Se = { class: "ac-seg" }, Ee = {
  key: 0,
  class: "ac-field"
}, Ne = {
  key: 1,
  class: "ac-muted"
}, Pe = { class: "ac-field" }, Te = { class: "ac-field" }, Be = { class: "ac-row-fields" }, qe = { class: "ac-field" }, je = ["placeholder"], Re = { class: "ac-field" }, Me = ["placeholder"], Oe = { class: "ac-field" }, He = { class: "ac-row-fields" }, We = { class: "ac-field" }, Ge = { class: "ac-field" }, Ke = ["placeholder"], ze = {
  key: 2,
  class: "ac-field"
}, Fe = { class: "ac-checks" }, Je = ["value"], Qe = { class: "ac-field" }, Xe = { class: "ac-dialog-foot" }, Ye = ["disabled"], Ze = {
  key: 3,
  class: "kx-err"
}, ea = /* @__PURE__ */ W({
  __name: "image-form",
  props: {
    edit: {},
    capabilities: {}
  },
  emits: ["saved", "cancel", "busy"],
  setup(U, { emit: S }) {
    const d = U, f = S, _ = ee();
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
    const l = v(V()), r = v(!1);
    R(() => l.value?.ref, (t) => {
      l.value && !d.edit && !r.value && t !== void 0 && (l.value.label = t);
    });
    const $ = v(!1), x = v("");
    R(() => d.edit, (t) => {
      if (x.value = "", r.value = !!t, !t) {
        l.value = V();
        return;
      }
      if (!t.settings) {
        l.value = null;
        return;
      }
      const e = t.settings;
      l.value = {
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
      l.value = e ? { ...e, ref: t.ref, label: t.label, home: t.home, mode: "build", dockerfile: t.dockerfile } : null;
    }
    function h() {
      const t = l.value;
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
      if (!(!l.value || $.value)) {
        x.value = "", $.value = !0, f("busy", !0);
        try {
          let t;
          if (d.edit) {
            const e = await q.updateImage(d.edit.image.id, { ...h(), ref: l.value.ref, dockerfile: l.value.mode === "build" ? l.value.dockerfile : "" });
            e.build_error && (t = `Settings saved. Build preparation has not started: ${e.build_error.message}. Use Prepare image to retry.`);
          } else {
            const e = l.value, i = await q.createImage({ ...h(), ref: e.ref, dockerfile: e.mode === "build" ? e.dockerfile : "" });
            i.build_error && (t = `Image created. Build preparation has not started: ${i.build_error.message}. Use Prepare image to retry.`), l.value = V();
          }
          f("saved", t);
        } catch (t) {
          x.value = B(t, "Could not save the image.");
        } finally {
          $.value = !1, f("busy", !1);
        }
      }
    }
    return (t, e) => l.value ? (s(), o("fieldset", {
      key: 1,
      class: "ac-form",
      disabled: $.value
    }, [
      a("div", Le, [
        a("span", Ie, g(U.edit ? "Container settings" : "Use an image reference or the default agent recipe."), 1),
        U.edit ? b("", !0) : (s(), o("button", {
          key: 0,
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: D
        }, [
          C(m(L), { icon: "tabler:sparkles" }),
          e[15] || (e[15] = I(" Default agent image", -1))
        ]))
      ]),
      a("label", Ve, [
        e[16] || (e[16] = a("span", null, "Image reference", -1)),
        N(a("input", {
          "onUpdate:modelValue": e[0] || (e[0] = (i) => l.value.ref = i),
          class: "ac-mono kx-focus-halo",
          placeholder: "registry/name:tag"
        }, null, 512), [
          [T, l.value.ref]
        ])
      ]),
      a("div", Se, [
        a("button", {
          type: "button",
          class: z(["kx-focus-outline", { active: l.value.mode === "pull" }]),
          onClick: e[1] || (e[1] = (i) => l.value.mode = "pull")
        }, "Use or pull existing", 2),
        a("button", {
          type: "button",
          class: z(["kx-focus-outline", { active: l.value.mode === "build" }]),
          onClick: e[2] || (e[2] = (i) => l.value.mode = "build")
        }, "Build from Dockerfile", 2)
      ]),
      l.value.mode === "build" ? (s(), o("label", Ee, [
        e[17] || (e[17] = a("span", null, "Dockerfile", -1)),
        N(a("textarea", {
          "onUpdate:modelValue": e[3] || (e[3] = (i) => l.value.dockerfile = i),
          rows: "9",
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [T, l.value.dockerfile]
        ]),
        e[18] || (e[18] = ge('<small class="ac-hint">Include <code>sh</code>, <code>git</code>, <code>mkdir</code>, <code>dirname</code>, a <code>timeout</code> that supports <code>-k</code>, and the agent CLIs. The image user needs writable home and work directories.</small>', 1))
      ])) : b("", !0),
      U.edit ? (s(), o("p", Ne, "Saving container settings prepares the image automatically.")) : b("", !0),
      a("label", Pe, [
        e[19] || (e[19] = a("span", null, "Label", -1)),
        N(a("input", {
          "onUpdate:modelValue": e[4] || (e[4] = (i) => l.value.label = i),
          class: "kx-focus-halo",
          onInput: e[5] || (e[5] = (i) => r.value = !0)
        }, null, 544), [
          [T, l.value.label]
        ])
      ]),
      a("label", Te, [
        e[20] || (e[20] = a("span", null, "Home directory in the image", -1)),
        N(a("input", {
          "onUpdate:modelValue": e[6] || (e[6] = (i) => l.value.home = i),
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [T, l.value.home]
        ])
      ]),
      a("div", Be, [
        a("label", qe, [
          e[21] || (e[21] = a("span", null, "Memory", -1)),
          N(a("input", {
            "onUpdate:modelValue": e[7] || (e[7] = (i) => l.value.memory = i),
            class: "ac-mono kx-focus-halo",
            placeholder: m(_).default_image.settings?.memory
          }, null, 8, je), [
            [T, l.value.memory]
          ])
        ]),
        a("label", Re, [
          e[22] || (e[22] = a("span", null, "CPUs", -1)),
          N(a("input", {
            "onUpdate:modelValue": e[8] || (e[8] = (i) => l.value.cpus = i),
            class: "ac-mono kx-focus-halo",
            placeholder: m(_).default_image.settings?.cpus
          }, null, 8, Me), [
            [T, l.value.cpus]
          ])
        ]),
        a("label", Oe, [
          e[23] || (e[23] = a("span", null, "PIDs limit", -1)),
          N(a("input", {
            "onUpdate:modelValue": e[9] || (e[9] = (i) => l.value.pids_limit = i),
            type: "number",
            min: "0",
            class: "ac-mono kx-focus-halo"
          }, null, 512), [
            [
              T,
              l.value.pids_limit,
              void 0,
              { number: !0 }
            ]
          ])
        ])
      ]),
      a("div", He, [
        a("label", We, [
          e[24] || (e[24] = a("span", null, "GPUs", -1)),
          N(a("input", {
            "onUpdate:modelValue": e[10] || (e[10] = (i) => l.value.gpus = i),
            class: "ac-mono kx-focus-halo",
            placeholder: "all, or device=0"
          }, null, 512), [
            [T, l.value.gpus]
          ])
        ]),
        a("label", Ge, [
          e[25] || (e[25] = a("span", null, "Network", -1)),
          N(a("input", {
            "onUpdate:modelValue": e[11] || (e[11] = (i) => l.value.network = i),
            class: "ac-mono kx-focus-halo",
            placeholder: m(_).default_image.settings?.network
          }, null, 8, Ke), [
            [T, l.value.network]
          ])
        ])
      ]),
      U.capabilities?.length ? (s(), o("div", ze, [
        e[26] || (e[26] = a("span", null, "Agents may", -1)),
        a("div", Fe, [
          (s(!0), o(M, null, H(U.capabilities, (i) => (s(), o("label", {
            key: i,
            class: "ac-check ac-mono"
          }, [
            N(a("input", {
              "onUpdate:modelValue": e[12] || (e[12] = (E) => l.value.allows = E),
              type: "checkbox",
              class: "kx-focus-outline",
              value: i
            }, null, 8, Je), [
              [ye, l.value.allows]
            ]),
            I(" " + g(i), 1)
          ]))), 128))
        ])
      ])) : b("", !0),
      a("label", Qe, [
        e[27] || (e[27] = a("span", null, "Extra docker run arguments", -1)),
        N(a("textarea", {
          "onUpdate:modelValue": e[13] || (e[13] = (i) => l.value.extra = i),
          rows: "3",
          class: "ac-mono kx-focus-halo",
          placeholder: `One argument per line, e.g.
--device=/dev/dri
--shm-size=2g`
        }, null, 512), [
          [T, l.value.extra]
        ])
      ]),
      a("footer", Xe, [
        a("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: e[14] || (e[14] = (i) => f("cancel"))
        }, "Cancel"),
        a("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: $.value || !U.capabilities || !l.value.ref,
          onClick: w
        }, [
          C(m(L), { icon: "tabler:box" }),
          I(" " + g($.value ? "Saving…" : U.edit ? "Save settings" : l.value.mode === "build" ? "Build image" : "Add image"), 1)
        ], 8, Ye)
      ]),
      x.value ? (s(), o("p", Ze, g(x.value), 1)) : b("", !0)
    ], 8, Ae)) : (s(), o("p", Ue, g(U.edit ? "Image settings are unavailable." : "Image defaults are unavailable.") + " Ask an administrator to update the image configuration.", 1));
  }
}), aa = { class: "ac-stack" }, ta = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, sa = {
  key: 1,
  class: "kx-loading"
}, la = {
  key: 2,
  class: "kx-empty"
}, oa = { class: "kx-empty-ico" }, na = {
  key: 3,
  class: "kx-empty"
}, ia = { class: "ac-list ac-resource-list" }, ra = { class: "ac-resource-icon" }, ua = { class: "ac-account-main" }, ca = { class: "ac-row-title" }, da = {
  key: 0,
  class: "kx-tag-sm ac-tone ready"
}, va = { class: "ac-muted ac-mono" }, pa = { class: "ac-chips" }, ma = { class: "ac-muted" }, fa = {
  key: 0,
  class: "kx-err ac-small"
}, ka = { class: "ac-row-actions" }, ba = ["disabled", "onClick"], ga = ["onClick"], ya = ["onClick"], ha = ["onClick"], _a = { class: "ac-form" }, xa = { class: "ac-mono" }, wa = { class: "ac-pre ac-build-log" }, $a = /* @__PURE__ */ W({
  __name: "images",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(U, { expose: S, emit: d }) {
    const f = ee(), _ = U, V = d, l = v(!1), r = v(!1), $ = v({});
    S({ open: ae });
    const x = v([]), D = v([]), h = v(""), w = v(null), t = v(null), e = J(() => [...new Set(f.value.agents.flatMap((u) => u.capabilities))].sort()), i = v(!1);
    let E = !0, P = 0, j = 0, G = 0;
    he(() => {
      E = !1, P++, j++;
    });
    async function F(u) {
      const k = P, n = await q.image(u);
      !E || k !== P || t.value?.id !== u || (t.value = { id: u, ref: n.image.ref, text: n.build_log || "(empty)" });
    }
    const y = ne(async () => {
      try {
        const u = await ie(q.images, (k) => k.map((n) => n.id), D, () => E);
        if (!E) return;
        x.value = u, c(u, ++G), t.value && u.some((k) => k.id === t.value?.id) && await F(t.value.id), i.value = !0, h.value = "";
      } catch (u) {
        h.value = B(u, "Could not load images.");
      }
    });
    async function c(u, k) {
      try {
        const n = await $e([...new Set(u.map((A) => A.owner))]);
        if (!E || k !== G) return;
        $.value = Object.fromEntries(u.map((A) => [A.id, `Owner: ${n[A.owner] || A.owner}`]));
      } catch (n) {
        E && k === G && (h.value = B(n, "Could not load image owners."));
      }
    }
    oe(() => D.value, () => {
      y();
    }), le(y);
    async function p(u, k) {
      h.value = "";
      try {
        await u(), await y();
      } catch (n) {
        h.value = B(n, k);
      }
    }
    async function X(u) {
      const k = ++j;
      h.value = "";
      try {
        const n = await q.image(u.id);
        E && k === j && (w.value = n);
      } catch (n) {
        E && k === j && (h.value = B(n, "Could not load the image settings."));
      }
    }
    function K() {
      j++, l.value = !1, w.value = null;
    }
    function ae() {
      K(), l.value = !0;
    }
    const ue = (u) => p(() => q.prepareImage(u.id), "Could not start the image preparation.");
    function ce(u) {
      P++, t.value = { id: u.id, ref: u.ref, text: "Loading…" }, y();
    }
    function te() {
      P++, t.value = null;
    }
    async function de(u) {
      K(), await y(), u && (h.value = u);
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
      j++, w.value?.image.id === u.id && K(), t.value?.id === u.id && te(), h.value = "";
      try {
        const A = await q.deleteImage(u.id, n);
        await y(), A.docker_error && (h.value = `Image deleted. Docker cleanup failed: ${A.docker_error.message}. Docker prune covers removal of unused images.`);
      } catch (A) {
        h.value = B(A, "Could not delete the image.");
      }
    }
    const se = J(() => x.value.filter((u) => [u.label, u.ref, ...u.agents].join(" ").toLowerCase().includes(_.query.toLowerCase())));
    return R(x, (u) => V("count", u.length)), (u, k) => (s(), o("div", aa, [
      k[7] || (k[7] = a("p", { class: "ac-hint" }, "Share ready images to make them available for tasks.", -1)),
      h.value ? (s(), o("p", ta, [
        I(g(h.value) + " ", 1),
        a("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: k[0] || (k[0] = //@ts-ignore
          (...n) => m(y) && m(y)(...n))
        }, "Retry")
      ])) : b("", !0),
      !i.value && !h.value ? (s(), o("div", sa, "Loading images…")) : b("", !0),
      i.value && !x.value.length ? (s(), o("div", la, [
        a("div", oa, [
          C(m(L), { icon: "tabler:box" })
        ]),
        k[4] || (k[4] = a("div", { class: "kx-empty-title" }, "No images yet", -1)),
        k[5] || (k[5] = a("div", { class: "kx-empty-sub" }, "Start with the default agent recipe or use an existing image.", -1)),
        a("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: ae
        }, "Add image")
      ])) : i.value && !se.value.length ? (s(), o("div", na, [...k[6] || (k[6] = [
        a("div", { class: "kx-empty-title" }, "No matches", -1),
        a("div", { class: "kx-empty-sub" }, "Try another image, reference or agent.", -1)
      ])])) : b("", !0),
      a("ul", ia, [
        (s(!0), o(M, null, H(se.value, (n) => (s(), o("li", {
          key: n.id,
          class: "ac-row ac-resource"
        }, [
          a("span", ra, [
            C(m(L), { icon: "tabler:box" })
          ]),
          a("div", ua, [
            a("div", ca, [
              I(g(n.label), 1),
              a("span", {
                class: z(["kx-tag-sm ac-tone", n.status])
              }, g(n.status === "unprepared" ? "Needs preparation" : n.status.charAt(0).toUpperCase() + n.status.slice(1)), 3),
              n.usable ? (s(), o("span", da, "Usable")) : b("", !0)
            ]),
            a("div", va, g(n.ref) + " · " + g(n.home), 1),
            a("div", pa, [
              (s(!0), o(M, null, H(n.agents, (A) => (s(), o("span", {
                key: A,
                class: "kx-tag-sm ac-tone"
              }, [
                C(m(L), {
                  icon: m(we)(A, m(f).agents)
                }, null, 8, ["icon"]),
                I(g(A), 1)
              ]))), 128))
            ]),
            a("div", ma, g($.value[n.id]), 1),
            n.last_error ? (s(), o("div", fa, g(n.last_error), 1)) : b("", !0)
          ]),
          a("div", ka, [
            n.shareable ? (s(), O(re, {
              key: 0,
              id: n.id,
              title: n.label
            }, null, 8, ["id", "title"])) : b("", !0),
            n.writable ? (s(), o("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Prepare image",
              "aria-label": "Prepare image",
              disabled: n.status === "preparing",
              onClick: (A) => ue(n)
            }, [
              C(m(L), { icon: "tabler:refresh" })
            ], 8, ba)) : b("", !0),
            a("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Build log",
              "aria-label": "Build log",
              onClick: (A) => ce(n)
            }, [
              C(m(L), { icon: "tabler:file-text" })
            ], 8, ga),
            n.writable ? (s(), o("button", {
              key: 2,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Edit settings",
              "aria-label": "Edit settings",
              onClick: (A) => X(n)
            }, [
              C(m(L), { icon: "tabler:pencil" })
            ], 8, ya)) : b("", !0),
            n.deletable ? (s(), o("button", {
              key: 3,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete image",
              "aria-label": "Delete image",
              onClick: (A) => ve(n)
            }, [
              C(m(L), { icon: "tabler:trash" })
            ], 8, ha)) : b("", !0)
          ])
        ]))), 128))
      ]),
      l.value || w.value ? (s(), O(Y, {
        key: 4,
        title: w.value ? "Edit image" : "Add image",
        busy: r.value,
        wide: "",
        onClose: k[3] || (k[3] = (n) => K())
      }, {
        default: Z(() => [
          C(ea, {
            onBusy: k[1] || (k[1] = (n) => r.value = n),
            edit: w.value,
            capabilities: e.value,
            onSaved: de,
            onCancel: k[2] || (k[2] = (n) => K())
          }, null, 8, ["edit", "capabilities"])
        ]),
        _: 1
      }, 8, ["title", "busy"])) : b("", !0),
      t.value ? (s(), O(Y, {
        key: 5,
        title: "Build log",
        wide: "",
        onClose: te
      }, {
        default: Z(() => [
          a("div", _a, [
            a("strong", xa, g(t.value.ref), 1),
            a("pre", wa, g(t.value.text), 1)
          ])
        ]),
        _: 1
      })) : b("", !0)
    ]));
  }
}), Ca = { class: "ac-stack" }, Da = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ua = {
  key: 1,
  class: "kx-loading"
}, Aa = {
  key: 2,
  class: "ac-chips"
}, La = {
  key: 3,
  class: "kx-empty"
}, Ia = { class: "kx-empty-ico" }, Va = {
  key: 4,
  class: "kx-empty"
}, Sa = { class: "ac-list ac-resource-list" }, Ea = { class: "ac-resource-icon" }, Na = { class: "ac-account-main" }, Pa = { class: "ac-row-title" }, Ta = { class: "kx-tag-sm ac-tone" }, Ba = {
  key: 0,
  class: "ac-muted ac-mono"
}, qa = { class: "ac-row-actions" }, ja = ["onClick"], Ra = ["disabled"], Ma = {
  key: 0,
  class: "ac-muted"
}, Oa = {
  key: 1,
  class: "ac-field"
}, Ha = { class: "ac-chips" }, Wa = ["onClick"], Ga = { class: "ac-field" }, Ka = { class: "ac-field" }, za = ["placeholder"], Fa = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Ja = { class: "ac-dialog-foot" }, Qa = ["disabled"], Xa = ["disabled"], Ya = /* @__PURE__ */ W({
  __name: "workspaces",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(U, { expose: S, emit: d }) {
    const f = Ce(), _ = v([]), V = U, l = d, r = v(!1);
    S({ open: () => {
      r.value = !0;
    } });
    const $ = v([]), x = v([]), D = v(""), h = v(!1), w = v(""), t = v(!1), e = v(""), i = v(!1);
    function E(y) {
      return y.replace(/\/+$/, "") + "/";
    }
    R([r, x], () => {
      r.value && !e.value && x.value.length && (e.value = E(x.value[0]));
    }), R(e, (y) => {
      t.value || (w.value = y.trim().split("/").filter(Boolean).pop() ?? "");
    });
    const P = ne(async () => {
      try {
        const y = await ie(q.workspaces, (c) => c.workspaces.map((p) => p.id), _, f);
        if (!f()) return;
        $.value = y.workspaces, x.value = y.roots ?? [], i.value = !0, D.value = "";
      } catch (y) {
        f() && (D.value = B(y, "Could not load workspaces."));
      }
    }, f);
    oe(() => _.value, () => {
      P();
    }), le(P);
    async function j() {
      D.value = "", h.value = !0;
      try {
        if (await q.createWorkspace({ name: w.value, host_path: e.value }), !f()) return;
        t.value = !1, w.value = "", e.value = "", r.value = !1, await P();
      } catch (y) {
        f() && (D.value = B(y, "Could not save the workspace."));
      } finally {
        f() && (h.value = !1);
      }
    }
    async function G(y) {
      const c = await Q.confirm({
        header: "Delete workspace",
        message: `Delete workspace "${y.name}"? The host directory stays untouched.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      });
      if (!(!f() || !c)) {
        D.value = "";
        try {
          await q.deleteWorkspace(y.id), await P();
        } catch (p) {
          f() && (D.value = B(p, "Could not delete the workspace."));
        }
      }
    }
    const F = J(() => $.value.filter((y) => [y.name, y.host_path].join(" ").toLowerCase().includes(V.query.toLowerCase())));
    return R($, (y) => l("count", y.length)), (y, c) => (s(), o("div", Ca, [
      c[15] || (c[15] = a("p", { class: "ac-hint" }, "Tasks use shared workspaces with the access you grant.", -1)),
      D.value && !r.value ? (s(), o("p", Da, [
        I(g(D.value) + " ", 1),
        a("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: c[0] || (c[0] = //@ts-ignore
          (...p) => m(P) && m(P)(...p))
        }, "Retry")
      ])) : b("", !0),
      !i.value && !D.value ? (s(), o("div", Ua, "Loading workspaces…")) : b("", !0),
      x.value.length ? (s(), o("div", Aa, [
        c[7] || (c[7] = a("span", { class: "ac-muted" }, "Allowed roots", -1)),
        (s(!0), o(M, null, H(x.value, (p) => (s(), o("span", {
          key: p,
          class: "ac-hint-chip ac-mono"
        }, g(p), 1))), 128))
      ])) : b("", !0),
      i.value && !$.value.length ? (s(), o("div", La, [
        a("div", Ia, [
          C(m(L), { icon: "tabler:folder" })
        ]),
        c[8] || (c[8] = a("div", { class: "kx-empty-title" }, "No workspaces yet", -1)),
        c[9] || (c[9] = a("div", { class: "kx-empty-sub" }, "Add a host directory, or let tasks use a scratch directory.", -1)),
        a("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: c[1] || (c[1] = (p) => r.value = !0)
        }, "Add workspace")
      ])) : i.value && !F.value.length ? (s(), o("div", Va, [...c[10] || (c[10] = [
        a("div", { class: "kx-empty-title" }, "No matches", -1),
        a("div", { class: "kx-empty-sub" }, "Try another workspace name or path.", -1)
      ])])) : b("", !0),
      a("ul", Sa, [
        (s(!0), o(M, null, H(F.value, (p) => (s(), o("li", {
          key: p.id,
          class: "ac-row ac-resource"
        }, [
          a("span", Ea, [
            C(m(L), { icon: "tabler:folder" })
          ]),
          a("div", Na, [
            a("div", Pa, [
              I(g(p.name), 1),
              a("span", Ta, g(p.writable ? "read-write" : "read-only"), 1)
            ]),
            p.host_path ? (s(), o("div", Ba, g(p.host_path), 1)) : b("", !0)
          ]),
          a("div", qa, [
            p.shareable ? (s(), O(re, {
              key: 0,
              id: p.id,
              title: p.name
            }, null, 8, ["id", "title"])) : b("", !0),
            p.deletable ? (s(), o("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete workspace",
              "aria-label": "Delete workspace",
              onClick: (X) => G(p)
            }, [
              C(m(L), { icon: "tabler:trash" })
            ], 8, ja)) : b("", !0)
          ])
        ]))), 128))
      ]),
      r.value ? (s(), O(Y, {
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
            x.value.length ? (s(), o("div", Oa, [
              c[11] || (c[11] = a("span", null, "Allowed roots", -1)),
              a("div", Ha, [
                (s(!0), o(M, null, H(x.value, (p) => (s(), o("button", {
                  key: p,
                  type: "button",
                  class: "ac-chip ac-mono kx-focus-halo",
                  title: "Start from this root",
                  onClick: (X) => e.value = E(p)
                }, g(p), 9, Wa))), 128))
              ])
            ])) : (s(), o("p", Ma, "The host administrator configures allowed workspace roots.")),
            a("label", Ga, [
              c[12] || (c[12] = a("span", null, "Name", -1)),
              N(a("input", {
                "onUpdate:modelValue": c[2] || (c[2] = (p) => w.value = p),
                onInput: c[3] || (c[3] = (p) => t.value = !0),
                autofocus: "",
                class: "kx-focus-halo",
                placeholder: "e.g. Kickside checkout"
              }, null, 544), [
                [T, w.value]
              ])
            ]),
            a("label", Ka, [
              c[13] || (c[13] = a("span", null, "Host directory", -1)),
              N(a("input", {
                "onUpdate:modelValue": c[4] || (c[4] = (p) => e.value = p),
                class: "ac-mono kx-focus-halo",
                placeholder: (x.value[0] ?? "/srv/work") + "/project"
              }, null, 8, za), [
                [T, e.value]
              ]),
              c[14] || (c[14] = a("small", { class: "ac-hint" }, [
                I("An existing directory, mounted at "),
                a("code", null, "/workspace"),
                I(".")
              ], -1))
            ]),
            D.value ? (s(), o("p", Fa, g(D.value), 1)) : b("", !0),
            a("footer", Ja, [
              a("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                disabled: h.value,
                onClick: c[5] || (c[5] = (p) => r.value = !1)
              }, "Cancel", 8, Qa),
              a("button", {
                type: "button",
                class: "ac-btn primary kx-focus-halo",
                disabled: h.value || !w.value.trim() || !e.value.trim(),
                onClick: j
              }, [
                C(m(L), { icon: "tabler:folder-plus" }),
                I(g(h.value ? "Saving…" : "Add workspace"), 1)
              ], 8, Xa)
            ])
          ], 8, Ra)
        ]),
        _: 1
      }, 8, ["busy"])) : b("", !0)
    ]));
  }
}), Za = { class: "ac-card ac-narrow" }, et = { class: "ac-card-head" }, at = { class: "ac-card-title" }, tt = ["disabled"], st = {
  key: 0,
  class: "kx-err"
}, lt = {
  key: 1,
  class: "ac-pre"
}, ot = /* @__PURE__ */ W({
  __name: "maintenance",
  setup(U) {
    const S = ee(), d = v(!1), f = v(""), _ = v("");
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
          f.value = await q.prune();
        } catch (r) {
          _.value = B(r, "Cleanup failed.");
        } finally {
          d.value = !1;
        }
      }
    }
    return (l, r) => (s(), o("section", Za, [
      a("div", et, [
        a("h2", at, [
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
        ], 8, tt)
      ]),
      r[1] || (r[1] = a("p", { class: "ac-hint" }, "Prune stopped Autocode containers, dangling images and build cache across the Docker host. Tagged images stay.", -1)),
      _.value ? (s(), o("p", st, g(_.value), 1)) : b("", !0),
      f.value ? (s(), o("pre", lt, g(f.value), 1)) : b("", !0)
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
}, mt = /* @__PURE__ */ W({
  __name: "admin",
  setup(U) {
    const S = [
      { id: "images", label: "Images", icon: "tabler:box" },
      { id: "workspaces", label: "Workspaces", icon: "tabler:folder" },
      { id: "docker", label: "Docker", icon: "tabler:brand-docker" }
    ], d = v(), { catalog: f, error: _, load: V } = pe(), l = J(() => S.filter((w) => w.id === "images" ? f.value?.can_images : w.id === "workspaces" ? f.value?.can_workspaces : f.value?.can_prune));
    R(l, (w) => {
      w.some((t) => t.id === d.value) || (d.value = w[0]?.id);
    }, { immediate: !0 });
    const r = v(""), $ = v(0), x = v(null), D = v(null);
    function h() {
      d.value === "images" ? x.value?.open() : D.value?.open();
    }
    return (w, t) => (s(), o("div", nt, [
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
      a("div", it, [
        a("nav", rt, [
          (s(!0), o(M, null, H(l.value, (e) => (s(), o("button", {
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
          ], 10, ut))), 128))
        ])
      ]),
      m(_) && !m(f) ? (s(), o("p", ct, [
        I(g(m(_)) + " ", 1),
        a("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: t[1] || (t[1] = //@ts-ignore
          (...e) => m(V) && m(V)(...e))
        }, "Retry")
      ])) : m(f) ? (s(), o("main", vt, [
        d.value === "images" ? (s(), O($a, {
          key: 0,
          ref_key: "images",
          ref: x,
          query: r.value,
          onCount: t[2] || (t[2] = (e) => $.value = e)
        }, null, 8, ["query"])) : d.value === "workspaces" ? (s(), O(Ya, {
          key: 1,
          ref_key: "workspaces",
          ref: D,
          query: r.value,
          onCount: t[3] || (t[3] = (e) => $.value = e)
        }, null, 8, ["query"])) : d.value === "docker" ? (s(), O(ot, { key: 2 })) : (s(), o("p", pt, "No management areas are available."))
      ])) : (s(), o("div", dt, [
        C(m(L), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        t[4] || (t[4] = I(" Loading…", -1))
      ]))
    ]));
  }
}), ft = { type: "object", properties: {} };
class kt extends be {
  static get wippyConfig() {
    return { propsSchema: ft, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"], inlineCss: fe };
  }
  static get vueConfig() {
    return { rootComponent: mt, plugins: [ke] };
  }
}
xe(import.meta.url, kt);
