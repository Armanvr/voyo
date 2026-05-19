type Listener = (...args: unknown[]) => void

export class EventEmitter {
	private _events: Record<string, Listener[]> = {}

	on(event: string, listener: Listener): this {
		if (!this._events[event]) this._events[event] = []
		this._events[event].push(listener)
		return this
	}

	addListener(event: string, listener: Listener): this {
		return this.on(event, listener)
	}

	once(event: string, listener: Listener): this {
		const wrap: Listener = (...args) => {
			listener(...args)
			this.off(event, wrap)
		}
		return this.on(event, wrap)
	}

	off(event: string, listener: Listener): this {
		if (this._events[event]) {
			this._events[event] = this._events[event].filter((l) => l !== listener)
		}
		return this
	}

	removeListener(event: string, listener: Listener): this {
		return this.off(event, listener)
	}

	removeAllListeners(event?: string): this {
		if (event) delete this._events[event]
		else this._events = {}
		return this
	}

	emit(event: string, ...args: unknown[]): boolean {
		const listeners = this._events[event]
		if (!listeners?.length) return false
		for (const l of listeners.slice()) l(...args)
		return true
	}

	listeners(event: string): Listener[] {
		return this._events[event] ?? []
	}

	listenerCount(event: string): number {
		return this._events[event]?.length ?? 0
	}

	setMaxListeners(): this {
		return this
	}
}

export default EventEmitter
