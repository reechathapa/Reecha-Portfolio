import type { ComponentProps } from 'react'
import { StaggeredMotion } from 'react-motion'

type SpringProps = ComponentProps<typeof StaggeredMotion>
const receiveProps = StaggeredMotion.prototype.componentWillReceiveProps

/**
 * React Motion 0.5.2 predates React's lifecycle rename. This scoped subclass
 * applies that rename without mutating the package or changing its solver.
 * Keep this integration on the tested React 18 version; it is not a promise
 * of React 19 / concurrent-rendering compatibility.
 */
export default class CoupledSpring extends StaggeredMotion {
  componentWillReceiveProps = undefined

  UNSAFE_componentWillReceiveProps(nextProps: SpringProps, nextContext: unknown) {
    receiveProps?.call(this, nextProps, nextContext)
  }
}
