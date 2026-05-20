import { useRef, useState } from 'preact/hooks'
import { insertTrip } from '../db'
import type { Day, Step, Trip } from '../types'

interface FormStep {
	id: string
	lieu: string
	heureArrivee: string
	type: string
	note: string
	adresse: string
	lat: string
	lon: string
}

interface FormDay {
	id: string
	date: string
	theme: string
	steps: FormStep[]
}

interface FormState {
	destination: string
	hotel: string
	hotelAdresse: string
	dateArrivee: string
	dateDepart: string
	jours: FormDay[]
}

const STEP_TYPES = [
	'attraction',
	'culture',
	'dejeuner',
	'diner',
	'gouter',
	'shopping',
	'marche',
	'evenement',
	'logistique',
]

const JOURS_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

function dayOfWeek(dateStr: string): string {
	if (!dateStr) return ''
	const d = new Date(dateStr)
	return JOURS_FR[d.getDay()] ?? ''
}

function uid(): string {
	return Math.random().toString(36).slice(2)
}

function emptyStep(): FormStep {
	return { id: uid(), lieu: '', heureArrivee: '', type: 'attraction', note: '', adresse: '', lat: '', lon: '' }
}

function emptyDay(): FormDay {
	return { id: uid(), date: '', theme: '', steps: [emptyStep()] }
}

function formToTrip(form: FormState): Trip {
	const jours: Day[] = form.jours.map((jour, i) => {
		const depart: Step = {
			ordre: 0,
			lieu: form.hotel || 'Hôtel',
			adresse: form.hotelAdresse,
			coordonnees: { lat: 0, lon: 0 },
			type: 'depart',
			heure_depart: '09:00',
		}
		const etapes: Step[] = jour.steps
			.filter((s) => s.lieu.trim())
			.map((s, j) => ({
				ordre: j + 1,
				lieu: s.lieu,
				adresse: s.adresse,
				coordonnees: {
					lat: parseFloat(s.lat) || 0,
					lon: parseFloat(s.lon) || 0,
				},
				heure_arrivee: s.heureArrivee || undefined,
				type: s.type,
				note: s.note || undefined,
			}))

		return {
			jour: i + 1,
			date: jour.date,
			jour_semaine: dayOfWeek(jour.date),
			theme: jour.theme || `Jour ${i + 1}`,
			depart_hotel: '09:00',
			etapes: [depart, ...etapes],
		}
	})

	return {
		sejour: {
			destination: form.destination,
			hotel: {
				nom: form.hotel,
				adresse: form.hotelAdresse,
				coordonnees: { lat: 0, lon: 0 },
			},
			dates: {
				arrivee: form.dateArrivee,
				depart: form.dateDepart,
				duree_nuits: form.jours.length,
			},
			infos_transport: {
				carte_recommandee: '',
				modes_utilises: [],
				taux_change: '',
			},
		},
		jours,
	}
}

interface CreerPageProps {
	onSaved: () => void
	onBack: () => void
}

function validateTrip(data: unknown): data is Trip {
	if (!data || typeof data !== 'object') return false
	const d = data as Record<string, unknown>
	if (!d.sejour || typeof d.sejour !== 'object') return false
	const sejour = d.sejour as Record<string, unknown>
	if (typeof sejour.destination !== 'string' || !sejour.destination) return false
	if (!Array.isArray(d.jours) || d.jours.length === 0) return false
	return (d.jours as unknown[]).every((j) => {
		if (!j || typeof j !== 'object') return false
		return Array.isArray((j as Record<string, unknown>).etapes)
	})
}

