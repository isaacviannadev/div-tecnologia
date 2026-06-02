/* DIV — bilingual content (PT / EN).
   Each localized value is { pt, en }. Strings flagged as HTML in the page
   (hero lead, AI heading/body, quote) carry inline <b>/<em> and are rendered
   via dangerouslySetInnerHTML, mirroring the prototype's data-pt/data-en. */

export type Lang = "pt" | "en";
export type L = { pt: string; en: string };

export const nav = {
  links: [
    { href: "/servicos", label: { pt: "Serviços", en: "Services" } },
    { href: "/#process", label: { pt: "Processo", en: "Process" } },
    { href: "/sobre", label: { pt: "Sobre", en: "About" } },
    { href: "/contato", label: { pt: "Contato", en: "Contact" } },
  ] as { href: string; label: L }[],
  cta: { pt: "Fale conosco", en: "Get in touch" },
};

export const hero = {
  kicker: {
    pt: "Consultoria · Design Systems & Performance",
    en: "Consulting · Design Systems & Performance",
  },
  line1: { pt: "Design systems", en: "Design systems" },
  line2: { pt: "legíveis por", en: "readable by" },
  words: {
    pt: ["humanos", "máquinas", "agentes", "o time"],
    en: ["humans", "machines", "agents", "your team"],
  },
  lead: {
    pt: "Somos uma consultoria especializada em <b>Design Systems</b> e <b>performance de front-end</b>. Construímos as bases que aceleram o seu time — e os agentes de IA que codam ao lado dele.",
    en: "A consultancy specialised in <b>Design Systems</b> and <b>front-end performance</b>. We build the foundations that speed up your team — and the AI agents coding alongside it.",
  },
  ctaPrimary: { pt: "Iniciar diagnóstico", en: "Start an audit" },
  ctaSecondary: { pt: "Ver serviços", en: "See services" },
};

export const ticker: string[] = [
  "Design Tokens",
  "Core Web Vitals",
  "Component API",
  "WCAG 2.2 AA",
  "Storybook",
  "Agent-ready docs",
  "Theming",
  "Design Ops",
  "Legacy migration",
];

export const clients = {
  kicker: {
    pt: "Confiança de marcas exigentes",
    en: "Trusted by demanding brands",
  },
  row1: ["Cartier", "Ferrari", "Farfetch", "Ferragamo", "Wella", "Worten"],
  row2: ["Eli Lilly", "Sana", "Activ8", "Zelo Club", "Hurb", "Qconcursos"],
};

export const services = {
  idx: "[ 01 — SERVIÇOS ]",
  title: {
    pt: "O que fazemos, com profundidade.",
    en: "What we do, in depth.",
  },
  note: {
    pt: "Seis frentes que cobrem o ciclo completo de um design system de alta performance — do diagnóstico à adoção.",
    en: "Six tracks covering the full lifecycle of a high-performance design system — from audit to adoption.",
  },
  items: [
    {
      num: "01",
      tag: { pt: "auditoria", en: "audit" },
      title: { pt: "Auditoria de Design System", en: "Design System Audit" },
      desc: {
        pt: "Mapeamos inconsistências, dívida de componentes e lacunas de tokens. Você recebe um diagnóstico acionável e priorizado.",
        en: "We map inconsistencies, component debt and token gaps. You get an actionable, prioritised diagnosis.",
      },
    },
    {
      num: "02",
      tag: { pt: "performance", en: "performance" },
      title: {
        pt: "Performance & Core Web Vitals",
        en: "Performance & Core Web Vitals",
      },
      desc: {
        pt: "LCP, INP e CLS no verde. Otimizamos bundle, renderização e fontes para o campo — não só no laboratório.",
        en: "LCP, INP and CLS in the green. We tune bundle, rendering and fonts for the field — not just the lab.",
      },
    },
    {
      num: "03",
      tag: { pt: "tokens", en: "tokens" },
      title: { pt: "Design Tokens", en: "Design Tokens" },
      desc: {
        pt: "Uma fonte única de verdade em tokens versionados. Tema, modo escuro e múltiplas marcas a partir da mesma base.",
        en: "A single source of truth in versioned tokens. Theming, dark mode and multi-brand from one base.",
      },
    },
    {
      num: "04",
      tag: { pt: "migração", en: "migration" },
      title: { pt: "Migração de legado", en: "Legacy Migration" },
      desc: {
        pt: "Do antigo ao moderno sem big bang. Estrangulamos o legado de forma incremental enquanto entregamos valor.",
        en: "From legacy to modern without a big bang. We strangle the old incrementally while shipping value.",
      },
    },
    {
      num: "05",
      tag: { pt: "design ops", en: "design ops" },
      title: { pt: "Design Ops", en: "Design Ops" },
      desc: {
        pt: "Governança, fluxo de contribuição e release do sistema. Processos que escalam junto com o time.",
        en: "Governance, contribution flow and releases. Processes that scale with the team.",
      },
    },
    {
      num: "06",
      tag: { pt: "treinamento", en: "enablement" },
      title: { pt: "Treinamento & Enablement", en: "Training & Enablement" },
      desc: {
        pt: "Capacitamos design e engenharia para manter e evoluir o sistema com autonomia depois que saímos.",
        en: "We enable design and engineering to maintain and evolve the system on their own after we leave.",
      },
    },
  ],
};

