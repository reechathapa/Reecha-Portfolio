import { expect, test } from '@playwright/test'
import { isUnexpectedConsoleMessage } from '../scripts/test-console'

const driverWarning = '[.WebGL-0x370400c22000]GL Driver Message (OpenGL, Performance, GL_CLOSE_PATH_NV, High): GPU stall due to ReadPixels'
const message = (type: string, text: string) => ({ type: () => type, text: () => text })

test('console checks tolerate only the known Chromium readback warning', () => {
  for (const text of [
    driverWarning,
    `${driverWarning} (this message will no longer repeat)`,
    driverWarning.replace('0x370400c22000', '0xABC123'),
  ]) {
    expect(isUnexpectedConsoleMessage(message('warning', text)), text).toBe(false)
  }
})

test('console checks still reject application warnings and every console error', () => {
  for (const text of [
    'An unexpected application warning',
    'GPU stall due to ReadPixels',
    `Application warning: ${driverWarning}`,
    `${driverWarning}: unexpected details`,
    driverWarning.replace('GPU stall due to ReadPixels', 'WebGL context lost'),
    driverWarning.replace('Performance', 'Error'),
  ]) {
    expect(isUnexpectedConsoleMessage(message('warning', text)), text).toBe(true)
  }
  for (const text of [
    'Uncaught TypeError: Cannot read properties of undefined',
    'Failed to load resource: the server responded with a status of 404',
    driverWarning,
    `${driverWarning} (this message will no longer repeat)`,
  ]) {
    expect(isUnexpectedConsoleMessage(message('error', text)), text).toBe(true)
  }
})

test('console checks do not treat informational output as errors', () => {
  for (const type of ['log', 'info', 'debug']) {
    expect(isUnexpectedConsoleMessage(message(type, 'Informational output'))).toBe(false)
  }
})
