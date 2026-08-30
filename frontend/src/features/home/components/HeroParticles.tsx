import { useEffect, useRef } from 'react'

interface Particle {
	x: number
	y: number
	vx: number
	vy: number
	radius: number
	color: string
	alpha: number
}

export function HeroParticles() {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		const parent = canvas?.parentElement
		const context = canvas?.getContext('2d')
		if (!canvas || !parent || !context) return

		let animationFrameId = 0
		let width = 0
		let height = 0
		const mouse = { x: -1000, y: -1000 }
		const particles: Particle[] = []
		const colors = ['#FF6B00', '#FBBF24', '#38BDF8', '#FFFFFF', '#FF8F3D']

		const resize = () => {
			const bounds = parent.getBoundingClientRect()
			const pixelRatio = window.devicePixelRatio || 1
			width = bounds.width
			height = bounds.height
			canvas.width = width * pixelRatio
			canvas.height = height * pixelRatio
			canvas.style.width = `${width}px`
			canvas.style.height = `${height}px`
			context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
			particles.length = 0
			const count = Math.min(Math.floor((width * height) / 14000), 65)
			for (let index = 0; index < count; index += 1) {
				particles.push({
					x: Math.random() * width,
					y: Math.random() * height,
					vx: (Math.random() - 0.5) * 0.75,
					vy: (Math.random() - 0.5) * 0.75,
					radius: Math.random() * 2 + 1.2,
					color: colors[Math.floor(Math.random() * colors.length)],
					alpha: Math.random() * 0.6 + 0.25,
				})
			}
		}

		const handleMouseMove = (event: MouseEvent) => {
			const bounds = canvas.getBoundingClientRect()
			mouse.x = event.clientX - bounds.left
			mouse.y = event.clientY - bounds.top
		}
		const resetMouse = () => { mouse.x = -1000; mouse.y = -1000 }
		const observer = new ResizeObserver(resize)
		observer.observe(parent)
		parent.addEventListener('mousemove', handleMouseMove)
		parent.addEventListener('mouseleave', resetMouse)
		resize()

		const render = () => {
			context.clearRect(0, 0, width, height)
			particles.forEach((particle, index) => {
				particle.x += particle.vx
				particle.y += particle.vy
				if (particle.x < 0 || particle.x > width) particle.vx *= -1
				if (particle.y < 0 || particle.y > height) particle.vy *= -1

				const mouseX = mouse.x - particle.x
				const mouseY = mouse.y - particle.y
				const mouseDistance = Math.hypot(mouseX, mouseY)
				if (mouseDistance < 120 && mouseDistance > 0) {
					const force = (120 - mouseDistance) / 120
					particle.x -= (mouseX / mouseDistance) * force * 1.5
					particle.y -= (mouseY / mouseDistance) * force * 1.5
				}

				context.beginPath()
				context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
				context.globalAlpha = particle.alpha
				context.fillStyle = particle.color
				context.shadowColor = particle.color
				context.shadowBlur = 6
				context.fill()
				context.shadowBlur = 0
				context.globalAlpha = 1

				particles.slice(index + 1).forEach((other) => {
					const distance = Math.hypot(particle.x - other.x, particle.y - other.y)
					if (distance >= 110) return
					context.beginPath()
					context.strokeStyle = `rgba(255, 180, 120, ${(1 - distance / 110) * 0.25})`
					context.lineWidth = 0.8
					context.moveTo(particle.x, particle.y)
					context.lineTo(other.x, other.y)
					context.stroke()
				})
			})
			animationFrameId = requestAnimationFrame(render)
		}
		render()

		return () => {
			cancelAnimationFrame(animationFrameId)
			observer.disconnect()
			parent.removeEventListener('mousemove', handleMouseMove)
			parent.removeEventListener('mouseleave', resetMouse)
		}
	}, [])

	return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-75" />
}