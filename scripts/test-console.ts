import type { ConsoleMessage } from '@playwright/test'

// Headless Chromium can emit this driver diagnostic during screenshot/readback
// capture on CI. It is not an application warning. Match only the observed
// warning (including Chromium's final repetition notice), not all WebGL output.
const chromiumReadPixelsWarning = /^\[\.WebGL-0x[\da-fA-F]+\]GL Driver Message \(OpenGL, Performance, GL_CLOSE_PATH_NV, High\): GPU stall due to ReadPixels(?: \(this message will no longer repeat\))?$/

export function isUnexpectedConsoleMessage(message: Pick<ConsoleMessage, 'type' | 'text'>): boolean {
  const type = message.type()
  // Never suppress console.error, even if its text matches the driver warning.
  return type === 'error' || (type === 'warning' && !chromiumReadPixelsWarning.test(message.text()))
}
