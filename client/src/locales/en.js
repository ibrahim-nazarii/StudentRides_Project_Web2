export default {
  nav: {
    home: "Home",
    rides: "Rides",
    profile: "Profile",
    about: "About",
    login: "Se connecter",
    logout: "Logout"
  },
  home: {
    badge: "EFREI Student Community",
    title: "Share the ride,\ncut the cost.",
    subtitle: "Find or offer rides to campus, classes and events built for EFREI students.",
    browseRides: "Browse rides",
    getStarted: "Get started →",
    features: {
      browse: { title: "Browse rides", desc: "See all upcoming rides posted by students in real time. Filter by date or destination." },
      share:  { title: "Share your ride", desc: "Post your trip with a few taps: origin, destination, departure time and available seats." },
      book:   { title: "Book instantly", desc: "Reserve a seat with one click. Seats update live so there's no double-booking." }
    },
    cta: {
      title: "Ready to ride smarter?",
      sub: "Join your fellow EFREI students on the platform.",
      btn: "Create a free account"
    }
  },
  auth: {
    welcomeBack: "Welcome back",
    createAccount: "Create your account",
    signInSub: "Sign in to browse and book rides.",
    signUpSub: "Join the EFREI ride-sharing community.",
    login: "Login",
    signup: "Sign up",
    name: "Full name",
    namePlaceholder: "Jean Dupont",
    email: "Email address",
    emailPlaceholder: "you@efrei.net",
    password: "Password",
    passwordPlaceholder: "6+ characters",
    submit: "Sign in",
    submitSignup: "Create account",
    loading: "Please wait…",
    error: "Please fill all fields correctly."
  },
  rides: {
    title: "Upcoming rides",
    available: "ride available | rides available",
    refresh: "Refresh",
    loading: "Loading…",
    empty: { title: "No upcoming rides", sub: "Be the first to post a ride from your profile." },
    departure: "Departure",
    driver: "Driver",
    seats: "seats",
    yourRide: "Your ride",
    delete: "Delete",
    deleting: "Deleting…",
    reserve: "Reserve seat",
    reserving: "Reserving…",
    cancelReservation: "Cancel reservation",
    cancelling: "Cancelling…",
    full: "Full",
    deleteConfirm: "Delete this ride? All reservations will be cancelled.",
    cancelConfirm: "Cancel this reservation?"
  },
  profile: {
    myRides: "My rides",
    myReservations: "My reservations",
    postRide: "Post a ride",
    noRides: { title: "No rides posted yet", sub: "Click \"Post a ride\" to share your first trip." },
    noReservations: { title: "No reservations yet", sub: "Head to the Rides page to book a seat." },
    confirmed: "Confirmed",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    departure: "Departure",
    vehicle: "Vehicle",
    driver: "Driver",
    seats: "seats",
    deleteConfirm: "Delete this ride? Reservations will be removed as well.",
    cancelConfirm: "Cancel this reservation?"
  },
  addRide: {
    titleAdd: "Post a ride",
    titleEdit: "Edit ride",
    departureTime: "Departure time",
    origin: "Departure location",
    originPlaceholder: "e.g. Paris, Gare de Lyon",
    destination: "Destination",
    destinationPlaceholder: "e.g. EFREI Villejuif",
    seats: "Available seats",
    vehicleType: "Vehicle type",
    publish: "Publish ride",
    save: "Save changes",
    saving: "Saving…",
    cancel: "Cancel",
    errorDate: "Please provide a valid departure time.",
    errorSeatsMax: "This vehicle fits a maximum of {max} passenger(s).",
    errorSeatsMin: "This vehicle requires at least {min} passenger(s)."
  },
  vehicles: {
    Car: "Car",
    Motorcycle: "Motorcycle",
    Van: "Van",
    "Electric Car": "Electric Car",
    Scooter: "Scooter"
  },
  about: {
    title: "About us",
    sub: "We are EFREI students who built this ride-sharing platform to make campus commutes safer, cheaper and more community-driven.",
    mission: ["Eco-friendly commutes", "Split the cost", "Student community", "Safe & verified"],
    meetTeam: "Meet the team",
    bios: {
      eya: "Builds the UI: Vue components, routing, and reservation flows.",
      ibrahim: "Connects frontend to backend, coordinates integration testing and architecture design.",
      rania: "Implements Express API, authentication, and Neon/Knex data layer."
    }
  }
};