export function CreerPage({ onSaved, onBack }: CreerPageProps) {
	const [form, setForm] = useState<FormState>({
		destination: '',
		hotel: '',
		hotelAdresse: '',
		dateArrivee: '',
		dateDepart: '',
		jours: [emptyDay()],
	})
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState('')
	const [importing, setImporting] = useState(false)
	const [importError, setImportError] = useState('')
	const fileInputRef = useRef<HTMLInputElement>(null)

	function handleImportClick() {
		setImportError('')
		fileInputRef.current?.click()
	}

	async function handleFileChange(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0]
		if (!fileInputRef.current) return
		fileInputRef.current.value = ''
		if (!file) return
		setImporting(true)
		setImportError('')
		try {
			const text = await file.text()
			let parsed: unknown
			try {
				parsed = JSON.parse(text)
			} catch {
				setImportError('JSON mal formé — vérifiez la syntaxe du fichier.')
				setImporting(false)
				return
			}
			if (!validateTrip(parsed)) {
				setImportError('JSON mal formé — structure invalide (sejour, destination, jours, etapes requis).')
				setImporting(false)
				return
			}
			await insertTrip({
				name: parsed.sejour.destination,
				trip: parsed,
				createdAt: new Date().toISOString(),
			})
			onSaved()
		} catch {
			setImportError('Erreur lors de l\'import.')
			setImporting(false)
		}
	}

	function setField<K extends keyof FormState>(key: K, val: FormState[K]) {
		setForm((f) => ({ ...f, [key]: val }))
	}

	function updateDay(dayId: string, patch: Partial<FormDay>) {
		setForm((f) => ({
			...f,
			jours: f.jours.map((d) => (d.id === dayId ? { ...d, ...patch } : d)),
		}))
	}

	function updateStep(dayId: string, stepId: string, patch: Partial<FormStep>) {
		setForm((f) => ({
			...f,
			jours: f.jours.map((d) =>
				d.id === dayId ? { ...d, steps: d.steps.map((s) => (s.id === stepId ? { ...s, ...patch } : s)) } : d,
			),
		}))
	}

	function addDay() {
		setForm((f) => ({ ...f, jours: [...f.jours, emptyDay()] }))
	}

	function removeDay(dayId: string) {
		setForm((f) => ({ ...f, jours: f.jours.filter((d) => d.id !== dayId) }))
	}

	function addStep(dayId: string) {
		setForm((f) => ({
			...f,
			jours: f.jours.map((d) => (d.id === dayId ? { ...d, steps: [...d.steps, emptyStep()] } : d)),
		}))
	}

	function removeStep(dayId: string, stepId: string) {
		setForm((f) => ({
			...f,
			jours: f.jours.map((d) => (d.id === dayId ? { ...d, steps: d.steps.filter((s) => s.id !== stepId) } : d)),
		}))
	}

	async function handleSubmit(e: Event) {
		e.preventDefault()
		if (!form.destination.trim()) {
			setError('Destination requise.')
			return
		}
		if (form.jours.length === 0) {
			setError('Au moins un jour requis.')
			return
		}
		setSaving(true)
		setError('')
		try {
			const trip = formToTrip(form)
			await insertTrip({
				name: form.destination,
				trip,
				createdAt: new Date().toISOString(),
			})
			onSaved()
		} catch {
			setError('Erreur lors de la sauvegarde.')
			setSaving(false)
		}
	}

	const inputCls =
		'w-full bg-transparent border-b border-ink/20 py-2 text-sm text-ink outline-none placeholder:text-ink/30 focus:border-primary transition-colors'
	const labelCls = 'block text-[10px] font-bold text-sand uppercase tracking-widest mb-1'

	return (
		<div class='pb-24'>
			<div class='flex items-center gap-3 px-4 pt-8 pb-4'>
				<button
					type='button'
					onClick={onBack}
					class='text-sand hover:text-primary transition-colors'
					aria-label='Retour'
				>
					<svg
						viewBox='0 0 16 16'
						fill='none'
						stroke='currentColor'
						stroke-width='1.5'
						stroke-linecap='round'
						stroke-linejoin='round'
						class='w-5 h-5'
						aria-hidden='true'
					>
						<path d='M10 3L5 8l5 5' />
					</svg>
				</button>
				<div>
					<p class='text-[10px] font-bold text-sand uppercase tracking-widest'>Voyo</p>
					<h1 class='text-2xl font-black text-ink'>Nouveau voyage</h1>
				</div>
			</div>

			{/* Import JSON */}
			<div class='px-4 mb-6'>
				<input
					ref={fileInputRef}
					type='file'
					accept='.json,application/json'
					class='hidden'
					onChange={handleFileChange}
				/>
				<button
					type='button'
					onClick={handleImportClick}
					disabled={importing}
					class='w-full py-3 border border-ink/20 text-ink font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-colors disabled:opacity-50'
				>
					<svg viewBox='0 0 16 16' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' class='w-4 h-4' aria-hidden='true'>
						<path d='M8 10V3M5 6l3-3 3 3' />
						<path d='M3 12h10' />
					</svg>
					{importing ? 'Import…' : 'Importer un JSON'}
				</button>
				{importError && <p class='mt-2 text-xs text-red-400 font-bold'>{importError}</p>}
				<div class='flex items-center gap-3 mt-5'>
					<div class='flex-1 h-px bg-ink/10' />
					<span class='text-[10px] font-bold text-sand uppercase tracking-widest'>ou créer manuellement</span>
					<div class='flex-1 h-px bg-ink/10' />
				</div>
			</div>

			<form onSubmit={handleSubmit} class='px-4 space-y-8'>
				{/* Trip info */}
				<section class='space-y-5'>
					<div>
						<label for='destination' class={labelCls}>
							Destination *
						</label>
						<input
							id='destination'
							type='text'
							value={form.destination}
							onInput={(e) => setField('destination', (e.target as HTMLInputElement).value)}
							placeholder='Paris, Tokyo, New York…'
							class={inputCls}
						/>
					</div>
					<div class='grid grid-cols-2 gap-4'>
						<div>
							<label for='date-arrivee' class={labelCls}>
								Date aller
							</label>
							<input
								id='date-arrivee'
								type='date'
								value={form.dateArrivee}
								onInput={(e) => setField('dateArrivee', (e.target as HTMLInputElement).value)}
								class={inputCls}
							/>
						</div>
						<div>
							<label for='date-depart' class={labelCls}>
								Date retour
							</label>
							<input
								id='date-depart'
								type='date'
								value={form.dateDepart}
								onInput={(e) => setField('dateDepart', (e.target as HTMLInputElement).value)}
								class={inputCls}
							/>
						</div>
					</div>
					<div>
						<label for='hotel' class={labelCls}>
							Hôtel
						</label>
						<input
							id='hotel'
							type='text'
							value={form.hotel}
							onInput={(e) => setField('hotel', (e.target as HTMLInputElement).value)}
							placeholder={"Nom de l'hôtel"}
							class={inputCls}
						/>
					</div>
					<div>
						<label for='hotel-adresse' class={labelCls}>
							Adresse hôtel
						</label>
						<input
							id='hotel-adresse'
							type='text'
							value={form.hotelAdresse}
							onInput={(e) => setField('hotelAdresse', (e.target as HTMLInputElement).value)}
							placeholder='123 rue…'
							class={inputCls}
						/>
					</div>
				</section>

				{/* Days */}
				<section class='space-y-6'>
					<div class='flex items-center justify-between'>
						<p class='text-[10px] font-bold text-sand uppercase tracking-widest'>Jours</p>
						<span class='text-xs text-sand'>
							{form.jours.length} jour{form.jours.length > 1 ? 's' : ''}
						</span>
					</div>

					{form.jours.map((jour, dayIdx) => (
						<div key={jour.id} class='border border-ink/10 p-4 space-y-4'>
							<div class='flex items-center justify-between'>
								<p class='text-xs font-black text-ink uppercase tracking-widest'>Jour {dayIdx + 1}</p>
								{form.jours.length > 1 && (
									<button
										type='button'
										onClick={() => removeDay(jour.id)}
										class='text-[10px] font-bold text-sand/60 hover:text-red-400 uppercase tracking-wider transition-colors'
									>
										Supprimer
									</button>
								)}
							</div>

							<div class='grid grid-cols-2 gap-4'>
								<div>
									<label class={labelCls}>Date</label>
									<input
										type='date'
										value={jour.date}
										onInput={(e) =>
											updateDay(jour.id, { date: (e.target as HTMLInputElement).value })
										}
										class={inputCls}
									/>
									{jour.date && <p class='text-[10px] text-sand mt-1'>{dayOfWeek(jour.date)}</p>}
								</div>
								<div>
									<label class={labelCls}>Thème / Titre</label>
									<input
										type='text'
										value={jour.theme}
										onInput={(e) =>
											updateDay(jour.id, { theme: (e.target as HTMLInputElement).value })
										}
										placeholder='Ex: Tour Eiffel…'
										class={inputCls}
									/>
								</div>
							</div>

							{/* Steps */}
							<div class='space-y-3 pt-2'>
								<p class='text-[10px] font-bold text-sand uppercase tracking-widest'>Étapes</p>

								{jour.steps.map((step, stepIdx) => (
									<div key={step.id} class='border-l-2 border-ink/10 pl-3 space-y-2'>
										<div class='flex items-center justify-between'>
											<p class='text-[10px] text-sand'>#{stepIdx + 1}</p>
											{jour.steps.length > 1 && (
												<button
													type='button'
													onClick={() => removeStep(jour.id, step.id)}
													class='text-[10px] text-sand/50 hover:text-red-400 transition-colors'
												>
													×
												</button>
											)}
										</div>

										<div class='grid grid-cols-2 gap-2'>
											<div class='col-span-2'>
												<label class={labelCls}>Lieu *</label>
												<input
													type='text'
													value={step.lieu}
													onInput={(e) =>
														updateStep(jour.id, step.id, {
															lieu: (e.target as HTMLInputElement).value,
														})
													}
													placeholder='Tour Eiffel'
													class={inputCls}
												/>
											</div>
											<div>
												<label class={labelCls}>Heure</label>
												<input
													type='time'
													value={step.heureArrivee}
													onInput={(e) =>
														updateStep(jour.id, step.id, {
															heureArrivee: (e.target as HTMLInputElement).value,
														})
													}
													class={inputCls}
												/>
											</div>
											<div>
												<label class={labelCls}>Type</label>
												<select
													value={step.type}
													onChange={(e) =>
														updateStep(jour.id, step.id, {
															type: (e.target as HTMLSelectElement).value,
														})
													}
													class={`${inputCls} cursor-pointer`}
												>
													{STEP_TYPES.map((t) => (
														<option key={t} value={t}>
															{t}
														</option>
													))}
												</select>
											</div>
											<div class='col-span-2'>
												<label class={labelCls}>Adresse</label>
												<input
													type='text'
													value={step.adresse}
													onInput={(e) =>
														updateStep(jour.id, step.id, {
															adresse: (e.target as HTMLInputElement).value,
														})
													}
													placeholder='1 rue de la Paix…'
													class={inputCls}
												/>
											</div>
											<div>
												<label class={labelCls}>Lat</label>
												<input
													type='number'
													step='any'
													value={step.lat}
													onInput={(e) =>
														updateStep(jour.id, step.id, {
															lat: (e.target as HTMLInputElement).value,
														})
													}
													placeholder='48.8584'
													class={inputCls}
												/>
											</div>
											<div>
												<label class={labelCls}>Lon</label>
												<input
													type='number'
													step='any'
													value={step.lon}
													onInput={(e) =>
														updateStep(jour.id, step.id, {
															lon: (e.target as HTMLInputElement).value,
														})
													}
													placeholder='2.2945'
													class={inputCls}
												/>
											</div>
											<div class='col-span-2'>
												<label class={labelCls}>Note</label>
												<input
													type='text'
													value={step.note}
													onInput={(e) =>
														updateStep(jour.id, step.id, {
															note: (e.target as HTMLInputElement).value,
														})
													}
													placeholder='Réserver en ligne…'
													class={inputCls}
												/>
											</div>
										</div>
									</div>
								))}

								<button
									type='button'
									onClick={() => addStep(jour.id)}
									class='w-full py-2 text-[10px] font-black uppercase tracking-widest border border-dashed border-ink/20 text-sand hover:border-primary hover:text-primary transition-colors'
								>
									+ Ajouter une étape
								</button>
							</div>
						</div>
					))}

					<button
						type='button'
						onClick={addDay}
						class='w-full py-3 text-[10px] font-black uppercase tracking-widest border border-dashed border-ink/20 text-sand hover:border-primary hover:text-primary transition-colors'
					>
						+ Ajouter un jour
					</button>
				</section>

				{error && <p class='text-xs text-red-400 font-bold'>{error}</p>}

				<button
					type='submit'
					disabled={saving}
					class='w-full py-4 bg-primary text-ink font-black text-sm uppercase tracking-widest active:scale-95 transition-transform disabled:opacity-50'
				>
					{saving ? 'Sauvegarde…' : 'Créer ce voyage →'}
				</button>
			</form>
		</div>
	)
}
