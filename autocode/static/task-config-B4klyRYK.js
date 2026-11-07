import { defineComponent as J, computed as E, ref as k, watch as K, openBlock as s, createElementBlock as l, toDisplayString as i, createCommentVNode as u, Fragment as f, createElementVNode as o, unref as n, renderList as C, createTextVNode as g, createBlock as M, createStaticVNode as Q, nextTick as X } from "vue";
import { s as Y, a as T, e as Z } from "./presentation-CaNB3T5F.js";
import { b as ee, u as te, a as oe } from "./wc-runtime-ClNbKZcC.js";
import { u as ae, d as se, _ as le } from "./driver-options.vue_vue_type_script_setup_true_lang-DLZHHKYC.js";
import { o as ne, s as d, r as ie, u as ue, c as j } from "./dto-BfV5Hy-x.js";
const re = ne({
  agent: d().optional(),
  account_id: d().optional(),
  image_id: d().optional(),
  workspace_id: d().optional(),
  prompt: d().optional(),
  include_input: j().optional(),
  unattended: j().optional(),
  options: ie(ue()).optional(),
  run_timeout: d().max(64).optional(),
  repo_url: d().optional(),
  repo_ref: d().optional()
}).strict(), ce = { class: "tc" }, de = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ve = {
  key: 1,
  class: "kx-err inline"
}, pe = {
  key: 2,
  class: "kx-loading"
}, ke = { class: "tc-pair" }, ge = { class: "tc-field" }, _e = ["value"], fe = ["value"], me = ["value"], he = { class: "tc-field" }, ye = ["value"], be = { value: "" }, xe = ["value"], we = ["value"], Ce = {
  key: 0,
  class: "tc-hint",
  role: "alert"
}, Te = {
  key: 1,
  class: "tc-hint",
  role: "alert"
}, Ae = {
  key: 2,
  class: "tc-hint"
}, Ue = { class: "tc-pair" }, Ve = { class: "tc-field" }, Ee = ["value"], Se = ["value"], Ie = ["value"], Ne = { class: "tc-field" }, $e = ["value"], Oe = ["value"], Pe = ["value"], Re = {
  key: 3,
  class: "tc-hint",
  role: "alert"
}, We = {
  key: 4,
  class: "tc-hint",
  role: "alert"
}, je = {
  key: 5,
  class: "tc-hint",
  role: "alert"
}, Be = { class: "tc-field" }, De = ["value"], qe = {
  key: 6,
  class: "kx-err",
  role: "alert"
}, Le = {
  key: 7,
  class: "kx-err",
  role: "alert"
}, ze = { class: "tc-check" }, Fe = ["checked"], Ge = { class: "ac-advanced" }, He = { class: "tc" }, Je = {
  key: 0,
  class: "tc-check"
}, Ke = ["checked"], Me = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Qe = { class: "tc-field" }, Xe = ["value"], Ye = { class: "tc-field" }, Ze = ["value"], et = { class: "tc-field" }, tt = ["value"], ut = /* @__PURE__ */ J({
  __name: "task-config",
  setup(ot) {
    const B = ee(), D = te(), m = E(() => re.safeParse(B.value.config ?? {})), h = E(() => m.value.success ? "" : "Workflow configuration is invalid."), a = k(m.value.success ? m.value.data : {});
    K(m, (c) => {
      if (!c.success) return;
      const e = c.data;
      e && Object.keys(e).length ? (a.value = V(e), _.value = !1) : (a.value = {}, W());
    });
    const v = k(null), A = k([]), S = k([]), U = k([]), y = k(""), _ = k(!1), {
      driver: p,
      agentAccounts: I,
      ready: q,
      agentImages: b,
      invalidAgent: N,
      invalidImage: $,
      invalidAccount: O,
      invalidWorkspace: P,
      invalidOptions: x,
      optionValues: L,
      normalizeConfig: V,
      selectAgent: z,
      initialSelection: F
    } = ae(a, {
      catalog: () => v.value,
      accounts: () => A.value,
      images: () => S.value,
      workspaces: () => U.value
    }, "saved"), w = E(() => p.value?.title ?? a.value.agent ?? "this agent");
    function r(c) {
      const e = V({ ...a.value, ...c });
      if (a.value = e, x.value > 0) {
        _.value = !0;
        return;
      }
      _.value = !1, D("config-changed", e);
    }
    function G(c) {
      x.value = c, !c && _.value && X(() => {
        !x.value && _.value && r({});
      });
    }
    function R(c) {
      r(z(c));
    }
    function W() {
      !v.value || h.value || Object.keys(a.value).length || r({ ...F(), include_input: !0 });
    }
    return oe(Y(async () => {
      try {
        const [c, e, t, H] = await Promise.all([T.catalog(), T.accounts(), T.images(), T.workspaces()]);
        v.value = c, A.value = e, S.value = t, U.value = H.workspaces, y.value = "", a.value = V(a.value), W();
      } catch (c) {
        y.value = Z(c, "Could not load the agents.");
      }
    })), (c, e) => (s(), l("div", ce, [
      h.value ? (s(), l("p", de, i(h.value), 1)) : u("", !0),
      y.value ? (s(), l("p", ve, i(y.value), 1)) : v.value ? h.value ? u("", !0) : (s(), l(f, { key: 3 }, [
        o("div", ke, [
          o("label", ge, [
            e[15] || (e[15] = o("span", { class: "tc-lbl" }, "Agent", -1)),
            o("select", {
              class: "tc-input kx-focus-halo",
              value: a.value.agent,
              onChange: e[0] || (e[0] = (t) => R(t.target.value))
            }, [
              n(N) ? (s(), l("option", {
                key: 0,
                value: a.value.agent
              }, "Unavailable agent: " + i(a.value.agent), 9, fe)) : u("", !0),
              (s(!0), l(f, null, C(v.value.agents, (t) => (s(), l("option", {
                key: t.id,
                value: t.id
              }, i(t.title), 9, me))), 128))
            ], 40, _e)
          ]),
          o("label", he, [
            e[16] || (e[16] = o("span", { class: "tc-lbl" }, "Account", -1)),
            o("select", {
              class: "tc-input kx-focus-halo",
              value: a.value.account_id ?? "",
              onChange: e[1] || (e[1] = (t) => r({ account_id: t.target.value }))
            }, [
              o("option", be, "Auto (" + i(n(q).length) + " ready)", 1),
              n(O) ? (s(), l("option", {
                key: 0,
                value: a.value.account_id
              }, "Unavailable account: " + i(a.value.account_id), 9, xe)) : u("", !0),
              (s(!0), l(f, null, C(n(I), (t) => (s(), l("option", {
                key: t.id,
                value: t.id
              }, i(t.label), 9, we))), 128))
            ], 40, ye)
          ])
        ]),
        n(N) ? (s(), l("p", Ce, [
          e[17] || (e[17] = g("This saved agent no longer exists. ", -1)),
          v.value.agents.length ? (s(), l("button", {
            key: 0,
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: e[2] || (e[2] = (t) => R(n(se)(v.value, A.value)))
          }, "Use default agent")) : u("", !0)
        ])) : u("", !0),
        n(O) ? (s(), l("p", Te, [
          g("This saved account no longer exists, is disabled or cannot run " + i(w.value) + ". ", 1),
          o("button", {
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: e[3] || (e[3] = (t) => r({ account_id: "" }))
          }, "Use Auto")
        ])) : u("", !0),
        n(I).length ? u("", !0) : (s(), l("p", Ae, "Add an account on Autocode → Accounts to run " + i(w.value) + ".", 1)),
        o("div", Ue, [
          o("label", Ve, [
            e[18] || (e[18] = o("span", { class: "tc-lbl" }, "Image (required)", -1)),
            o("select", {
              class: "tc-input kx-focus-halo",
              value: a.value.image_id ?? "",
              onChange: e[4] || (e[4] = (t) => r({ image_id: t.target.value }))
            }, [
              n($) ? (s(), l("option", {
                key: 0,
                value: a.value.image_id ?? ""
              }, i(a.value.image_id ? "Unavailable image: " + a.value.image_id : "Choose an image"), 9, Se)) : u("", !0),
              (s(!0), l(f, null, C(n(b), (t) => (s(), l("option", {
                key: t.id,
                value: t.id
              }, i(t.label), 9, Ie))), 128))
            ], 40, Ee)
          ]),
          o("label", Ne, [
            e[20] || (e[20] = o("span", { class: "tc-lbl" }, "Workspace", -1)),
            o("select", {
              class: "tc-input kx-focus-halo",
              value: a.value.workspace_id ?? "",
              onChange: e[5] || (e[5] = (t) => r({ workspace_id: t.target.value }))
            }, [
              e[19] || (e[19] = o("option", { value: "" }, "Scratch directory", -1)),
              n(P) ? (s(), l("option", {
                key: 0,
                value: a.value.workspace_id
              }, "Unavailable workspace: " + i(a.value.workspace_id), 9, Oe)) : u("", !0),
              (s(!0), l(f, null, C(U.value, (t) => (s(), l("option", {
                key: t.id,
                value: t.id
              }, i(t.name) + i(t.writable ? "" : " (read-only)"), 9, Pe))), 128))
            ], 40, $e)
          ])
        ]),
        n(b).length ? n($) ? (s(), l("p", We, [
          g("This saved image is missing, is not usable or does not include " + i(w.value) + ". ", 1),
          o("button", {
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: e[6] || (e[6] = (t) => r({ image_id: n(b)[0].id }))
          }, "Use " + i(n(b)[0].label), 1)
        ])) : u("", !0) : (s(), l("p", Re, "No image with " + i(w.value) + "; ask an administrator.", 1)),
        n(P) ? (s(), l("p", je, [
          e[21] || (e[21] = g("This saved workspace no longer exists or is unavailable. ", -1)),
          o("button", {
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: e[7] || (e[7] = (t) => r({ workspace_id: "" }))
          }, "Use Scratch")
        ])) : u("", !0),
        o("label", Be, [
          e[22] || (e[22] = o("span", { class: "tc-lbl" }, "Task (required)", -1)),
          o("textarea", {
            class: "tc-input kx-focus-halo",
            rows: "4",
            value: a.value.prompt,
            placeholder: "What should the agent do?",
            onInput: e[8] || (e[8] = (t) => r({ prompt: t.target.value }))
          }, null, 40, De)
        ]),
        a.value.prompt?.trim() ? u("", !0) : (s(), l("p", qe, "Enter a task prompt.")),
        a.value.image_id ? u("", !0) : (s(), l("p", Le, "Choose an image.")),
        o("label", ze, [
          o("input", {
            type: "checkbox",
            class: "kx-focus-outline",
            checked: a.value.include_input !== !1,
            onChange: e[9] || (e[9] = (t) => r({ include_input: t.target.checked }))
          }, null, 40, Fe),
          e[23] || (e[23] = g(" Pass the node's input to the agent after the task ", -1))
        ]),
        o("details", Ge, [
          e[28] || (e[28] = o("summary", { class: "kx-focus-outline" }, "Advanced", -1)),
          o("div", He, [
            n(p)?.unattended ? (s(), l("label", Je, [
              o("input", {
                type: "checkbox",
                class: "kx-focus-outline",
                checked: a.value.unattended !== !1,
                onChange: e[10] || (e[10] = (t) => r({ unattended: t.target.checked }))
              }, null, 40, Ke),
              e[24] || (e[24] = g(" Unattended: skip permission prompts ", -1))
            ])) : u("", !0),
            n(p) ? (s(), M(le, {
              key: n(p).id,
              options: n(p).options,
              "model-value": n(L),
              locked: a.value.unattended !== !1 && n(p).unattended ? n(p).unattended : {},
              onInvalid: G,
              "onUpdate:modelValue": e[11] || (e[11] = (t) => r({ options: t }))
            }, null, 8, ["options", "model-value", "locked"])) : u("", !0),
            n(x) ? (s(), l("p", Me, "Driver options are invalid. These drafts and further changes are not applied to the workflow until all options are valid.")) : u("", !0),
            o("label", Qe, [
              e[25] || (e[25] = o("span", { class: "tc-lbl" }, "Run timeout", -1)),
              o("input", {
                class: "tc-input tc-mono kx-focus-halo",
                value: a.value.run_timeout,
                placeholder: "Use configured timeout",
                onChange: e[12] || (e[12] = (t) => r({ run_timeout: t.target.value.trim() || void 0 }))
              }, null, 40, Xe)
            ]),
            o("label", Ye, [
              e[26] || (e[26] = o("span", { class: "tc-lbl" }, "Git repository", -1)),
              o("input", {
                class: "tc-input tc-mono kx-focus-halo",
                value: a.value.repo_url,
                placeholder: "optional",
                onChange: e[13] || (e[13] = (t) => r({ repo_url: t.target.value }))
              }, null, 40, Ze)
            ]),
            o("label", et, [
              e[27] || (e[27] = o("span", { class: "tc-lbl" }, "Repository ref", -1)),
              o("input", {
                class: "tc-input tc-mono kx-focus-halo",
                "aria-label": "Repository ref",
                value: a.value.repo_ref,
                placeholder: "Default branch",
                onChange: e[14] || (e[14] = (t) => r({ repo_ref: t.target.value.trim() || void 0 }))
              }, null, 40, tt)
            ])
          ])
        ]),
        e[29] || (e[29] = Q('<p class="tc-hint">Output: <code>run_id</code>, <code>status</code>, <code>answer</code>, <code>error</code>, <code>usage</code>, <code>agent</code>, <code>account_id</code>; next nodes read them as <code>output.answer</code>.</p>', 1))
      ], 64)) : (s(), l("div", pe, "Loading agents…"))
    ]));
  }
});
export {
  ut as default
};
