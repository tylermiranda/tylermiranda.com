---
title: "Beyond the Demo: Building an Agent Harness on Top of Off-the-Shelf Runtimes"
description: "Every off-the-shelf AI agent harness hits the same walls: amnesia, config drift, and sandbox isolation. Here is how I built my own layer of shared memory, session history, and rule inheritance on top of the one I run."
publishDate: "2026-11-17"
author: "Tyler Miranda"
tags: ["AI Agents", "MCP", "SQLite", "Homelab", "Personal Software"]
ogImage: "/images/blog/custom-agent-harness-hero.png"
readTime: "10 min read"
draft: false
---

When you first spin up an off-the-shelf agent harness, the initial experience is impressive. It doesn't really matter which one: [Claude Code](https://www.anthropic.com/claude-code), [Codex](https://github.com/openai/codex), [Gemini CLI](https://github.com/google-gemini/gemini-cli), Cursor's agent, or a self-hosted runtime like [OpenBot](https://github.com/nightly-labs/openbot), which is the one I happen to run. You install it, sign in to a model provider, ask it to look over a repository or scaffold a service, and watch it run shell commands for you.

After running one daily for a few weeks, though, the limitations show up, and they are the same no matter which harness you picked. They aren't bugs in any one product. They come from how harnesses are built: each one owns its own sessions, its own config, and its own sandbox.

The first issue is session amnesia across tools. If I spend an hour in Cursor or Antigravity on my laptop fixing a caching bug, and then ask a background agent on my server to prepare the release, the server agent knows nothing about that work. Every harness keeps its own history, and none of them read each other's. It references old code, suggests discarded approaches, and requires a lengthy paste of recent context before it can do anything useful.

The second issue is fleet drift. When you move from a single generalist bot to thirty-odd specialized agents (one for home automation, one for 3D printing, one for reading statistics, one for personal accounting), keeping operational rules consistent becomes tedious. Updating a basic convention around secret handling or process management means updating thirty separate prompts or config files by hand, and missing one.

The third issue is sandbox isolation. Whether a harness runs in a container, a VM, or a cloud workspace, it is boxed off from the rest of your life on purpose. Mine lives in a Linux container on a home server, but the information I rely on daily lives in macOS native databases (Apple Notes, Reminders, Calendar) and on local physical devices in the house. The container cannot see any of it without custom plumbing.

Building a custom harness is often where you want to end up, but it is rarely the best place to start (in my opinion :) ). If you begin from zero on day one, you spend weeks building WebSockets, terminal emulators, authentication, and container isolation before you even know what your agents actually struggle with. You end up designing for hypothetical problems instead of the real bottlenecks.

The better path is starting with whichever off-the-shelf harness you like, running your daily work through it, and letting the real friction points dictate what custom harness capabilities you need to build. 

Here is how that evolution played out on my laptop and the small server I run at home. I built these layers around OpenBot, but none of them depend on it. Swap in your own harness and the problems, and most of the fixes, stay the same.

---

## Architecture: connecting the workstation, server, and hardware

Instead of treating the harness as an isolated playground, I tied it into a small mesh with three parts:

- My laptop (macOS): Cursor and Antigravity, with stop hooks that push each finished session to the memory server, plus a small MCP server that exposes Apple Notes, Reminders, and Calendar.
- The home server: a shared memory hub (SQLite with WAL and FTS5 search, plus a Git-backed Markdown mirror), a proxy that sits in front of the Mac bridge, and the agent harness itself (OpenBot in my case) running about thirty specialized agents that inherit the same rules.
- Physical hardware and local services: a Bambu Lab 3D printer, Frigate NVR with a Coral TPU for camera detection, and a headless browser for scraping.

The agents pull shared context from the memory hub, reach my Mac through the proxy, and dispatch work to hardware on the local network. Sessions from the laptop reach the server over the LAN or a Cloudflare Tunnel.

---

## Shared SQLite memory and session history

Agent amnesia happens because each tool saves history in its own format and place. Cursor writes to local application storage, Antigravity writes to its project directories, Claude Code keeps its own transcript files, and the server harness has its own internal database. Nothing shares.

I replaced that fragmentation with a single Model Context Protocol (MCP) server running on top of SQLite with write-ahead logging (WAL) and full-text search (FTS5 BM25).

### Automated session ingestion
When a coding session wraps up in Cursor or Antigravity on my laptop, an automated stop hook executes locally. It packages the conversation along with any implementation plan or walkthrough files the agent produced and pushes it to my memory server, where transcripts pass through regex redaction for obvious API keys and tokens:

```typescript
// Recent sessions from every IDE and server agent
const recentSessions = await history_list_sessions({ 
  harness: "all", 
  limit: 5 
});
```

When an agent on the home server picks up a follow-up task twenty minutes later, it can run that query before starting. It sees which files changed, which bugs were resolved, and what trade-offs were made on the laptop.

### Atomic work capture
Relying on agents to manually open, edit, and save multiple Markdown log files regularly results in formatting errors and git merge conflicts. 

I gave the harness a single capture tool called `pkm_record_work`. In a single call, it writes an immutable log row into SQLite, indexes the content into FTS5 for fast keyword retrieval, updates the target project's summary record, and re-renders a Git-backed Markdown mirror. Everything stays consistent without multi-file editing loops.

---

## Four-layer configuration inheritance across agents

When managing about thirty agents, prompt drift causes constant headaches. If you discover a problem with how background tasks are monitored, you cannot spend an hour editing prompts across thirty web forms.

I set up four layers of inheritance that push the same conventions into every agent automatically. The details below are from my setup, but most harnesses now have some version of each layer:

1. Global skills: Shared capabilities like the central memory bridge live in a global skills directory. Every agent sees each skill's name and a one-line description, and loads the full instructions only when a task calls for it, so a big skill library costs almost nothing until it is needed.
2. Managed skill overlay: I bind-mount a shared skill file from the host into the container, read-only. When a new agent workspace is created, that skill is copied in, so every new agent starts with the same database and state conventions.
3. Ancestor rule files: I keep `AGENTS.md` and `CLAUDE.md` at the top of the directory tree that holds every agent's workspace. Most coding agent CLIs read a rules file like these and also pick up the ones in parent directories, so every agent inherits the base rules on safety, secrets, and task handling without me copying prompts around.
4. Essential memory seeding: When I set up a new agent, I seed a few baseline memories into the harness's memory store and mark them essential. Essential memories ride along with every turn instead of waiting to be searched, so they survive context compaction.

When I change a shared skill or rules file, every agent picks it up on its next turn. Seeded memories live per agent, so those get refreshed with a small script.

![My agent harness (OpenBot) with about thirty specialized agents in the sidebar](/images/blog/openbot-harness.png)

---

## Bridging Linux containers to macOS tools

My background agents often need personal context: checking upcoming calendar events, reviewing active reminders, or reading quick notes taken on an iPhone.

Running in a Linux container on a home server, my harness cannot talk directly to Apple frameworks. Running a full macOS virtual machine on the server wastes resources, and scraping web portals is unreliable.

My workaround is a small MCP server on my primary Mac that exposes those apps over HTTP, with a proxy on the home server sitting in front of it.

The main engineering challenge with this setup is that laptops go to sleep. If an agent tries to check my calendar while the laptop lid is closed, a plain network request just hangs until some long timeout fires, and the agent's whole turn stalls with it.

So the server-side proxy probes the Mac with a short timeout before forwarding anything (simplified):

```typescript
if (!isMacReachable()) {
  return {
    status: "mac_offline",
    message: "Primary Mac is asleep or disconnected. Operating in offline fallback mode."
  };
}
```

If the laptop is asleep, the proxy answers `mac_offline` itself in about 1.5 seconds. The server agent logs the status, skips the personal lookup, and continues its work without hanging.

---

## Direct hardware control: 3D printing and cameras

Software agents become noticeably more useful when they can interact with physical hardware instead of just generating text:

- 3D printer operations: My 3D printing agent talks to my Bambu Lab printer through a self-hosted Bambuddy service. The agent can download a 3D model, configure filament slots in the material feeder, trigger server-side slicing, and queue the print job. Every job waits on a manual start, so I still confirm the bed is clear before anything moves. Giving an LLM physical hands is fun. Giving it unsupervised hands is not.
- Camera monitoring: My monitoring agents connect to Frigate NVR backed by a local Google Coral TPU, querying real-time object detection and facial recognition events across the property.
- Headless browsing: For web scraping, the agents run Obscura, a lightweight Rust headless browser running on the local server, producing clean Markdown without the overhead of heavy browser automation frameworks.

---

## One bug and one guardrail

Running autonomous agents against real infrastructure surfaced one sneaky bug and forced one important guardrail.

### The disappearing background task
Early on, server agents would go silent mid-task. An agent would start a long-running build, say it was waiting for the process to finish, and then never report back.

The cause was a mismatch between two layers, and it can bite any harness that wraps another agent CLI. Mine drives the model through the [Agent Client Protocol](https://agentclientprotocol.com) (ACP), where each prompt is a turn, and a turn ends when the model replies without calling another tool. The model's own CLI, meanwhile, told it that long commands run in the background and that it would be woken up when they finished, so stopping was fine. The agent did exactly that. The harness saw the turn end, marked it complete, ignored the completion signal that arrived later, and eventually shut down the idle agent process. Each layer made sense on its own. Together they ghosted me. If your harness wraps Claude Code, Codex, or Gemini CLI, it is worth checking what happens to a background job that finishes after the turn ends.

I fixed this by adding a strict rule to my base `AGENTS.md` file: agents must never end a turn while waiting on an asynchronous task. They must stay in the active loop, check progress at growing intervals, and deliver the final verdict in the same turn.

### Keeping secrets out of the context window
Letting agents read raw environment files or passwords is an obvious hazard, because anything a model reads can end up in a transcript, a log, or a summary.

I split secrets into three tiers:
- MCP servers handle their own authentication, so the agent calls a tool and never sees the credential.
- API tokens for local scripts live in a restricted env file (`chmod 600`) that shell commands source directly, so the values never pass through the model's context.
- Website logins go through a password manager vault. The agent asks for a login to be filled and never reads the password itself.

---

## The age of personal software

You could point your own agent to this article right now, tell it to implement this exact system, and it might work. 

The point I am trying to get across, though, is that what works for my workflow may not work for you. 

We are now living in the age of personal software, and that includes customizing your own harness. Five years ago, maintaining a bespoke setup of custom sync protocols, database schemas, IPC bridges, and monitoring tools would have required weeks of hand-rolled boilerplate that a single engineer could never justify keeping alive. 

With capable agent harnesses, that trade-off changes. When you can hand the architectural constraints, boilerplate, and edge-case debugging to local AI tools, you do not have to settle for rigid SaaS tools or blindly copy someone else's stack. 

Writing a custom harness is not a bad idea. If you care about specialized hardware, long-term memory, or cross-tool workflows, you will almost certainly end up building one. 

The trick is not starting there from scratch in the dark. By beginning with a working off-the-shelf harness, you get immediate utility while you discover where the real edges are. Once those boundaries are clear, you can build your custom harness intentionally, layer by layer, directly around the problems you have actually run into.