export const ai = {
  kicker: "AI-aligned",
  heading: {
    pt: "Entregas que o time <em>e os agentes</em> sabem ler.",
    en: "Deliverables your team <em>and the agents</em> can read.",
  },
  body: {
    pt: "Nossos design systems não são pensados só para o time técnico. Cada token, componente e documento é estruturado para também ser consumido por agentes de IA — acelerando o desenvolvimento e mantendo a consistência mesmo quando quem escreve o código é uma máquina.",
    en: "Our design systems aren't built for the engineering team alone. Every token, component and doc is structured to also be consumed by AI agents — speeding up delivery and keeping consistency even when a machine writes the code.",
  },
  list: [
    {
      pt: "Tokens semânticos no padrão W3C — máquinas e humanos partem da mesma verdade.",
      en: "Semantic tokens in the W3C standard — machines and humans share one truth.",
    },
    {
      pt: "APIs de componentes e docs legíveis por LLM.",
      en: "Component APIs and docs legible to LLMs.",
    },
    {
      pt: "Regras e exemplos que guiam a geração de código.",
      en: "Rules and examples that steer code generation.",
    },
    {
      pt: "Guardrails de marca e acessibilidade que o agente respeita.",
      en: "Brand and accessibility guardrails the agent respects.",
    },
  ] as L[],
};

export const stats = [
  {
    count: 47,
    dec: 0,
    unit: "%",
    label: { pt: "Redução média de LCP", en: "Avg. LCP reduction" },
  },
  {
    count: 100,
    dec: 0,
    unit: "%",
    label: {
      pt: "Core Web Vitals no verde",
      en: "Core Web Vitals in the green",
    },
  },
  {
    count: 3.2,
    dec: 1,
    unit: "k",
    label: {
      pt: "Tokens versionados entregues",
      en: "Versioned tokens shipped",
    },
  },
  {
    count: 12,
    dec: 0,
    unit: "+",
    label: {
      pt: "Design systems em produção",
      en: "Design systems in production",
    },
  },
];

