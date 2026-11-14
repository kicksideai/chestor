# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
"""Run the shared production mount guard with adversarial mountinfo rows."""
from pathlib import Path
import re
import json
import shlex
import os
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1] / 'src/infrastructure'


class MountAliases(unittest.TestCase):
    def check_guards(self, mountinfo, path, rejected):
        source = (ROOT / 'host.lua').read_text()
        command = json.loads(re.search(r'local command = (".*")', source)[1])
        outer = shlex.split(command)[2]
        wrapper = shlex.split(outer)[-2]
        source = shlex.split(wrapper.split('TERM\n', 1)[1])[2]
        guard = re.search(r"awk '(.*?)' /proc/self/mountinfo", source, re.S)[1]
        result = subprocess.run(['awk', guard], input=mountinfo, env={**os.environ, "AUTOCODE_CHECK_PATH": path}, capture_output=True, text=True)
        self.assertEqual(result.returncode != 0, rejected, result.stderr)
        self.assertIn('no_mounts', (ROOT / 'host.lua').read_text())

    def test_root_bind_alias_ancestor(self):
        self.check_guards('1 0 8:1 / / rw - ext4 /dev/root rw\n2 1 8:1 / /allowed/alias rw - ext4 /dev/root rw\n', '/allowed/alias/workspace', True)

    def test_escaped_mountpoint_ancestor(self):
        for escaped, decoded in [(r'\011', '\t'), (r'\040', ' '), (r'\134', '\\'), (r'\012', '\n')]:
            self.check_guards('1 0 8:1 / / rw - ext4 /dev/root rw\n2 1 8:1 /outside /allowed/team' + escaped + 'name rw - ext4 /dev/root rw\n', '/allowed/team' + decoded + 'name/workspace', True)

    def test_ordinary_root_and_distinct_filesystem(self):
        mounts = '1 0 8:1 / / rw - ext4 /dev/root rw\n2 1 8:2 / /allowed rw - ext4 /dev/data rw\n'
        self.check_guards(mounts, '/allowed', False)
        self.check_guards(mounts, '/allowed/workspace', False)
        self.check_guards(mounts, '/other/workspace', False)


if __name__ == '__main__': unittest.main()
