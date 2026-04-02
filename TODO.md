# MyAI-Tool Customization TODO

## Plan (Approved: Make independent, runnable local AI tool)
- [x] 1. Create TODO.md & new project dir
- [ ] 2. Rename project files/repo to MyAI-Tool (README, Cargo.toml, etc.)
- [x] 3. Install Ollama, pull model (llama3.2)  # pip deps done; Ollama server next
- [ ] 4. Python: Integrate Ollama client to src/runtime.py/main.py (remove Claw deps)
- [ ] 5. Rust: Swap ClawApiClient to Ollama API calls
- [x] 6. Custom entrypoint: myai.py (chat/tool REPL)

- [ ] 7. Remove Claw-specific: API/OAuth, rename crates to myai-*
- [ ] 8. Test: python myai.py, cargo run
- [ ] 9. Commit/PR as blackboxai/myai-tool

Def: Ollama local LLM. Features: Code assistant REPL w/ tools (read/edit/bash). Local, no cloud.