export const process = {
  idx: "[ 02 — PROCESSO ]",
  title: { pt: "Do caos à adoção.", en: "From chaos to adoption." },
  note: {
    pt: "Um caminho enxuto, em quatro fases, desenhado para entregar valor desde a primeira semana.",
    en: "A lean four-phase path, designed to deliver value from week one.",
  },
  steps: [
    {
      n: "01",
      title: { pt: "Diagnóstico", en: "Diagnose" },
      desc: {
        pt: "Auditoria de UI, tokens, performance e fluxo de contribuição.",
        en: "Audit of UI, tokens, performance and contribution flow.",
      },
    },
    {
      n: "02",
      title: { pt: "Arquitetura", en: "Architect" },
      desc: {
        pt: "Definimos tokens, APIs de componentes e a base legível por máquina.",
        en: "We define tokens, component APIs and the machine-readable base.",
      },
    },
    {
      n: "03",
      title: { pt: "Implementação", en: "Build" },
      desc: {
        pt: "Construímos, documentamos e integramos ao seu stack e CI.",
        en: "We build, document and integrate into your stack and CI.",
      },
    },
    {
      n: "04",
      title: { pt: "Adoção", en: "Adopt" },
      desc: {
        pt: "Treinamento, governança e métricas para o sistema viver.",
        en: "Training, governance and metrics so the system lives on.",
      },
    },
  ],
};

export const quote = {
  text: {
    pt: "Um design system só importa se for <em>adotado</em>. Projetamos para a adoção — por pessoas e por máquinas.",
    en: "A design system only matters if it gets <em>adopted</em>. We design for adoption — by people and by machines.",
  },
  cite: { pt: "DIV — Princípio 01", en: "DIV — Principle 01" },
};

export const cta = {
  kicker: { pt: "Próximo passo", en: "Next step" },
  heading: { pt: "Vamos construir.", en: "Let's build." },
  sub: {
    pt: "Diga onde dói — DS inconsistente, performance ruim, ou um sistema pronto para a era dos agentes.",
    en: "Tell us where it hurts — an inconsistent DS, poor performance, or a system ready for the age of agents.",
  },
  button: { pt: "Iniciar conversa", en: "Start a conversation" },
};

export const footer = {
  offices: { pt: "Escritórios", en: "Offices" },
  studio: { pt: "Estúdio", en: "Studio" },
  connect: { pt: "Conecte-se", en: "Connect" },
  newsletter: "Newsletter",
  newsletterNote: {
    pt: "Notas sobre design systems, performance e IA aplicada ao front-end.",
    en: "Notes on design systems, performance and AI applied to the front-end.",
  },
  emailPlaceholder: { pt: "seu@email.com", en: "you@email.com" },
  tagline: {
    pt: "Design Systems & Front-end Performance",
    en: "Design Systems & Front-end Performance",
  },
};

/* ============================================================
   Inner page: Serviços
   ============================================================ */
