export type Locale = "en" | "pt";

export const translations = {
  en: {
    // Header / Nav
    nav: {
      events: "Events",
      discoverExperiences: "Discover experiences around you",
      browseEvents: "Browse through the most viewed events",
      createEvent: "Create Event",
      myEvents: "My Events",
      myRegistrations: "My Registrations",
    },
    // Header Actions
    auth: {
      hello: "Hello",
      logout: "Log out",
      loginSignup: "Log in / Sign up",
    },
    // Landing Page
    landing: {
      badge: "Welcome to XploreHub",
      headline: "Your next experience starts here.",
      subheadline:
        "Discover local events, explore exclusive highlights, or create your own unforgettable moment with our community.",
      findEventsTitle: "Find events near you",
      findEventsDesc:
        "Use our interactive map and geolocation to discover experiences within a 10km radius.",
      exploreMap: "Explore Map",
      featuredTitle: "View featured events",
      featuredDesc:
        "Check out the curated selection of the most popular and recommended events from our global community.",
      viewHighlights: "View Highlights",
      organizeTitle: "Want to organize your own event?",
      organizeDesc:
        "Turn your idea into reality and connect with people nearby in minutes.",
      startNow: "Start Now",
    },
    // Footer
    footer: {
      tagline: "Discover and manage amazing events in your area.",
      connect: "Connect",
      rights: "© 2025 Victor Fernandes. All rights reserved.",
    },
    // Discovery Page
    discovery: {
      title: "Discover Events",
      subtitle: "Find amazing experiences near you",
      searchPlaceholder: "Search events...",
      filterAll: "All",
      noEvents: "No events found.",
      loadingMap: "Loading map...",
    },
    // Events Page
    events: {
      title: "Featured Events",
      subtitle: "Browse through the most viewed events",
      noEvents: "No events found.",
    },
    // Create Event Page
    createEvent: {
      title: "Create Event",
      subtitle: "Fill in the details to create your event",
    },
    // My Events Page
    myEvents: {
      title: "My Events",
      subtitle: "Manage all your organized events",
      noEvents: "You haven't created any events yet.",
      createFirst: "Create your first event",
    },
    // My Registrations Page
    myRegistrations: {
      title: "My Registrations",
      subtitle: "All events you have registered for",
      noRegistrations: "You haven't registered for any events yet.",
    },
    // Login
    login: {
      title: "Welcome back",
      subtitle: "Sign in to your account",
      emailLabel: "Email",
      passwordLabel: "Password",
      loginBtn: "Sign In",
      noAccount: "Don't have an account?",
      signupLink: "Sign up",
      orContinue: "Or continue with",
    },
    // Event Card
    eventCard: {
      free: "Free",
      register: "Register",
      viewDetails: "View Details",
    },
  },

  pt: {
    // Header / Nav
    nav: {
      events: "Eventos",
      discoverExperiences: "Descubra experiências ao seu redor",
      browseEvents: "Veja os eventos mais acessados",
      createEvent: "Criar Evento",
      myEvents: "Meus Eventos",
      myRegistrations: "Minhas Inscrições",
    },
    // Header Actions
    auth: {
      hello: "Olá",
      logout: "Sair",
      loginSignup: "Entrar / Cadastrar",
    },
    // Landing Page
    landing: {
      badge: "Bem-vindo ao XploreHub",
      headline: "Sua próxima experiência começa aqui.",
      subheadline:
        "Descubra eventos locais, explore destaques exclusivos ou crie seu próprio momento inesquecível com a nossa comunidade.",
      findEventsTitle: "Encontre eventos próximos a você",
      findEventsDesc:
        "Utilize nosso mapa interativo e geolocalização para descobrir experiências em um raio de 10km.",
      exploreMap: "Explorar Mapa",
      featuredTitle: "Visualize os eventos em destaque",
      featuredDesc:
        "Confira a seleção curada dos eventos mais populares e recomendados por nossa comunidade global.",
      viewHighlights: "Ver Destaques",
      organizeTitle: "Quer organizar seu próprio evento?",
      organizeDesc:
        "Transforme sua ideia em realidade e conecte-se com pessoas próximas em minutos.",
      startNow: "Começar Agora",
    },
    // Footer
    footer: {
      tagline: "Descubra e gerencie eventos incríveis na sua região.",
      connect: "Conectar",
      rights: "© 2025 Victor Fernandes. Todos os direitos reservados.",
    },
    // Discovery Page
    discovery: {
      title: "Descobrir Eventos",
      subtitle: "Encontre experiências incríveis perto de você",
      searchPlaceholder: "Buscar eventos...",
      filterAll: "Todos",
      noEvents: "Nenhum evento encontrado.",
      loadingMap: "Carregando mapa...",
    },
    // Events Page
    events: {
      title: "Eventos em Destaque",
      subtitle: "Veja os eventos mais acessados",
      noEvents: "Nenhum evento encontrado.",
    },
    // Create Event Page
    createEvent: {
      title: "Criar Evento",
      subtitle: "Preencha os detalhes para criar seu evento",
    },
    // My Events Page
    myEvents: {
      title: "Meus Eventos",
      subtitle: "Gerencie todos os seus eventos organizados",
      noEvents: "Você ainda não criou nenhum evento.",
      createFirst: "Criar meu primeiro evento",
    },
    // My Registrations Page
    myRegistrations: {
      title: "Minhas Inscrições",
      subtitle: "Todos os eventos em que você se inscreveu",
      noRegistrations: "Você ainda não se inscreveu em nenhum evento.",
    },
    // Login
    login: {
      title: "Bem-vindo de volta",
      subtitle: "Acesse sua conta",
      emailLabel: "E-mail",
      passwordLabel: "Senha",
      loginBtn: "Entrar",
      noAccount: "Não tem uma conta?",
      signupLink: "Cadastre-se",
      orContinue: "Ou continue com",
    },
    // Event Card
    eventCard: {
      free: "Grátis",
      register: "Inscrever-se",
      viewDetails: "Ver Detalhes",
    },
  },
} as const satisfies Record<Locale, unknown>;

export type Translations = (typeof translations)["en"];
