-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- chestor.autocode.runner:redact removes a supplied secret from run text with
-- the forms it declares: the raw value, every long string of a JSON login
-- file, values under credential-named JSON fields, URL userinfo, and Bearer
-- values.
local test = require("test")
local redact = require("redact")
local json = require("json")

local SECRET = "sk-autocode-harness-0123456789"

local function cases()
    test.describe("autocode redaction", function()
        test.it("removes bare JSON-escaped encodings of known credentials", function()
            for _, secret in ipairs({'credential-quote"-0123456789', 'credential-backslash\\-0123456789'}) do
                local encoded = json.encode(secret):sub(2, -2)
                test.eq(redact.apply(redact.new(secret), encoded), redact.MARK)
            end
        end)
        test.it("removes every occurrence of the supplied secret", function()
            local text = redact.apply(redact.new(SECRET), "key=" .. SECRET .. " again " .. SECRET .. ".")
            test.eq(text, "key=" .. redact.MARK .. " again " .. redact.MARK .. ".")
        end)

        test.it("removes each long string of a JSON login file and keeps short ones", function()
            local access = "access-0123456789abcdef"
            local refresh = "refresh-0123456789abcdef"
            local login = '{"tokens":{"access":"' .. access .. '","refresh":"' .. refresh .. '"},"plan":"pro"}'
            local text = redact.apply(redact.new(login), "a=" .. access .. " r=" .. refresh .. " plan=pro")
            test.eq(text, "a=" .. redact.MARK .. " r=" .. redact.MARK .. " plan=pro")
        end)

        test.it("removes the longest matching value whole", function()
            local short = "overlap-0123456789"
            local long = short .. "-tail-abcdef"
            local login = '{"a":"' .. short .. '","b":"' .. long .. '"}'
            local text = redact.apply(redact.new(login), "v=" .. long)
            test.eq(text, "v=" .. redact.MARK)
        end)

        test.it("removes values under credential-named JSON fields it was not given", function()
            local text = redact.apply(redact.new(SECRET),
                '{"access_token": "refreshed-0123456789", "api_key":"other-aaaaaaaaaaaaaaaa", "model": "claude-sonnet-model"}')
            test.eq(text, '{"access_token": "' .. redact.MARK .. '", "api_key":"' .. redact.MARK
                .. '", "model": "claude-sonnet-model"}')
        end)

        test.it("removes credentials in URL userinfo and keeps the rest of the URL", function()
            local text = redact.apply(redact.new(SECRET),
                "fatal: could not read from https://bot:ghp_harness0123456789@github.com/acme/repo.git, see http://example.com/x")
            test.eq(text, "fatal: could not read from https://" .. redact.MARK .. "@github.com/acme/repo.git, see http://example.com/x")
        end)

        test.it("removes Bearer values", function()
            local text = redact.apply(redact.new(SECRET), "Authorization: Bearer eyJhbGciOi.JIUzI1NiJ9-x_y")
            test.eq(text, "Authorization: Bearer " .. redact.MARK)
        end)

        test.it("keeps field and Bearer values shorter than the minimum length", function()
            local text = redact.apply(redact.new(""), '{"token":"tiny"} Bearer abc')
            test.eq(text, '{"token":"tiny"} Bearer abc')
        end)
    end)
end

local run_cases = test.run_cases(cases)
return { run = function(options) return run_cases(options) end }
