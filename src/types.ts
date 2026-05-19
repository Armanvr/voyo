export interface Coordonnees {
  lat: number
  lon: number
}

export interface Transport {
  mode: string
  ligne?: string
  trajet?: string
  duree_min: number
  cout_gbp_par_pers: number
}

export interface Step {
  ordre: number
  lieu: string
  adresse: string
  coordonnees: Coordonnees
  heure_arrivee?: string
  heure_depart?: string
  heure_ceremonie?: string
  fin_ceremonie?: string
  heure_train?: string
  duree_visite_min?: number
  duree_min?: number
  type: string
  gratuit?: boolean
  note?: string
  transport_depuis_precedent?: Transport
}

export interface Day {
  jour: number
  date: string
  jour_semaine: string
  theme: string
  contrainte?: string
  evenement_special?: string
  depart_hotel: string
  retour_hotel?: string
  arrivee_gare?: string
  train_depart?: string
  point_final?: string
  etapes: Step[]
}

export interface Hotel {
  nom: string
  adresse: string
  coordonnees: Coordonnees
  metro_proche?: string
}

export interface Trip {
  sejour: {
    destination: string
    hotel: Hotel
    dates: {
      arrivee: string
      depart: string
      duree_nuits: number
    }
    infos_transport: {
      carte_recommandee: string
      modes_utilises: string[]
      taux_change: string
    }
  }
  jours: Day[]
}
