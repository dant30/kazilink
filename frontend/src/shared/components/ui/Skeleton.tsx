import type { HTMLAttributes } from 'react'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
	/** Indicates that the placeholder represents content that is still loading. */
	loading?: boolean
}

export function Skeleton({ className = '', loading = true, ...props }: SkeletonProps) {
	return (
		<div
			aria-hidden={!loading}
			aria-busy={loading}
			className={`skeleton-shimmer rounded-md ${className}`}
			{...props}
		/>
	)
}

export interface SkeletonTextProps extends Omit<SkeletonProps, 'children'> {
	lines?: number
}

export function SkeletonText({ lines = 3, loading = true, className = '', ...props }: SkeletonTextProps) {
	return (
		<div aria-busy={loading} className={`space-y-2 ${className}`} {...props}>
			{Array.from({ length: Math.max(1, lines) }, (_, index) => (
				<Skeleton loading={loading} key={index} className={`h-4 ${index === lines - 1 ? 'w-3/4' : 'w-full'}`} />
			))}
		</div>
	)
}
