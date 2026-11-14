import { u as ee, _ as Y, a as pe, b as me, s as ke, P as fe } from "./styles-C4tJ2C9e.js";
import { u as le, W as be } from "./dto-BNKl23sa.js";
import { defineComponent as G, ref as v, watch as O, openBlock as a, createElementBlock as o, Fragment as j, createElementVNode as e, createVNode as D, unref as p, createCommentVNode as m, toDisplayString as f, createTextVNode as I, withDirectives as P, vModelText as T, normalizeClass as z, createStaticVNode as ge, renderList as M, vModelCheckbox as ye, computed as J, onUnmounted as he, createBlock as H, withCtx as Z, vShow as _e } from "vue";
import { Icon as V } from "@iconify/vue";
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
  setup(U) {
    const E = U, u = v(!1), g = v(null), x = v("");
    function S() {
      u.value = !1;
    }
    return O(g, async (s) => {
      if (s) {
        x.value = "";
        try {
          if (customElements.get("kickside-share") || await we("kickside-share", { timeoutMs: 8e3 }), g.value !== s) return;
          const r = document.createElement("kickside-share");
          r.setAttribute("config", JSON.stringify({
            resource_id: E.id,
            title: E.title,
            access_url: `/api/v1/component-access/grants/${encodeURIComponent(E.id)}`,
            share_url: `/api/v1/component-access/share/${encodeURIComponent(E.id)}`
          })), r.style.display = "block", r.addEventListener("close", S), s.appendChild(r);
        } catch (r) {
          x.value = B(r, "Could not open sharing.");
        }
      }
    }), (s, r) => (a(), o(j, null, [
      e("button", {
        type: "button",
        class: "ac-icon-btn kx-focus-outline",
        title: "Share",
        "aria-label": "Share",
        onClick: r[0] || (r[0] = (A) => u.value = !0)
      }, [
        D(p(V), { icon: "tabler:share" })
      ]),
      u.value ? (a(), o("div", {
        key: 0,
        ref_key: "shareHost",
        ref: g
      }, null, 512)) : m("", !0),
      x.value ? (a(), o("span", Ue, f(x.value), 1)) : m("", !0)
    ], 64));
  }
}), Ae = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Le = ["disabled"], Ve = { class: "ac-card-head" }, Ie = { class: "ac-muted" }, Se = { class: "ac-field" }, Ne = { class: "ac-seg" }, Ee = {
  key: 0,
  class: "ac-field"
}, Pe = {
  key: 1,
  class: "ac-muted"
}, Te = { class: "ac-field" }, Be = { class: "ac-field" }, qe = { class: "ac-row-fields" }, Re = { class: "ac-field" }, je = ["placeholder"], Me = { class: "ac-field" }, Oe = ["placeholder"], He = { class: "ac-field" }, We = { class: "ac-row-fields" }, Ge = { class: "ac-field" }, Ke = { class: "ac-field" }, Fe = ["placeholder"], ze = {
  key: 2,
  class: "ac-field"
}, Je = { class: "ac-checks" }, Qe = ["value"], Xe = { class: "ac-field" }, Ye = { class: "ac-dialog-foot" }, Ze = ["disabled"], et = {
  key: 3,
  class: "kx-err"
}, tt = /* @__PURE__ */ G({
  __name: "image-form",
  props: {
    edit: {},
    capabilities: {}
  },
  emits: ["saved", "cancel", "busy"],
  setup(U, { emit: E }) {
    const u = U, g = E, x = ee();
    function S(l = x.value.default_image.settings) {
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
    const s = v(S()), r = v(!1);
    O(() => s.value?.ref, (l) => {
      s.value && !u.edit && !r.value && l !== void 0 && (s.value.label = l);
    });
    const A = v(!1), $ = v("");
    O(() => u.edit, (l) => {
      if ($.value = "", r.value = !!l, !l) {
        s.value = S();
        return;
      }
      if (!l.settings) {
        s.value = null;
        return;
      }
      const t = l.settings;
      s.value = {
        ...t,
        ref: l.image.ref,
        label: l.image.label,
        home: l.image.home,
        mode: l.dockerfile ? "build" : "pull",
        dockerfile: l.dockerfile ?? "",
        extra: t.extra_args.join(`
`),
        allows: [...t.allows]
      };
    }, { immediate: !0 });
    function C() {
      const l = x.value.default_image;
      r.value = !0;
      const t = S();
      s.value = t ? { ...t, ref: l.ref, label: l.label, home: l.home, mode: "build", dockerfile: l.dockerfile } : null;
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
`).map((t) => t.trim()).filter(Boolean),
        allows: [...l.allows]
      };
    }
    async function L() {
      if (!(!s.value || A.value)) {
        $.value = "", A.value = !0, g("busy", !0);
        try {
          let l;
          if (u.edit) {
            const t = await q.updateImage(u.edit.image.id, { ...w(), ref: s.value.ref, dockerfile: s.value.mode === "build" ? s.value.dockerfile : "" });
            t.build_error && (l = `Settings saved. Build preparation has not started: ${t.build_error.message}. Use Prepare image to retry.`);
          } else {
            const t = s.value, n = await q.createImage({ ...w(), ref: t.ref, dockerfile: t.mode === "build" ? t.dockerfile : "" });
            n.build_error && (l = `Image created. Build preparation has not started: ${n.build_error.message}. Use Prepare image to retry.`), s.value = S();
          }
          g("saved", l);
        } catch (l) {
          $.value = B(l, "Could not save the image.");
        } finally {
          A.value = !1, g("busy", !1);
        }
      }
    }
    return (l, t) => s.value ? (a(), o("fieldset", {
      key: 1,
      class: "ac-form",
      disabled: A.value
    }, [
      e("div", Ve, [
        e("span", Ie, f(U.edit ? "Container settings" : "Use an image reference or the default agent recipe."), 1),
        U.edit ? m("", !0) : (a(), o("button", {
          key: 0,
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: C
        }, [
          D(p(V), { icon: "tabler:sparkles" }),
          t[15] || (t[15] = I(" Default agent image", -1))
        ]))
      ]),
      e("label", Se, [
        t[16] || (t[16] = e("span", null, "Image reference", -1)),
        P(e("input", {
          "onUpdate:modelValue": t[0] || (t[0] = (n) => s.value.ref = n),
          class: "ac-mono kx-focus-halo",
          placeholder: "registry/name:tag"
        }, null, 512), [
          [T, s.value.ref]
        ])
      ]),
      e("div", Ne, [
        e("button", {
          type: "button",
          class: z(["kx-focus-outline", { active: s.value.mode === "pull" }]),
          onClick: t[1] || (t[1] = (n) => s.value.mode = "pull")
        }, "Use or pull existing", 2),
        e("button", {
          type: "button",
          class: z(["kx-focus-outline", { active: s.value.mode === "build" }]),
          onClick: t[2] || (t[2] = (n) => s.value.mode = "build")
        }, "Build from Dockerfile", 2)
      ]),
      s.value.mode === "build" ? (a(), o("label", Ee, [
        t[17] || (t[17] = e("span", null, "Dockerfile", -1)),
        P(e("textarea", {
          "onUpdate:modelValue": t[3] || (t[3] = (n) => s.value.dockerfile = n),
          rows: "9",
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [T, s.value.dockerfile]
        ]),
        t[18] || (t[18] = ge('<small class="ac-hint">Include <code>sh</code>, <code>git</code>, <code>mkdir</code>, <code>dirname</code>, a <code>timeout</code> that supports <code>-k</code>, and the agent CLIs. The image user needs writable home and work directories.</small>', 1))
      ])) : m("", !0),
      U.edit ? (a(), o("p", Pe, "Saving container settings prepares the image automatically.")) : m("", !0),
      e("label", Te, [
        t[19] || (t[19] = e("span", null, "Label", -1)),
        P(e("input", {
          "onUpdate:modelValue": t[4] || (t[4] = (n) => s.value.label = n),
          class: "kx-focus-halo",
          onInput: t[5] || (t[5] = (n) => r.value = !0)
        }, null, 544), [
          [T, s.value.label]
        ])
      ]),
      e("label", Be, [
        t[20] || (t[20] = e("span", null, "Home directory in the image", -1)),
        P(e("input", {
          "onUpdate:modelValue": t[6] || (t[6] = (n) => s.value.home = n),
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [T, s.value.home]
        ])
      ]),
      e("div", qe, [
        e("label", Re, [
          t[21] || (t[21] = e("span", null, "Memory", -1)),
          P(e("input", {
            "onUpdate:modelValue": t[7] || (t[7] = (n) => s.value.memory = n),
            class: "ac-mono kx-focus-halo",
            placeholder: p(x).default_image.settings?.memory
          }, null, 8, je), [
            [T, s.value.memory]
          ])
        ]),
        e("label", Me, [
          t[22] || (t[22] = e("span", null, "CPUs", -1)),
          P(e("input", {
            "onUpdate:modelValue": t[8] || (t[8] = (n) => s.value.cpus = n),
            class: "ac-mono kx-focus-halo",
            placeholder: p(x).default_image.settings?.cpus
          }, null, 8, Oe), [
            [T, s.value.cpus]
          ])
        ]),
        e("label", He, [
          t[23] || (t[23] = e("span", null, "PIDs limit", -1)),
          P(e("input", {
            "onUpdate:modelValue": t[9] || (t[9] = (n) => s.value.pids_limit = n),
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
          t[24] || (t[24] = e("span", null, "GPUs", -1)),
          P(e("input", {
            "onUpdate:modelValue": t[10] || (t[10] = (n) => s.value.gpus = n),
            class: "ac-mono kx-focus-halo",
            placeholder: "all, or device=0"
          }, null, 512), [
            [T, s.value.gpus]
          ])
        ]),
        e("label", Ke, [
          t[25] || (t[25] = e("span", null, "Network", -1)),
          P(e("input", {
            "onUpdate:modelValue": t[11] || (t[11] = (n) => s.value.network = n),
            class: "ac-mono kx-focus-halo",
            placeholder: p(x).default_image.settings?.network
          }, null, 8, Fe), [
            [T, s.value.network]
          ])
        ])
      ]),
      U.capabilities?.length ? (a(), o("div", ze, [
        t[26] || (t[26] = e("span", null, "Agents may", -1)),
        e("div", Je, [
          (a(!0), o(j, null, M(U.capabilities, (n) => (a(), o("label", {
            key: n,
            class: "ac-check ac-mono"
          }, [
            P(e("input", {
              "onUpdate:modelValue": t[12] || (t[12] = (_) => s.value.allows = _),
              type: "checkbox",
              class: "kx-focus-outline",
              value: n
            }, null, 8, Qe), [
              [ye, s.value.allows]
            ]),
            I(" " + f(n), 1)
          ]))), 128))
        ])
      ])) : m("", !0),
      e("label", Xe, [
        t[27] || (t[27] = e("span", null, "Docker host aliases", -1)),
        P(e("textarea", {
          "onUpdate:modelValue": t[13] || (t[13] = (n) => s.value.extra = n),
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
          onClick: t[14] || (t[14] = (n) => g("cancel"))
        }, "Cancel"),
        e("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: A.value || !U.capabilities || !s.value.ref,
          onClick: L
        }, [
          D(p(V), { icon: "tabler:box" }),
          I(" " + f(A.value ? "Saving…" : U.edit ? "Save settings" : s.value.mode === "build" ? "Build image" : "Add image"), 1)
        ], 8, Ze)
      ]),
      $.value ? (a(), o("p", et, f($.value), 1)) : m("", !0)
    ], 8, Le)) : (a(), o("p", Ae, f(U.edit ? "Image settings are unavailable." : "Image defaults are unavailable.") + " Ask an administrator to update the image configuration.", 1));
  }
}), at = { class: "ac-stack" }, st = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, lt = {
  key: 1,
  class: "kx-loading"
}, ot = {
  key: 2,
  class: "kx-empty"
}, nt = { class: "kx-empty-ico" }, it = {
  key: 3,
  class: "kx-empty"
}, rt = { class: "ac-list ac-resource-list" }, ut = { class: "ac-resource-icon" }, ct = { class: "ac-account-main" }, dt = { class: "ac-row-title" }, vt = {
  key: 0,
  class: "kx-tag-sm ac-tone ready"
}, pt = { class: "ac-muted ac-mono" }, mt = { class: "ac-chips" }, kt = { class: "ac-muted" }, ft = {
  key: 0,
  class: "kx-err ac-small"
}, bt = { class: "ac-row-actions" }, gt = ["disabled", "onClick"], yt = ["onClick"], ht = ["onClick"], _t = ["onClick"], wt = { class: "ac-form" }, xt = { class: "ac-mono" }, $t = { class: "ac-pre ac-build-log" }, Ct = /* @__PURE__ */ G({
  __name: "images",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(U, { expose: E, emit: u }) {
    const g = ee(), x = U, S = u, s = v(!1), r = v(!1), A = v({});
    E({ open: te });
    const $ = v([]), C = v([]), w = v(""), L = v(null), l = v(null), t = J(() => [...new Set(g.value.agents.flatMap((d) => d.capabilities))].sort()), n = v(!1);
    let _ = !0, y = 0, R = 0, K = 0;
    he(() => {
      _ = !1, y++, R++;
    });
    async function Q(d) {
      const b = y, i = await q.image(d);
      !_ || b !== y || l.value?.id !== d || (l.value = { id: d, ref: i.image.ref, text: i.build_log || "(empty)" });
    }
    const h = ne(async () => {
      try {
        const d = await ie(q.images, (b) => b.map((i) => i.id), C, () => _, (b) => {
          $.value = b, n.value = !0, w.value = "";
        }, () => {
          h();
        });
        if (!_) return;
        $.value = d, c(d, ++K), l.value && d.some((b) => b.id === l.value?.id) && await Q(l.value.id), n.value = !0, w.value = "";
      } catch (d) {
        w.value = B(d, "Could not load images.");
      }
    });
    async function c(d, b) {
      try {
        const i = await Ce([...new Set(d.map((N) => N.owner_user_id))]);
        if (!_ || b !== K) return;
        A.value = Object.fromEntries(d.map((N) => [N.id, `Owner: ${i[N.owner_user_id] || N.owner_user_id}`]));
      } catch (i) {
        _ && b === K && (w.value = B(i, "Could not load image owners."));
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
        w.value = B(i, b);
      }
    }
    async function W(d) {
      const b = ++R;
      w.value = "";
      try {
        const i = await q.image(d.id);
        _ && b === R && (L.value = i);
      } catch (i) {
        _ && b === R && (w.value = B(i, "Could not load the image settings."));
      }
    }
    function F() {
      R++, s.value = !1, L.value = null;
    }
    function te() {
      F(), s.value = !0;
    }
    const ue = (d) => k(() => q.prepareImage(d.id), "Could not start the image preparation.");
    function ce(d) {
      y++, l.value = { id: d.id, ref: d.ref, text: "Loading…" }, h();
    }
    function ae() {
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
      R++, L.value?.image.id === d.id && F(), l.value?.id === d.id && ae(), w.value = "";
      try {
        await q.deleteImage(d.id, i), await h();
      } catch (N) {
        w.value = B(N, "Could not delete the image.");
      }
    }
    const se = J(() => $.value.filter((d) => [d.label, d.ref, ...d.agents].join(" ").toLowerCase().includes(x.query.toLowerCase())));
    return O($, (d) => S("count", d.length)), (d, b) => (a(), o("div", at, [
      b[7] || (b[7] = e("p", { class: "ac-hint" }, "Share ready images to make them available for tasks.", -1)),
      w.value ? (a(), o("p", st, [
        I(f(w.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: b[0] || (b[0] = //@ts-ignore
          (...i) => p(h) && p(h)(...i))
        }, "Retry")
      ])) : m("", !0),
      !n.value && !w.value ? (a(), o("div", lt, "Loading images…")) : m("", !0),
      n.value && !$.value.length ? (a(), o("div", ot, [
        e("div", nt, [
          D(p(V), { icon: "tabler:box" })
        ]),
        b[4] || (b[4] = e("div", { class: "kx-empty-title" }, "No images yet", -1)),
        b[5] || (b[5] = e("div", { class: "kx-empty-sub" }, "Start with the default agent recipe or use an existing image.", -1)),
        e("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: te
        }, "Add image")
      ])) : n.value && !se.value.length ? (a(), o("div", it, [...b[6] || (b[6] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another image, reference or agent.", -1)
      ])])) : m("", !0),
      e("ul", rt, [
        (a(!0), o(j, null, M(se.value, (i) => (a(), o("li", {
          key: i.id,
          class: "ac-row ac-resource"
        }, [
          e("span", ut, [
            D(p(V), { icon: "tabler:box" })
          ]),
          e("div", ct, [
            e("div", dt, [
              I(f(i.label), 1),
              e("span", {
                class: z(["kx-tag-sm ac-tone", i.status])
              }, f(i.status === "unprepared" ? "Needs preparation" : i.status.charAt(0).toUpperCase() + i.status.slice(1)), 3),
              i.usable ? (a(), o("span", vt, "Usable")) : m("", !0)
            ]),
            e("div", pt, f(i.ref) + " · " + f(i.home), 1),
            e("div", mt, [
              (a(!0), o(j, null, M(i.agents, (N) => (a(), o("span", {
                key: N,
                class: "kx-tag-sm ac-tone"
              }, [
                D(p(V), {
                  icon: p($e)(N, p(g).agents)
                }, null, 8, ["icon"]),
                I(f(N), 1)
              ]))), 128))
            ]),
            e("div", kt, f(A.value[i.id]), 1),
            i.last_error ? (a(), o("div", ft, f(i.last_error), 1)) : m("", !0)
          ]),
          e("div", bt, [
            i.shareable ? (a(), H(re, {
              key: 0,
              id: i.id,
              title: i.label
            }, null, 8, ["id", "title"])) : m("", !0),
            i.writable ? (a(), o("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Prepare image",
              "aria-label": "Prepare image",
              disabled: i.status === "preparing",
              onClick: (N) => ue(i)
            }, [
              D(p(V), { icon: "tabler:refresh" })
            ], 8, gt)) : m("", !0),
            e("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Build log",
              "aria-label": "Build log",
              onClick: (N) => ce(i)
            }, [
              D(p(V), { icon: "tabler:file-text" })
            ], 8, yt),
            i.writable ? (a(), o("button", {
              key: 2,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Edit settings",
              "aria-label": "Edit settings",
              onClick: (N) => W(i)
            }, [
              D(p(V), { icon: "tabler:pencil" })
            ], 8, ht)) : m("", !0),
            i.deletable ? (a(), o("button", {
              key: 3,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete image",
              "aria-label": "Delete image",
              onClick: (N) => ve(i)
            }, [
              D(p(V), { icon: "tabler:trash" })
            ], 8, _t)) : m("", !0)
          ])
        ]))), 128))
      ]),
      s.value || L.value ? (a(), H(Y, {
        key: 4,
        title: L.value ? "Edit image" : "Add image",
        busy: r.value,
        wide: "",
        onClose: b[3] || (b[3] = (i) => F())
      }, {
        default: Z(() => [
          D(tt, {
            onBusy: b[1] || (b[1] = (i) => r.value = i),
            edit: L.value,
            capabilities: t.value,
            onSaved: de,
            onCancel: b[2] || (b[2] = (i) => F())
          }, null, 8, ["edit", "capabilities"])
        ]),
        _: 1
      }, 8, ["title", "busy"])) : m("", !0),
      l.value ? (a(), H(Y, {
        key: 5,
        title: "Build log",
        wide: "",
        onClose: ae
      }, {
        default: Z(() => [
          e("div", wt, [
            e("strong", xt, f(l.value.ref), 1),
            e("pre", $t, f(l.value.text), 1)
          ])
        ]),
        _: 1
      })) : m("", !0)
    ]));
  }
}), Dt = { class: "ac-stack" }, Ut = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, At = {
  key: 1,
  class: "kx-loading"
}, Lt = {
  key: 2,
  class: "ac-chips"
}, Vt = {
  key: 3,
  class: "kx-empty"
}, It = { class: "kx-empty-ico" }, St = {
  key: 4,
  class: "kx-empty"
}, Nt = { class: "ac-list ac-resource-list" }, Et = { class: "ac-resource-icon" }, Pt = { class: "ac-account-main" }, Tt = { class: "ac-row-title" }, Bt = { class: "kx-tag-sm ac-tone" }, qt = {
  key: 0,
  class: "ac-muted"
}, Rt = { class: "ac-mono" }, jt = {
  key: 1,
  class: "ac-muted ac-mono"
}, Mt = { class: "ac-row-actions" }, Ot = ["onClick"], Ht = ["disabled"], Wt = {
  key: 0,
  class: "ac-muted"
}, Gt = {
  key: 1,
  class: "ac-field"
}, Kt = { class: "ac-chips" }, Ft = ["onClick"], zt = { class: "ac-field" }, Jt = { class: "ac-field" }, Qt = ["placeholder"], Xt = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Yt = { class: "ac-dialog-foot" }, Zt = ["disabled"], ea = ["disabled"], ta = /* @__PURE__ */ G({
  __name: "workspaces",
  props: {
    query: {}
  },
  emits: ["count", "registration-needed"],
  setup(U, { expose: E, emit: u }) {
    const g = De(), x = v([]), S = U, s = u, r = v(!1);
    E({ open: () => {
      r.value = !0;
    } });
    const A = v([]), $ = v([]), C = v(""), w = v(!1), L = v(""), l = v(!1), t = v(""), n = v(!1);
    function _(h) {
      return h.replace(/\/+$/, "") + "/";
    }
    O([r, $], () => {
      r.value && !t.value && $.value.length && (t.value = _($.value[0]));
    }), O(t, (h) => {
      l.value || (L.value = h.trim().split("/").filter(Boolean).pop() ?? "");
    });
    const y = ne(async () => {
      try {
        await ie(q.workspaces, (h) => h.workspaces.map((c) => c.id), x, g, (h) => {
          A.value = h.workspaces, $.value = h.roots ?? [], n.value = !0, C.value = "";
        }, () => {
          y();
        });
      } catch (h) {
        g() && (C.value = B(h, "Could not load workspaces."));
      }
    }, g);
    oe(() => x.value, () => {
      y();
    }), le(y);
    async function R() {
      C.value = "", w.value = !0;
      try {
        if (await q.createWorkspace({ name: L.value, host_path: t.value }), !g()) return;
        l.value = !1, L.value = "", t.value = "", r.value = !1, await y();
      } catch (h) {
        g() && (C.value = B(h, "Could not save the workspace."));
      } finally {
        g() && (w.value = !1);
      }
    }
    async function K(h) {
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
          await q.deleteWorkspace(h.id), await y();
        } catch (k) {
          g() && (C.value = B(k, "Could not delete the workspace."));
        }
      }
    }
    const Q = J(() => A.value.filter((h) => [h.name, h.host_path].join(" ").toLowerCase().includes(S.query.toLowerCase())));
    return O(A, (h) => {
      s("count", h.length), s("registration-needed", h.filter((c) => c.unavailable_reason).length);
    }), (h, c) => (a(), o("div", Dt, [
      c[15] || (c[15] = e("p", { class: "ac-hint" }, "Tasks use shared workspaces with the access you grant.", -1)),
      C.value && !r.value ? (a(), o("p", Ut, [
        I(f(C.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: c[0] || (c[0] = //@ts-ignore
          (...k) => p(y) && p(y)(...k))
        }, "Retry")
      ])) : m("", !0),
      !n.value && !C.value ? (a(), o("div", At, "Loading workspaces…")) : m("", !0),
      $.value.length ? (a(), o("div", Lt, [
        c[7] || (c[7] = e("span", { class: "ac-muted" }, "Allowed roots", -1)),
        (a(!0), o(j, null, M($.value, (k) => (a(), o("span", {
          key: k,
          class: "ac-hint-chip ac-mono"
        }, f(k), 1))), 128))
      ])) : m("", !0),
      n.value && !A.value.length ? (a(), o("div", Vt, [
        e("div", It, [
          D(p(V), { icon: "tabler:folder" })
        ]),
        c[8] || (c[8] = e("div", { class: "kx-empty-title" }, "No workspaces yet", -1)),
        c[9] || (c[9] = e("div", { class: "kx-empty-sub" }, "Add a host directory, or let tasks use a scratch directory.", -1)),
        e("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: c[1] || (c[1] = (k) => r.value = !0)
        }, "Add workspace")
      ])) : n.value && !Q.value.length ? (a(), o("div", St, [...c[10] || (c[10] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another workspace name or path.", -1)
      ])])) : m("", !0),
      e("ul", Nt, [
        (a(!0), o(j, null, M(Q.value, (k) => (a(), o("li", {
          key: k.id,
          class: "ac-row ac-resource"
        }, [
          e("span", Et, [
            D(p(V), { icon: "tabler:folder" })
          ]),
          e("div", Pt, [
            e("div", Tt, [
              I(f(k.name), 1),
              e("span", Bt, f(k.writable ? "read-write" : "read-only"), 1)
            ]),
            k.unavailable_reason ? (a(), o("div", qt, f(k.unavailable_reason), 1)) : m("", !0),
            (a(!0), o(j, null, M(k.conflicts, (W) => (a(), o("div", {
              key: W.id,
              class: "ac-muted"
            }, [
              I("Conflicts with " + f(W.id) + ": ", 1),
              e("span", Rt, f(W.host_path), 1)
            ]))), 128)),
            k.host_path ? (a(), o("div", jt, f(k.host_path), 1)) : m("", !0)
          ]),
          e("div", Mt, [
            k.shareable ? (a(), H(re, {
              key: 0,
              id: k.id,
              title: k.name
            }, null, 8, ["id", "title"])) : m("", !0),
            k.deletable ? (a(), o("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete workspace",
              "aria-label": "Delete workspace",
              onClick: (W) => K(k)
            }, [
              D(p(V), { icon: "tabler:trash" })
            ], 8, Ot)) : m("", !0)
          ])
        ]))), 128))
      ]),
      r.value ? (a(), H(Y, {
        key: 5,
        title: "Add workspace",
        busy: w.value,
        onClose: c[6] || (c[6] = (k) => r.value = !1)
      }, {
        default: Z(() => [
          e("fieldset", {
            class: "ac-form",
            disabled: w.value
          }, [
            $.value.length ? (a(), o("div", Gt, [
              c[11] || (c[11] = e("span", null, "Allowed roots", -1)),
              e("div", Kt, [
                (a(!0), o(j, null, M($.value, (k) => (a(), o("button", {
                  key: k,
                  type: "button",
                  class: "ac-chip ac-mono kx-focus-halo",
                  title: "Start from this root",
                  onClick: (W) => t.value = _(k)
                }, f(k), 9, Ft))), 128))
              ])
            ])) : (a(), o("p", Wt, "The host administrator configures allowed workspace roots.")),
            e("label", zt, [
              c[12] || (c[12] = e("span", null, "Name", -1)),
              P(e("input", {
                "onUpdate:modelValue": c[2] || (c[2] = (k) => L.value = k),
                onInput: c[3] || (c[3] = (k) => l.value = !0),
                autofocus: "",
                class: "kx-focus-halo",
                placeholder: "e.g. Kickside checkout"
              }, null, 544), [
                [T, L.value]
              ])
            ]),
            e("label", Jt, [
              c[13] || (c[13] = e("span", null, "Host directory", -1)),
              P(e("input", {
                "onUpdate:modelValue": c[4] || (c[4] = (k) => t.value = k),
                class: "ac-mono kx-focus-halo",
                placeholder: ($.value[0] ?? "/srv/work") + "/project"
              }, null, 8, Qt), [
                [T, t.value]
              ]),
              c[14] || (c[14] = e("small", { class: "ac-hint" }, [
                I("An existing directory, mounted at "),
                e("code", null, "/workspace"),
                I(".")
              ], -1))
            ]),
            C.value ? (a(), o("p", Xt, f(C.value), 1)) : m("", !0),
            e("footer", Yt, [
              e("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                disabled: w.value,
                onClick: c[5] || (c[5] = (k) => r.value = !1)
              }, "Cancel", 8, Zt),
              e("button", {
                type: "button",
                class: "ac-btn primary kx-focus-halo",
                disabled: w.value || !L.value.trim() || !t.value.trim(),
                onClick: R
              }, [
                D(p(V), { icon: "tabler:folder-plus" }),
                I(f(w.value ? "Saving…" : "Add workspace"), 1)
              ], 8, ea)
            ])
          ], 8, Ht)
        ]),
        _: 1
      }, 8, ["busy"])) : m("", !0)
    ]));
  }
}), aa = { class: "ac-card ac-narrow" }, sa = { class: "ac-card-head" }, la = { class: "ac-card-title" }, oa = ["disabled"], na = {
  key: 0,
  class: "kx-err"
}, ia = {
  key: 1,
  class: "ac-pre"
}, ra = /* @__PURE__ */ G({
  __name: "maintenance",
  setup(U) {
    const E = ee(), u = v(!1), g = v(""), x = v("");
    async function S() {
      if (await X.confirm({
        header: "Clean up Docker",
        message: `Prune stopped Autocode containers, unused images and build cache older than ${E.value.build_cache_retention} across this Docker host? Other modules may use the shared image cache.`,
        icon: "tabler:trash-x",
        acceptLabel: "Clean up",
        rejectLabel: "Cancel"
      })) {
        x.value = "", u.value = !0;
        try {
          g.value = await q.prune();
        } catch (r) {
          x.value = B(r, "Cleanup failed.");
        } finally {
          u.value = !1;
        }
      }
    }
    return (s, r) => (a(), o("section", aa, [
      e("div", sa, [
        e("h2", la, [
          D(p(V), { icon: "tabler:brand-docker" }),
          r[0] || (r[0] = I("Docker cleanup", -1))
        ]),
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          disabled: u.value,
          onClick: S
        }, [
          D(p(V), {
            icon: u.value ? "tabler:loader-2" : "tabler:trash-x",
            class: z({ spin: u.value })
          }, null, 8, ["icon", "class"]),
          I(" " + f(u.value ? "Cleaning…" : "Clean up Docker"), 1)
        ], 8, oa)
      ]),
      r[1] || (r[1] = e("p", { class: "ac-hint" }, "Prune stopped Autocode containers, dangling images and build cache across the Docker host. Tagged images stay.", -1)),
      x.value ? (a(), o("p", na, f(x.value), 1)) : m("", !0),
      g.value ? (a(), o("pre", ia, f(g.value), 1)) : m("", !0)
    ]));
  }
}), ua = { class: "ac" }, ca = { class: "ac-bar" }, da = {
  class: "ac-tabs",
  "aria-label": "Autocode management"
}, va = ["aria-pressed", "onClick"], pa = {
  key: 0,
  class: "ac-hint",
  role: "status"
}, ma = {
  key: 1,
  class: "kx-err"
}, ka = {
  key: 2,
  class: "kx-loading"
}, fa = {
  key: 3,
  class: "ac-body"
}, ba = {
  key: 3,
  class: "ac-muted"
}, ga = /* @__PURE__ */ G({
  __name: "admin",
  setup(U) {
    const E = [
      { id: "images", label: "Images", icon: "tabler:box" },
      { id: "workspaces", label: "Workspaces", icon: "tabler:folder" },
      { id: "docker", label: "Docker", icon: "tabler:brand-docker" }
    ], u = v(), { catalog: g, error: x, load: S } = pe(), s = J(() => E.filter((n) => n.id === "images" ? g.value?.can_images : n.id === "workspaces" ? g.value?.can_workspaces : g.value?.can_prune));
    O(s, (n) => {
      n.some((_) => _.id === u.value) || (u.value = n[0]?.id);
    }, { immediate: !0 });
    const r = v(""), A = v(0), $ = v(0), C = v(0), w = J(() => u.value === "images" ? A.value : $.value), L = v(null), l = v(null);
    function t() {
      u.value === "images" ? L.value?.open() : l.value?.open();
    }
    return (n, _) => (a(), o("div", ua, [
      D(me, {
        title: "Autocode",
        subtitle: "Manage agent images, workspaces and Docker.",
        count: u.value && u.value !== "docker" ? `${w.value} ${w.value === 1 ? u.value.slice(0, -1) : u.value}` : void 0,
        action: u.value === "images" ? "Add image" : u.value === "workspaces" ? "Add workspace" : void 0,
        query: r.value,
        "onUpdate:query": _[0] || (_[0] = (y) => r.value = y),
        placeholder: u.value === "docker" ? void 0 : "Search resources…",
        onCreate: t
      }, null, 8, ["count", "action", "query", "placeholder"]),
      e("div", ca, [
        e("nav", da, [
          (a(!0), o(j, null, M(s.value, (y) => (a(), o("button", {
            key: y.id,
            type: "button",
            class: z(["ac-tab kx-focus-outline", { active: u.value === y.id }]),
            "aria-pressed": u.value === y.id,
            onClick: (R) => {
              u.value !== y.id && (u.value = y.id, r.value = "");
            }
          }, [
            D(p(V), {
              icon: y.icon
            }, null, 8, ["icon"]),
            I(" " + f(y.label), 1)
          ], 10, va))), 128))
        ])
      ]),
      p(g)?.can_workspaces && C.value ? (a(), o("p", pa, [
        I(f(C.value) + " " + f(C.value === 1 ? "workspace needs" : "workspaces need") + " re-registration. Review the refusal reason, settle any active runs, then delete the old workspace and add it through Autocode. Update saved references to the new workspace. ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: _[1] || (_[1] = (y) => {
            u.value = "workspaces", r.value = "";
          })
        }, "Review workspaces")
      ])) : m("", !0),
      p(x) && !p(g) ? (a(), o("p", ma, [
        I(f(p(x)) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: _[2] || (_[2] = //@ts-ignore
          (...y) => p(S) && p(S)(...y))
        }, "Retry")
      ])) : p(g) ? (a(), o("main", fa, [
        u.value === "images" ? (a(), H(Ct, {
          key: 0,
          ref_key: "images",
          ref: L,
          query: r.value,
          onCount: _[3] || (_[3] = (y) => A.value = y)
        }, null, 8, ["query"])) : m("", !0),
        p(g).can_workspaces ? P((a(), H(ta, {
          key: 1,
          ref_key: "workspaces",
          ref: l,
          query: r.value,
          onCount: _[4] || (_[4] = (y) => $.value = y),
          onRegistrationNeeded: _[5] || (_[5] = (y) => C.value = y)
        }, null, 8, ["query"])), [
          [_e, u.value === "workspaces"]
        ]) : m("", !0),
        u.value === "docker" ? (a(), H(ra, { key: 2 })) : m("", !0),
        u.value ? m("", !0) : (a(), o("p", ba, "No management areas are available."))
      ])) : (a(), o("div", ka, [
        D(p(V), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        _[6] || (_[6] = I(" Loading…", -1))
      ]))
    ]));
  }
}), ya = { type: "object", properties: {} };
class ha extends be {
  static get wippyConfig() {
    return { propsSchema: ya, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"], inlineCss: ke };
  }
  static get vueConfig() {
    return { rootComponent: ga, plugins: [fe] };
  }
}
xe(import.meta.url, ha);
