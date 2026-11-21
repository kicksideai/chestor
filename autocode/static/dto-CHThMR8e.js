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
var _e;
(function(a) {
  a.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(_e || (_e = {}));
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
]), I = (a) => {
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
}, c = v.arrayToEnum([
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
const ne = (a, e) => {
  let t;
  switch (a.code) {
    case c.invalid_type:
      a.received === u.undefined ? t = "Required" : t = `Expected ${a.expected}, received ${a.received}`;
      break;
    case c.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(a.expected, v.jsonStringifyReplacer)}`;
      break;
    case c.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${v.joinValues(a.keys, ", ")}`;
      break;
    case c.invalid_union:
      t = "Invalid input";
      break;
    case c.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${v.joinValues(a.options)}`;
      break;
    case c.invalid_enum_value:
      t = `Invalid enum value. Expected ${v.joinValues(a.options)}, received '${a.received}'`;
      break;
    case c.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case c.invalid_return_type:
      t = "Invalid function return type";
      break;
    case c.invalid_date:
      t = "Invalid date";
      break;
    case c.invalid_string:
      typeof a.validation == "object" ? "includes" in a.validation ? (t = `Invalid input: must include "${a.validation.includes}"`, typeof a.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${a.validation.position}`)) : "startsWith" in a.validation ? t = `Invalid input: must start with "${a.validation.startsWith}"` : "endsWith" in a.validation ? t = `Invalid input: must end with "${a.validation.endsWith}"` : v.assertNever(a.validation) : a.validation !== "regex" ? t = `Invalid ${a.validation}` : t = "Invalid";
      break;
    case c.too_small:
      a.type === "array" ? t = `Array must contain ${a.exact ? "exactly" : a.inclusive ? "at least" : "more than"} ${a.minimum} element(s)` : a.type === "string" ? t = `String must contain ${a.exact ? "exactly" : a.inclusive ? "at least" : "over"} ${a.minimum} character(s)` : a.type === "number" ? t = `Number must be ${a.exact ? "exactly equal to " : a.inclusive ? "greater than or equal to " : "greater than "}${a.minimum}` : a.type === "bigint" ? t = `Number must be ${a.exact ? "exactly equal to " : a.inclusive ? "greater than or equal to " : "greater than "}${a.minimum}` : a.type === "date" ? t = `Date must be ${a.exact ? "exactly equal to " : a.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(a.minimum))}` : t = "Invalid input";
      break;
    case c.too_big:
      a.type === "array" ? t = `Array must contain ${a.exact ? "exactly" : a.inclusive ? "at most" : "less than"} ${a.maximum} element(s)` : a.type === "string" ? t = `String must contain ${a.exact ? "exactly" : a.inclusive ? "at most" : "under"} ${a.maximum} character(s)` : a.type === "number" ? t = `Number must be ${a.exact ? "exactly" : a.inclusive ? "less than or equal to" : "less than"} ${a.maximum}` : a.type === "bigint" ? t = `BigInt must be ${a.exact ? "exactly" : a.inclusive ? "less than or equal to" : "less than"} ${a.maximum}` : a.type === "date" ? t = `Date must be ${a.exact ? "exactly" : a.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(a.maximum))}` : t = "Invalid input";
      break;
    case c.custom:
      t = "Invalid input";
      break;
    case c.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case c.not_multiple_of:
      t = `Number must be a multiple of ${a.multipleOf}`;
      break;
    case c.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, v.assertNever(a);
  }
  return { message: t };
};
let ze = ne;
function Ue() {
  return ze;
}
const Be = (a) => {
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
function l(a, e) {
  const t = Ue(), s = Be({
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
      t === ne ? void 0 : ne
      // then global default map
    ].filter((r) => !!r)
  });
  a.common.issues.push(s);
}
class C {
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
    return C.mergeObjectSync(e, s);
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
}), W = (a) => ({ status: "dirty", value: a }), O = (a) => ({ status: "valid", value: a }), ge = (a) => a.status === "aborted", ye = (a) => a.status === "dirty", D = (a) => a.status === "valid", H = (a) => typeof Promise < "u" && a instanceof Promise;
var f;
(function(a) {
  a.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, a.toString = (e) => typeof e == "string" ? e : e?.message;
})(f || (f = {}));
class S {
  constructor(e, t, s, r) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = s, this._key = r;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const ve = (a, e) => {
  if (D(e))
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
function g(a) {
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
class y {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return I(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: I(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new C(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: I(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (H(t))
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
      parsedType: I(e)
    }, r = this._parseSync({ data: e, path: s.path, parent: s });
    return ve(s, r);
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
      parsedType: I(e)
    };
    if (!this["~standard"].async)
      try {
        const s = this._parseSync({ data: e, path: [], parent: t });
        return D(s) ? {
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
    return this._parseAsync({ data: e, path: [], parent: t }).then((s) => D(s) ? {
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
      parsedType: I(e)
    }, r = this._parse({ data: e, path: s.path, parent: s }), n = await (H(r) ? r : Promise.resolve(r));
    return ve(s, n);
  }
  refine(e, t) {
    const s = (r) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(r) : t;
    return this._refinement((r, n) => {
      const i = e(r), o = () => n.addIssue({
        code: c.custom,
        ...s(r)
      });
      return typeof Promise < "u" && i instanceof Promise ? i.then((h) => h ? !0 : (o(), !1)) : i ? !0 : (o(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((s, r) => e(s) ? !0 : (r.addIssue(typeof t == "function" ? t(s, r) : t), !1));
  }
  _refinement(e) {
    return new z({
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
    return U.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return A.create(this);
  }
  promise() {
    return ee.create(this, this._def);
  }
  or(e) {
    return Q.create([this, e], this._def);
  }
  and(e) {
    return X.create(this, e, this._def);
  }
  transform(e) {
    return new z({
      ...g(this._def),
      schema: this,
      typeName: m.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new le({
      ...g(this._def),
      innerType: this,
      defaultValue: t,
      typeName: m.ZodDefault
    });
  }
  brand() {
    return new ft({
      typeName: m.ZodBranded,
      type: this,
      ...g(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new ue({
      ...g(this._def),
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
    return he.create(this, e);
  }
  readonly() {
    return fe.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const qe = /^c[^\s-]{8,}$/i, We = /^[0-9a-z]+$/, Fe = /^[0-9A-HJKMNP-TV-Z]{26}$/i, Je = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Ye = /^[a-z0-9_-]{21}$/i, He = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, Ge = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Qe = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Xe = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let re;
const Ke = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, et = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, tt = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, st = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, at = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, rt = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, Ze = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", nt = new RegExp(`^${Ze}$`);
function Ie(a) {
  let e = "[0-5]\\d";
  a.precision ? e = `${e}\\.\\d{${a.precision}}` : a.precision == null && (e = `${e}(\\.\\d+)?`);
  const t = a.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${t}`;
}
function it(a) {
  return new RegExp(`^${Ie(a)}$`);
}
function ot(a) {
  let e = `${Ze}T${Ie(a)}`;
  const t = [];
  return t.push(a.local ? "Z?" : "Z"), a.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function dt(a, e) {
  return !!((e === "v4" || !e) && Ke.test(a) || (e === "v6" || !e) && tt.test(a));
}
function ct(a, e) {
  if (!He.test(a))
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
function lt(a, e) {
  return !!((e === "v4" || !e) && et.test(a) || (e === "v6" || !e) && st.test(a));
}
class R extends y {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== u.string) {
      const n = this._getOrReturnCtx(e);
      return l(n, {
        code: c.invalid_type,
        expected: u.string,
        received: n.parsedType
      }), _;
    }
    const s = new C();
    let r;
    for (const n of this._def.checks)
      if (n.kind === "min")
        e.data.length < n.value && (r = this._getOrReturnCtx(e, r), l(r, {
          code: c.too_small,
          minimum: n.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: n.message
        }), s.dirty());
      else if (n.kind === "max")
        e.data.length > n.value && (r = this._getOrReturnCtx(e, r), l(r, {
          code: c.too_big,
          maximum: n.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: n.message
        }), s.dirty());
      else if (n.kind === "length") {
        const i = e.data.length > n.value, o = e.data.length < n.value;
        (i || o) && (r = this._getOrReturnCtx(e, r), i ? l(r, {
          code: c.too_big,
          maximum: n.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: n.message
        }) : o && l(r, {
          code: c.too_small,
          minimum: n.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: n.message
        }), s.dirty());
      } else if (n.kind === "email")
        Qe.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
          validation: "email",
          code: c.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "emoji")
        re || (re = new RegExp(Xe, "u")), re.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
          validation: "emoji",
          code: c.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "uuid")
        Je.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
          validation: "uuid",
          code: c.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "nanoid")
        Ye.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
          validation: "nanoid",
          code: c.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "cuid")
        qe.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
          validation: "cuid",
          code: c.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "cuid2")
        We.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
          validation: "cuid2",
          code: c.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "ulid")
        Fe.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
          validation: "ulid",
          code: c.invalid_string,
          message: n.message
        }), s.dirty());
      else if (n.kind === "url")
        try {
          new URL(e.data);
        } catch {
          r = this._getOrReturnCtx(e, r), l(r, {
            validation: "url",
            code: c.invalid_string,
            message: n.message
          }), s.dirty();
        }
      else n.kind === "regex" ? (n.regex.lastIndex = 0, n.regex.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
        validation: "regex",
        code: c.invalid_string,
        message: n.message
      }), s.dirty())) : n.kind === "trim" ? e.data = e.data.trim() : n.kind === "includes" ? e.data.includes(n.value, n.position) || (r = this._getOrReturnCtx(e, r), l(r, {
        code: c.invalid_string,
        validation: { includes: n.value, position: n.position },
        message: n.message
      }), s.dirty()) : n.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : n.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : n.kind === "startsWith" ? e.data.startsWith(n.value) || (r = this._getOrReturnCtx(e, r), l(r, {
        code: c.invalid_string,
        validation: { startsWith: n.value },
        message: n.message
      }), s.dirty()) : n.kind === "endsWith" ? e.data.endsWith(n.value) || (r = this._getOrReturnCtx(e, r), l(r, {
        code: c.invalid_string,
        validation: { endsWith: n.value },
        message: n.message
      }), s.dirty()) : n.kind === "datetime" ? ot(n).test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
        code: c.invalid_string,
        validation: "datetime",
        message: n.message
      }), s.dirty()) : n.kind === "date" ? nt.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
        code: c.invalid_string,
        validation: "date",
        message: n.message
      }), s.dirty()) : n.kind === "time" ? it(n).test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
        code: c.invalid_string,
        validation: "time",
        message: n.message
      }), s.dirty()) : n.kind === "duration" ? Ge.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
        validation: "duration",
        code: c.invalid_string,
        message: n.message
      }), s.dirty()) : n.kind === "ip" ? dt(e.data, n.version) || (r = this._getOrReturnCtx(e, r), l(r, {
        validation: "ip",
        code: c.invalid_string,
        message: n.message
      }), s.dirty()) : n.kind === "jwt" ? ct(e.data, n.alg) || (r = this._getOrReturnCtx(e, r), l(r, {
        validation: "jwt",
        code: c.invalid_string,
        message: n.message
      }), s.dirty()) : n.kind === "cidr" ? lt(e.data, n.version) || (r = this._getOrReturnCtx(e, r), l(r, {
        validation: "cidr",
        code: c.invalid_string,
        message: n.message
      }), s.dirty()) : n.kind === "base64" ? at.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
        validation: "base64",
        code: c.invalid_string,
        message: n.message
      }), s.dirty()) : n.kind === "base64url" ? rt.test(e.data) || (r = this._getOrReturnCtx(e, r), l(r, {
        validation: "base64url",
        code: c.invalid_string,
        message: n.message
      }), s.dirty()) : v.assertNever(n);
    return { status: s.value, value: e.data };
  }
  _regex(e, t, s) {
    return this.refinement((r) => e.test(r), {
      validation: t,
      code: c.invalid_string,
      ...f.errToObj(s)
    });
  }
  _addCheck(e) {
    return new R({
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
    return new R({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new R({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new R({
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
R.create = (a) => new R({
  checks: [],
  typeName: m.ZodString,
  coerce: a?.coerce ?? !1,
  ...g(a)
});
function ut(a, e) {
  const t = (a.toString().split(".")[1] || "").length, s = (e.toString().split(".")[1] || "").length, r = t > s ? t : s, n = Number.parseInt(a.toFixed(r).replace(".", "")), i = Number.parseInt(e.toFixed(r).replace(".", ""));
  return n % i / 10 ** r;
}
class P extends y {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== u.number) {
      const n = this._getOrReturnCtx(e);
      return l(n, {
        code: c.invalid_type,
        expected: u.number,
        received: n.parsedType
      }), _;
    }
    let s;
    const r = new C();
    for (const n of this._def.checks)
      n.kind === "int" ? v.isInteger(e.data) || (s = this._getOrReturnCtx(e, s), l(s, {
        code: c.invalid_type,
        expected: "integer",
        received: "float",
        message: n.message
      }), r.dirty()) : n.kind === "min" ? (n.inclusive ? e.data < n.value : e.data <= n.value) && (s = this._getOrReturnCtx(e, s), l(s, {
        code: c.too_small,
        minimum: n.value,
        type: "number",
        inclusive: n.inclusive,
        exact: !1,
        message: n.message
      }), r.dirty()) : n.kind === "max" ? (n.inclusive ? e.data > n.value : e.data >= n.value) && (s = this._getOrReturnCtx(e, s), l(s, {
        code: c.too_big,
        maximum: n.value,
        type: "number",
        inclusive: n.inclusive,
        exact: !1,
        message: n.message
      }), r.dirty()) : n.kind === "multipleOf" ? ut(e.data, n.value) !== 0 && (s = this._getOrReturnCtx(e, s), l(s, {
        code: c.not_multiple_of,
        multipleOf: n.value,
        message: n.message
      }), r.dirty()) : n.kind === "finite" ? Number.isFinite(e.data) || (s = this._getOrReturnCtx(e, s), l(s, {
        code: c.not_finite,
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
    return new P({
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
    return new P({
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
P.create = (a) => new P({
  checks: [],
  typeName: m.ZodNumber,
  coerce: a?.coerce || !1,
  ...g(a)
});
class F extends y {
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
    const r = new C();
    for (const n of this._def.checks)
      n.kind === "min" ? (n.inclusive ? e.data < n.value : e.data <= n.value) && (s = this._getOrReturnCtx(e, s), l(s, {
        code: c.too_small,
        type: "bigint",
        minimum: n.value,
        inclusive: n.inclusive,
        message: n.message
      }), r.dirty()) : n.kind === "max" ? (n.inclusive ? e.data > n.value : e.data >= n.value) && (s = this._getOrReturnCtx(e, s), l(s, {
        code: c.too_big,
        type: "bigint",
        maximum: n.value,
        inclusive: n.inclusive,
        message: n.message
      }), r.dirty()) : n.kind === "multipleOf" ? e.data % n.value !== BigInt(0) && (s = this._getOrReturnCtx(e, s), l(s, {
        code: c.not_multiple_of,
        multipleOf: n.value,
        message: n.message
      }), r.dirty()) : v.assertNever(n);
    return { status: r.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return l(t, {
      code: c.invalid_type,
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
    return new F({
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
    return new F({
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
F.create = (a) => new F({
  checks: [],
  typeName: m.ZodBigInt,
  coerce: a?.coerce ?? !1,
  ...g(a)
});
class ie extends y {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== u.boolean) {
      const s = this._getOrReturnCtx(e);
      return l(s, {
        code: c.invalid_type,
        expected: u.boolean,
        received: s.parsedType
      }), _;
    }
    return O(e.data);
  }
}
ie.create = (a) => new ie({
  typeName: m.ZodBoolean,
  coerce: a?.coerce || !1,
  ...g(a)
});
class G extends y {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== u.date) {
      const n = this._getOrReturnCtx(e);
      return l(n, {
        code: c.invalid_type,
        expected: u.date,
        received: n.parsedType
      }), _;
    }
    if (Number.isNaN(e.data.getTime())) {
      const n = this._getOrReturnCtx(e);
      return l(n, {
        code: c.invalid_date
      }), _;
    }
    const s = new C();
    let r;
    for (const n of this._def.checks)
      n.kind === "min" ? e.data.getTime() < n.value && (r = this._getOrReturnCtx(e, r), l(r, {
        code: c.too_small,
        message: n.message,
        inclusive: !0,
        exact: !1,
        minimum: n.value,
        type: "date"
      }), s.dirty()) : n.kind === "max" ? e.data.getTime() > n.value && (r = this._getOrReturnCtx(e, r), l(r, {
        code: c.too_big,
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
    return new G({
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
G.create = (a) => new G({
  checks: [],
  coerce: a?.coerce || !1,
  typeName: m.ZodDate,
  ...g(a)
});
class ke extends y {
  _parse(e) {
    if (this._getType(e) !== u.symbol) {
      const s = this._getOrReturnCtx(e);
      return l(s, {
        code: c.invalid_type,
        expected: u.symbol,
        received: s.parsedType
      }), _;
    }
    return O(e.data);
  }
}
ke.create = (a) => new ke({
  typeName: m.ZodSymbol,
  ...g(a)
});
class xe extends y {
  _parse(e) {
    if (this._getType(e) !== u.undefined) {
      const s = this._getOrReturnCtx(e);
      return l(s, {
        code: c.invalid_type,
        expected: u.undefined,
        received: s.parsedType
      }), _;
    }
    return O(e.data);
  }
}
xe.create = (a) => new xe({
  typeName: m.ZodUndefined,
  ...g(a)
});
class be extends y {
  _parse(e) {
    if (this._getType(e) !== u.null) {
      const s = this._getOrReturnCtx(e);
      return l(s, {
        code: c.invalid_type,
        expected: u.null,
        received: s.parsedType
      }), _;
    }
    return O(e.data);
  }
}
be.create = (a) => new be({
  typeName: m.ZodNull,
  ...g(a)
});
class we extends y {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return O(e.data);
  }
}
we.create = (a) => new we({
  typeName: m.ZodAny,
  ...g(a)
});
class oe extends y {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return O(e.data);
  }
}
oe.create = (a) => new oe({
  typeName: m.ZodUnknown,
  ...g(a)
});
class E extends y {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return l(t, {
      code: c.invalid_type,
      expected: u.never,
      received: t.parsedType
    }), _;
  }
}
E.create = (a) => new E({
  typeName: m.ZodNever,
  ...g(a)
});
class Te extends y {
  _parse(e) {
    if (this._getType(e) !== u.undefined) {
      const s = this._getOrReturnCtx(e);
      return l(s, {
        code: c.invalid_type,
        expected: u.void,
        received: s.parsedType
      }), _;
    }
    return O(e.data);
  }
}
Te.create = (a) => new Te({
  typeName: m.ZodVoid,
  ...g(a)
});
class A extends y {
  _parse(e) {
    const { ctx: t, status: s } = this._processInputParams(e), r = this._def;
    if (t.parsedType !== u.array)
      return l(t, {
        code: c.invalid_type,
        expected: u.array,
        received: t.parsedType
      }), _;
    if (r.exactLength !== null) {
      const i = t.data.length > r.exactLength.value, o = t.data.length < r.exactLength.value;
      (i || o) && (l(t, {
        code: i ? c.too_big : c.too_small,
        minimum: o ? r.exactLength.value : void 0,
        maximum: i ? r.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: r.exactLength.message
      }), s.dirty());
    }
    if (r.minLength !== null && t.data.length < r.minLength.value && (l(t, {
      code: c.too_small,
      minimum: r.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: r.minLength.message
    }), s.dirty()), r.maxLength !== null && t.data.length > r.maxLength.value && (l(t, {
      code: c.too_big,
      maximum: r.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: r.maxLength.message
    }), s.dirty()), t.common.async)
      return Promise.all([...t.data].map((i, o) => r.type._parseAsync(new S(t, i, t.path, o)))).then((i) => C.mergeArray(s, i));
    const n = [...t.data].map((i, o) => r.type._parseSync(new S(t, i, t.path, o)));
    return C.mergeArray(s, n);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new A({
      ...this._def,
      minLength: { value: e, message: f.toString(t) }
    });
  }
  max(e, t) {
    return new A({
      ...this._def,
      maxLength: { value: e, message: f.toString(t) }
    });
  }
  length(e, t) {
    return new A({
      ...this._def,
      exactLength: { value: e, message: f.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
A.create = (a, e) => new A({
  type: a,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: m.ZodArray,
  ...g(e)
});
function L(a) {
  if (a instanceof T) {
    const e = {};
    for (const t in a.shape) {
      const s = a.shape[t];
      e[t] = j.create(L(s));
    }
    return new T({
      ...a._def,
      shape: () => e
    });
  } else return a instanceof A ? new A({
    ...a._def,
    type: L(a.element)
  }) : a instanceof j ? j.create(L(a.unwrap())) : a instanceof U ? U.create(L(a.unwrap())) : a instanceof $ ? $.create(a.items.map((e) => L(e))) : a;
}
class T extends y {
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
      return l(p, {
        code: c.invalid_type,
        expected: u.object,
        received: p.parsedType
      }), _;
    }
    const { status: s, ctx: r } = this._processInputParams(e), { shape: n, keys: i } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof E && this._def.unknownKeys === "strip"))
      for (const p in r.data)
        i.includes(p) || o.push(p);
    const h = [];
    for (const p of i) {
      const k = n[p], q = r.data[p];
      h.push({
        key: { status: "valid", value: p },
        value: k._parse(new S(r, q, r.path, p)),
        alwaysSet: p in r.data
      });
    }
    if (this._def.catchall instanceof E) {
      const p = this._def.unknownKeys;
      if (p === "passthrough")
        for (const k of o)
          h.push({
            key: { status: "valid", value: k },
            value: { status: "valid", value: r.data[k] }
          });
      else if (p === "strict")
        o.length > 0 && (l(r, {
          code: c.unrecognized_keys,
          keys: o
        }), s.dirty());
      else if (p !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const p = this._def.catchall;
      for (const k of o) {
        const q = r.data[k];
        h.push({
          key: { status: "valid", value: k },
          value: p._parse(
            new S(r, q, r.path, k)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: k in r.data
        });
      }
    }
    return r.common.async ? Promise.resolve().then(async () => {
      const p = [];
      for (const k of h) {
        const q = await k.key, Me = await k.value;
        p.push({
          key: q,
          value: Me,
          alwaysSet: k.alwaysSet
        });
      }
      return p;
    }).then((p) => C.mergeObjectSync(s, p)) : C.mergeObjectSync(s, h);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return f.errToObj, new T({
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
    return new T({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new T({
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
    return new T({
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
    return new T({
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
    return new T({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    for (const s of v.objectKeys(e))
      e[s] && this.shape[s] && (t[s] = this.shape[s]);
    return new T({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    for (const s of v.objectKeys(this.shape))
      e[s] || (t[s] = this.shape[s]);
    return new T({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return L(this);
  }
  partial(e) {
    const t = {};
    for (const s of v.objectKeys(this.shape)) {
      const r = this.shape[s];
      e && !e[s] ? t[s] = r : t[s] = r.optional();
    }
    return new T({
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
    return new T({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return je(v.objectKeys(this.shape));
  }
}
T.create = (a, e) => new T({
  shape: () => a,
  unknownKeys: "strip",
  catchall: E.create(),
  typeName: m.ZodObject,
  ...g(e)
});
T.strictCreate = (a, e) => new T({
  shape: () => a,
  unknownKeys: "strict",
  catchall: E.create(),
  typeName: m.ZodObject,
  ...g(e)
});
T.lazycreate = (a, e) => new T({
  shape: a,
  unknownKeys: "strip",
  catchall: E.create(),
  typeName: m.ZodObject,
  ...g(e)
});
class Q extends y {
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
      return l(t, {
        code: c.invalid_union,
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
        }, k = h._parseSync({
          data: t.data,
          path: t.path,
          parent: p
        });
        if (k.status === "valid")
          return k;
        k.status === "dirty" && !n && (n = { result: k, ctx: p }), p.common.issues.length && i.push(p.common.issues);
      }
      if (n)
        return t.common.issues.push(...n.ctx.common.issues), n.result;
      const o = i.map((h) => new Z(h));
      return l(t, {
        code: c.invalid_union,
        unionErrors: o
      }), _;
    }
  }
  get options() {
    return this._def.options;
  }
}
Q.create = (a, e) => new Q({
  options: a,
  typeName: m.ZodUnion,
  ...g(e)
});
function de(a, e) {
  const t = I(a), s = I(e);
  if (a === e)
    return { valid: !0, data: a };
  if (t === u.object && s === u.object) {
    const r = v.objectKeys(e), n = v.objectKeys(a).filter((o) => r.indexOf(o) !== -1), i = { ...a, ...e };
    for (const o of n) {
      const h = de(a[o], e[o]);
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
      const i = a[n], o = e[n], h = de(i, o);
      if (!h.valid)
        return { valid: !1 };
      r.push(h.data);
    }
    return { valid: !0, data: r };
  } else return t === u.date && s === u.date && +a == +e ? { valid: !0, data: a } : { valid: !1 };
}
class X extends y {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), r = (n, i) => {
      if (ge(n) || ge(i))
        return _;
      const o = de(n.value, i.value);
      return o.valid ? ((ye(n) || ye(i)) && t.dirty(), { status: t.value, value: o.data }) : (l(s, {
        code: c.invalid_intersection_types
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
X.create = (a, e, t) => new X({
  left: a,
  right: e,
  typeName: m.ZodIntersection,
  ...g(t)
});
class $ extends y {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== u.array)
      return l(s, {
        code: c.invalid_type,
        expected: u.array,
        received: s.parsedType
      }), _;
    if (s.data.length < this._def.items.length)
      return l(s, {
        code: c.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), _;
    !this._def.rest && s.data.length > this._def.items.length && (l(s, {
      code: c.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const n = [...s.data].map((i, o) => {
      const h = this._def.items[o] || this._def.rest;
      return h ? h._parse(new S(s, i, s.path, o)) : null;
    }).filter((i) => !!i);
    return s.common.async ? Promise.all(n).then((i) => C.mergeArray(t, i)) : C.mergeArray(t, n);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new $({
      ...this._def,
      rest: e
    });
  }
}
$.create = (a, e) => {
  if (!Array.isArray(a))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new $({
    items: a,
    typeName: m.ZodTuple,
    rest: null,
    ...g(e)
  });
};
class K extends y {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== u.object)
      return l(s, {
        code: c.invalid_type,
        expected: u.object,
        received: s.parsedType
      }), _;
    const r = [], n = this._def.keyType, i = this._def.valueType;
    for (const o in s.data)
      r.push({
        key: n._parse(new S(s, o, s.path, o)),
        value: i._parse(new S(s, s.data[o], s.path, o)),
        alwaysSet: o in s.data
      });
    return s.common.async ? C.mergeObjectAsync(t, r) : C.mergeObjectSync(t, r);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, s) {
    return t instanceof y ? new K({
      keyType: e,
      valueType: t,
      typeName: m.ZodRecord,
      ...g(s)
    }) : new K({
      keyType: R.create(),
      valueType: e,
      typeName: m.ZodRecord,
      ...g(t)
    });
  }
}
class Ce extends y {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== u.map)
      return l(s, {
        code: c.invalid_type,
        expected: u.map,
        received: s.parsedType
      }), _;
    const r = this._def.keyType, n = this._def.valueType, i = [...s.data.entries()].map(([o, h], p) => ({
      key: r._parse(new S(s, o, s.path, [p, "key"])),
      value: n._parse(new S(s, h, s.path, [p, "value"]))
    }));
    if (s.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const h of i) {
          const p = await h.key, k = await h.value;
          if (p.status === "aborted" || k.status === "aborted")
            return _;
          (p.status === "dirty" || k.status === "dirty") && t.dirty(), o.set(p.value, k.value);
        }
        return { status: t.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const h of i) {
        const p = h.key, k = h.value;
        if (p.status === "aborted" || k.status === "aborted")
          return _;
        (p.status === "dirty" || k.status === "dirty") && t.dirty(), o.set(p.value, k.value);
      }
      return { status: t.value, value: o };
    }
  }
}
Ce.create = (a, e, t) => new Ce({
  valueType: e,
  keyType: a,
  typeName: m.ZodMap,
  ...g(t)
});
class J extends y {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== u.set)
      return l(s, {
        code: c.invalid_type,
        expected: u.set,
        received: s.parsedType
      }), _;
    const r = this._def;
    r.minSize !== null && s.data.size < r.minSize.value && (l(s, {
      code: c.too_small,
      minimum: r.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: r.minSize.message
    }), t.dirty()), r.maxSize !== null && s.data.size > r.maxSize.value && (l(s, {
      code: c.too_big,
      maximum: r.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: r.maxSize.message
    }), t.dirty());
    const n = this._def.valueType;
    function i(h) {
      const p = /* @__PURE__ */ new Set();
      for (const k of h) {
        if (k.status === "aborted")
          return _;
        k.status === "dirty" && t.dirty(), p.add(k.value);
      }
      return { status: t.value, value: p };
    }
    const o = [...s.data.values()].map((h, p) => n._parse(new S(s, h, s.path, p)));
    return s.common.async ? Promise.all(o).then((h) => i(h)) : i(o);
  }
  min(e, t) {
    return new J({
      ...this._def,
      minSize: { value: e, message: f.toString(t) }
    });
  }
  max(e, t) {
    return new J({
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
J.create = (a, e) => new J({
  valueType: a,
  minSize: null,
  maxSize: null,
  typeName: m.ZodSet,
  ...g(e)
});
class Oe extends y {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
Oe.create = (a, e) => new Oe({
  getter: a,
  typeName: m.ZodLazy,
  ...g(e)
});
class ce extends y {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return l(t, {
        received: t.data,
        code: c.invalid_literal,
        expected: this._def.value
      }), _;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
ce.create = (a, e) => new ce({
  value: a,
  typeName: m.ZodLiteral,
  ...g(e)
});
function je(a, e) {
  return new M({
    values: a,
    typeName: m.ZodEnum,
    ...g(e)
  });
}
class M extends y {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return l(t, {
        expected: v.joinValues(s),
        received: t.parsedType,
        code: c.invalid_type
      }), _;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return l(t, {
        received: t.data,
        code: c.invalid_enum_value,
        options: s
      }), _;
    }
    return O(e.data);
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
    return M.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return M.create(this.options.filter((s) => !e.includes(s)), {
      ...this._def,
      ...t
    });
  }
}
M.create = je;
class Ae extends y {
  _parse(e) {
    const t = v.getValidEnumValues(this._def.values), s = this._getOrReturnCtx(e);
    if (s.parsedType !== u.string && s.parsedType !== u.number) {
      const r = v.objectValues(t);
      return l(s, {
        expected: v.joinValues(r),
        received: s.parsedType,
        code: c.invalid_type
      }), _;
    }
    if (this._cache || (this._cache = new Set(v.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const r = v.objectValues(t);
      return l(s, {
        received: s.data,
        code: c.invalid_enum_value,
        options: r
      }), _;
    }
    return O(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
Ae.create = (a, e) => new Ae({
  values: a,
  typeName: m.ZodNativeEnum,
  ...g(e)
});
class ee extends y {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== u.promise && t.common.async === !1)
      return l(t, {
        code: c.invalid_type,
        expected: u.promise,
        received: t.parsedType
      }), _;
    const s = t.parsedType === u.promise ? t.data : Promise.resolve(t.data);
    return O(s.then((r) => this._def.type.parseAsync(r, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
ee.create = (a, e) => new ee({
  type: a,
  typeName: m.ZodPromise,
  ...g(e)
});
class z extends y {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === m.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), r = this._def.effect || null, n = {
      addIssue: (i) => {
        l(s, i), i.fatal ? t.abort() : t.dirty();
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
          return h.status === "aborted" ? _ : h.status === "dirty" || t.value === "dirty" ? W(h.value) : h;
        });
      {
        if (t.value === "aborted")
          return _;
        const o = this._def.schema._parseSync({
          data: i,
          path: s.path,
          parent: s
        });
        return o.status === "aborted" ? _ : o.status === "dirty" || t.value === "dirty" ? W(o.value) : o;
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
        if (!D(i))
          return _;
        const o = r.transform(i.value, n);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((i) => D(i) ? Promise.resolve(r.transform(i.value, n)).then((o) => ({
          status: t.value,
          value: o
        })) : _);
    v.assertNever(r);
  }
}
z.create = (a, e, t) => new z({
  schema: a,
  typeName: m.ZodEffects,
  effect: e,
  ...g(t)
});
z.createWithPreprocess = (a, e, t) => new z({
  schema: e,
  effect: { type: "preprocess", transform: a },
  typeName: m.ZodEffects,
  ...g(t)
});
class j extends y {
  _parse(e) {
    return this._getType(e) === u.undefined ? O(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
j.create = (a, e) => new j({
  innerType: a,
  typeName: m.ZodOptional,
  ...g(e)
});
class U extends y {
  _parse(e) {
    return this._getType(e) === u.null ? O(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
U.create = (a, e) => new U({
  innerType: a,
  typeName: m.ZodNullable,
  ...g(e)
});
class le extends y {
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
le.create = (a, e) => new le({
  innerType: a,
  typeName: m.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...g(e)
});
class ue extends y {
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
    return H(r) ? r.then((n) => ({
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
ue.create = (a, e) => new ue({
  innerType: a,
  typeName: m.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...g(e)
});
class Se extends y {
  _parse(e) {
    if (this._getType(e) !== u.nan) {
      const s = this._getOrReturnCtx(e);
      return l(s, {
        code: c.invalid_type,
        expected: u.nan,
        received: s.parsedType
      }), _;
    }
    return { status: "valid", value: e.data };
  }
}
Se.create = (a) => new Se({
  typeName: m.ZodNaN,
  ...g(a)
});
class ft extends y {
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
class he extends y {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.common.async)
      return (async () => {
        const n = await this._def.in._parseAsync({
          data: s.data,
          path: s.path,
          parent: s
        });
        return n.status === "aborted" ? _ : n.status === "dirty" ? (t.dirty(), W(n.value)) : this._def.out._parseAsync({
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
    return new he({
      in: e,
      out: t,
      typeName: m.ZodPipeline
    });
  }
}
class fe extends y {
  _parse(e) {
    const t = this._def.innerType._parse(e), s = (r) => (D(r) && (r.value = Object.freeze(r.value)), r);
    return H(t) ? t.then((r) => s(r)) : s(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
fe.create = (a, e) => new fe({
  innerType: a,
  typeName: m.ZodReadonly,
  ...g(e)
});
var m;
(function(a) {
  a.ZodString = "ZodString", a.ZodNumber = "ZodNumber", a.ZodNaN = "ZodNaN", a.ZodBigInt = "ZodBigInt", a.ZodBoolean = "ZodBoolean", a.ZodDate = "ZodDate", a.ZodSymbol = "ZodSymbol", a.ZodUndefined = "ZodUndefined", a.ZodNull = "ZodNull", a.ZodAny = "ZodAny", a.ZodUnknown = "ZodUnknown", a.ZodNever = "ZodNever", a.ZodVoid = "ZodVoid", a.ZodArray = "ZodArray", a.ZodObject = "ZodObject", a.ZodUnion = "ZodUnion", a.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", a.ZodIntersection = "ZodIntersection", a.ZodTuple = "ZodTuple", a.ZodRecord = "ZodRecord", a.ZodMap = "ZodMap", a.ZodSet = "ZodSet", a.ZodFunction = "ZodFunction", a.ZodLazy = "ZodLazy", a.ZodLiteral = "ZodLiteral", a.ZodEnum = "ZodEnum", a.ZodEffects = "ZodEffects", a.ZodNativeEnum = "ZodNativeEnum", a.ZodOptional = "ZodOptional", a.ZodNullable = "ZodNullable", a.ZodDefault = "ZodDefault", a.ZodCatch = "ZodCatch", a.ZodPromise = "ZodPromise", a.ZodBranded = "ZodBranded", a.ZodPipeline = "ZodPipeline", a.ZodReadonly = "ZodReadonly";
})(m || (m = {}));
const d = R.create, w = P.create, x = ie.create, te = oe.create;
E.create;
const N = A.create, b = T.create, Ee = Q.create;
X.create;
$.create;
const pe = K.create, Ct = ce.create, Y = M.create;
ee.create;
j.create;
U.create;
const V = d().max(64), se = pe(te()), ae = b({ protocol: d().max(64).describe("Endpoint protocol supported by the selected ListCodingAgents entry."), base_url: d().max(512).describe("Custom endpoint base URL. An empty value clears an account or task override."), model: d().max(200).optional().describe("Driver-native model identifier for this custom endpoint.") }).strict().describe("Optional custom endpoint supported by the selected agent; task values override profile/account defaults.");
ae.partial({ protocol: !0 });
const ht = b({
  traits: N(d().min(1).max(200)).max(32).optional().describe("Public agent trait IDs to resolve under the caller; at most 32. A task list replaces the profile trait list."),
  context: se.optional().describe("Context keys are projected to each selected trait schema, then merged with its defaults and validated. Task keys override profile keys; undeclared keys are rejected.")
}).strict().describe("Optional per-run tool gateway declaration using traits only. Task traits replace profile traits; context keys merge with task values taking precedence."), pt = b({ id: d(), label: d(), hint: d(), file: d().optional(), subscription: x(), format: Y(["json_object", "single_line", "text"]) }).strict(), Ne = b({
  input_tokens: w().nonnegative().optional(),
  output_tokens: w().nonnegative().optional(),
  cached_tokens: w().nonnegative().optional(),
  cache_write_tokens: w().nonnegative().optional(),
  reasoning_tokens: w().nonnegative().optional(),
  cost_usd: w().nonnegative().optional(),
  cost_decimal: d().optional(),
  currency: d().optional()
}).strict(), $e = Ne.extend({ models: pe(Ne).optional() }), Le = b({
  title: d().min(1).max(200).describe("Display title for this reusable coding configuration."),
  agent: V.min(1).describe("Activated agent ID from ListCodingAgents; use that tool to discover credential kinds, capabilities, endpoints and supported driver options."),
  image_id: V.min(1).describe("Prepared image ID from ListCodingImages, compatible with the selected agent. ReadCodingImage exposes build status and the latest log."),
  account_id: V.optional().describe("Account ID from ListCodingAccounts. Omit to balance across eligible accounts; an explicit account remains pinned. Empty clears a profile account selection."),
  account_pool: N(V.min(1)).max(200).optional().describe("Eligible account IDs from ListCodingAccounts for balancing. A task pool overrides the profile pool and clears its pinned account unless account_id is also supplied."),
  endpoint: ae.optional(),
  tools: ht.optional(),
  workspace_id: V.optional().describe("Workspace ID from ListCodingWorkspaces. Omit for an ephemeral scratch directory; an empty value overrides a profile workspace with scratch. Registered workspaces mount according to caller grants."),
  repo_url: d().max(2e3).optional().describe("Optional repository URL to clone into scratch. Omit for a plain scratch directory. A registered workspace uses its existing checkout. Do not embed credentials, query strings or URL fragments."),
  repo_ref: d().max(200).optional().describe("Optional branch or tag for a scratch clone; omitted or empty uses the remote default. Registered workspaces keep their current ref and refuse this field."),
  run_timeout: d().max(64).optional().describe("Default run duration such as 30m or 2h, from 1m through 168h (7 days). A task timeout overrides it."),
  unattended: x().optional().describe("Apply the driver unattended preset when true. Explicit driver options override the preset; omission uses the profile or driver default."),
  options: se.optional().describe("Driver-specific option values from ListCodingAgents. Task keys override matching profile keys and unattended presets; omitted keys inherit defaults.")
}).strict();
Le.partial().extend({ id: V.min(1).describe("Profile ID from ListCodingProfiles; update requires WRITE access.") });
const Ve = Le.extend({ id: d(), options: se, owner_user_id: d(), owner: d(), writable: x(), deletable: x() }), mt = Ve.pick({ id: !0, title: !0, agent: !0, owner_user_id: !0, owner: !0, writable: !0, deletable: !0 });
Ee([Ve, mt]);
const _t = b({ kind: d(), message: d(), retryable: x().optional(), details: se.optional() }).strict(), B = N(d()), me = pe(te()), gt = b({ name: d(), label: d(), description: d(), section: d(), group: d(), order: w(), type: d(), values: N(te()).optional(), schema: me.optional(), default: te().optional(), profiles: B.optional() }), yt = b({ id: d(), title: d(), icon: d(), credentials: N(pt), endpoints: B, capabilities: B, unattended: me.optional(), options: N(gt) }), De = b({ memory: d(), cpus: d(), pids_limit: w().int(), gpus: d(), network: d(), extra_args: B, allows: B }), vt = b({ ref: d(), label: d(), home: d(), dockerfile: d(), settings: De.optional() }), kt = b({ label_bytes: w().int().positive(), secret_bytes: w().int().positive(), endpoint_url_bytes: w().int().positive(), endpoint_model_bytes: w().int().positive() }), Ot = b({ agents: N(yt), default_image: vt, can_images: x(), can_workspaces: x(), can_prune: x(), build_cache_retention: d(), settings_path: d().optional(), can_limits: x().optional(), can_accounts: x().optional(), account_limits: kt.optional() }), xt = b({ windows: N(b({ window: d(), utilization: w().optional(), status: Y(["allowed", "warning", "rejected"]), resets_at: w().int().optional() })), overage_status: d().optional(), overage_disabled_reason: d().optional(), is_using_overage: x().optional() }), At = b({
  id: d(),
  agent: d(),
  label: d(),
  credential_kind: d(),
  subscription: x(),
  enabled: x(),
  rate_limits: xt.optional(),
  endpoint: ae.optional(),
  owner_user_id: d(),
  owner: d(),
  mine: x(),
  usable: x(),
  unavailable_reason: d().optional(),
  writable: x(),
  deletable: x(),
  shareable: x().optional(),
  last_used_at: d(),
  cooldown_until: d(),
  last_error: d(),
  runs_day: w().int(),
  failures_day: w().int()
}), Re = Ee([d(), w().int()]), St = b({
  key: d(),
  title: d(),
  category: d(),
  description: d(),
  unit: d(),
  order: w(),
  value_type: Y(["duration", "int"]),
  value: Re,
  default: Re,
  overridden: x()
}), Nt = b({
  agent: d(),
  title: d(),
  icon: d().optional(),
  provider_id: d(),
  create_ui_id: d().optional()
}), bt = b({ id: d(), ref: d(), label: d(), home: d(), status: d(), usable: x(), agents: B, last_error: d(), owner_user_id: d(), owner: d(), writable: x(), deletable: x(), shareable: x() }), Rt = b({ image: bt, build_log: d(), dockerfile: d().optional(), settings: De.optional() }), Zt = b({ conflicts: N(b({ id: d(), host_path: d() })).optional(), unavailable_reason: d().optional(), id: d(), name: d(), writable: x(), deletable: x(), shareable: x(), host_path: d().optional() }), wt = Y(["queued", "running", "succeeded", "failed", "cancelled"]), Pe = b({
  owner_user_id: d(),
  endpoint: ae.optional(),
  id: d(),
  agent: d(),
  account_id: d(),
  image_id: d(),
  workspace_id: d().optional(),
  options: me,
  unattended: x(),
  repo_url: d(),
  prompt: d(),
  status: wt,
  result: d(),
  error: d(),
  error_native: _t.optional(),
  usage: $e,
  cancel_requested: x(),
  timeout_ms: w(),
  workflow: x(),
  created_at: d(),
  started_at: d(),
  finished_at: d()
}), It = Pe.pick({ id: !0, agent: !0, account_id: !0, image_id: !0, workspace_id: !0, status: !0, workflow: !0, cancel_requested: !0, created_at: !0, started_at: !0, finished_at: !0 }).extend({ prompt_summary: d(), usage: $e.optional() }), Tt = b({ seq: w().int(), kind: Y(["assistant", "reasoning", "tool", "tool_call", "hook", "tool_result", "tool_error", "system", "error", "log"]), text: d(), created_at: d() }), jt = b({ run: Pe, events: N(Tt), more: x(), next_seq: w().int().nonnegative() });
export {
  yt as a,
  kt as b,
  x as c,
  N as d,
  ae as e,
  Ee as f,
  Y as g,
  _t as h,
  It as i,
  bt as j,
  At as k,
  Ct as l,
  Nt as m,
  w as n,
  b as o,
  St as p,
  Ve as q,
  pe as r,
  d as s,
  ht as t,
  te as u,
  jt as v,
  Zt as w,
  Rt as x,
  Ot as y
};
