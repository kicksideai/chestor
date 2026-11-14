<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# SPEC: Docker image extra arguments

Docker parses `extra_args`, including option availability, arity, CSV network
syntax, short clusters and values that look like flags. Autocode checks only the
array/string representation and absence of NUL bytes at the recipe boundary.
Unknown or malformed Docker options fail in Docker. Approved historical recipes
need no conversion or rebuild.

Every main run and both image probes use `docker create`, inspect the returned
container ID, verify its effective configuration, and only then use `docker
start`. There is one isolation check, independent of argument spelling. An
inspection failure or mismatch removes that ID before returning an error. The
error names the mismatched property; a removal failure remains visible. Cleanup
has its own bounded deadline so an expired operation cannot skip removal.

Capability spelling follows the stored create request. In Moby v28.0.4,
[`Client.ContainerCreate`](https://github.com/moby/moby/blob/v28.0.4/client/container_create.go#L72)
normalizes capability names before sending them; its
[`normalizeCap`](https://github.com/moby/moby/blob/v28.0.4/client/container_create.go#L156)
uppercases names, adds `CAP_`, and preserves the special value `ALL`.
The Docker v26.1.3 client sends `NET_RAW` unchanged. Inspection accepts those
three exact spellings, without case folding, trimming, or accepting `CAP_ALL`.

The inspected properties are:

- `NetworkMode` equals the module-selected recipe network (Docker's default bridge
  when empty). The recipe reference is resolved once per inspection to its ID
  and name; both HostConfig and every created network-map key must select that
  identity, with exactly one attachment. Nonempty endpoint IDs must agree too.
  Host and foreign-container networking are refused even when configured as the
  recipe network. Network names, full IDs and unambiguous ID prefixes work.
- PID, IPC, UTS, user and cgroup namespaces use private/default-private modes;
  every create explicitly requests `--cgroupns=private`, including on daemons
  whose cgroup-v1 default is `host`. Inspection still requires `private`.
- `Privileged` is false, devices/device-cgroup rules and added capabilities are
  empty. Every create drops `NET_RAW`; inspection requires exactly `NET_RAW`, `CAP_NET_RAW`,
  or `ALL` in `CapDrop`. Additional recipe drops are preserved. The recipe's dedicated GPU setting may
  contribute its one Docker device request; extra GPU requests are refused.
- Security options contain only `no-new-privileges` true variants. `MaskedPaths`
  and `ReadonlyPaths` contain every Moby v26.1.3 default protected path;
  additional protection is allowed. Clearing either list (including Docker's
  client-side `systempaths=unconfined` transformation) is refused.
- Bind specifications and effective mounts exactly match the module's selected
  sources, targets and read-only flags, with private propagation and recursive
  binding disabled. Image-declared volumes and volumes from other containers
  are refused. Docker tmpfs options remain valid: their targets are container
  paths and Docker accepts no host source for them.
- The runtime equals the daemon's default runtime. Cgroup parents, sysctls,
  host-device I/O controls, OCI annotations, isolation overrides, foreign links,
  host port bindings and Docker client CID-file writes are refused.
- Host OOM protection (negative `OomScoreAdj` or disabled OOM killing), realtime
  CPU scheduling and automatic restarts are refused: runs must remain killable
  under their resource ceilings and execution must stay within job ownership.
- The inspected name and image equal the module-selected values, preserving
  lifecycle ownership even when extra arguments change Docker's command shape.

## Settings limits and Docker warnings

Main runs and both probes pass base memory, CPU and PID options followed by the
same unchanged extra arguments exactly once. Docker alone parses option values
and precedence. Created-container inspection requires a positive `Memory` for
nonempty memory settings, positive `NanoCpus` for nonempty CPU settings, and a
positive `PidsLimit` for nonzero PID settings. An absent or unbounded requested
limit refuses and removes the container before start, with or without a warning.
This checks effective presence; Docker owns numeric magnitude and enforcement.
Autocode neither parses resource values nor captures the CLI's outgoing request.
Empty memory/CPU settings and PID zero request no bound. Nonempty zero spellings
such as memory `0m` or CPU `0.0` therefore refuse at inspection; use empty settings
for unbounded operation. Extra options may change positive magnitudes but cannot
remove a settings-requested bound. There is no memory-swap setting; `--memory-swap`
is an administrator extra option, so its value is governed by Docker semantics.

All Docker create warnings, including discard warnings, are retained in the
run's system log or image build log on success and failure. A warning never
refuses by itself. Administrator extra options follow Docker's warn-and-proceed
semantics: `--cpu-quota=-1`, period-only `--cpu-period=100000`, positive extra
`--cpu-quota`, and zero or positive `--memory-swappiness` proceed with any notice
logged when the settings-requested bounds and isolation checks pass. Unsupported
`--cpus` is a hard daemon error on Linux without CFS support. Warnings do not
waive any effective isolation check, including private cgroups, host-device I/O
controls and host OOM protection.

This behavior uses [Moby v26.1.3 resource validation](https://github.com/moby/moby/blob/v26.1.3/daemon/daemon_unix.go#L400)
and [Docker CLI v26.1.3 create-response warning output](https://github.com/docker/cli/blob/v26.1.3/cli/command/container/create.go#L278).
Probes apply the same recipe network and options as main containers, without a
workspace bind.

File-backed Docker client options such as `--env-file` and `--label-file` are
**administrator responsibility**. Files must be executor-readable and outside
all workspaces and container-mounted directories, including symlink and hard-link
aliases. Relative paths retain Docker's executor-working-directory semantics.
Docker consumes these files before container creation and does not retain their
source paths in inspect output. Autocode does not infer file origin from argument spellings. The same trust rule
applies to Docker client file outputs such as `--cidfile`, whose side effect can
precede rejection of the resulting container. Administrators must also configure
a trusted Docker client environment, daemon and default runtime.

## HostConfig completeness (Linux, Docker/Moby v26.1.3)

Reviewed against [HostConfig and Resources](https://github.com/moby/moby/blob/v26.1.3/api/types/container/hostconfig.go)
and the [CLI option mapping](https://github.com/docker/cli/blob/v26.1.3/cli/command/container/opts.go).
The verified authority above covers every field that can grant a container
additional host access. The remaining fields have these explicit boundaries:

- `Binds`, `Mounts`, `VolumesFrom`, `VolumeDriver`: Exact approved private nonrecursive binds; no volume imports/driver override.
- `NetworkMode`, `Links`, `PortBindings`, `PublishAllPorts`: Resolved approved network only; no foreign links or host ports.
- `PidMode`, `IpcMode`, `UTSMode`, `UsernsMode`, `CgroupnsMode`: Private/default-private; explicit private cgroup request.
- `Privileged`, `CapAdd`, `Devices`, `DeviceCgroupRules`, `DeviceRequests`: No added host authority; only the dedicated recipe GPU request may contribute a device request.
- `SecurityOpt`, `MaskedPaths`, `ReadonlyPaths`: Default protection retained; only true no-new-privileges additions.
- `Runtime`, `Isolation`, `Annotations`, `CgroupParent`, `Cgroup`, `Sysctls`, `ContainerIDFile`: Default runtime; other authority overrides empty. `Cgroup` has no Linux CLI setter.
- `RestartPolicy`: No automatic restart or retry.
- `OomScoreAdj`, `OomKillDisable`, `CpuRealtimePeriod`, `CpuRealtimeRuntime`: No host OOM protection or realtime scheduling.
- `Memory`, `MemorySwap`, `NanoCpus`, `CpuQuota`, `CpuPeriod`, `PidsLimit`: See the settings limits and Docker warnings contract above.
- `MemoryReservation`, `KernelMemory`, `CpuShares`, `BlkioWeight`, `MemorySwappiness`, `CpusetCpus`, `CpusetMems`: Docker-owned tuning and placement options; see the contract above.
- `BlkioWeightDevice`, `BlkioDeviceReadBps`, `BlkioDeviceWriteBps`, `BlkioDeviceReadIOps`, `BlkioDeviceWriteIOps`: Empty; no host-device controls.
- `CapDrop`: Must include exactly `NET_RAW`, `CAP_NET_RAW`, or `ALL`; further drops are allowed.
- `ReadonlyRootfs`: Can only remove filesystem write authority.
- `Dns`, `DnsOptions`, `DnsSearch`, `ExtraHosts`: Container resolver/hosts-file configuration; cannot attach another network or move a process into a host namespace. Recipe-network verification is attachment isolation, not an egress firewall.
- `GroupAdd`: Container process groups; approved mounts are already exact and container identity may already be root. No additional host path or device is granted.
- `Tmpfs`, `ShmSize`: Container-only memory filesystems; no host source, with private IPC. Memory/PID ceilings remain checked when requested.
- `StorageOpt`: Trusted daemon storage-driver options set the container writable-layer quota; cannot add a container bind, device or namespace.
- `LogConfig`: Trusted daemon logging routes captured output; cannot grant the container a namespace, mount or device. Host log export is outside recipe-network attachment isolation, just as host capture of stdout is. Administrator-approved logging options retain their existing semantics.
- `Ulimits`: Per-process limits within the already isolated container; cannot add host access or bypass its checked cgroup ceilings.
- `AutoRemove`, `ConsoleSize`, `Init`: Container removal, terminal dimensions and an in-container child reaper; cannot add host access.
- `KernelMemoryTCP`: No CLI setter in the pinned version.
- `CpuCount`, `CpuPercent`, `IOMaximumIOps`, `IOMaximumBandwidth`: Windows-only controls cannot grant Linux host access; non-default Windows `Isolation` is refused.

The daemon, its installed runtime/storage/log/device drivers and its host logging
configuration remain trusted deployment infrastructure. Concurrent operator
changes to those defaults or a selected network during a request are a known
deployment race.
