import { o as n, e as a, s as o, a as t, b as e, n as s, c as i } from "./dto-CHThMR8e.js";
const p = n({
  driver: t,
  guided: i().optional(),
  initialKind: o().optional(),
  busy: i().optional(),
  error: o().optional(),
  saved: s().optional(),
  limits: e.optional(),
  account: n({ id: o(), label: o(), credential_kind: o(), endpoint: a.optional() }).optional()
}), c = n({ agent: o(), credential_kind: o(), label: o(), secret: o(), endpoint: a.optional() });
export {
  c as a,
  p as d
};
