import { o as n, e as a, s as o, a as t, b as e, n as i, c as s } from "./dto-PQMIoW9W.js";
const c = n({
  driver: t,
  busy: s().optional(),
  error: o().optional(),
  saved: i().optional(),
  limits: e.optional(),
  account: n({ id: o(), label: o(), credential_kind: o(), endpoint: a.optional() }).optional()
}), l = n({ agent: o(), credential_kind: o(), label: o(), secret: o(), endpoint: a.optional() });
export {
  l as a,
  c as d
};
