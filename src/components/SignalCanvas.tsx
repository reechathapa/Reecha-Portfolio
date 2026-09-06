import { useEffect, useRef } from 'react'

type Props = { active: boolean; phase: number; onReady: (ready: boolean) => void }

const vertexSource = `
  attribute vec2 a_position;
  attribute float a_lane;
  uniform vec2 u_pointer;
  uniform float u_time;
  uniform float u_phase;
  varying float v_alpha;
  void main() {
    vec2 pos = a_position;
    float proximity = exp(-5.0 * distance(pos, u_pointer));
    pos.y += sin(pos.x * 3.0 + u_time * 0.3 + a_lane) * 0.009;
    pos += (u_pointer - pos) * proximity * 0.022;
    gl_Position = vec4(pos, 0.0, 1.0);
    gl_PointSize = 2.0;
    float signal = 0.5 + 0.5 * sin(pos.x * 4.0 - u_time * 0.7 + a_lane * 0.2);
    float focus = 1.0 - min(1.0, abs(a_lane - u_phase * 4.0) / 16.0);
    v_alpha = (0.075 + signal * 0.11) * (0.7 + focus * 0.3);
  }
`
const fragmentSource = `
  precision mediump float;
  varying float v_alpha;
  void main() { gl_FragColor = vec4(0.29, 0.39, 0.19, v_alpha); }
`

// A single, small native WebGL context. Parallel data routes, not decorative
// particles. No scene graph, textures, 3D engine, or GPU work offscreen.
export default function SignalCanvas({ active, phase, onReady }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(active)
  const phaseRef = useRef(phase)
  const wake = useRef<() => void>(() => {})
  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { activeRef.current = active; wake.current() }, [active])
  useEffect(() => {
    const element = canvas.current
    if (!element) return
    let gl: WebGLRenderingContext | null = null
    try { gl = element.getContext('webgl', { alpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power', preserveDrawingBuffer: false }) } catch { /* Static signal remains available. */ }
    if (!gl) { onReady(false); return }
    const context = gl
    let frame = 0
    let disposed = false
    let lost = false
    let lastTime = 0
    let clock = 0
    const shaders: WebGLShader[] = []
    const buffers: WebGLBuffer[] = []
    const program = context.createProgram()
    if (!program) return
    const compile = (type: number, source: string) => {
      const shader = context.createShader(type)
      if (!shader) throw new Error('Shader unavailable')
      shaders.push(shader)
      context.shaderSource(shader, source)
      context.compileShader(shader)
      if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) throw new Error('Shader compilation unavailable')
      return shader
    }
    const pointer = { x: 0, y: 0 }
    const host = element.parentElement!
    let resizeObserver: ResizeObserver | undefined
    let positionLocation = 0
    let laneLocation = 0
    let vertexCount = 0
    let pointerLocation: WebGLUniformLocation | null = null
    let timeLocation: WebGLUniformLocation | null = null
    let phaseLocation: WebGLUniformLocation | null = null
    const resize = () => {
      const rect = host.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      element.width = Math.min(1200, Math.round(rect.width * dpr))
      element.height = Math.min(1000, Math.round(rect.height * dpr))
      context.viewport(0, 0, element.width, element.height)
    }
    const render = (timestamp: number) => {
      frame = 0
      if (disposed || lost || !activeRef.current || document.hidden) return
      frame = requestAnimationFrame(render)
      if (timestamp - lastTime < 1000 / 30) return
      clock += Math.min(timestamp - lastTime, 50) / 1000
      lastTime = timestamp
      context.clear(context.COLOR_BUFFER_BIT)
      context.uniform2f(pointerLocation, pointer.x, pointer.y)
      context.uniform1f(timeLocation, clock)
      context.uniform1f(phaseLocation, phaseRef.current)
      context.drawArrays(context.LINES, 0, vertexCount)
    }
    const resume = () => {
      cancelAnimationFrame(frame)
      frame = 0
      const running = !disposed && !lost && activeRef.current && !document.hidden
      element.dataset.renderState = running ? 'running' : lost ? 'fallback' : 'paused'
      if (running) { lastTime = performance.now(); frame = requestAnimationFrame(render) }
    }
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const rect = host.getBoundingClientRect()
      pointer.x = (event.clientX - rect.left) / rect.width * 2 - 1
      pointer.y = 1 - (event.clientY - rect.top) / rect.height * 2
    }
    const onLeave = () => { pointer.x = 0; pointer.y = 0 }
    const onLost = (event: Event) => {
      event.preventDefault()
      lost = true
      cancelAnimationFrame(frame)
      element.dataset.renderState = 'fallback'
      onReady(false)
    }
    try {
      context.attachShader(program, compile(context.VERTEX_SHADER, vertexSource))
      context.attachShader(program, compile(context.FRAGMENT_SHADER, fragmentSource))
      context.linkProgram(program)
      if (!context.getProgramParameter(program, context.LINK_STATUS)) throw new Error('WebGL unavailable')
      context.useProgram(program)
      const positions: number[] = []
      const lanes: number[] = []
      for (let lane = 0; lane < 19; lane++) {
        const point = (t: number) => {
          const startY = (lane / 18 - 0.5) * 1.8
          const endY = 0.35 + (lane / 18 - 0.5) * 1.2
          const eased = t * t * (3 - 2 * t)
          const y = startY * (1 - eased) + endY * eased + Math.sin(t * Math.PI) * Math.cos(lane * 0.11) * 0.25
          return [t * 2.4 - 1.2, y]
        }
        for (let step = 0; step < 74; step++) {
          positions.push(...point(step / 74), ...point((step + 1) / 74))
          lanes.push(lane, lane)
        }
      }
      vertexCount = positions.length / 2
      const attribute = (name: string, data: number[], size: number) => {
        const buffer = context.createBuffer()
        if (!buffer) throw new Error('Buffer unavailable')
        buffers.push(buffer)
        context.bindBuffer(context.ARRAY_BUFFER, buffer)
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(data), context.STATIC_DRAW)
        const location = context.getAttribLocation(program, name)
        context.enableVertexAttribArray(location)
        context.vertexAttribPointer(location, size, context.FLOAT, false, 0, 0)
        return location
      }
      positionLocation = attribute('a_position', positions, 2)
      laneLocation = attribute('a_lane', lanes, 1)
      pointerLocation = context.getUniformLocation(program, 'u_pointer')
      timeLocation = context.getUniformLocation(program, 'u_time')
      phaseLocation = context.getUniformLocation(program, 'u_phase')
      context.enable(context.BLEND)
      context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA)
      context.clearColor(0, 0, 0, 0)
      resize()
      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(host)
      host.addEventListener('pointermove', onMove, { passive: true })
      host.addEventListener('pointerleave', onLeave)
      element.addEventListener('webglcontextlost', onLost)
      document.addEventListener('visibilitychange', resume)
      wake.current = resume
      onReady(true)
      resume()
    } catch {
      onReady(false)
    }
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      wake.current = () => {}
      resizeObserver?.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
      element.removeEventListener('webglcontextlost', onLost)
      document.removeEventListener('visibilitychange', resume)
      if (!lost) {
        context.disableVertexAttribArray(positionLocation)
        context.disableVertexAttribArray(laneLocation)
        buffers.forEach(buffer => context.deleteBuffer(buffer))
        shaders.forEach(shader => context.deleteShader(shader))
        context.deleteProgram(program)
        context.getExtension('WEBGL_lose_context')?.loseContext()
      }
    }
  }, [onReady])
  return <canvas className="signal-canvas" ref={canvas} aria-hidden="true" />
}
