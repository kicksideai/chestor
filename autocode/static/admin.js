import { u as ee, _ as Y, a as pe, b as me, s as ke, P as fe } from "./styles-K-SJETe9.js";
import { u as le, W as be } from "./dto-CcYNmUR0.js";
import { defineComponent as W, ref as p, watch as R, openBlock as s, createElementBlock as o, Fragment as M, createElementVNode as a, createVNode as D, unref as m, createCommentVNode as g, toDisplayString as y, createTextVNode as I, withDirectives as N, vModelText as B, normalizeClass as z, createStaticVNode as ge, renderList as H, vModelCheckbox as ye, computed as J, onUnmounted as he, createBlock as O, withCtx as Z, nextTick as oe } from "vue";
import { Icon as L } from "@iconify/vue";
import { loadByTagName as _e, host as Q, define as we } from "@wippy-fe/proxy";
import { e as q, a as P, u as ne, b as xe, s as ie, p as $e, c as Ce } from "./presentation-BDm-VNGA.js";
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
    const S = U, d = p(!1), k = p(null), _ = p("");
    function V() {
      d.value = !1;
    }
    return R(k, async (l) => {
      if (l) {
        _.value = "";
        try {
          if (customElements.get("kickside-share") || await _e("kickside-share", { timeoutMs: 8e3 }), k.value !== l) return;
          const c = document.createElement("kickside-share");
          c.setAttribute("config", JSON.stringify({
            resource_id: S.id,
            title: S.title,
            access_url: `/api/v1/component-access/grants/${encodeURIComponent(S.id)}`,
            share_url: `/api/v1/component-access/share/${encodeURIComponent(S.id)}`
          })), c.style.display = "block", c.addEventListener("close", V), l.appendChild(c);
        } catch (c) {
          _.value = q(c, "Could not open sharing.");
        }
      }
    }), (l, c) => (s(), o(M, null, [
      a("button", {
        type: "button",
        class: "ac-icon-btn kx-focus-outline",
        title: "Share",
        "aria-label": "Share",
        onClick: c[0] || (c[0] = ($) => d.value = !0)
      }, [
        D(m(L), { icon: "tabler:share" })
      ]),
      d.value ? (s(), o("div", {
        key: 0,
        ref_key: "shareHost",
        ref: k
      }, null, 512)) : g("", !0),
      _.value ? (s(), o("span", De, y(_.value), 1)) : g("", !0)
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
    const d = U, k = S, _ = ee();
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
    const l = p(V()), c = p(!1);
    R(() => l.value?.ref, (t) => {
      l.value && !d.edit && !c.value && t !== void 0 && (l.value.label = t);
    });
    const $ = p(!1), w = p("");
    R(() => d.edit, (t) => {
      if (w.value = "", c.value = !!t, !t) {
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
    function C() {
      const t = _.value.default_image;
      c.value = !0;
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
    async function x() {
      if (!(!l.value || $.value)) {
        w.value = "", $.value = !0, k("busy", !0);
        try {
          let t;
          if (d.edit) {
            const e = await P.updateImage(d.edit.image.id, { ...h(), ref: l.value.ref, dockerfile: l.value.mode === "build" ? l.value.dockerfile : "" });
            e.build_error && (t = `Settings saved. Build preparation has not started: ${e.build_error.message}. Use Prepare image to retry.`);
          } else {
            const e = l.value, u = await P.createImage({ ...h(), ref: e.ref, dockerfile: e.mode === "build" ? e.dockerfile : "" });
            u.build_error && (t = `Image created. Build preparation has not started: ${u.build_error.message}. Use Prepare image to retry.`), l.value = V();
          }
          k("saved", t);
        } catch (t) {
          w.value = q(t, "Could not save the image.");
        } finally {
          $.value = !1, k("busy", !1);
        }
      }
    }
    return (t, e) => l.value ? (s(), o("fieldset", {
      key: 1,
      class: "ac-form",
      disabled: $.value
    }, [
      a("div", Le, [
        a("span", Ie, y(U.edit ? "Container settings" : "Use an image reference or the default agent recipe."), 1),
        U.edit ? g("", !0) : (s(), o("button", {
          key: 0,
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: C
        }, [
          D(m(L), { icon: "tabler:sparkles" }),
          e[15] || (e[15] = I(" Default agent image", -1))
        ]))
      ]),
      a("label", Ve, [
        e[16] || (e[16] = a("span", null, "Image reference", -1)),
        N(a("input", {
          "onUpdate:modelValue": e[0] || (e[0] = (u) => l.value.ref = u),
          class: "ac-mono kx-focus-halo",
          placeholder: "registry/name:tag"
        }, null, 512), [
          [B, l.value.ref]
        ])
      ]),
      a("div", Se, [
        a("button", {
          type: "button",
          class: z(["kx-focus-outline", { active: l.value.mode === "pull" }]),
          onClick: e[1] || (e[1] = (u) => l.value.mode = "pull")
        }, "Use or pull existing", 2),
        a("button", {
          type: "button",
          class: z(["kx-focus-outline", { active: l.value.mode === "build" }]),
          onClick: e[2] || (e[2] = (u) => l.value.mode = "build")
        }, "Build from Dockerfile", 2)
      ]),
      l.value.mode === "build" ? (s(), o("label", Ee, [
        e[17] || (e[17] = a("span", null, "Dockerfile", -1)),
        N(a("textarea", {
          "onUpdate:modelValue": e[3] || (e[3] = (u) => l.value.dockerfile = u),
          rows: "9",
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [B, l.value.dockerfile]
        ]),
        e[18] || (e[18] = ge('<small class="ac-hint">Include <code>sh</code>, <code>git</code>, <code>mkdir</code>, <code>dirname</code>, a <code>timeout</code> that supports <code>-k</code>, and the agent CLIs. The image user needs writable home and work directories.</small>', 1))
      ])) : g("", !0),
      U.edit ? (s(), o("p", Ne, "Saving container settings prepares the image automatically.")) : g("", !0),
      a("label", Pe, [
        e[19] || (e[19] = a("span", null, "Label", -1)),
        N(a("input", {
          "onUpdate:modelValue": e[4] || (e[4] = (u) => l.value.label = u),
          class: "kx-focus-halo",
          onInput: e[5] || (e[5] = (u) => c.value = !0)
        }, null, 544), [
          [B, l.value.label]
        ])
      ]),
      a("label", Te, [
        e[20] || (e[20] = a("span", null, "Home directory in the image", -1)),
        N(a("input", {
          "onUpdate:modelValue": e[6] || (e[6] = (u) => l.value.home = u),
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [B, l.value.home]
        ])
      ]),
      a("div", Be, [
        a("label", qe, [
          e[21] || (e[21] = a("span", null, "Memory", -1)),
          N(a("input", {
            "onUpdate:modelValue": e[7] || (e[7] = (u) => l.value.memory = u),
            class: "ac-mono kx-focus-halo",
            placeholder: m(_).default_image.settings?.memory
          }, null, 8, je), [
            [B, l.value.memory]
          ])
        ]),
        a("label", Re, [
          e[22] || (e[22] = a("span", null, "CPUs", -1)),
          N(a("input", {
            "onUpdate:modelValue": e[8] || (e[8] = (u) => l.value.cpus = u),
            class: "ac-mono kx-focus-halo",
            placeholder: m(_).default_image.settings?.cpus
          }, null, 8, Me), [
            [B, l.value.cpus]
          ])
        ]),
        a("label", Oe, [
          e[23] || (e[23] = a("span", null, "PIDs limit", -1)),
          N(a("input", {
            "onUpdate:modelValue": e[9] || (e[9] = (u) => l.value.pids_limit = u),
            type: "number",
            min: "0",
            class: "ac-mono kx-focus-halo"
          }, null, 512), [
            [
              B,
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
            "onUpdate:modelValue": e[10] || (e[10] = (u) => l.value.gpus = u),
            class: "ac-mono kx-focus-halo",
            placeholder: "all, or device=0"
          }, null, 512), [
            [B, l.value.gpus]
          ])
        ]),
        a("label", Ge, [
          e[25] || (e[25] = a("span", null, "Network", -1)),
          N(a("input", {
            "onUpdate:modelValue": e[11] || (e[11] = (u) => l.value.network = u),
            class: "ac-mono kx-focus-halo",
            placeholder: m(_).default_image.settings?.network
          }, null, 8, Ke), [
            [B, l.value.network]
          ])
        ])
      ]),
      U.capabilities?.length ? (s(), o("div", ze, [
        e[26] || (e[26] = a("span", null, "Agents may", -1)),
        a("div", Fe, [
          (s(!0), o(M, null, H(U.capabilities, (u) => (s(), o("label", {
            key: u,
            class: "ac-check ac-mono"
          }, [
            N(a("input", {
              "onUpdate:modelValue": e[12] || (e[12] = (E) => l.value.allows = E),
              type: "checkbox",
              class: "kx-focus-outline",
              value: u
            }, null, 8, Je), [
              [ye, l.value.allows]
            ]),
            I(" " + y(u), 1)
          ]))), 128))
        ])
      ])) : g("", !0),
      a("label", Qe, [
        e[27] || (e[27] = a("span", null, "Extra docker run arguments", -1)),
        N(a("textarea", {
          "onUpdate:modelValue": e[13] || (e[13] = (u) => l.value.extra = u),
          rows: "3",
          class: "ac-mono kx-focus-halo",
          placeholder: `One argument per line, e.g.
--device=/dev/dri
--shm-size=2g`
        }, null, 512), [
          [B, l.value.extra]
        ])
      ]),
      a("footer", Xe, [
        a("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: e[14] || (e[14] = (u) => k("cancel"))
        }, "Cancel"),
        a("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: $.value || !U.capabilities || !l.value.ref,
          onClick: x
        }, [
          D(m(L), { icon: "tabler:box" }),
          I(" " + y($.value ? "Saving…" : U.edit ? "Save settings" : l.value.mode === "build" ? "Build image" : "Add image"), 1)
        ], 8, Ye)
      ]),
      w.value ? (s(), o("p", Ze, y(w.value), 1)) : g("", !0)
    ], 8, Ae)) : (s(), o("p", Ue, y(U.edit ? "Image settings are unavailable." : "Image defaults are unavailable.") + " Ask an administrator to update the image configuration.", 1));
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
}, va = { class: "ac-muted ac-mono" }, pa = { class: "ac-chips" }, ma = { class: "ac-muted" }, ka = {
  key: 0,
  class: "kx-err ac-small"
}, fa = { class: "ac-row-actions" }, ba = ["disabled", "onClick"], ga = ["onClick"], ya = ["onClick"], ha = ["onClick"], _a = { class: "ac-form" }, wa = { class: "ac-mono" }, xa = { class: "ac-pre ac-build-log" }, $a = /* @__PURE__ */ W({
  __name: "images",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(U, { expose: S, emit: d }) {
    const k = ee(), _ = U, V = d, l = p(!1), c = p(!1), $ = p({});
    S({ open: ae });
    const w = p([]), C = p([]), h = p(""), x = p(null), t = p(null), e = J(() => [...new Set(k.value.agents.flatMap((i) => i.capabilities))].sort()), u = p(!1);
    let E = !0, T = 0, j = 0, G = 0;
    he(() => {
      E = !1, T++, j++;
    });
    async function F(i) {
      const v = T, n = await P.image(i);
      !E || v !== T || t.value?.id !== i || (t.value = { id: i, ref: n.image.ref, text: n.build_log || "(empty)" });
    }
    const f = ie(async () => {
      try {
        let i = await P.images();
        for (; E && i.some((v) => !C.value.includes(v.id)); )
          C.value = i.map((v) => v.id), await oe(), i = await P.images();
        if (!E) return;
        C.value = i.map((v) => v.id), w.value = i, r(i, ++G), t.value && i.some((v) => v.id === t.value?.id) && await F(t.value.id), u.value = !0, h.value = "";
      } catch (i) {
        h.value = q(i, "Could not load images.");
      }
    });
    async function r(i, v) {
      try {
        const n = await $e([...new Set(i.map((A) => A.owner))]);
        if (!E || v !== G) return;
        $.value = Object.fromEntries(i.map((A) => [A.id, `Owner: ${n[A.owner] || A.owner}`]));
      } catch (n) {
        E && v === G && (h.value = q(n, "Could not load image owners."));
      }
    }
    ne(() => C.value, () => {
      f();
    }), le(f);
    async function b(i, v) {
      h.value = "";
      try {
        await i(), await f();
      } catch (n) {
        h.value = q(n, v);
      }
    }
    async function X(i) {
      const v = ++j;
      h.value = "";
      try {
        const n = await P.image(i.id);
        E && v === j && (x.value = n);
      } catch (n) {
        E && v === j && (h.value = q(n, "Could not load the image settings."));
      }
    }
    function K() {
      j++, l.value = !1, x.value = null;
    }
    function ae() {
      K(), l.value = !0;
    }
    const ue = (i) => b(() => P.prepareImage(i.id), "Could not start the image preparation.");
    function ce(i) {
      T++, t.value = { id: i.id, ref: i.ref, text: "Loading…" }, f();
    }
    function te() {
      T++, t.value = null;
    }
    async function de(i) {
      K(), await f(), i && (h.value = i);
    }
    async function ve(i) {
      if (!await Q.confirm({
        header: "Delete image",
        message: `Delete image "${i.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) return;
      const n = await Q.confirm({
        header: "Docker image",
        message: `Also remove ${i.ref} from Docker on the host? Keeping it lets a later image with the same reference reuse it.`,
        icon: "tabler:brand-docker",
        acceptLabel: "Remove from Docker",
        rejectLabel: "Keep in Docker",
        acceptClass: "p-button-danger"
      });
      j++, x.value?.image.id === i.id && K(), t.value?.id === i.id && te(), h.value = "";
      try {
        const A = await P.deleteImage(i.id, n);
        await f(), A.docker_error && (h.value = `Image deleted. Docker cleanup failed: ${A.docker_error.message}. Docker prune covers removal of unused images.`);
      } catch (A) {
        h.value = q(A, "Could not delete the image.");
      }
    }
    const se = J(() => w.value.filter((i) => [i.label, i.ref, ...i.agents].join(" ").toLowerCase().includes(_.query.toLowerCase())));
    return R(w, (i) => V("count", i.length)), (i, v) => (s(), o("div", aa, [
      v[7] || (v[7] = a("p", { class: "ac-hint" }, "Share ready images to make them available for tasks.", -1)),
      h.value ? (s(), o("p", ta, [
        I(y(h.value) + " ", 1),
        a("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: v[0] || (v[0] = //@ts-ignore
          (...n) => m(f) && m(f)(...n))
        }, "Retry")
      ])) : g("", !0),
      !u.value && !h.value ? (s(), o("div", sa, "Loading images…")) : g("", !0),
      u.value && !w.value.length ? (s(), o("div", la, [
        a("div", oa, [
          D(m(L), { icon: "tabler:box" })
        ]),
        v[4] || (v[4] = a("div", { class: "kx-empty-title" }, "No images yet", -1)),
        v[5] || (v[5] = a("div", { class: "kx-empty-sub" }, "Start with the default agent recipe or use an existing image.", -1)),
        a("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: ae
        }, "Add image")
      ])) : u.value && !se.value.length ? (s(), o("div", na, [...v[6] || (v[6] = [
        a("div", { class: "kx-empty-title" }, "No matches", -1),
        a("div", { class: "kx-empty-sub" }, "Try another image, reference or agent.", -1)
      ])])) : g("", !0),
      a("ul", ia, [
        (s(!0), o(M, null, H(se.value, (n) => (s(), o("li", {
          key: n.id,
          class: "ac-row ac-resource"
        }, [
          a("span", ra, [
            D(m(L), { icon: "tabler:box" })
          ]),
          a("div", ua, [
            a("div", ca, [
              I(y(n.label), 1),
              a("span", {
                class: z(["kx-tag-sm ac-tone", n.status])
              }, y(n.status === "unprepared" ? "Needs preparation" : n.status.charAt(0).toUpperCase() + n.status.slice(1)), 3),
              n.usable ? (s(), o("span", da, "Usable")) : g("", !0)
            ]),
            a("div", va, y(n.ref) + " · " + y(n.home), 1),
            a("div", pa, [
              (s(!0), o(M, null, H(n.agents, (A) => (s(), o("span", {
                key: A,
                class: "kx-tag-sm ac-tone"
              }, [
                D(m(L), {
                  icon: m(xe)(A, m(k).agents)
                }, null, 8, ["icon"]),
                I(y(A), 1)
              ]))), 128))
            ]),
            a("div", ma, y($.value[n.id]), 1),
            n.last_error ? (s(), o("div", ka, y(n.last_error), 1)) : g("", !0)
          ]),
          a("div", fa, [
            n.shareable ? (s(), O(re, {
              key: 0,
              id: n.id,
              title: n.label
            }, null, 8, ["id", "title"])) : g("", !0),
            n.writable ? (s(), o("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Prepare image",
              "aria-label": "Prepare image",
              disabled: n.status === "preparing",
              onClick: (A) => ue(n)
            }, [
              D(m(L), { icon: "tabler:refresh" })
            ], 8, ba)) : g("", !0),
            a("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Build log",
              "aria-label": "Build log",
              onClick: (A) => ce(n)
            }, [
              D(m(L), { icon: "tabler:file-text" })
            ], 8, ga),
            n.writable ? (s(), o("button", {
              key: 2,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Edit settings",
              "aria-label": "Edit settings",
              onClick: (A) => X(n)
            }, [
              D(m(L), { icon: "tabler:pencil" })
            ], 8, ya)) : g("", !0),
            n.deletable ? (s(), o("button", {
              key: 3,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete image",
              "aria-label": "Delete image",
              onClick: (A) => ve(n)
            }, [
              D(m(L), { icon: "tabler:trash" })
            ], 8, ha)) : g("", !0)
          ])
        ]))), 128))
      ]),
      l.value || x.value ? (s(), O(Y, {
        key: 4,
        title: x.value ? "Edit image" : "Add image",
        busy: c.value,
        wide: "",
        onClose: v[3] || (v[3] = (n) => K())
      }, {
        default: Z(() => [
          D(ea, {
            onBusy: v[1] || (v[1] = (n) => c.value = n),
            edit: x.value,
            capabilities: e.value,
            onSaved: de,
            onCancel: v[2] || (v[2] = (n) => K())
          }, null, 8, ["edit", "capabilities"])
        ]),
        _: 1
      }, 8, ["title", "busy"])) : g("", !0),
      t.value ? (s(), O(Y, {
        key: 5,
        title: "Build log",
        wide: "",
        onClose: te
      }, {
        default: Z(() => [
          a("div", _a, [
            a("strong", wa, y(t.value.ref), 1),
            a("pre", xa, y(t.value.text), 1)
          ])
        ]),
        _: 1
      })) : g("", !0)
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
    const k = Ce(), _ = p([]), V = U, l = d, c = p(!1);
    S({ open: () => {
      c.value = !0;
    } });
    const $ = p([]), w = p([]), C = p(""), h = p(!1), x = p(""), t = p(!1), e = p(""), u = p(!1);
    function E(f) {
      return f.replace(/\/+$/, "") + "/";
    }
    R([c, w], () => {
      c.value && !e.value && w.value.length && (e.value = E(w.value[0]));
    }), R(e, (f) => {
      t.value || (x.value = f.trim().split("/").filter(Boolean).pop() ?? "");
    });
    const T = ie(async () => {
      try {
        let f = await P.workspaces();
        for (; k() && f.workspaces.some((r) => !_.value.includes(r.id)); ) {
          if (_.value = f.workspaces.map((r) => r.id), await oe(), !k()) return;
          f = await P.workspaces();
        }
        if (!k()) return;
        _.value = f.workspaces.map((r) => r.id), $.value = f.workspaces, w.value = f.roots ?? [], u.value = !0, C.value = "";
      } catch (f) {
        k() && (C.value = q(f, "Could not load workspaces."));
      }
    }, k);
    ne(() => _.value, () => {
      T();
    }), le(T);
    async function j() {
      C.value = "", h.value = !0;
      try {
        if (await P.createWorkspace({ name: x.value, host_path: e.value }), !k()) return;
        t.value = !1, x.value = "", e.value = "", c.value = !1, await T();
      } catch (f) {
        k() && (C.value = q(f, "Could not save the workspace."));
      } finally {
        k() && (h.value = !1);
      }
    }
    async function G(f) {
      const r = await Q.confirm({
        header: "Delete workspace",
        message: `Delete workspace "${f.name}"? The host directory stays untouched.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      });
      if (!(!k() || !r)) {
        C.value = "";
        try {
          await P.deleteWorkspace(f.id), await T();
        } catch (b) {
          k() && (C.value = q(b, "Could not delete the workspace."));
        }
      }
    }
    const F = J(() => $.value.filter((f) => [f.name, f.host_path].join(" ").toLowerCase().includes(V.query.toLowerCase())));
    return R($, (f) => l("count", f.length)), (f, r) => (s(), o("div", Ca, [
      r[15] || (r[15] = a("p", { class: "ac-hint" }, "Tasks use shared workspaces with the access you grant.", -1)),
      C.value && !c.value ? (s(), o("p", Da, [
        I(y(C.value) + " ", 1),
        a("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: r[0] || (r[0] = //@ts-ignore
          (...b) => m(T) && m(T)(...b))
        }, "Retry")
      ])) : g("", !0),
      !u.value && !C.value ? (s(), o("div", Ua, "Loading workspaces…")) : g("", !0),
      w.value.length ? (s(), o("div", Aa, [
        r[7] || (r[7] = a("span", { class: "ac-muted" }, "Allowed roots", -1)),
        (s(!0), o(M, null, H(w.value, (b) => (s(), o("span", {
          key: b,
          class: "ac-hint-chip ac-mono"
        }, y(b), 1))), 128))
      ])) : g("", !0),
      u.value && !$.value.length ? (s(), o("div", La, [
        a("div", Ia, [
          D(m(L), { icon: "tabler:folder" })
        ]),
        r[8] || (r[8] = a("div", { class: "kx-empty-title" }, "No workspaces yet", -1)),
        r[9] || (r[9] = a("div", { class: "kx-empty-sub" }, "Add a host directory, or let tasks use a scratch directory.", -1)),
        a("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: r[1] || (r[1] = (b) => c.value = !0)
        }, "Add workspace")
      ])) : u.value && !F.value.length ? (s(), o("div", Va, [...r[10] || (r[10] = [
        a("div", { class: "kx-empty-title" }, "No matches", -1),
        a("div", { class: "kx-empty-sub" }, "Try another workspace name or path.", -1)
      ])])) : g("", !0),
      a("ul", Sa, [
        (s(!0), o(M, null, H(F.value, (b) => (s(), o("li", {
          key: b.id,
          class: "ac-row ac-resource"
        }, [
          a("span", Ea, [
            D(m(L), { icon: "tabler:folder" })
          ]),
          a("div", Na, [
            a("div", Pa, [
              I(y(b.name), 1),
              a("span", Ta, y(b.writable ? "read-write" : "read-only"), 1)
            ]),
            b.host_path ? (s(), o("div", Ba, y(b.host_path), 1)) : g("", !0)
          ]),
          a("div", qa, [
            b.shareable ? (s(), O(re, {
              key: 0,
              id: b.id,
              title: b.name
            }, null, 8, ["id", "title"])) : g("", !0),
            b.deletable ? (s(), o("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete workspace",
              "aria-label": "Delete workspace",
              onClick: (X) => G(b)
            }, [
              D(m(L), { icon: "tabler:trash" })
            ], 8, ja)) : g("", !0)
          ])
        ]))), 128))
      ]),
      c.value ? (s(), O(Y, {
        key: 5,
        title: "Add workspace",
        busy: h.value,
        onClose: r[6] || (r[6] = (b) => c.value = !1)
      }, {
        default: Z(() => [
          a("fieldset", {
            class: "ac-form",
            disabled: h.value
          }, [
            w.value.length ? (s(), o("div", Oa, [
              r[11] || (r[11] = a("span", null, "Allowed roots", -1)),
              a("div", Ha, [
                (s(!0), o(M, null, H(w.value, (b) => (s(), o("button", {
                  key: b,
                  type: "button",
                  class: "ac-chip ac-mono kx-focus-halo",
                  title: "Start from this root",
                  onClick: (X) => e.value = E(b)
                }, y(b), 9, Wa))), 128))
              ])
            ])) : (s(), o("p", Ma, "The host administrator configures allowed workspace roots.")),
            a("label", Ga, [
              r[12] || (r[12] = a("span", null, "Name", -1)),
              N(a("input", {
                "onUpdate:modelValue": r[2] || (r[2] = (b) => x.value = b),
                onInput: r[3] || (r[3] = (b) => t.value = !0),
                autofocus: "",
                class: "kx-focus-halo",
                placeholder: "e.g. Kickside checkout"
              }, null, 544), [
                [B, x.value]
              ])
            ]),
            a("label", Ka, [
              r[13] || (r[13] = a("span", null, "Host directory", -1)),
              N(a("input", {
                "onUpdate:modelValue": r[4] || (r[4] = (b) => e.value = b),
                class: "ac-mono kx-focus-halo",
                placeholder: (w.value[0] ?? "/srv/work") + "/project"
              }, null, 8, za), [
                [B, e.value]
              ]),
              r[14] || (r[14] = a("small", { class: "ac-hint" }, [
                I("An existing directory, mounted at "),
                a("code", null, "/workspace"),
                I(".")
              ], -1))
            ]),
            C.value ? (s(), o("p", Fa, y(C.value), 1)) : g("", !0),
            a("footer", Ja, [
              a("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                disabled: h.value,
                onClick: r[5] || (r[5] = (b) => c.value = !1)
              }, "Cancel", 8, Qa),
              a("button", {
                type: "button",
                class: "ac-btn primary kx-focus-halo",
                disabled: h.value || !x.value.trim() || !e.value.trim(),
                onClick: j
              }, [
                D(m(L), { icon: "tabler:folder-plus" }),
                I(y(h.value ? "Saving…" : "Add workspace"), 1)
              ], 8, Xa)
            ])
          ], 8, Ra)
        ]),
        _: 1
      }, 8, ["busy"])) : g("", !0)
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
    const S = ee(), d = p(!1), k = p(""), _ = p("");
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
          k.value = await P.prune();
        } catch (c) {
          _.value = q(c, "Cleanup failed.");
        } finally {
          d.value = !1;
        }
      }
    }
    return (l, c) => (s(), o("section", Za, [
      a("div", et, [
        a("h2", at, [
          D(m(L), { icon: "tabler:brand-docker" }),
          c[0] || (c[0] = I("Docker cleanup", -1))
        ]),
        a("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          disabled: d.value,
          onClick: V
        }, [
          D(m(L), {
            icon: d.value ? "tabler:loader-2" : "tabler:trash-x",
            class: z({ spin: d.value })
          }, null, 8, ["icon", "class"]),
          I(" " + y(d.value ? "Cleaning…" : "Clean up Docker"), 1)
        ], 8, tt)
      ]),
      c[1] || (c[1] = a("p", { class: "ac-hint" }, "Prune stopped Autocode containers, dangling images and build cache across the Docker host. Tagged images stay.", -1)),
      _.value ? (s(), o("p", st, y(_.value), 1)) : g("", !0),
      k.value ? (s(), o("pre", lt, y(k.value), 1)) : g("", !0)
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
    ], d = p(), { catalog: k, error: _, load: V } = pe(), l = J(() => S.filter((x) => x.id === "images" ? k.value?.can_images : x.id === "workspaces" ? k.value?.can_workspaces : k.value?.can_prune));
    R(l, (x) => {
      x.some((t) => t.id === d.value) || (d.value = x[0]?.id);
    }, { immediate: !0 });
    const c = p(""), $ = p(0), w = p(null), C = p(null);
    function h() {
      d.value === "images" ? w.value?.open() : C.value?.open();
    }
    return (x, t) => (s(), o("div", nt, [
      D(me, {
        title: "Autocode",
        subtitle: "Manage agent images, workspaces and Docker.",
        count: d.value && d.value !== "docker" ? `${$.value} ${$.value === 1 ? d.value.slice(0, -1) : d.value}` : void 0,
        action: d.value === "images" ? "Add image" : d.value === "workspaces" ? "Add workspace" : void 0,
        query: c.value,
        "onUpdate:query": t[0] || (t[0] = (e) => c.value = e),
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
            onClick: (u) => {
              d.value !== e.id && (d.value = e.id, c.value = "", $.value = 0);
            }
          }, [
            D(m(L), {
              icon: e.icon
            }, null, 8, ["icon"]),
            I(" " + y(e.label), 1)
          ], 10, ut))), 128))
        ])
      ]),
      m(_) && !m(k) ? (s(), o("p", ct, [
        I(y(m(_)) + " ", 1),
        a("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: t[1] || (t[1] = //@ts-ignore
          (...e) => m(V) && m(V)(...e))
        }, "Retry")
      ])) : m(k) ? (s(), o("main", vt, [
        d.value === "images" ? (s(), O($a, {
          key: 0,
          ref_key: "images",
          ref: w,
          query: c.value,
          onCount: t[2] || (t[2] = (e) => $.value = e)
        }, null, 8, ["query"])) : d.value === "workspaces" ? (s(), O(Ya, {
          key: 1,
          ref_key: "workspaces",
          ref: C,
          query: c.value,
          onCount: t[3] || (t[3] = (e) => $.value = e)
        }, null, 8, ["query"])) : d.value === "docker" ? (s(), O(ot, { key: 2 })) : (s(), o("p", pt, "No management areas are available."))
      ])) : (s(), o("div", dt, [
        D(m(L), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        t[4] || (t[4] = I(" Loading…", -1))
      ]))
    ]));
  }
}), kt = { type: "object", properties: {} };
class ft extends be {
  static get wippyConfig() {
    return { propsSchema: kt, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"], inlineCss: ke };
  }
  static get vueConfig() {
    return { rootComponent: mt, plugins: [fe] };
  }
}
we(import.meta.url, ft);
