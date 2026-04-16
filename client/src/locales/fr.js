export default {
  nav: {
    home: "Accueil",
    rides: "Trajets",
    profile: "Profil",
    about: "À propos",
    login: "Se connecter",
    logout: "Déconnexion"
  },
  home: {
    badge: "Communauté étudiante EFREI",
    title: "Partagez le trajet,\nréduisez les coûts.",
    subtitle: "Trouvez ou proposez des trajets vers le campus, les cours et les événements fait pour les étudiants EFREI.",
    browseRides: "Voir les trajets",
    getStarted: "Commencer →",
    features: {
      browse: { title: "Voir les trajets", desc: "Consultez tous les trajets à venir publiés par des étudiants en temps réel." },
      share:  { title: "Proposer un trajet", desc: "Publiez votre trajet en quelques clics : origine, destination, horaire et places disponibles." },
      book:   { title: "Réserver instantanément", desc: "Réservez une place en un clic. Les places se mettent à jour en direct." }
    },
    cta: {
      title: "Prêt à voyager plus intelligemment ?",
      sub: "Rejoignez vos camarades EFREI sur la plateforme.",
      btn: "Créer un compte gratuit"
    }
  },
  auth: {
    welcomeBack: "Bon retour",
    createAccount: "Créer votre compte",
    signInSub: "Connectez-vous pour consulter et réserver des trajets.",
    signUpSub: "Rejoignez la communauté de covoiturage EFREI.",
    login: "Connexion",
    signup: "Inscription",
    name: "Nom complet",
    namePlaceholder: "Jean Dupont",
    email: "Adresse e-mail",
    emailPlaceholder: "vous@efrei.net",
    password: "Mot de passe",
    passwordPlaceholder: "6 caractères minimum",
    submit: "Se connecter",
    submitSignup: "Créer le compte",
    loading: "Veuillez patienter…",
    error: "Veuillez remplir tous les champs correctement."
  },
  rides: {
    title: "Trajets à venir",
    available: "trajet disponible | trajets disponibles",
    refresh: "Actualiser",
    loading: "Chargement…",
    empty: { title: "Aucun trajet à venir", sub: "Soyez le premier à publier un trajet depuis votre profil." },
    departure: "Départ",
    driver: "Conducteur",
    seats: "places",
    yourRide: "Votre trajet",
    delete: "Supprimer",
    deleting: "Suppression…",
    reserve: "Réserver une place",
    reserving: "Réservation…",
    cancelReservation: "Annuler la réservation",
    cancelling: "Annulation…",
    full: "Complet",
    deleteConfirm: "Supprimer ce trajet ? Toutes les réservations seront annulées.",
    cancelConfirm: "Annuler cette réservation ?"
  },
  profile: {
    myRides: "Mes trajets",
    myReservations: "Mes réservations",
    postRide: "Publier un trajet",
    noRides: { title: "Aucun trajet publié", sub: "Cliquez sur « Publier un trajet » pour partager votre premier trajet." },
    noReservations: { title: "Aucune réservation", sub: "Rendez-vous sur la page Trajets pour réserver une place." },
    confirmed: "Confirmée",
    cancel: "Annuler",
    edit: "Modifier",
    delete: "Supprimer",
    departure: "Départ",
    vehicle: "Véhicule",
    driver: "Conducteur",
    seats: "places",
    deleteConfirm: "Supprimer ce trajet ? Les réservations seront également supprimées.",
    cancelConfirm: "Annuler cette réservation ?"
  },
  addRide: {
    titleAdd: "Publier un trajet",
    titleEdit: "Modifier le trajet",
    departureTime: "Heure de départ",
    origin: "Lieu de départ",
    originPlaceholder: "ex. Paris, Gare de Lyon",
    destination: "Destination",
    destinationPlaceholder: "ex. EFREI Villejuif",
    seats: "Places disponibles",
    vehicleType: "Type de véhicule",
    publish: "Publier le trajet",
    save: "Enregistrer",
    saving: "Enregistrement…",
    cancel: "Annuler",
    errorDate: "Veuillez indiquer une heure de départ valide.",
    errorSeatsMax: "Ce véhicule accepte au maximum {max} passager(s).",
    errorSeatsMin: "Ce véhicule nécessite au moins {min} passager(s)."
  },
  vehicles: {
    Car: "Voiture",
    Motorcycle: "Moto",
    Van: "Fourgonnette",
    "Electric Car": "Voiture électrique",
    Scooter: "Trottinette"
  },
  about: {
    title: "À propos de nous",
    sub: "Nous sommes des étudiants EFREI qui avons créé cette plateforme de covoiturage pour rendre les trajets plus sûrs, moins chers et plus communautaires.",
    mission: ["Trajets écologiques", "Partage des coûts", "Communauté étudiante", "Sûr & vérifié"],
    meetTeam: "L'équipe",
    bios: {
      eya: "Développe l'interface : composants Vue, routage et flux de réservation.",
      ibrahim: "Connecte le frontend au backend, coordonne les tests d'intégration et la conception de l'architecture.",
      rania: "Implémente l'API Express, l'authentification et la couche de données Neon/Knex."
    }
  }
};