export const servicesPage = {
  kicker: { pt: "Serviços", en: "Services" },
  // <br/> rendered explicitly in the view
  titleA: { pt: "Tudo para um", en: "Everything a real" },
  titleB: { pt: "DS de verdade.", en: "design system needs." },
  lead: {
    pt: "Da auditoria à adoção. Trabalhamos no ponto onde design, engenharia e — agora — agentes de IA se encontram.",
    en: "From audit to adoption. We work where design, engineering and — now — AI agents meet.",
  },
  rows: [
    {
      ix: "01",
      title: { pt: "Auditoria de Design System", en: "Design System Audit" },
      desc: {
        pt: "Um raio-x do seu sistema: inconsistências visuais, dívida de componentes, lacunas de tokens e gargalos no fluxo de contribuição.",
        en: "An X-ray of your system: visual inconsistencies, component debt, token gaps and bottlenecks in the contribution flow.",
      },
      bullets: [
        { pt: "Inventário de componentes & UI audit", en: "Component inventory & UI audit" },
        { pt: "Mapa de dívida e prioridades", en: "Debt map & priorities" },
        { pt: "Relatório acionável + roadmap", en: "Actionable report + roadmap" },
      ] as L[],
    },
    {
      ix: "02",
      title: {
        pt: "Performance & Core Web Vitals",
        en: "Performance & Core Web Vitals",
      },
      desc: {
        pt: "Levamos LCP, INP e CLS para o verde — com foco em dados de campo, não só em métricas de laboratório. Bundle, render, fontes e imagens sob controle.",
        en: "We bring LCP, INP and CLS into the green — focused on field data, not just lab metrics. Bundle, render, fonts and images under control.",
      },
      bullets: [
        { pt: "Diagnóstico de campo (CrUX/RUM)", en: "Field diagnosis (CrUX/RUM)" },
        { pt: "Otimização de bundle & rendering", en: "Bundle & rendering optimisation" },
        { pt: "Budget de performance no CI", en: "Performance budget in CI" },
      ] as L[],
    },
    {
      ix: "03",
      title: { pt: "Design Tokens", en: "Design Tokens" },
      desc: {
        pt: "Uma fonte única de verdade em tokens versionados, no padrão W3C. Theming, modo escuro e multi-marca a partir da mesma base — legível por humanos e por máquinas.",
        en: "A single source of truth in versioned, W3C-standard tokens. Theming, dark mode and multi-brand from one base — readable by humans and machines.",
      },
      bullets: [
        { pt: "Arquitetura de tokens semânticos", en: "Semantic token architecture" },
        { pt: "Pipeline (Style Dictionary)", en: "Pipeline (Style Dictionary)" },
        { pt: "Theming & multi-marca", en: "Theming & multi-brand" },
      ] as L[],
    },
    {
      ix: "04",
      title: { pt: "Migração de legado", en: "Legacy Migration" },
      desc: {
        pt: "Do antigo ao moderno sem big bang. Aplicamos o padrão strangler para migrar de forma incremental, entregando valor a cada sprint e sem congelar o produto.",
        en: "From legacy to modern without a big bang. We apply the strangler pattern to migrate incrementally, shipping value each sprint without freezing the product.",
      },
      bullets: [
        { pt: "Estratégia incremental (strangler)", en: "Incremental strategy (strangler)" },
        { pt: "Codemods & automação", en: "Codemods & automation" },
        { pt: "Coexistência legado ⇄ novo", en: "Legacy ⇄ new coexistence" },
      ] as L[],
    },
    {
      ix: "05",
      title: { pt: "Design Ops", en: "Design Ops" },
      desc: {
        pt: "Governança, fluxo de contribuição, versionamento e release do sistema. Definimos rituais e ferramentas para o DS escalar junto com o time, não contra ele.",
        en: "Governance, contribution flow, versioning and releases. We define rituals and tooling so the DS scales with the team, not against it.",
      },
      bullets: [
        { pt: "Modelo de governança", en: "Governance model" },
        { pt: "Versionamento & changelog", en: "Versioning & changelog" },
        { pt: "Métricas de adoção", en: "Adoption metrics" },
      ] as L[],
    },
    {
      ix: "06",
      title: { pt: "Treinamento & Enablement", en: "Training & Enablement" },
      desc: {
        pt: "Capacitamos design e engenharia para manter e evoluir o sistema com autonomia — inclusive ensinando o time a trabalhar com agentes de IA sobre a base que construímos.",
        en: "We enable design and engineering to maintain and evolve the system independently — including teaching the team to work with AI agents on the base we built.",
      },
      bullets: [
        { pt: "Workshops hands-on", en: "Hands-on workshops" },
        { pt: "Playbooks & documentação", en: "Playbooks & documentation" },
        { pt: "Onboarding para agentes de IA", en: "AI-agent onboarding" },
      ] as L[],
    },
  ],
  cta: {
    kicker: { pt: "Por onde começar", en: "Where to start" },
    heading: { pt: "Comece pela auditoria.", en: "Start with an audit." },
    sub: {
      pt: "Em poucas semanas você sai com um diagnóstico claro e um plano priorizado — sem compromisso de longo prazo.",
      en: "In a few weeks you walk away with a clear diagnosis and a prioritised plan — no long-term commitment.",
    },
    button: { pt: "Solicitar diagnóstico", en: "Request an audit" },
  },
};

/* ============================================================
   Inner page: Sobre
   ============================================================ */
