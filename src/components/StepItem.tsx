import type { JSX } from 'preact'
import type { Step } from '../types'

function Ico({ d, extra }: { d: string; extra?: string }) {
	return (
		<svg
			viewBox='0 0 16 16'
			fill='none'
			stroke='currentColor'
			stroke-width='1.5'
			stroke-linecap='round'
			stroke-linejoin='round'
			class='w-4 h-4'
			aria-hidden='true'
		>
			<path d={d} />
			{extra && <path d={extra} />}
		</svg>
	)
}

function IcoCircle({ d, cx, cy }: { d?: string; cx: number; cy: number }) {
	return (
		<svg
			viewBox='0 0 16 16'
			fill='none'
			stroke='currentColor'
			stroke-width='1.5'
			stroke-linecap='round'
			stroke-linejoin='round'
			class='w-4 h-4'
			aria-hidden='true'
		>
			{d && <path d={d} />}
			<circle cx={cx} cy={cy} r='1.5' fill='currentColor' stroke='none' />
		</svg>
	)
}

const ICONS: Record<string, JSX.Element> = {
	culture: <Ico d='M2 13h12M3 13V8M13 13V8M6 13v-3h4v3M2 8h12M8 3l5 5H3z' />,
	attraction: <Ico d='M8 2l1.4 3.5H13l-3 2.2 1.2 3.6L8 9.5l-3.2 1.8 1.2-3.6L3 5.5h3.6z' />,
	dejeuner: <Ico d='M5 2v4.5a2 2 0 0 0 4 0V2M7 8v6M11 2v12' />,
	diner: <Ico d='M5 2h6M5 2c0 3 1.5 5 3 5s3-2 3-5M8 7v7M6 14h4' />,
	gouter: <Ico d='M4 8h8v3a4 4 0 0 1-8 0V8zM12 9.5h1a1 1 0 1 0 0-2h-1M6 6V5M8 5V4M10 6V5' />,
	shopping: <Ico d='M5 5a3 3 0 1 1 6 0M3 5h10l-1 9H4z' />,
	marche: <Ico d='M2 6h12M2 6l2-3h8l2 3M2 6v8h12V6M6 10v3M10 10v3' />,
	evenement: <Ico d='M2 3h12v11H2zM2 7h12M6 2v2M10 2v2' />,
	logistique: <Ico d='M4 6h8v8H4zM6 6V4.5a2 2 0 0 1 4 0V6M8 10v2' />,
	point_final: <Ico d='M4 14h8M10 2v8M10 2L6 5l4 3' />,
	gratuit: <IcoCircle d='M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2zM8 5v1M8 10v1' cx={8} cy={7.5} />,
}

const ALIAS: Record<string, string> = {
	dejeuner_culture: 'dejeuner',
	gouter_culture: 'gouter',
	gouter_attraction: 'gouter',
	gouter_shopping: 'shopping',
}

const PIN = (
	<svg
		viewBox='0 0 16 16'
		fill='none'
		stroke='currentColor'
		stroke-width='1.5'
		stroke-linecap='round'
		stroke-linejoin='round'
		class='w-4 h-4'
		aria-hidden='true'
	>
		<path d='M8 14s-5-4.2-5-7a5 5 0 1 1 10 0c0 2.8-5 7-5 7z' />
		<circle cx='8' cy='7' r='1.5' fill='currentColor' stroke='none' />
	</svg>
)

const TRANSPORT_ICONS: Record<string, JSX.Element> = {
	bus: <Ico d='M2 5h12v8H2zM2 9h12M6 13v1M10 13v1M5 5V3M11 5V3' />,
	metro: <Ico d='M5 11V6l3 3 3-3v5' extra='M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8z' />,
	thames_clipper: <Ico d='M2 11h12M4 11V8.5l4-4 4 4V11M8 4.5V2.5' />,
}

function getIcon(type: string): JSX.Element {
	const key = ALIAS[type] ?? type
	return ICONS[key] ?? PIN
}

interface StepItemProps {
	step: Step
	completed: boolean
	active: boolean
	onToggle: () => void
	onStepClick?: () => void
	innerRef?: (el: HTMLElement | null) => void
}

export function StepItem({ step, completed, active, onToggle, onStepClick, innerRef }: StepItemProps) {
	const transport = step.transport_depuis_precedent

	return (
		<div
			ref={innerRef}
			class={`flex items-start gap-3 px-4 py-4 border-l-2 transition-all ${active ? 'border-primary bg-primary/5' : 'border-transparent'} ${completed ? 'opacity-40' : ''}`}
		>
			<button
				type='button'
				onClick={onToggle}
				class={`flex-shrink-0 mt-0.5 w-5 h-5 border flex items-center justify-center transition-colors ${completed ? 'bg-primary border-primary text-ink' : 'border-ink/25 bg-paper'}`}
				aria-label={completed ? 'Marquer incomplet' : 'Marquer complété'}
			>
				{completed && (
					<svg class='w-3 h-3' viewBox='0 0 12 12' fill='none' aria-hidden='true'>
						<path
							d='M2 6l3 3 5-5'
							stroke='currentColor'
							stroke-width='2'
							stroke-linecap='round'
							stroke-linejoin='round'
						/>
					</svg>
				)}
			</button>

			<button
				type='button'
				onClick={onStepClick}
				class={`flex-shrink-0 w-8 h-8 flex items-center justify-center transition-colors ${active ? 'text-primary' : 'text-ink/40'} ${onStepClick ? 'cursor-pointer hover:text-primary' : 'cursor-default'}`}
				aria-label={onStepClick ? `Centrer sur ${step.lieu}` : undefined}
				tabIndex={onStepClick ? 0 : -1}
			>
				{getIcon(step.type)}
			</button>

			<div class='flex-1 min-w-0'>
				<div class='flex items-baseline justify-between gap-2'>
					<span
						class={`font-bold text-sm leading-snug text-ink ${completed ? 'line-through decoration-sand' : ''}`}
					>
						{step.lieu}
					</span>
					{step.heure_arrivee && (
						<span class='text-xs font-black font-mono text-primary flex-shrink-0 tabular-nums'>
							{step.heure_arrivee}
						</span>
					)}
				</div>

				{transport && transport.mode !== 'pied' && (
					<div class='mt-1 flex items-center gap-1.5 text-xs text-sand'>
						{TRANSPORT_ICONS[transport.mode] ?? <Ico d='M4 8h8M8 5l3 3-3 3' />}
						<span>
							{transport.mode}
							{transport.ligne ? ` ${transport.ligne}` : ''} · {transport.duree_min}min
							{transport.cout_gbp_par_pers > 0 ? ` · £${transport.cout_gbp_par_pers.toFixed(2)}` : ''}
						</span>
					</div>
				)}

				{step.note && <p class='mt-1 text-xs text-sand/80 leading-relaxed'>{step.note}</p>}

				{step.gratuit && (
					<span class='mt-1 inline-block text-xs font-black text-primary uppercase tracking-widest'>
						Free
					</span>
				)}
			</div>
		</div>
	)
}
