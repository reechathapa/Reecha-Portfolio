import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { brotliDecompressSync } from 'node:zlib'
import { execFileSync } from 'node:child_process'
import { chromium } from '@playwright/test'
import type { LaunchOptions } from '@playwright/test'

/** Prefer regular Playwright browsers. The Linux fallback is distributed via
 * npm for sandboxes where the separate Playwright browser CDN is unavailable.
 * It is a dev-only binary, never part of the website or a persisted artifact.
 */
export async function testBrowserOptions(): Promise<LaunchOptions> {
  const executable = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  if (executable) return { executablePath: executable }
  if (existsSync(chromium.executablePath())) return { args: ['--enable-unsafe-swiftshader'] }
  if (process.platform !== 'linux' || process.arch !== 'x64') throw new Error('Install a browser with: npx playwright install chromium')

  const { default: binary } = await import('@sparticuz/chromium')
  const binaryPath = await binary.executablePath()
  const libraries = join(tmpdir(), 'reecha-playwright-libs-149')
  const libPath = join(libraries, 'lib')
  if (!existsSync(join(libPath, 'libnss3.so'))) {
    mkdirSync(libraries, { recursive: true })
    const modulePath = fileURLToPath(import.meta.resolve('@sparticuz/chromium'))
    const archive = resolve(dirname(modulePath), '../bin/al2023.tar.br')
    execFileSync('tar', ['-xf', '-', '-C', libraries], { input: brotliDecompressSync(readFileSync(archive)) })
  }
  return {
    executablePath: binaryPath,
    args: binary.args.filter(arg => !['--single-process', '--disable-web-security', '--allow-running-insecure-content'].includes(arg)),
    env: { ...process.env, LD_LIBRARY_PATH: [libPath, process.env.LD_LIBRARY_PATH].filter(Boolean).join(':') },
  }
}