export const aboutPage = {
  kicker: { pt: "Sobre", en: "About" },
  titleLines: {
    pt: ["Um estúdio", "obcecado por", "consistência."],
    en: ["A studio", "obsessed with", "consistency."],
  },
  lead: {
    pt: "A DIV nasceu construindo produtos para marcas exigentes. Hoje somos uma consultoria focada no que faz esses produtos durarem: design systems sólidos e front-ends rápidos.",
    en: "DIV started out building products for demanding brands. Today we're a consultancy focused on what makes those products last: solid design systems and fast front-ends.",
  },
  manifestoIdx: "[ MANIFESTO ]",
  manifestoHeading: {
    pt: ["A consistência", "virou requisito", "de máquina."],
    en: ["Consistency is now", "a machine", "requirement."],
  },
  manifesto: [
    {
      pt: "Por anos, um design system existiu para alinhar pessoas: designers, devs e produto falando a mesma língua. Esse problema continua — mas surgiu um novo consumidor do seu sistema.",
      en: "For years, a design system existed to align people: designers, devs and product speaking the same language. That problem remains — but a new consumer of your system has arrived.",
    },
    {
      pt: "<b>Os agentes de IA agora escrevem código no seu produto.</b> Eles só mantêm a consistência se o sistema for explícito, semântico e legível por máquina. É exatamente aí que trabalhamos: bases que humanos e agentes entendem do mesmo jeito.",
      en: "<b>AI agents now write code in your product.</b> They only keep things consistent if the system is explicit, semantic and machine-readable. That's exactly where we work: foundations humans and agents understand the same way.",
    },
    {
      pt: "Não vendemos horas. Vendemos sistemas que continuam de pé depois que vamos embora.",
      en: "We don't sell hours. We sell systems that keep standing after we're gone.",
    },
  ] as L[],
  principlesIdx: "[ PRINCÍPIOS ]",
  principlesTitle: { pt: "Como pensamos.", en: "How we think." },
  principles: [
    {
      ix: "01",
      title: { pt: "Adoção > entrega", en: "Adoption > delivery" },
      desc: {
        pt: "Um componente que ninguém usa é dívida. Projetamos para ser adotado — por pessoas e por agentes.",
        en: "A component nobody uses is debt. We design for adoption — by people and by agents.",
      },
    },
    {
      ix: "02",
      title: { pt: "Explícito vence", en: "Explicit wins" },
      desc: {
        pt: "Tokens semânticos, APIs claras e docs sem ambiguidade. O que é explícito, a máquina respeita.",
        en: "Semantic tokens, clear APIs and unambiguous docs. What's explicit, the machine respects.",
      },
    },
    {
      ix: "03",
      title: { pt: "Performance é design", en: "Performance is design" },
      desc: {
        pt: "Velocidade não é detalhe de engenharia. É experiência. Medimos em campo, não só no lab.",
        en: "Speed isn't an engineering detail. It's experience. We measure in the field, not just the lab.",
      },
    },
    {
      ix: "04",
      title: { pt: "Sem big bang", en: "No big bang" },
      desc: {
        pt: "Migrações grandes morrem grandes. Entregamos valor incremental, sprint após sprint.",
        en: "Big migrations die big. We deliver incremental value, sprint after sprint.",
      },
    },
    {
      ix: "05",
      title: { pt: "Autonomia no fim", en: "Autonomy at the end" },
      desc: {
        pt: "Nosso melhor resultado é o seu time não precisar mais de nós. Documentamos e ensinamos.",
        en: "Our best outcome is your team not needing us anymore. We document and we teach.",
      },
    },
    {
      ix: "06",
      title: { pt: "Marca importa", en: "Brand matters" },
      desc: {
        pt: "Trabalhamos com marcas de luxo e percepção altíssima. Cada pixel carrega reputação.",
        en: "We work with luxury, high-perception brands. Every pixel carries reputation.",
      },
    },
  ],
  whereIdx: "[ ONDE ESTAMOS ]",
  whereTitle: {
    pt: ["Dois fusos,", "um sistema."],
    en: ["Two time zones,", "one system."],
  },
  whereNote: {
    pt: "Operamos entre Brasil e Portugal, atendendo times na América Latina e na Europa.",
    en: "We operate between Brazil and Portugal, serving teams across Latin America and Europe.",
  },
  offices: [
    {
      ix: "BR",
      city: "Rio de Janeiro",
      addr: "R. Diogo Camarão, 18 — Duque de Caxias\nRio de Janeiro, Brasil",
    },
    {
      ix: "PT",
      city: "Leiria",
      addr: "R. dos Vinagres, 27 — Pombal\nLeiria, Portugal",
    },
  ],
  cta: {
    kicker: { pt: "Vamos trabalhar juntos", en: "Let's work together" },
    heading: { pt: "Bora?", en: "Shall we?" },
    sub: {
      pt: "Conte o desafio do seu produto. A primeira conversa é sempre por nossa conta.",
      en: "Tell us your product's challenge. The first conversation is always on us.",
    },
    button: { pt: "Falar com a DIV", en: "Talk to DIV" },
  },
};

