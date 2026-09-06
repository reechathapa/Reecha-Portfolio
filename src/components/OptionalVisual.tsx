import { Component } from 'react'
import type { ReactNode } from 'react'

// A failed optional graphics chunk must never take the portfolio with it.
// The accessible SVG, stage controls, and copy live outside this boundary.
export default class OptionalVisual extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? null : this.props.children }
}
