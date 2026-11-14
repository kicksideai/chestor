# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
"""Run the production shell launcher against a harmless Docker executable."""
import json
import os
from pathlib import Path
import re
import shlex
import subprocess
import tempfile
import unittest

SOURCE = Path(__file__).resolve().parents[1] / 'src/infrastructure'
SCRATCH = SOURCE.parents[1] / 'test/.wippy/client-checks'
SCRATCH.mkdir(parents=True, exist_ok=True)



def script():
    return re.search(r'local CLIENT = .*?\[=\[(.*?)\]=\]', (SOURCE / 'docker.lua').read_text(), re.S)[1]


class ClientBoundary(unittest.TestCase):
    def launch(self, args, payload='', excluded='', environment=None, cwd=None):
        with tempfile.TemporaryDirectory(dir=SCRATCH) as folder:
            root = Path(folder)
            binary = root / 'bin'
            binary.mkdir()
            docker = binary / 'docker'
            docker.write_text('#!/usr/bin/python3\nimport os,sys,json\na=sys.argv[1:]\np=open("/dev/fd/3").read() if "/dev/fd/3" in a else ""\nprint(json.dumps({"args":a,"env":dict(os.environ),"payload":p}))\n')
            docker.chmod(0o700)
            env = {'PATH': str(binary) + ':/usr/bin:/bin', 'HOME': folder, 'DOCKER_CONFIG': folder + '/.docker',
                   'DOCKER_CONTEXT': 'existing-context', 'DOCKER_HOST': 'unix:///executor.sock',
                   'AUTOCODE_DOCKER_CLIENT': 'module code', 'AUTOCODE_DOCKER_ARGS': shlex.join(args),
                   'AUTOCODE_DOCKER_CONTEXT': '',
                   'AUTOCODE_DOCKER_PAYLOAD_COUNT': '1' if payload else '0', 'AUTOCODE_DOCKER_PAYLOAD_0': payload}
            if not payload: env.pop("AUTOCODE_DOCKER_PAYLOAD_0")
            env.update(environment or {})
            result = subprocess.run(['/bin/sh', '-ec', script()], env=env, cwd=cwd, text=True, capture_output=True)
            return result, env

    def test_host_context_auth_plugins_and_environment_survive(self):
        result, env = self.launch(['create', 'image'])
        self.assertEqual(result.returncode, 0, result.stderr)
        observed = json.loads(result.stdout)
        for name in ('PATH', 'HOME', 'DOCKER_HOST', 'DOCKER_CONFIG', 'DOCKER_CONTEXT'):
            self.assertEqual(observed['env'][name], env[name])
        self.assertFalse(any(k.startswith('AUTOCODE_') for k in observed['env']))

    def test_docker_endpoint_forms_are_passed_unchanged(self):
        for endpoint in ('unix://', 'unix:///executor.sock', ' unix:///executor.sock ', 'tcp://daemon.example:2376'):
            with self.subTest(endpoint=endpoint):
                result, _ = self.launch(['image', 'inspect', 'image'], environment={'DOCKER_HOST': endpoint, 'DOCKER_CONTEXT': ''})
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertEqual(json.loads(result.stdout)['env']['DOCKER_HOST'], endpoint)

    def test_bound_named_context_is_an_explicit_cli_override(self):
        result, env = self.launch(['image', 'inspect', 'image'], environment={'AUTOCODE_DOCKER_CONTEXT': 'host-selected'})
        self.assertEqual(result.returncode, 0, result.stderr)
        observed = json.loads(result.stdout)
        self.assertEqual(observed['args'], ['--context', 'host-selected', 'image', 'inspect', 'image'])
        self.assertEqual(observed['env']['DOCKER_CONTEXT'], env['DOCKER_CONTEXT'])

    def test_container_values_use_inherited_pipe_without_disk(self):
        values = {'TOKEN': 'secret', 'HOME': '/container/home', 'PATH': '/container/bin',
                  'DOCKER_HOST': 'unix:///container.sock', 'DOCKER_CONTEXT': 'container-context',
                  'DOCKER_CONFIG': '/container/config', 'DOCKER_CERT_PATH': '/container/certs', 'DOCKER_TLS_VERIFY': '1'}
        payload = 'AUTOCODE_TRANSFER_NAMES=' + ' '.join(values) + '\n'
        for index, value in enumerate(values.values()):
            payload += f'AUTOCODE_PAYLOAD_{index}_COUNT=1\nAUTOCODE_PAYLOAD_{index}_0=' + ''.join('\\0%03o' % c for c in value.encode()) + '\n'
        result, env = self.launch(['create', 'image'], payload)
        self.assertEqual(result.returncode, 0, result.stderr)
        observed = json.loads(result.stdout)
        self.assertEqual(observed['payload'], payload)
        for name in values:
            self.assertEqual(observed['env'].get(name), env.get(name))
        self.assertNotIn('secret', ' '.join(observed['args']))
        self.assertFalse(any(k.startswith('AUTOCODE_') for k in observed['env']))
        self.assertEqual(observed['args'][2], '/dev/fd/3')

    def test_shared_scratch_build_and_maintenance_need_no_private_state_or_writable_home(self):
        with tempfile.TemporaryDirectory(dir=SCRATCH) as folder:
            home = Path(folder) / 'home'
            home.mkdir(mode=0o500)
            payload = 'AUTOCODE_TRANSFER_NAMES=TOKEN\nAUTOCODE_PAYLOAD_0_COUNT=1\nAUTOCODE_PAYLOAD_0_0=secret\n'
            try:
                for args in (['create', 'image'], ['run', 'image'], ['build', '-'], ['image', 'inspect', 'image'], ['cp', 'box:/file', '-'], ['rm', 'box']):
                    with self.subTest(args=args):
                        result, _ = self.launch(args, payload if args[0] in ('run', 'create') else '', environment={'HOME': str(home)})
                        self.assertEqual(result.returncode, 0, result.stderr)
                        self.assertEqual(list(home.iterdir()), [])
            finally:
                home.chmod(0o700)

    def test_host_file_authority_is_delegated_to_the_administrator(self):
        # Docker consumes client file paths before inspect; their origin is not retained.
        for option in ('--env-file', '--label-file'):
            result, _ = self.launch(['create', option, '/operator-managed/file', 'image'])
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(json.loads(result.stdout)['args'], ['create', option, '/operator-managed/file', 'image'])

    def test_relative_host_file_options_keep_executor_working_directory(self):
        with tempfile.TemporaryDirectory(dir=SCRATCH) as folder:
            root = Path(folder)
            (root / 'labels').write_text('team=legacy\n')
            for path in ('labels', './labels'):
                for option in ('--env-file', '--label-file'):
                    result, _ = self.launch(['create', option, path, 'image'], cwd=root)
                    self.assertEqual(result.returncode, 0, result.stderr)

    def test_flag_looking_label_values_are_passed_to_docker(self):
        for value in ('--env-file=/definitely-absent/autocode.env', '--label-file=/definitely-absent/labels'):
            with self.subTest(value=value):
                result, _ = self.launch(['create', '--label', value, 'image'])
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertEqual(json.loads(result.stdout)['args'], ['create', '--label', value, 'image'])

    def test_label_data_is_not_interpreted_as_a_host_bind(self):
        result, _ = self.launch(['create', '--label', 'type=bind,source=/,target=/data', 'image'])
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_container_restoration_requires_only_the_existing_posix_shell(self):
        value = "printf '%s' payload-survived"
        payload = {'AUTOCODE_TRANSFER_NAMES': 'AUTOCODE_SCRIPT', 'AUTOCODE_PAYLOAD_0_COUNT': '1',
                   'AUTOCODE_PAYLOAD_0_0': ''.join('\\0%03o' % c for c in value.encode()), 'PATH': '/no-utilities'}
        entrypoint = re.search(r'M.entrypoint = \[=\[(.*?)\]=\]', (SOURCE / 'container.lua').read_text(), re.S)[1]
        result = subprocess.run(['/bin/sh', '-c', entrypoint], env=payload, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout, 'payload-survived')


if __name__ == '__main__': unittest.main()