/* ============================================================
   Inner page: Contato
   ============================================================ */
export const contactPage = {
  kicker: { pt: "Contato", en: "Contact" },
  titleLines: {
    pt: ["Conte sobre", "seu projeto."],
    en: ["Tell us about", "your project."],
  },
  lead: {
    pt: "Resposta em até 1 dia útil. Sem formulário interminável — só o essencial para entendermos o desafio.",
    en: "We reply within one business day. No endless form — just what we need to understand the challenge.",
  },
  form: {
    name: { pt: "Nome", en: "Name" },
    namePlaceholder: { pt: "Como podemos te chamar?", en: "What should we call you?" },
    company: { pt: "Empresa", en: "Company" },
    companyPlaceholder: { pt: "Onde você trabalha", en: "Where you work" },
    email: { pt: "E-mail", en: "Email" },
    emailPlaceholder: { pt: "voce@empresa.com", en: "you@company.com" },
    help: { pt: "No que podemos ajudar?", en: "What can we help with?" },
    chips: [
      { pt: "Auditoria de DS", en: "DS Audit" },
      { pt: "Performance", en: "Performance" },
      { pt: "Tokens", en: "Tokens" },
      { pt: "Migração", en: "Migration" },
      { pt: "Design Ops", en: "Design Ops" },
      { pt: "Treinamento", en: "Training" },
    ] as L[],
    more: { pt: "Conte um pouco mais", en: "Tell us a bit more" },
    morePlaceholder: {
      pt: "Qual o estado atual do seu DS / front-end e o que você quer alcançar?",
      en: "What's the current state of your DS / front-end and what do you want to achieve?",
    },
    submit: { pt: "Enviar mensagem", en: "Send message" },
  },
  aside: {
    emailDirect: { pt: "Escreva direto", en: "Email us directly" },
    offices: { pt: "Escritórios", en: "Offices" },
    connect: { pt: "Conecte-se", en: "Connect" },
    responseTime: { pt: "Tempo de resposta", en: "Response time" },
    responseNote: {
      pt: "Até 1 dia útil — geralmente bem menos.",
      en: "Within one business day — usually much less.",
    },
  },
};

/* ============================================================
   Feedback (toasts + form validation) — PT/EN
   ============================================================ */
export const feedback = {
  newsletterSuccess: { pt: "Inscrição enviada com sucesso!", en: "Subscription sent!" },
  newsletterError: { pt: "Erro ao enviar. Tente novamente.", en: "Failed to send. Try again." },
  contactSuccess: {
    pt: "Obrigado pelo contato! Em breve retornaremos.",
    en: "Thanks for reaching out! We'll get back soon.",
  },
  contactError: { pt: "Erro ao enviar. Tente novamente.", en: "Failed to send. Try again." },
  invalidEmail: { pt: "E-mail inválido", en: "Invalid email" },
  required: { pt: "Campo obrigatório", en: "Required field" },
  sending: { pt: "Enviando…", en: "Sending…" },
};
