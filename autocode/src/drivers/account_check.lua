-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local http = require("http_client")

type Object = {[string]: unknown}
type Probe = {url: string, header: string?, extra: {[string]: string}?}
local probes: {[string]: Probe} = {
    ["env:CODEX_API_KEY"] = {url = "https://api.openai.com/v1/models"},
    ["env:OPENAI_API_KEY"] = {url = "https://api.openai.com/v1/models"},
    ["env:ANTHROPIC_API_KEY"] = {url = "https://api.anthropic.com/v1/models", header = "x-api-key", extra = {["anthropic-version"] = "2023-06-01"}},
    ["env:GEMINI_API_KEY"] = {url = "https://generativelanguage.googleapis.com/v1beta/models", header = "x-goog-api-key"},
    ["env:XAI_API_KEY"] = {url = "https://api.x.ai/v1/models"},
    ["env:GROQ_API_KEY"] = {url = "https://api.groq.com/openai/v1/models"},
    ["env:OPENROUTER_API_KEY"] = {url = "https://openrouter.ai/api/v1/key"},
    ["env:MISTRAL_API_KEY"] = {url = "https://api.mistral.ai/v1/models"},
    ["env:DEEPSEEK_API_KEY"] = {url = "https://api.deepseek.com/user/balance"},
}

local function verify(kind: string, credential: string, endpoint: Object?): (boolean?, error?)
    local probe = probes[kind]
    -- A CLI login and a custom endpoint can be checked by a real task. Never
    -- send their credentials to the default provider's API as a shortcut.
    if endpoint or not probe then return false, nil end
    local headers: {[string]: string} = {Accept = "application/json"}
    for name, value in pairs(probe.extra or {}) do headers[name] = value end
    if probe.header then headers[probe.header] = credential
    else headers.Authorization = "Bearer " .. credential end
    local response = http.get(probe.url, {headers = headers, timeout = "10s", max_response_body = 1048576})
    local status = response and response.status_code or 0
    if status >= 200 and status < 300 then return true, nil end
    if status == 401 or status == 403 then
        return nil, errors.new({kind = errors.INVALID, message = "The provider declined this credential. Check it or create a new one and try again.",
            details = {code = "autocode.credential_declined", provider_status = status}})
    end
    if status == 429 then
        return nil, errors.new({kind = errors.RATE_LIMITED, message = "The provider is limiting requests. Wait a moment and test the credential again.",
            details = {code = "autocode.credential_check_limited", provider_status = status}})
    end
    return nil, errors.new({kind = errors.UNAVAILABLE, message = "The provider could not check the credential. Try again shortly.",
        details = {code = "autocode.credential_check_unavailable", provider_status = status}})
end
return {verify = verify}
