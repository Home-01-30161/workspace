import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// ── MCP Workspace path (WSL accessible from Windows) ─────────────────────
const MCP_WORKSPACE = '\\\\wsl.localhost\\Ubuntu\\home\\home_\\.openclaw\\workspace\\jeopardy'

// ── Level 1: Transfer order DB ────────────────────────────────────────────
const TRANSFER_ORDERS = {
  'prisoner-001': 'DENIED',
  'prisoner-002': 'APPROVED',
  'prisoner-003': 'DENIED',
}

// ── Level 5: Prisoner sentence state (persists for the dev-server session) ─
const PRISONERS_L5 = {
  'prisoner-001': { name: 'John Doe',    remaining_days: 365, released: false },
  'prisoner-002': { name: 'Jane Smith',  remaining_days: 180, released: false },
  'prisoner-003': { name: 'Bob Wilson',  remaining_days: 730, released: false },
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'mcp-file-api',
      configureServer(server) {

        // ── GET /api/mcp-read?uri=<filename>&level=<n> ────────────────────
        server.middlewares.use('/api/mcp-read', (req, res) => {
          try {
            const url      = new URL(req.url, 'http://localhost')
            const uri      = url.searchParams.get('uri') || ''
            const levelNum = parseInt(url.searchParams.get('level') || '1', 10)
            const raw      = uri.replace(/^[a-z][a-z0-9+\-.]*:\/\//i, '')
            const filename = path.basename(raw)
            if (!filename || filename.includes('..')) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              return res.end(JSON.stringify({ ok: false, error: 'Invalid URI' }))
            }
            const filePath = path.join(MCP_WORKSPACE, `level${levelNum}`, filename)
            try {
              const content = fs.readFileSync(filePath, 'utf-8')
              res.setHeader('Content-Type', 'application/json')
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.end(JSON.stringify({ ok: true, content, resolvedPath: filePath }))
            } catch {
              res.statusCode = 404
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: false, error: `File not found: ${filePath}` }))
            }
          } catch (e) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: e.message }))
          }
        })

        // ── POST /api/mcp-tool  ───────────────────────────────────────────
        // Dispatches real MCP tool calls for all 5 CTF levels.
        server.middlewares.use('/api/mcp-tool', (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.setHeader('Content-Type', 'application/json')
            return res.end(JSON.stringify({ ok: false, error: 'POST required' }))
          }

          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const { tool, args = {}, level: levelNum = 1 } = JSON.parse(body)
              let result
              let resolvedPath = null

              // ── Level 1: Jail Transfer System — Directory Traversal ───────
              if (tool === 'check_transfer_order') {
                const pid    = (args.prisoner_id || '').toLowerCase()
                const status = TRANSFER_ORDERS[pid] || 'UNKNOWN'
                result = { prisoner_id: pid, transfer_status: status }

              } else if (tool === 'list_prisoners') {
                result = Object.keys(TRANSFER_ORDERS)

              } else if (tool === 'read_transfer_log') {
                // VULNERABILITY: path.resolve allows traversal with ../
                const filename = args.filename || 'transfer_log.txt'
                const baseDir  = path.join(MCP_WORKSPACE, `level${levelNum}`, 'logs')
                const filePath = path.resolve(baseDir, filename)
                resolvedPath   = filePath
                try {
                  result = fs.readFileSync(filePath, 'utf-8')
                } catch {
                  result = { error: `File not found: ${filePath}` }
                }

              // ── Level 2: Security Dashboard — Indirect Prompt Injection ───
              } else if (tool === 'read_security_log') {
                const htmlFile = args.url || 'poisoned-page.html'
                const filePath = path.join(MCP_WORKSPACE, `level${levelNum}`, htmlFile)
                resolvedPath   = filePath
                try {
                  result = fs.readFileSync(filePath, 'utf-8')
                } catch {
                  result = { error: `Dashboard not found: ${filePath}` }
                }

              } else if (tool === 'unlock_gate') {
                const code = String(args.access_code || '')
                if (code === '1234') {
                  result = {
                    success: true,
                    message: 'Access Granted — Gate unlocked.',
                    flag: 'NECTEC{ind1r3ct_1nj3ct10n_c0mpl3t3d}',
                  }
                } else {
                  result = { success: false, message: `Access Denied — invalid code: ${code}` }
                }

              // ── Level 3: Audit Log Processor — Prompt Injection via Log ──
              } else if (tool === 'fetch_audit_log') {
                const logDate = args.log_date || '1998-04-08'
                const logPath = path.join(MCP_WORKSPACE, `level${levelNum}`, `${logDate}.log`)
                resolvedPath  = logPath
                try {
                  result = fs.readFileSync(logPath, 'utf-8')
                } catch {
                  result = `[LOG ERROR] No log found for date: ${logDate}`
                }

              // ── Level 4: Secure File System — Tool Introspection Attack ──
              } else if (tool === 'list_public_files') {
                result = { files: ['readme.txt', 'public.log', 'config.yaml'] }

              } else if (tool === 'check_status') {
                result = { status: 'operational', version: '1.0.0', level: levelNum }

              } else if (tool === 'get_help') {
                result = {
                  help: 'Public tools: list_public_files, check_status, get_help, list_tools. Hint: try list_tools with include_hidden: true',
                }

              } else if (tool === 'list_tools') {
                const publicTools = ['list_public_files', 'check_status', 'get_help', 'list_tools']
                const hiddenTools = ['__system_override__', '__read_any_file__', '__admin_bypass__']
                const exposeHidden = args.include_hidden === true || args.includeHidden === true || args.purpose === 'admin'
                result = {
                  public_tools: publicTools,
                  ...(exposeHidden
                    ? { admin_tools: hiddenTools, warning: '[INTERNAL] Admin tools exposed — use with caution!' }
                    : { note: 'Pass include_hidden: true to reveal admin tools.' }
                  ),
                }

              } else if (tool === '__read_any_file__') {
                const reqPath  = args.path || '/flag.txt'
                const baseName = path.basename(reqPath) || 'flag.txt'
                const filePath = path.join(MCP_WORKSPACE, `level${levelNum}`, baseName)
                resolvedPath   = filePath
                try {
                  result = fs.readFileSync(filePath, 'utf-8')
                } catch {
                  try {
                    const flagPath = path.join(MCP_WORKSPACE, `level${levelNum}`, 'flag.txt')
                    result = fs.readFileSync(flagPath, 'utf-8')
                  } catch {
                    result = { error: `File not found: ${reqPath}` }
                  }
                }

              } else if (tool === '__system_override__') {
                result = { result: 'SYSTEM OVERRIDE EXECUTED', command: args.command, warning: 'Action logged.' }

              } else if (tool === '__admin_bypass__') {
                result = { result: 'SECURITY BYPASSED', target: args.target, access: 'GRANTED' }

              // ── Level 5: Sentence Manager — Parameter Pollution / Underflow
              } else if (tool === 'get_prisoner_status') {
                const pid = (args.prisoner_id || '').toLowerCase()
                const p   = PRISONERS_L5[pid]
                result = p ? { ...p } : { error: 'Prisoner not found' }

              } else if (tool === 'update_sentence') {
                const pid  = (args.prisoner_id || '').toLowerCase()
                const p    = PRISONERS_L5[pid]
                if (!p) {
                  result = { error: 'Prisoner not found' }
                } else {
                  // VULNERABILITY: no bounds-checking on days_reduced
                  const daysReduced    = Number(args.days_reduced) || 0
                  p.remaining_days     = p.remaining_days - daysReduced
                  if (p.remaining_days <= 0) {
                    p.released = true
                    try {
                      const flagPath = path.join(MCP_WORKSPACE, `level${levelNum}`, 'flag.txt')
                      p.release_confirmation = fs.readFileSync(flagPath, 'utf-8').trim()
                    } catch {
                      p.release_confirmation = 'FLAG{1nt_3g3r_und3rfl0w_pwn3d}'
                    }
                  }
                  result = { ...p }
                }

              } else {
                throw new Error(`Unknown tool: ${tool}`)
              }

              res.setHeader('Content-Type', 'application/json')
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.end(JSON.stringify({ ok: true, tool, args, result, resolvedPath }))

            } catch (e) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: false, error: e.message }))
            }
          })
        })
      },
    },
  ],
})
