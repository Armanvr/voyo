import Datastore from '@seald-io/nedb'
import type { Trip } from './types'

export interface TripDoc {
	_id?: string
	name: string
	trip: Trip
	createdAt: string
}

const _db = new Datastore<TripDoc>({ filename: 'voyo_trips', autoload: true })

export async function initDb(): Promise<void> {
	// no-op: DB auto-loads via autoload:true
}

export async function findAllTrips(): Promise<TripDoc[]> {
	const all = await _db.findAsync({})
	return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function insertTrip(doc: Omit<TripDoc, '_id'>): Promise<TripDoc> {
	return _db.insertAsync(doc as TripDoc)
}

export async function removeTrip(id: string): Promise<void> {
	await _db.removeAsync({ _id: id }, {})
}
