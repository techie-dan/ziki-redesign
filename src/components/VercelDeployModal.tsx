import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Terminal, Globe, CloudCheck, Sparkles, FolderGit2 } from 'lucide-react';

interface VercelDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelDeployModal: React.FC<VercelDeployModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyText = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const vercelJsonContent = `{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}`;

  const cliCommands = `# 1. Install or run Vercel CLI
npx vercel

# Follow the interactive prompts:
# - Set up and deploy: Yes
# - Which scope: your account
# - Link to existing project: No
# - Project name: ziki-synapse-protocol
# - Directory: ./
# - Override settings: No (Vite defaults: build: "npm run build", output: "dist")

# For production release:
npx vercel --prod`;

  const gitCommands = `# 1. Initialize local repository (if not already)
git init
git add .
git commit -m "feat: Ziki Synapse Human-Agent Co-Steering Protocol"

# 2. Push to GitHub
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ziki-synapse.git
git push -u origin main

# 3. Import in Vercel Dashboard
# Go to https://vercel.com/new -> Select repository -> Deploy!`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-black text-sm shadow-md">
              ▲
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <CloudCheck className="w-3.5 h-3.5" />
                  Vercel Ready
                </span>
                <span className="text-xs text-slate-400">Zero-Config Vite SPA</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 mt-0.5">
                Deploy Ziki Synapse to Vercel
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-300">
          
          {/* Quick Status Box */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-emerald-300">Project Configured for Instant Vercel Deployment</h4>
              <p className="text-xs text-slate-400 mt-1">
                A custom <code className="text-emerald-300 font-mono">vercel.json</code> rewrite file has already been generated in the project root. Static assets build cleanly to <code className="text-emerald-300 font-mono">dist/</code> with Vite.
              </p>
            </div>
          </div>

          {/* Option A: Git Push -> Vercel Dashboard */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-indigo-400" />
                <h3 className="font-semibold text-slate-100 text-sm">Option A: Deploy via GitHub (Recommended)</h3>
              </div>
              <button
                onClick={() => copyText(gitCommands, 'git')}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
              >
                {copiedSection === 'git' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedSection === 'git' ? 'Copied' : 'Copy Git Commands'}
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Push your repository to GitHub, GitLab, or Bitbucket, then connect it via the Vercel Dashboard for automated CI/CD previews on every commit:
            </p>
            <pre className="bg-slate-900 border border-slate-800 p-3.5 rounded-lg text-xs font-mono text-indigo-200 overflow-x-auto">
              {gitCommands}
            </pre>
          </div>

          {/* Option B: Vercel CLI */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-slate-100 text-sm">Option B: Instant Deploy with Vercel CLI</h3>
              </div>
              <button
                onClick={() => copyText(cliCommands, 'cli')}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
              >
                {copiedSection === 'cli' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedSection === 'cli' ? 'Copied' : 'Copy CLI Command'}
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Deploy in seconds directly from your local terminal:
            </p>
            <pre className="bg-slate-900 border border-slate-800 p-3.5 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto">
              {cliCommands}
            </pre>
          </div>

          {/* vercel.json preview */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-slate-100 text-sm">Verified Root Configuration: vercel.json</h3>
              </div>
              <button
                onClick={() => copyText(vercelJsonContent, 'vercelJson')}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
              >
                {copiedSection === 'vercelJson' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedSection === 'vercelJson' ? 'Copied' : 'Copy Config'}
              </button>
            </div>
            <p className="text-xs text-slate-400">
              This rewrite rule ensures that all browser routing paths resolve to <code className="text-indigo-300">/index.html</code> without 404s:
            </p>
            <pre className="bg-slate-900 border border-slate-800 p-3.5 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto">
              {vercelJsonContent}
            </pre>
          </div>

          {/* Vercel Environment Variables Note */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-xs space-y-2">
            <h4 className="font-semibold text-slate-200">Optional: Vercel Environment Variables</h4>
            <p className="text-slate-400">
              If you want live real-time Gemini generation in your deployed app on Vercel, add <code className="text-indigo-300 font-mono">GEMINI_API_KEY</code> in your Vercel Project Settings &gt; Environment Variables. The app also features full interactive offline simulation and deterministic co-steering!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <a
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 font-medium"
          >
            Open Vercel Dashboard <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
