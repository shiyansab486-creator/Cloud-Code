#!/usr/bin/env python3
"""MyAI Tool - Local AI Code Assistant (Ollama-powered fork of Claw port)"""
import os
import sys
import argparse
import requests
import json
from pathlib import Path

# Ollama integration - local LLM
OLLAMA_URL = os.getenv('OLLAMA_URL', 'http://localhost:11434')
MODEL = os.getenv('MYAI_MODEL', 'llama3.2:3b')  # Def small local model

class MyAI:
    def __init__(self, model=MODEL):
        self.model = model
        self.context = [{'role': 'system', 'content': 'You are MyAI, a helpful code assistant. Use tools for file ops. Output markdown.'}]

    def chat(self, prompt):
        msg = {'role': 'user', 'content': prompt}
        self.context.append(msg)
        resp = requests.post(f'{OLLAMA_URL}/api/chat', json={
            'model': self.model,
            'stream': False,
            'messages': self.context,
            'tools': [  # Basic tools (extend here)
                {'type': 'function', 'function': {'name': 'read_file', 'description': 'Read file', 'parameters': {'type': 'object', 'properties': {'path': {'type': 'string'}}}}}
            ]
        })
        if resp.ok:
            data = resp.json()
            content = data['message']['content']
            self.context.append({'role': 'assistant', 'content': content})
            return content
        return f'Error: {resp.text}'

    def repl(self):
        print('MyAI REPL (Ollama). /quit to exit. Model:', self.model)
        while True:
            prompt = input('myai> ')
            if prompt in ['/quit', '/exit']:
                break
            print(self.chat(prompt))

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='MyAI - Local AI Tool')
    parser.add_argument('prompt', nargs='?', help='One-shot prompt')
    args = parser.parse_args()
    ai = MyAI()
    if args.prompt:
        print(ai.chat(args.prompt))
    else:
        ai.repl()

