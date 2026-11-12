var v;
(function(a) {
  a.assertEqual = (r) => {
  };
  function e(r) {
  }
  a.assertIs = e;
  function t(r) {
    throw new Error();
  }
  a.assertNever = t, a.arrayToEnum = (r) => {
    const n = {};
    for (const i of r)
      n[i] = i;
    return n;
  }, a.getValidEnumValues = (r) => {
    const n = a.objectKeys(r).filter((o) => typeof r[r[o]] != "number"), i = {};
    for (const o of n)
      i[o] = r[o];
    return a.objectValues(i);
  }, a.objectValues = (r) => a.objectKeys(r).map(function(n) {
    return r[n];
  }), a.objectKeys = typeof Object.keys == "function" ? (r) => Object.keys(r) : (r) => {
    const n = [];
    for (const i in r)
      Object.prototype.hasOwnProperty.call(r, i) && n.push(i);
    return n;
  }, a.find = (r, n) => {
    for (const i of r)
      if (n(i))
        return i;
  }, a.isInteger = typeof Number.isInteger == "function" ? (r) => Number.isInteger(r) : (r) => typeof r == "number" && Number.isFinite(r) && Math.floor(r) === r;
  function s(r, n = " | ") {
    return r.map((i) => typeof i == "string" ? `'${i}'` : i).join(n);
  }
  a.joinValues = s, a.jsonStringifyReplacer = (r, n) => typeof n == "bigint" ? n.toString() : n;
})(v || (v = {}));
var fe;
(function(a) {
  a.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(fe || (fe = {}));
const u = v.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), R = (a) => {
  switch (typeof a) {
    case "undefined":
      return u.undefined;
    case "string":
      return u.string;
    case "number":
      return Number.isNaN(a) ? u.nan : u.number;
    case "boolean":
      return u.boolean;
    case "function":
      return u.function;
    case "bigint":
      return u.bigint;
    case "symbol":
      return u.symbol;
    case "object":
      return Array.isArray(a) ? u.array : a === null ? u.null : a.then && typeof a.then == "function" && a.catch && typeof a.catch == "function" ? u.promise : typeof Map < "u" && a instanceof Map ? u.map : typeof Set < "u" && a instanceof Set ? u.set : typeof Date < "u" && a instanceof Date ? u.date : u.object;
    default:
      return u.unknown;
  }
}, d = v.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
class Z extends Error {
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (s) => {
      this.issues = [...this.issues, s];
    }, this.addIssues = (s = []) => {
      this.issues = [...this.issues, ...s];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    const t = e || function(n) {
      return n.message;
    }, s = { _errors: [] }, r = (n) => {
      for (const i of n.issues)
        if (i.code === "invalid_union")
          i.unionErrors.map(r);
        else if (i.code === "invalid_return_type")
          r(i.returnTypeError);
        else if (i.code === "invalid_arguments")
          r(i.argumentsError);
        else if (i.path.length === 0)
          s._errors.push(t(i));
        else {
          let o = s, h = 0;
          for (; h < i.path.length; ) {
            const p = i.path[h];
            h === i.path.length - 1 ? (o[p] = o[p] || { _errors: [] }, o[p]._errors.push(t(i))) : o[p] = o[p] || { _errors: [] }, o = o[p], h++;
          }
        }
    };
    return r(this), s;
  }
  static assert(e) {
    if (!(e instanceof Z))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, v.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, s = [];
    for (const r of this.issues)
      if (r.path.length > 0) {
        const n = r.path[0];
        t[n] = t[n] || [], t[n].push(e(r));
      } else
        s.push(e(r));
    return { formErrors: s, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
Z.create = (a) => new Z(a);
const ee = (a, e) => {
  let t;
  switch (a.code) {
    case d.invalid_type:
      a.received === u.undefined ? t = "Required" : t = `Expected ${a.expected}, received ${a.received}`;
      break;
    case d.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(a.expected, v.jsonStringifyReplacer)}`;
      break;
    case d.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${v.joinValues(a.keys, ", ")}`;
      break;
    case d.invalid_union:
      t = "Invalid input";
      break;
    case d.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${v.joinValues(a.options)}`;
      break;
    case d.invalid_enum_value:
      t = `Invalid enum value. Expected ${v.joinValues(a.options)}, received '${a.received}'`;
      break;
    case d.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case d.invalid_return_type:
      t = "Invalid function return type";
      break;
    case d.invalid_date:
      t = "Invalid date";
      break;
    case d.invalid_string:
      typeof a.validation == "object" ? "includes" in a.validation ? (t = `Invalid input: must include "${a.validation.includes}"`, typeof a.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${a.validation.position}`)) : "startsWith" in a.validation ? t = `Invalid input: must start with "${a.validation.startsWith}"` : "endsWith" in a.validation ? t = `Invalid input: must end with "${a.validation.endsWith}"` : v.assertNever(a.validation) : a.validation !== "regex" ? t = `Invalid ${a.validation}` : t = "Invalid";
      break;
    case d.too_small:
      a.type === "array" ? t = `Array must contain ${a.exact ? "exactly" : a.inclusive ? "at least" : "more than"} ${a.minimum} element(s)` : a.type === "string" ? t = `String must contain ${a.exact ? "exactly" : a.inclusive ? "at least" : "over"} ${a.minimum} character(s)` : a.type === "number" ? t = `Number must be ${a.exact ? "exactly equal to " : a.inclusive ? "greater than or equal to " : "greater than "}${a.minimum}` : a.type === "bigint" ? t = `Number must be ${a.exact ? "exactly equal to " : a.inclusive ? "greater than or equal to " : "greater than "}${a.minimum}` : a.type === "date" ? t = `Date must be ${a.exact ? "exactly equal to " : a.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(a.minimum))}` : t = "Invalid input";
      break;
    case d.too_big:
      a.type === "array" ? t = `Array must contain ${a.exact ? "exactly" : a.inclusive ? "at most" : "less than"} ${a.maximum} element(s)` : a.type === "string" ? t = `String must contain ${a.exact ? "exactly" : a.inclusive ? "at most" : "under"} ${a.maximum} character(s)` : a.type === "number" ? t = `Number must be ${a.exact ? "exactly" : a.inclusive ? "less than or equal to" : "less than"} ${a.maximum}` : a.type === "bigint" ? t = `BigInt must be ${a.exact ? "exactly" : a.inclusive ? "less than or equal to" : "less than"} ${a.maximum}` : a.type === "date" ? t = `Date must be ${a.exact ? "exactly" : a.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(a.maximum))}` : t = "Invalid input";
      break;
    case d.custom:
      t = "Invalid input";
      break;
    case d.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case d.not_multiple_of:
      t = `Number must be a multiple of ${a.multipleOf}`;
      break;
    case d.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, v.assertNever(a);
  }
  return { message: t };
};
let Re = ee;
function je() {
  return Re;
}
const Ie = (a) => {
  const { data: e, path: t, errorMaps: s, issueData: r } = a, n = [...t, ...r.path || []], i = {
    ...r,
    path: n
  };
  if (r.message !== void 0)
    return {
      ...r,
      path: n,
      message: r.message
    };
  let o = "";
  const h = s.filter((p) => !!p).slice().reverse();
  for (const p of h)
    o = p(i, { data: e, defaultError: o }).message;
  return {
    ...r,
    path: n,
    message: o
  };
};
function c(a, e) {
  const t = je(), s = Ie({
    issueData: e,
    data: a.data,
    path: a.path,
    errorMaps: [
      a.common.contextualErrorMap,
      // contextual error map is first priority
      a.schemaErrorMap,
      // then schema-bound map if available
      t,
      // then global override map
      t === ee ? void 0 : ee
      // then global default map
    ].filter((r) => !!r)
  });
  a.common.issues.push(s);
}
class T {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, t) {
    const s = [];
    for (const r of t) {
      if (r.status === "aborted")
        return _;
      r.status === "dirty" && e.dirty(), s.push(r.value);
    }
    return { status: e.value, value: s };
  }
  static async mergeObjectAsync(e, t) {
    const s = [];
    for (const r of t) {
      const n = await r.key, i = await r.value;
      s.push({
        key: n,
        value: i
      });
    }
    return T.mergeObjectSync(e, s);
  }
  static mergeObjectSync(e, t) {
    const s = {};
    for (const r of t) {
      const { key: n, value: i } = r;
      if (n.status === "aborted" || i.status === "aborted")
        return _;
      n.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), n.value !== "__proto__" && (typeof i.value < "u" || r.alwaysSet) && (s[n.value] = i.value);
    }
    return { status: e.value, value: s };
  }
}
const _ = Object.freeze({
  status: "aborted"
}), F = (a) => ({ status: "dirty", value: a }), S = (a) => ({ status: "valid", value: a }), he = (a) => a.status === "aborted", pe = (a) => a.status === "dirty", V = (a) => a.status === "valid", J = (a) => typeof Promise < "u" && a instanceof Promise;
var f;
(function(a) {
  a.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, a.toString = (e) => typeof e == "string" ? e : e?.message;
})(f || (f = {}));
class N {
  constructor(e, t, s, r) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = s, this._key = r;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const me = (a, e) => {
  if (V(e))
    return { success: !0, data: e.value };
  if (!a.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new Z(a.common.issues);
      return this._error = t, this._error;
    }
  };
};
function y(a) {
  if (!a)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: s, description: r } = a;
  if (e && (t || s))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: r } : { errorMap: (i, o) => {
    const { message: h } = a;
    return i.code === "invalid_enum_value" ? { message: h ?? o.defaultError } : typeof o.data > "u" ? { message: h ?? s ?? o.defaultError } : i.code !== "invalid_type" ? { message: o.defaultError } : { message: h ?? t ?? o.defaultError };
  }, description: r };
}
class g {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return R(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: R(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new T(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: R(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (J(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const s = this.safeParse(e, t);
    if (s.success)
      return s.data;
    throw s.error;
  }
  safeParse(e, t) {
    const s = {
      common: {
        issues: [],
        async: t?.async ?? !1,
        contextualErrorMap: t?.errorMap
      },
      path: t?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: R(e)
    }, r = this._parseSync({ data: e, path: s.path, parent: s });
    return me(s, r);
  }
  "~validate"(e) {
    const t = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: R(e)
    };
    if (!this["~standard"].async)
      try {
        const s = this._parseSync({ data: e, path: [], parent: t });
        return V(s) ? {
          value: s.value
        } : {
          issues: t.common.issues
        };
      } catch (s) {
        s?.message?.toLowerCase()?.includes("encountered") && (this["~standard"].async = !0), t.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: e, path: [], parent: t }).then((s) => V(s) ? {
      value: s.value
    } : {
      issues: t.common.issues
    });
  }
  async parseAsync(e, t) {
    const s = await this.safeParseAsync(e, t);
    if (s.success)
      return s.data;
    throw s.error;
  }
  async safeParseAsync(e, t) {
    const s = {
      common: {
        issues: [],
        contextualErrorMap: t?.errorMap,
        async: !0
      },
      path: t?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: R(e)
    }, r = this._parse({ data: e, path: s.path, parent: s }), n = await (J(r) ? r : Promise.resolve(r));
    return me(s, n);
  }
  refine(e, t) {
    const s = (r) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(r) : t;
    return this._refinement((r, n) => {
      const i = e(r), o = () => n.addIssue({
        code: d.custom,
        ...s(r)
      });
      return typeof Promise < "u" && i instanceof Promise ? i.then((h) => h ? !0 : (o(), !1)) : i ? !0 : (o(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((s, r) => e(s) ? !0 : (r.addIssue(typeof t == "function" ? t(s, r) : t), !1));
  }
  _refinement(e) {
    return new P({
      schema: this,
      typeName: m.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (t) => this["~validate"](t)
    };
  }
  optional() {
    return j.create(this, this._def);
  }
  nullable() {
    return z.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return O.create(this);
  }
  promise() {
    return X.create(this, this._def);
  }
  or(e) {
    return H.create([this, e], this._def);
  }
  and(e) {
    return G.create(this, e, this._def);
  }
  transform(e) {
    return new P({
      ...y(this._def),
      schema: this,
      typeName: m.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new ne({
      ...y(this._def),
      innerType: this,
      defaultValue: t,
      typeName: m.ZodDefault
    });
  }
  brand() {
    return new st({
      typeName: m.ZodBranded,
      type: this,
      ...y(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new ie({
      ...y(this._def),
      innerType: this,
      catchValue: t,
      typeName: m.ZodCatch
    });
  }
  describe(e) {
    const t = this.constructor;
    return new t({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return ce.create(this, e);
  }
  readonly() {
    return oe.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Ee = /^c[^\s-]{8,}$/i, $e = /^[0-9a-z]+$/, Ve = /^[0-9A-HJKMNP-TV-Z]{26}$/i, Me = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Le = /^[a-z0-9_-]{21}$/i, Pe = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, ze = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, De = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Ue = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let K;
const Be = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Fe = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, qe = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, We = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Je = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, Ye = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, Ce = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", He = new RegExp(`^${Ce}$`);
function Se(a) {
  let e = "[0-5]\\d";
  a.precision ? e = `${e}\\.\\d{${a.precision}}` : a.precision == null && (e = `${e}(\\.\\d+)?`);
  const t = a.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${t}`;
}
function Ge(a) {
  return new RegExp(`^${Se(a)}$`);
}
function Qe(a) {
  let e = `${Ce}T${Se(a)}`;
  const t = [];
  return t.push(a.local ? "Z?" : "Z"), a.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function Xe(a, e) {
  return !!((e === "v4" || !e) && Be.test(a) || (e === "v6" || !e) && qe.test(a));
}
function Ke(a, e) {
  if (!Pe.test(a))
    return !1;
  try {
    const [t] = a.split(".");
    if (!t)
      return !1;
    const s = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), r = JSON.parse(atob(s));
    return !(typeof r != "object" || r === null || "typ" in r && r?.typ !== "JWT" || !r.alg || e && r.alg !== e);
  } catch {
    return !1;
  }
}
function et(a, e) {
  return !!((e === "v4" || !e) && Fe.test(a) || (e === "v6" || !e) && We.test(a));
}
class A extends g {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== u.string) {
      const n = this._getOrReturnCtx(e);
      return c(n, {
        code: d.invalid_type,
        expected: u.string,
        received: n.parsedType
      }), _;
    }
    const s = new T();
    let r;
    for (const n of this._def.checks)
      if (n.kind === "min")
        e.data.length < n.value && (r = this._getOrReturnCtx(e, r), c(r, {
          code: d.too_small,
          minimum: n.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: n.message
        }), s.dirty());
      else if (n.kind === "max")
        e.data.length > n.value && (r = this._getOrReturnCtx(e, r), c(r, {
          code: d.too_big,
          maximum: n.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: n.message
        }), s.dirty());
      else if (n.kind === "length") {
        const i = e.data.length > n.value, o = e.data.length < n.value;
        (i || o) && (r = this._getOrReturnCtx(e, r), i ? c(r, {
          code: d.too_big,
          maximum: n.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: n.message
        }) : o && c(r, {
          code: d.too_small,
          minimum: n.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: n.message
        }), s.dirty());
      } else if (n.kind === "email")
        De.test(e.data) || (r = this._getOrReturnCtx(e, r), c(r, {
          validation: "email",
          code: d.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "emoji")
        K || (K = new RegExp(Ue, "u")), K.test(e.data) || (r = this._getOrReturnCtx(e, r), c(r, {
          validation: "emoji",
          code: d.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "uuid")
        Me.test(e.data) || (r = this._getOrReturnCtx(e, r), c(r, {
          validation: "uuid",
          code: d.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "nanoid")
        Le.test(e.data) || (r = this._getOrReturnCtx(e, r), c(r, {
          validation: "nanoid",
          code: d.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "cuid")
        Ee.test(e.data) || (r = this._getOrReturnCtx(e, r), c(r, {
          validation: "cuid",
          code: d.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "cuid2")
        $e.test(e.data) || (r = this._getOrReturnCtx(e, r), c(r, {
          validation: "cuid2",
          code: d.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "ulid")
        Ve.test(e.data) || (r = this._getOrReturnCtx(e, r), c(r, {
          validation: "ulid",
          code: d.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "url")
        try {
          new URL(e.data);
        } catch {
          r = this._getOrReturnCtx(e, r), c(r, {
            validation: "url",
            code: d.invalid_string,
            message: n.message
          }), s.dirty();
        }
      else n.kind === "regex" ? (n.regex.lastIndex = 0, n.regex.test(e.data) || (r = this._getOrReturnCtx(e, r), c(r, {
        validation: "regex",
        code: d.invalid_string,
        message: n.message
      }), s.dirty())) : n.kind === "trim" ? e.data = e.data.trim() : n.kind === "includes" ? e.data.includes(n.value, n.position) || (r = this._getOrReturnCtx(e, r), c(r, {
        code: d.invalid_string,
        validation: { includes: n.value, position: n.position },
        message: n.message
      }), s.dirty()) : n.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : n.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : n.kind === "startsWith" ? e.data.startsWith(n.value) || (r = this._getOrReturnCtx(e, r), c(r, {
        code: d.invalid_string,
        validation: { startsWith: n.value },
        message: n.message
      }), s.dirty()) : n.kind === "endsWith" ? e.data.endsWith(n.value) || (r = this._getOrReturnCtx(e, r), c(r, {
        code: d.invalid_string,
        validation: { endsWith: n.value },
        message: n.message
      }), s.dirty()) : n.kind === "datetime" ? Qe(n).test(e.data) || (r = this._getOrReturnCtx(e, r), c(r, {
        code: d.invalid_string,
        validation: "datetime",
        message: n.message
      }), s.dirty()) : n.kind === "date" ? He.test(e.data) || (r = this._getOrReturnCtx(e, r), c(r, {
        code: d.invalid_string,
        validation: "date",
        message: n.message
      }), s.dirty()) : n.kind === "time" ? Ge(n).test(e.data) || (r = this._getOrReturnCtx(e, r), c(r, {
        code: d.invalid_string,
        validation: "time",
        message: n.message
      }), s.dirty()) : n.kind === "duration" ? ze.test(e.data) || (r = this._getOrReturnCtx(e, r), c(r, {
        validation: "duration",
        code: d.invalid_string,
        message: n.message
      }), s.dirty()) : n.kind === "ip" ? Xe(e.data, n.version) || (r = this._getOrReturnCtx(e, r), c(r, {
        validation: "ip",
        code: d.invalid_string,
        message: n.message
      }), s.dirty()) : n.kind === "jwt" ? Ke(e.data, n.alg) || (r = this._getOrReturnCtx(e, r), c(r, {
        validation: "jwt",
        code: d.invalid_string,
        message: n.message
      }), s.dirty()) : n.kind === "cidr" ? et(e.data, n.version) || (r = this._getOrReturnCtx(e, r), c(r, {
        validation: "cidr",
        code: d.invalid_string,
        message: n.message
      }), s.dirty()) : n.kind === "base64" ? Je.test(e.data) || (r = this._getOrReturnCtx(e, r), c(r, {
        validation: "base64",
        code: d.invalid_string,
        message: n.message
      }), s.dirty()) : n.kind === "base64url" ? Ye.test(e.data) || (r = this._getOrReturnCtx(e, r), c(r, {
        validation: "base64url",
        code: d.invalid_string,
        message: n.message
      }), s.dirty()) : v.assertNever(n);
    return { status: s.value, value: e.data };
  }
  _regex(e, t, s) {
    return this.refinement((r) => e.test(r), {
      validation: t,
      code: d.invalid_string,
      ...f.errToObj(s)
    });
  }
  _addCheck(e) {
    return new A({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...f.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...f.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...f.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...f.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...f.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...f.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...f.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...f.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...f.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...f.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...f.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...f.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...f.errToObj(e) });
  }
  datetime(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      local: !1,
      message: e
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof e?.precision > "u" ? null : e?.precision,
      offset: e?.offset ?? !1,
      local: e?.local ?? !1,
      ...f.errToObj(e?.message)
    });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "time",
      precision: null,
      message: e
    }) : this._addCheck({
      kind: "time",
      precision: typeof e?.precision > "u" ? null : e?.precision,
      ...f.errToObj(e?.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...f.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...f.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t?.position,
      ...f.errToObj(t?.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...f.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...f.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...f.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...f.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...f.errToObj(t)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, f.errToObj(e));
  }
  trim() {
    return new A({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new A({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new A({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e) => e.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e) => e.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e) => e.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e) => e.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((e) => e.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((e) => e.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((e) => e.kind === "base64url");
  }
  get minLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
A.create = (a) => new A({
  checks: [],
  typeName: m.ZodString,
  coerce: a?.coerce ?? !1,
  ...y(a)
});
function tt(a, e) {
  const t = (a.toString().split(".")[1] || "").length, s = (e.toString().split(".")[1] || "").length, r = t > s ? t : s, n = Number.parseInt(a.toFixed(r).replace(".", "")), i = Number.parseInt(e.toFixed(r).replace(".", ""));
  return n % i / 10 ** r;
}
class M extends g {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== u.number) {
      const n = this._getOrReturnCtx(e);
      return c(n, {
        code: d.invalid_type,
        expected: u.number,
        received: n.parsedType
      }), _;
    }
    let s;
    const r = new T();
    for (const n of this._def.checks)
      n.kind === "int" ? v.isInteger(e.data) || (s = this._getOrReturnCtx(e, s), c(s, {
        code: d.invalid_type,
        expected: "integer",
        received: "float",
        message: n.message
      }), r.dirty()) : n.kind === "min" ? (n.inclusive ? e.data < n.value : e.data <= n.value) && (s = this._getOrReturnCtx(e, s), c(s, {
        code: d.too_small,
        minimum: n.value,
        type: "number",
        inclusive: n.inclusive,
        exact: !1,
        message: n.message
      }), r.dirty()) : n.kind === "max" ? (n.inclusive ? e.data > n.value : e.data >= n.value) && (s = this._getOrReturnCtx(e, s), c(s, {
        code: d.too_big,
        maximum: n.value,
        type: "number",
        inclusive: n.inclusive,
        exact: !1,
        message: n.message
      }), r.dirty()) : n.kind === "multipleOf" ? tt(e.data, n.value) !== 0 && (s = this._getOrReturnCtx(e, s), c(s, {
        code: d.not_multiple_of,
        multipleOf: n.value,
        message: n.message
      }), r.dirty()) : n.kind === "finite" ? Number.isFinite(e.data) || (s = this._getOrReturnCtx(e, s), c(s, {
        code: d.not_finite,
        message: n.message
      }), r.dirty()) : v.assertNever(n);
    return { status: r.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, f.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, f.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, f.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, f.toString(t));
  }
  setLimit(e, t, s, r) {
    return new M({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: f.toString(r)
        }
      ]
    });
  }
  _addCheck(e) {
    return new M({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: f.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: f.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: f.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: f.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: f.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: f.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: f.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: f.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: f.toString(e)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && v.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (const s of this._def.checks) {
      if (s.kind === "finite" || s.kind === "int" || s.kind === "multipleOf")
        return !0;
      s.kind === "min" ? (t === null || s.value > t) && (t = s.value) : s.kind === "max" && (e === null || s.value < e) && (e = s.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
M.create = (a) => new M({
  checks: [],
  typeName: m.ZodNumber,
  coerce: a?.coerce || !1,
  ...y(a)
});
class q extends g {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce)
      try {
        e.data = BigInt(e.data);
      } catch {
        return this._getInvalidInput(e);
      }
    if (this._getType(e) !== u.bigint)
      return this._getInvalidInput(e);
    let s;
    const r = new T();
    for (const n of this._def.checks)
      n.kind === "min" ? (n.inclusive ? e.data < n.value : e.data <= n.value) && (s = this._getOrReturnCtx(e, s), c(s, {
        code: d.too_small,
        type: "bigint",
        minimum: n.value,
        inclusive: n.inclusive,
        message: n.message
      }), r.dirty()) : n.kind === "max" ? (n.inclusive ? e.data > n.value : e.data >= n.value) && (s = this._getOrReturnCtx(e, s), c(s, {
        code: d.too_big,
        type: "bigint",
        maximum: n.value,
        inclusive: n.inclusive,
        message: n.message
      }), r.dirty()) : n.kind === "multipleOf" ? e.data % n.value !== BigInt(0) && (s = this._getOrReturnCtx(e, s), c(s, {
        code: d.not_multiple_of,
        multipleOf: n.value,
        message: n.message
      }), r.dirty()) : v.assertNever(n);
    return { status: r.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return c(t, {
      code: d.invalid_type,
      expected: u.bigint,
      received: t.parsedType
    }), _;
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, f.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, f.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, f.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, f.toString(t));
  }
  setLimit(e, t, s, r) {
    return new q({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: f.toString(r)
        }
      ]
    });
  }
  _addCheck(e) {
    return new q({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: f.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: f.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: f.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: f.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: f.toString(t)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
q.create = (a) => new q({
  checks: [],
  typeName: m.ZodBigInt,
  coerce: a?.coerce ?? !1,
  ...y(a)
});
class te extends g {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== u.boolean) {
      const s = this._getOrReturnCtx(e);
      return c(s, {
        code: d.invalid_type,
        expected: u.boolean,
        received: s.parsedType
      }), _;
    }
    return S(e.data);
  }
}
te.create = (a) => new te({
  typeName: m.ZodBoolean,
  coerce: a?.coerce || !1,
  ...y(a)
});
class Y extends g {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== u.date) {
      const n = this._getOrReturnCtx(e);
      return c(n, {
        code: d.invalid_type,
        expected: u.date,
        received: n.parsedType
      }), _;
    }
    if (Number.isNaN(e.data.getTime())) {
      const n = this._getOrReturnCtx(e);
      return c(n, {
        code: d.invalid_date
      }), _;
    }
    const s = new T();
    let r;
    for (const n of this._def.checks)
      n.kind === "min" ? e.data.getTime() < n.value && (r = this._getOrReturnCtx(e, r), c(r, {
        code: d.too_small,
        message: n.message,
        inclusive: !0,
        exact: !1,
        minimum: n.value,
        type: "date"
      }), s.dirty()) : n.kind === "max" ? e.data.getTime() > n.value && (r = this._getOrReturnCtx(e, r), c(r, {
        code: d.too_big,
        message: n.message,
        inclusive: !0,
        exact: !1,
        maximum: n.value,
        type: "date"
      }), s.dirty()) : v.assertNever(n);
    return {
      status: s.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new Y({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: f.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: f.toString(t)
    });
  }
  get minDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
}
Y.create = (a) => new Y({
  checks: [],
  coerce: a?.coerce || !1,
  typeName: m.ZodDate,
  ...y(a)
});
class _e extends g {
  _parse(e) {
    if (this._getType(e) !== u.symbol) {
      const s = this._getOrReturnCtx(e);
      return c(s, {
        code: d.invalid_type,
        expected: u.symbol,
        received: s.parsedType
      }), _;
    }
    return S(e.data);
  }
}
_e.create = (a) => new _e({
  typeName: m.ZodSymbol,
  ...y(a)
});
class ye extends g {
  _parse(e) {
    if (this._getType(e) !== u.undefined) {
      const s = this._getOrReturnCtx(e);
      return c(s, {
        code: d.invalid_type,
        expected: u.undefined,
        received: s.parsedType
      }), _;
    }
    return S(e.data);
  }
}
ye.create = (a) => new ye({
  typeName: m.ZodUndefined,
  ...y(a)
});
class ge extends g {
  _parse(e) {
    if (this._getType(e) !== u.null) {
      const s = this._getOrReturnCtx(e);
      return c(s, {
        code: d.invalid_type,
        expected: u.null,
        received: s.parsedType
      }), _;
    }
    return S(e.data);
  }
}
ge.create = (a) => new ge({
  typeName: m.ZodNull,
  ...y(a)
});
class ve extends g {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return S(e.data);
  }
}
ve.create = (a) => new ve({
  typeName: m.ZodAny,
  ...y(a)
});
class se extends g {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return S(e.data);
  }
}
se.create = (a) => new se({
  typeName: m.ZodUnknown,
  ...y(a)
});
class I extends g {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return c(t, {
      code: d.invalid_type,
      expected: u.never,
      received: t.parsedType
    }), _;
  }
}
I.create = (a) => new I({
  typeName: m.ZodNever,
  ...y(a)
});
class xe extends g {
  _parse(e) {
    if (this._getType(e) !== u.undefined) {
      const s = this._getOrReturnCtx(e);
      return c(s, {
        code: d.invalid_type,
        expected: u.void,
        received: s.parsedType
      }), _;
    }
    return S(e.data);
  }
}
xe.create = (a) => new xe({
  typeName: m.ZodVoid,
  ...y(a)
});
class O extends g {
  _parse(e) {
    const { ctx: t, status: s } = this._processInputParams(e), r = this._def;
    if (t.parsedType !== u.array)
      return c(t, {
        code: d.invalid_type,
        expected: u.array,
        received: t.parsedType
      }), _;
    if (r.exactLength !== null) {
      const i = t.data.length > r.exactLength.value, o = t.data.length < r.exactLength.value;
      (i || o) && (c(t, {
        code: i ? d.too_big : d.too_small,
        minimum: o ? r.exactLength.value : void 0,
        maximum: i ? r.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: r.exactLength.message
      }), s.dirty());
    }
    if (r.minLength !== null && t.data.length < r.minLength.value && (c(t, {
      code: d.too_small,
      minimum: r.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: r.minLength.message
    }), s.dirty()), r.maxLength !== null && t.data.length > r.maxLength.value && (c(t, {
      code: d.too_big,
      maximum: r.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: r.maxLength.message
    }), s.dirty()), t.common.async)
      return Promise.all([...t.data].map((i, o) => r.type._parseAsync(new N(t, i, t.path, o)))).then((i) => T.mergeArray(s, i));
    const n = [...t.data].map((i, o) => r.type._parseSync(new N(t, i, t.path, o)));
    return T.mergeArray(s, n);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new O({
      ...this._def,
      minLength: { value: e, message: f.toString(t) }
    });
  }
  max(e, t) {
    return new O({
      ...this._def,
      maxLength: { value: e, message: f.toString(t) }
    });
  }
  length(e, t) {
    return new O({
      ...this._def,
      exactLength: { value: e, message: f.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
O.create = (a, e) => new O({
  type: a,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: m.ZodArray,
  ...y(e)
});
function $(a) {
  if (a instanceof b) {
    const e = {};
    for (const t in a.shape) {
      const s = a.shape[t];
      e[t] = j.create($(s));
    }
    return new b({
      ...a._def,
      shape: () => e
    });
  } else return a instanceof O ? new O({
    ...a._def,
    type: $(a.element)
  }) : a instanceof j ? j.create($(a.unwrap())) : a instanceof z ? z.create($(a.unwrap())) : a instanceof E ? E.create(a.items.map((e) => $(e))) : a;
}
class b extends g {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = v.objectKeys(e);
    return this._cached = { shape: e, keys: t }, this._cached;
  }
  _parse(e) {
    if (this._getType(e) !== u.object) {
      const p = this._getOrReturnCtx(e);
      return c(p, {
        code: d.invalid_type,
        expected: u.object,
        received: p.parsedType
      }), _;
    }
    const { status: s, ctx: r } = this._processInputParams(e), { shape: n, keys: i } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof I && this._def.unknownKeys === "strip"))
      for (const p in r.data)
        i.includes(p) || o.push(p);
    const h = [];
    for (const p of i) {
      const x = n[p], B = r.data[p];
      h.push({
        key: { status: "valid", value: p },
        value: x._parse(new N(r, B, r.path, p)),
        alwaysSet: p in r.data
      });
    }
    if (this._def.catchall instanceof I) {
      const p = this._def.unknownKeys;
      if (p === "passthrough")
        for (const x of o)
          h.push({
            key: { status: "valid", value: x },
            value: { status: "valid", value: r.data[x] }
          });
      else if (p === "strict")
        o.length > 0 && (c(r, {
          code: d.unrecognized_keys,
          keys: o
        }), s.dirty());
      else if (p !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const p = this._def.catchall;
      for (const x of o) {
        const B = r.data[x];
        h.push({
          key: { status: "valid", value: x },
          value: p._parse(
            new N(r, B, r.path, x)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: x in r.data
        });
      }
    }
    return r.common.async ? Promise.resolve().then(async () => {
      const p = [];
      for (const x of h) {
        const B = await x.key, Ze = await x.value;
        p.push({
          key: B,
          value: Ze,
          alwaysSet: x.alwaysSet
        });
      }
      return p;
    }).then((p) => T.mergeObjectSync(s, p)) : T.mergeObjectSync(s, h);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return f.errToObj, new b({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, s) => {
          const r = this._def.errorMap?.(t, s).message ?? s.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: f.errToObj(e).message ?? r
          } : {
            message: r
          };
        }
      } : {}
    });
  }
  strip() {
    return new b({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new b({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(e) {
    return new b({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...e
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(e) {
    return new b({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: m.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(e, t) {
    return this.augment({ [e]: t });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(e) {
    return new b({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    for (const s of v.objectKeys(e))
      e[s] && this.shape[s] && (t[s] = this.shape[s]);
    return new b({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    for (const s of v.objectKeys(this.shape))
      e[s] || (t[s] = this.shape[s]);
    return new b({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return $(this);
  }
  partial(e) {
    const t = {};
    for (const s of v.objectKeys(this.shape)) {
      const r = this.shape[s];
      e && !e[s] ? t[s] = r : t[s] = r.optional();
    }
    return new b({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    for (const s of v.objectKeys(this.shape))
      if (e && !e[s])
        t[s] = this.shape[s];
      else {
        let n = this.shape[s];
        for (; n instanceof j; )
          n = n._def.innerType;
        t[s] = n;
      }
    return new b({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return Oe(v.objectKeys(this.shape));
  }
}
b.create = (a, e) => new b({
  shape: () => a,
  unknownKeys: "strip",
  catchall: I.create(),
  typeName: m.ZodObject,
  ...y(e)
});
b.strictCreate = (a, e) => new b({
  shape: () => a,
  unknownKeys: "strict",
  catchall: I.create(),
  typeName: m.ZodObject,
  ...y(e)
});
b.lazycreate = (a, e) => new b({
  shape: a,
  unknownKeys: "strip",
  catchall: I.create(),
  typeName: m.ZodObject,
  ...y(e)
});
class H extends g {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = this._def.options;
    function r(n) {
      for (const o of n)
        if (o.result.status === "valid")
          return o.result;
      for (const o of n)
        if (o.result.status === "dirty")
          return t.common.issues.push(...o.ctx.common.issues), o.result;
      const i = n.map((o) => new Z(o.ctx.common.issues));
      return c(t, {
        code: d.invalid_union,
        unionErrors: i
      }), _;
    }
    if (t.common.async)
      return Promise.all(s.map(async (n) => {
        const i = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await n._parseAsync({
            data: t.data,
            path: t.path,
            parent: i
          }),
          ctx: i
        };
      })).then(r);
    {
      let n;
      const i = [];
      for (const h of s) {
        const p = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, x = h._parseSync({
          data: t.data,
          path: t.path,
          parent: p
        });
        if (x.status === "valid")
          return x;
        x.status === "dirty" && !n && (n = { result: x, ctx: p }), p.common.issues.length && i.push(p.common.issues);
      }
      if (n)
        return t.common.issues.push(...n.ctx.common.issues), n.result;
      const o = i.map((h) => new Z(h));
      return c(t, {
        code: d.invalid_union,
        unionErrors: o
      }), _;
    }
  }
  get options() {
    return this._def.options;
  }
}
H.create = (a, e) => new H({
  options: a,
  typeName: m.ZodUnion,
  ...y(e)
});
function ae(a, e) {
  const t = R(a), s = R(e);
  if (a === e)
    return { valid: !0, data: a };
  if (t === u.object && s === u.object) {
    const r = v.objectKeys(e), n = v.objectKeys(a).filter((o) => r.indexOf(o) !== -1), i = { ...a, ...e };
    for (const o of n) {
      const h = ae(a[o], e[o]);
      if (!h.valid)
        return { valid: !1 };
      i[o] = h.data;
    }
    return { valid: !0, data: i };
  } else if (t === u.array && s === u.array) {
    if (a.length !== e.length)
      return { valid: !1 };
    const r = [];
    for (let n = 0; n < a.length; n++) {
      const i = a[n], o = e[n], h = ae(i, o);
      if (!h.valid)
        return { valid: !1 };
      r.push(h.data);
    }
    return { valid: !0, data: r };
  } else return t === u.date && s === u.date && +a == +e ? { valid: !0, data: a } : { valid: !1 };
}
class G extends g {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), r = (n, i) => {
      if (he(n) || he(i))
        return _;
      const o = ae(n.value, i.value);
      return o.valid ? ((pe(n) || pe(i)) && t.dirty(), { status: t.value, value: o.data }) : (c(s, {
        code: d.invalid_intersection_types
      }), _);
    };
    return s.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: s.data,
        path: s.path,
        parent: s
      }),
      this._def.right._parseAsync({
        data: s.data,
        path: s.path,
        parent: s
      })
    ]).then(([n, i]) => r(n, i)) : r(this._def.left._parseSync({
      data: s.data,
      path: s.path,
      parent: s
    }), this._def.right._parseSync({
      data: s.data,
      path: s.path,
      parent: s
    }));
  }
}
G.create = (a, e, t) => new G({
  left: a,
  right: e,
  typeName: m.ZodIntersection,
  ...y(t)
});
class E extends g {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== u.array)
      return c(s, {
        code: d.invalid_type,
        expected: u.array,
        received: s.parsedType
      }), _;
    if (s.data.length < this._def.items.length)
      return c(s, {
        code: d.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), _;
    !this._def.rest && s.data.length > this._def.items.length && (c(s, {
      code: d.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const n = [...s.data].map((i, o) => {
      const h = this._def.items[o] || this._def.rest;
      return h ? h._parse(new N(s, i, s.path, o)) : null;
    }).filter((i) => !!i);
    return s.common.async ? Promise.all(n).then((i) => T.mergeArray(t, i)) : T.mergeArray(t, n);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new E({
      ...this._def,
      rest: e
    });
  }
}
E.create = (a, e) => {
  if (!Array.isArray(a))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new E({
    items: a,
    typeName: m.ZodTuple,
    rest: null,
    ...y(e)
  });
};
class Q extends g {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== u.object)
      return c(s, {
        code: d.invalid_type,
        expected: u.object,
        received: s.parsedType
      }), _;
    const r = [], n = this._def.keyType, i = this._def.valueType;
    for (const o in s.data)
      r.push({
        key: n._parse(new N(s, o, s.path, o)),
        value: i._parse(new N(s, s.data[o], s.path, o)),
        alwaysSet: o in s.data
      });
    return s.common.async ? T.mergeObjectAsync(t, r) : T.mergeObjectSync(t, r);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, s) {
    return t instanceof g ? new Q({
      keyType: e,
      valueType: t,
      typeName: m.ZodRecord,
      ...y(s)
    }) : new Q({
      keyType: A.create(),
      valueType: e,
      typeName: m.ZodRecord,
      ...y(t)
    });
  }
}
class ke extends g {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== u.map)
      return c(s, {
        code: d.invalid_type,
        expected: u.map,
        received: s.parsedType
      }), _;
    const r = this._def.keyType, n = this._def.valueType, i = [...s.data.entries()].map(([o, h], p) => ({
      key: r._parse(new N(s, o, s.path, [p, "key"])),
      value: n._parse(new N(s, h, s.path, [p, "value"]))
    }));
    if (s.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const h of i) {
          const p = await h.key, x = await h.value;
          if (p.status === "aborted" || x.status === "aborted")
            return _;
          (p.status === "dirty" || x.status === "dirty") && t.dirty(), o.set(p.value, x.value);
        }
        return { status: t.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const h of i) {
        const p = h.key, x = h.value;
        if (p.status === "aborted" || x.status === "aborted")
          return _;
        (p.status === "dirty" || x.status === "dirty") && t.dirty(), o.set(p.value, x.value);
      }
      return { status: t.value, value: o };
    }
  }
}
ke.create = (a, e, t) => new ke({
  valueType: e,
  keyType: a,
  typeName: m.ZodMap,
  ...y(t)
});
class W extends g {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== u.set)
      return c(s, {
        code: d.invalid_type,
        expected: u.set,
        received: s.parsedType
      }), _;
    const r = this._def;
    r.minSize !== null && s.data.size < r.minSize.value && (c(s, {
      code: d.too_small,
      minimum: r.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: r.minSize.message
    }), t.dirty()), r.maxSize !== null && s.data.size > r.maxSize.value && (c(s, {
      code: d.too_big,
      maximum: r.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: r.maxSize.message
    }), t.dirty());
    const n = this._def.valueType;
    function i(h) {
      const p = /* @__PURE__ */ new Set();
      for (const x of h) {
        if (x.status === "aborted")
          return _;
        x.status === "dirty" && t.dirty(), p.add(x.value);
      }
      return { status: t.value, value: p };
    }
    const o = [...s.data.values()].map((h, p) => n._parse(new N(s, h, s.path, p)));
    return s.common.async ? Promise.all(o).then((h) => i(h)) : i(o);
  }
  min(e, t) {
    return new W({
      ...this._def,
      minSize: { value: e, message: f.toString(t) }
    });
  }
  max(e, t) {
    return new W({
      ...this._def,
      maxSize: { value: e, message: f.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
W.create = (a, e) => new W({
  valueType: a,
  minSize: null,
  maxSize: null,
  typeName: m.ZodSet,
  ...y(e)
});
class be extends g {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
be.create = (a, e) => new be({
  getter: a,
  typeName: m.ZodLazy,
  ...y(e)
});
class re extends g {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return c(t, {
        received: t.data,
        code: d.invalid_literal,
        expected: this._def.value
      }), _;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
re.create = (a, e) => new re({
  value: a,
  typeName: m.ZodLiteral,
  ...y(e)
});
function Oe(a, e) {
  return new L({
    values: a,
    typeName: m.ZodEnum,
    ...y(e)
  });
}
class L extends g {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return c(t, {
        expected: v.joinValues(s),
        received: t.parsedType,
        code: d.invalid_type
      }), _;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return c(t, {
        received: t.data,
        code: d.invalid_enum_value,
        options: s
      }), _;
    }
    return S(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Values() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  extract(e, t = this._def) {
    return L.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return L.create(this.options.filter((s) => !e.includes(s)), {
      ...this._def,
      ...t
    });
  }
}
L.create = Oe;
class we extends g {
  _parse(e) {
    const t = v.getValidEnumValues(this._def.values), s = this._getOrReturnCtx(e);
    if (s.parsedType !== u.string && s.parsedType !== u.number) {
      const r = v.objectValues(t);
      return c(s, {
        expected: v.joinValues(r),
        received: s.parsedType,
        code: d.invalid_type
      }), _;
    }
    if (this._cache || (this._cache = new Set(v.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const r = v.objectValues(t);
      return c(s, {
        received: s.data,
        code: d.invalid_enum_value,
        options: r
      }), _;
    }
    return S(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
we.create = (a, e) => new we({
  values: a,
  typeName: m.ZodNativeEnum,
  ...y(e)
});
class X extends g {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== u.promise && t.common.async === !1)
      return c(t, {
        code: d.invalid_type,
        expected: u.promise,
        received: t.parsedType
      }), _;
    const s = t.parsedType === u.promise ? t.data : Promise.resolve(t.data);
    return S(s.then((r) => this._def.type.parseAsync(r, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
X.create = (a, e) => new X({
  type: a,
  typeName: m.ZodPromise,
  ...y(e)
});
class P extends g {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === m.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), r = this._def.effect || null, n = {
      addIssue: (i) => {
        c(s, i), i.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return s.path;
      }
    };
    if (n.addIssue = n.addIssue.bind(n), r.type === "preprocess") {
      const i = r.transform(s.data, n);
      if (s.common.async)
        return Promise.resolve(i).then(async (o) => {
          if (t.value === "aborted")
            return _;
          const h = await this._def.schema._parseAsync({
            data: o,
            path: s.path,
            parent: s
          });
          return h.status === "aborted" ? _ : h.status === "dirty" || t.value === "dirty" ? F(h.value) : h;
        });
      {
        if (t.value === "aborted")
          return _;
        const o = this._def.schema._parseSync({
          data: i,
          path: s.path,
          parent: s
        });
        return o.status === "aborted" ? _ : o.status === "dirty" || t.value === "dirty" ? F(o.value) : o;
      }
    }
    if (r.type === "refinement") {
      const i = (o) => {
        const h = r.refinement(o, n);
        if (s.common.async)
          return Promise.resolve(h);
        if (h instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o;
      };
      if (s.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        return o.status === "aborted" ? _ : (o.status === "dirty" && t.dirty(), i(o.value), { status: t.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((o) => o.status === "aborted" ? _ : (o.status === "dirty" && t.dirty(), i(o.value).then(() => ({ status: t.value, value: o.value }))));
    }
    if (r.type === "transform")
      if (s.common.async === !1) {
        const i = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        if (!V(i))
          return _;
        const o = r.transform(i.value, n);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((i) => V(i) ? Promise.resolve(r.transform(i.value, n)).then((o) => ({
          status: t.value,
          value: o
        })) : _);
    v.assertNever(r);
  }
}
P.create = (a, e, t) => new P({
  schema: a,
  typeName: m.ZodEffects,
  effect: e,
  ...y(t)
});
P.createWithPreprocess = (a, e, t) => new P({
  schema: e,
  effect: { type: "preprocess", transform: a },
  typeName: m.ZodEffects,
  ...y(t)
});
class j extends g {
  _parse(e) {
    return this._getType(e) === u.undefined ? S(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
j.create = (a, e) => new j({
  innerType: a,
  typeName: m.ZodOptional,
  ...y(e)
});
class z extends g {
  _parse(e) {
    return this._getType(e) === u.null ? S(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
z.create = (a, e) => new z({
  innerType: a,
  typeName: m.ZodNullable,
  ...y(e)
});
class ne extends g {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let s = t.data;
    return t.parsedType === u.undefined && (s = this._def.defaultValue()), this._def.innerType._parse({
      data: s,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ne.create = (a, e) => new ne({
  innerType: a,
  typeName: m.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...y(e)
});
class ie extends g {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, r = this._def.innerType._parse({
      data: s.data,
      path: s.path,
      parent: {
        ...s
      }
    });
    return J(r) ? r.then((n) => ({
      status: "valid",
      value: n.status === "valid" ? n.value : this._def.catchValue({
        get error() {
          return new Z(s.common.issues);
        },
        input: s.data
      })
    })) : {
      status: "valid",
      value: r.status === "valid" ? r.value : this._def.catchValue({
        get error() {
          return new Z(s.common.issues);
        },
        input: s.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
ie.create = (a, e) => new ie({
  innerType: a,
  typeName: m.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...y(e)
});
class Te extends g {
  _parse(e) {
    if (this._getType(e) !== u.nan) {
      const s = this._getOrReturnCtx(e);
      return c(s, {
        code: d.invalid_type,
        expected: u.nan,
        received: s.parsedType
      }), _;
    }
    return { status: "valid", value: e.data };
  }
}
Te.create = (a) => new Te({
  typeName: m.ZodNaN,
  ...y(a)
});
class st extends g {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = t.data;
    return this._def.type._parse({
      data: s,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class ce extends g {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.common.async)
      return (async () => {
        const n = await this._def.in._parseAsync({
          data: s.data,
          path: s.path,
          parent: s
        });
        return n.status === "aborted" ? _ : n.status === "dirty" ? (t.dirty(), F(n.value)) : this._def.out._parseAsync({
          data: n.value,
          path: s.path,
          parent: s
        });
      })();
    {
      const r = this._def.in._parseSync({
        data: s.data,
        path: s.path,
        parent: s
      });
      return r.status === "aborted" ? _ : r.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: r.value
      }) : this._def.out._parseSync({
        data: r.value,
        path: s.path,
        parent: s
      });
    }
  }
  static create(e, t) {
    return new ce({
      in: e,
      out: t,
      typeName: m.ZodPipeline
    });
  }
}
class oe extends g {
  _parse(e) {
    const t = this._def.innerType._parse(e), s = (r) => (V(r) && (r.value = Object.freeze(r.value)), r);
    return J(t) ? t.then((r) => s(r)) : s(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
oe.create = (a, e) => new oe({
  innerType: a,
  typeName: m.ZodReadonly,
  ...y(e)
});
var m;
(function(a) {
  a.ZodString = "ZodString", a.ZodNumber = "ZodNumber", a.ZodNaN = "ZodNaN", a.ZodBigInt = "ZodBigInt", a.ZodBoolean = "ZodBoolean", a.ZodDate = "ZodDate", a.ZodSymbol = "ZodSymbol", a.ZodUndefined = "ZodUndefined", a.ZodNull = "ZodNull", a.ZodAny = "ZodAny", a.ZodUnknown = "ZodUnknown", a.ZodNever = "ZodNever", a.ZodVoid = "ZodVoid", a.ZodArray = "ZodArray", a.ZodObject = "ZodObject", a.ZodUnion = "ZodUnion", a.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", a.ZodIntersection = "ZodIntersection", a.ZodTuple = "ZodTuple", a.ZodRecord = "ZodRecord", a.ZodMap = "ZodMap", a.ZodSet = "ZodSet", a.ZodFunction = "ZodFunction", a.ZodLazy = "ZodLazy", a.ZodLiteral = "ZodLiteral", a.ZodEnum = "ZodEnum", a.ZodEffects = "ZodEffects", a.ZodNativeEnum = "ZodNativeEnum", a.ZodOptional = "ZodOptional", a.ZodNullable = "ZodNullable", a.ZodDefault = "ZodDefault", a.ZodCatch = "ZodCatch", a.ZodPromise = "ZodPromise", a.ZodBranded = "ZodBranded", a.ZodPipeline = "ZodPipeline", a.ZodReadonly = "ZodReadonly";
})(m || (m = {}));
const l = A.create, C = M.create, k = te.create, de = se.create;
I.create;
const D = O.create, w = b.create, pt = H.create;
G.create;
E.create;
const at = Q.create, mt = re.create, ue = L.create;
X.create;
j.create;
z.create;
const U = D(l()), le = at(de()), rt = w({ id: l(), label: l(), hint: l(), file: l().optional(), subscription: k(), format: ue(["json_object", "single_line", "text"]).optional() }), nt = w({ name: l(), label: l(), description: l(), section: l(), group: l(), order: C(), type: l(), values: D(de()).optional(), schema: le.optional(), default: de().optional(), profiles: U.optional() }), it = w({ id: l(), title: l(), icon: l().optional(), credentials: D(rt), endpoints: U, capabilities: U, unattended: le.optional(), options: D(nt) }), ot = w({ protocol: l(), base_url: l(), model: l().optional() }), Ne = w({ memory: l(), cpus: l(), pids_limit: C().int(), gpus: l(), network: l(), extra_args: U, allows: U }), dt = w({ ref: l(), label: l(), home: l(), dockerfile: l(), settings: Ne.optional() }), ct = w({ label_bytes: C().int().positive(), secret_bytes: C().int().positive(), endpoint_url_bytes: C().int().positive(), endpoint_model_bytes: C().int().positive() }), _t = w({ agents: D(it), default_image: dt, can_images: k(), can_workspaces: k(), can_prune: k(), build_cache_retention: l(), settings_path: l().optional(), account_limits: ct.optional() }), yt = w({
  id: l(),
  agent: l(),
  label: l(),
  credential_kind: l(),
  subscription: k(),
  enabled: k(),
  endpoint: ot.optional(),
  owner: l(),
  mine: k(),
  usable: k(),
  unavailable_reason: l().optional(),
  writable: k(),
  deletable: k(),
  last_used_at: l(),
  cooldown_until: l(),
  last_error: l(),
  runs_day: C().int(),
  failures_day: C().int()
}), ut = w({ id: l(), ref: l(), label: l(), home: l(), status: l(), usable: k(), agents: U, last_error: l(), owner: l(), writable: k(), deletable: k(), shareable: k() }), gt = w({ image: ut, build_log: l(), dockerfile: l().optional(), settings: Ne.optional() }), vt = w({ id: l(), name: l(), writable: k(), deletable: k(), shareable: k(), host_path: l().optional() }), lt = w({ input_tokens: C().optional(), output_tokens: C().optional(), cached_tokens: C().optional() }), ft = ue(["queued", "running", "succeeded", "failed", "cancelled"]), Ae = w({
  id: l(),
  agent: l(),
  account_id: l(),
  image_id: l(),
  workspace_id: l().optional(),
  options: le,
  unattended: k(),
  repo_url: l(),
  prompt: l(),
  status: ft,
  result: l(),
  error: l(),
  usage: lt,
  cancel_requested: k(),
  timeout_ms: C(),
  workflow: k(),
  created_at: l(),
  started_at: l(),
  finished_at: l()
}), xt = Ae.pick({ id: !0, agent: !0, account_id: !0, image_id: !0, workspace_id: !0, status: !0, workflow: !0, cancel_requested: !0, created_at: !0, started_at: !0, finished_at: !0 }).extend({ prompt_summary: l() }), ht = w({ seq: C().int(), kind: ue(["assistant", "reasoning", "tool", "tool_result", "tool_error", "system", "error", "log"]), text: l(), created_at: l() }), kt = w({ run: Ae, events: D(ht), more: k(), next_seq: C().int().nonnegative() });
export {
  it as a,
  ct as b,
  k as c,
  D as d,
  ot as e,
  xt as f,
  yt as g,
  pt as h,
  ut as i,
  kt as j,
  gt as k,
  mt as l,
  _t as m,
  C as n,
  w as o,
  at as r,
  l as s,
  de as u,
  vt as w
};
