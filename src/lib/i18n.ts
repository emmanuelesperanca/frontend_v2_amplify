export type Lang = 'en' | 'pt' | 'es';

export interface TimelineItem {
  phase: string;
  label: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  imageAlt: string;
  color: string;
}

export interface StatusStep {
  label: string;
  state: 'done' | 'current' | 'pending';
}

export interface ChatLabels {
  goHome: string;
  expand: string;
  collapse: string;
  marketplace: string;
  newChat: string;
  agents: string;
  history: string;
  noConversations: string;
  deleteConv: string;
  theme: string;
  language: string;
  messagePlaceholder: string; // use {agent} as placeholder
  disclaimer: string;
  cancel: string;
  send: string;
  copy: string;
  inputPlaceholder: string;
  agentNotFound: string;
  connectionError: string;
  unknownError: string;
  online: string;
}

export interface Translations {
  chat: ChatLabels;
  nav: {
    agents: string;
    intro: string;
    journey: string;
    status: string;
    supporters: string;
    platform: string;
  };
  hero: {
    badge: string;
    headline1: string;
    headline2: string;
    sub: string;
    pill1: string;
    pill2: string;
    pill3: string;
    cta1: string;
    cta2: string;
  };
  agents: {
    eyebrow: string;
    title: string;
    sub: string;
    cta: string;
    online: string;
  };
  intro: {
    eyebrow: string;
    title: string;
  };
  journey: {
    eyebrow: string;
    title: string;
    sub: string;
    timeline: TimelineItem[];
  };
  status: {
    eyebrow: string;
    title: string;
    sub: string;
    steps: StatusStep[];
    done: string;
    inProgress: string;
    pending: string;
  };
  supporters: {
    eyebrow: string;
    title: string;
    sub: string;
    team: string;
  };
  footer: {
    guardrails: string;
  };
}

// ── Shared tags (tech names don't change) ─────────────────────────────────────
const TAGS = {
  poc:    ['Python', 'PostgreSQL', 'pgvector', 'HTML/CSS/JS', 'OpenAI Enterprise', 'Local'],
  v1:     ['FastAPI', 'pgvector', 'PostgreSQL', 'OpenAI', 'NextJS', 'Tailwind', 'React', 'Prometheus', 'Grafana', 'Open Source Observability'],
  v2:     ['Amazon S3 Vectors', 'AWS Bedrock AgentCore', 'Entra ID', 'AWS Lambda', 'AWS API Gateway', 'Load Balancer', 'AWS CloudWatch', 'AWS X-Ray', 'NextJS', 'Tailwind', 'React'],
};

// ── Translations ──────────────────────────────────────────────────────────────
export const translations: Record<Lang, Translations> = {

  // ── English ──────────────────────────────────────────────────────────────────
  en: {
    chat: {
      goHome: 'Back to home',
      expand: 'Expand',
      collapse: 'Collapse',
      marketplace: 'Marketplace',
      newChat: 'New conversation',
      agents: 'Agents',
      history: 'History',
      noConversations: 'No conversations yet',
      deleteConv: 'Delete',
      theme: 'Theme',
      language: 'Language',
      messagePlaceholder: 'Message to {agent}…',
      disclaimer: 'AI-generated responses. Verify important information with official sources.',
      cancel: 'Cancel',
      send: 'Send',
      copy: 'Copy',
      inputPlaceholder: 'Type your message… (Enter to send)',
      agentNotFound: 'Agent not found.',
      connectionError: 'Connection error. Please try again.',
      unknownError: 'Unknown error.',
      online: 'Online',
    },
    nav: {
      agents: 'Agents', intro: 'Intro', journey: 'Journey',
      status: 'Status', supporters: 'Supporters',
      platform: 'Straumann Group · AI Platform',
    },
    hero: {
      badge: 'Powered by Amazon Bedrock AgentCore',
      headline1: 'Corporate AI',
      headline2: 'at global scale',
      sub: 'More than a chat, an ecosystem of specialists. Neoson understands your department and region to transform complex documents into immediate, personalized answers.',
      pill1: 'Specialized agents',
      pill2: 'Real-time generative AI',
      pill3: 'Corporate guardrails',
      cta1: 'Talk to Neoson',
      cta2: 'View all agents',
    },
    agents: {
      eyebrow: 'Available assistants',
      title: 'Choose your agent',
      sub: 'Each agent accesses the corporate knowledge base in real time and has tools dedicated to its domain.',
      cta: 'Start conversation',
      online: 'Online',
    },
    intro: {
      eyebrow: 'Introduction',
      title: 'What is Neoson?',
    },
    journey: {
      eyebrow: 'The journey',
      title: 'From scratch to AgentCore',
      sub: 'The evolution of the Neoson platform — from the original architecture to the native AWS ecosystem.',
      timeline: [
        {
          phase: '2025', label: 'How It Was Before', color: 'from-violet-500 to-purple-600',
          title: 'The Local Proof of Concept',
          description: 'The Proof of Concept focused on proving the business value of Generative AI for unstructured data. The main objective was to validate whether a RAG system could read internal manuals and policies and respond accurately, without hallucinating. It was a rapid experimentation phase, executed in isolation, to gain traction and prove that AI could go beyond mere prototypes, solving real information-search pain points for employees.',
          tags: TAGS.poc, image: '/backgrounds/slide-ui-antes.png', imageAlt: 'Original Neoson interface',
        },
        {
          phase: 'Architecture v1', label: 'Where We Were', color: 'from-blue-500 to-indigo-600',
          title: 'Self-Developed Agent Brain',
          description: 'Agent brain developed in-house with a manual knowledge ingestion pipeline, proprietary similarity search via LangChain, and automated agent creation. The architecture worked, but was too complex to iterate quickly. It would work well at Brazil scale, but at a Global scale it would be impossible to maintain with a small team.',
          tags: TAGS.v1, image: '/backgrounds/slide-arq-antes.png', imageAlt: 'Original Neoson architecture',
        },
        {
          phase: '2026 → Forward', label: 'Where We Are Going', color: 'from-emerald-500 to-teal-600',
          title: 'Amazon Bedrock AgentCore',
          description: 'The current phase represents the leap to Enterprise-level maturity. Neoson abandons custom orchestration code in favor of the native AWS ecosystem, adopting a 3-layer routing topology (Global → Domain → Leaf). The focus shifts from infrastructure maintenance to model governance, edge security (RLS), and extreme cost efficiency (FinOps).',
          tags: TAGS.v2, image: '/backgrounds/slide-arq-nova.png', imageAlt: 'New architecture with Amazon Bedrock AgentCore',
        },
      ],
    },
    status: {
      eyebrow: 'Progress',
      title: 'Project Status',
      sub: 'Currently in the phase of securing resources to continue development.',
      done: 'Done', inProgress: 'In Progress', pending: 'Pending',
      steps: [
        { label: 'Ideation',                       state: 'done' },
        { label: 'Development',                    state: 'done' },
        { label: 'Proof of Concept',               state: 'done' },
        { label: 'LATAM Leadership Approval',      state: 'done' },
        { label: 'Global Alignment',               state: 'done' },
        { label: 'Resources',                      state: 'current' },
        { label: 'Development',                    state: 'pending' },
        { label: 'Testing',                        state: 'pending' },
        { label: 'Deploy',                         state: 'pending' },
      ],
    },
    supporters: {
      eyebrow: 'Credits',
      title: 'Our Supporters',
      sub: 'This project was made possible thanks to the support and commitment of these people.',
      team: 'And to the Neoson team!',
    },
    footer: { guardrails: 'Active guardrails' },
  },

  // ── Português ─────────────────────────────────────────────────────────────────
  pt: {
    chat: {
      goHome: 'Voltar ao início',
      expand: 'Expandir',
      collapse: 'Recolher',
      marketplace: 'Marketplace',
      newChat: 'Nova conversa',
      agents: 'Agentes',
      history: 'Histórico',
      noConversations: 'Nenhuma conversa ainda',
      deleteConv: 'Excluir',
      theme: 'Tema',
      language: 'Idioma',
      messagePlaceholder: 'Mensagem para {agent}…',
      disclaimer: 'Respostas geradas por IA. Verifique informações importantes com fontes oficiais.',
      cancel: 'Cancelar',
      send: 'Enviar',
      copy: 'Copiar',
      inputPlaceholder: 'Digite sua mensagem… (Enter para enviar)',
      agentNotFound: 'Agente não encontrado.',
      connectionError: 'Erro de conexão. Tente novamente.',
      unknownError: 'Erro desconhecido.',
      online: 'Online',
    },
    nav: {
      agents: 'Agentes', intro: 'Intro', journey: 'Jornada',
      status: 'Status', supporters: 'Apoiadores',
      platform: 'Straumann Group · Plataforma de IA',
    },
    hero: {
      badge: 'Desenvolvido com Amazon Bedrock AgentCore',
      headline1: 'Inteligência Artificial',
      headline2: 'para o seu time',
      sub: 'Mais do que um chat, um ecossistema de especialistas. O Neoson entende o seu departamento e região para transformar documentos complexos em respostas imediatas e personalizadas.',
      pill1: 'Agentes especializados',
      pill2: 'IA generativa em tempo real',
      pill3: 'Guardrails corporativos',
      cta1: 'Falar com o Neoson',
      cta2: 'Ver todos os agentes',
    },
    agents: {
      eyebrow: 'Assistentes disponíveis',
      title: 'Escolha seu agente',
      sub: 'Cada agente acessa a base de conhecimento corporativa em tempo real e possui ferramentas dedicadas ao seu domínio.',
      cta: 'Iniciar conversa',
      online: 'Online',
    },
    intro: {
      eyebrow: 'Introdução',
      title: 'O que é o Neoson?',
    },
    journey: {
      eyebrow: 'A jornada',
      title: 'Do zero ao AgentCore',
      sub: 'A evolução da plataforma Neoson — da arquitetura original para o ecossistema nativo da AWS.',
      timeline: [
        {
          phase: '2025', label: 'Como Era Antes', color: 'from-violet-500 to-purple-600',
          title: 'A Prova de Conceito Local',
          description: 'A PoC focou em provar o valor de negócio da IA Generativa para dados não estruturados. O objetivo principal era validar se um sistema RAG conseguia ler manuais e políticas internas e responder com precisão, sem alucinações. Foi uma fase de experimentação rápida, executada de forma isolada, para conquistar adesão e provar que a IA podia ir além de meros protótipos, resolvendo dores reais de busca de informação dos colaboradores.',
          tags: TAGS.poc, image: '/backgrounds/slide-ui-antes.png', imageAlt: 'Interface original do Neoson',
        },
        {
          phase: 'Arquitetura v1', label: 'Onde Estávamos', color: 'from-blue-500 to-indigo-600',
          title: 'Self-Developed Agent Brain',
          description: 'Agent brain desenvolvido internamente com pipeline manual de ingestão de conhecimento, similarity search próprio via LangChain e criação automatizada de agentes. A arquitetura funcionava, mas era complexa demais para iterar com velocidade. Funcionaria bem na escala do Brasil, mas em escala Global seria impossível de manter com um time pequeno. Além disso, a dependência de múltiplas tecnologias open-source criava overhead operacional e dificultava a implementação de guardrails corporativos robustos.',
          tags: TAGS.v1, image: '/backgrounds/slide-arq-antes.png', imageAlt: 'Arquitetura original do Neoson',
        },
        {
          phase: '2026 → Futuro', label: 'Para Onde Vamos', color: 'from-emerald-500 to-teal-600',
          title: 'Amazon Bedrock AgentCore',
          description: 'A fase atual representa o salto para maturidade de nível Enterprise. O Neoson abandona código de orquestração personalizado em favor do ecossistema nativo da AWS, adotando uma topologia de roteamento em 3 camadas (Global → Domínio → Folha). O foco migra de manutenção de infraestrutura para governança de modelos, segurança de borda (RLS) e eficiência extrema de custos (FinOps).',
          tags: TAGS.v2, image: '/backgrounds/slide-arq-nova.png', imageAlt: 'Nova arquitetura com Amazon Bedrock AgentCore',
        },
      ],
    },
    status: {
      eyebrow: 'Progresso',
      title: 'Status do Projeto',
      sub: 'Atualmente na fase de obtenção de recursos para continuar o desenvolvimento.',
      done: 'Concluído', inProgress: 'Em andamento', pending: 'Pendente',
      steps: [
        { label: 'Idealização',                    state: 'done' },
        { label: 'Desenvolvimento',                state: 'done' },
        { label: 'Prova de Conceito',              state: 'done' },
        { label: 'Aprovação da Liderança LATAM',   state: 'done' },
        { label: 'Alinhamento Global',             state: 'done' },
        { label: 'Recursos',                       state: 'current' },
        { label: 'Desenvolvimento',                state: 'pending' },
        { label: 'Testes',                         state: 'pending' },
        { label: 'Deploy',                         state: 'pending' },
      ],
    },
    supporters: {
      eyebrow: 'Créditos',
      title: 'Nossos Apoiadores',
      sub: 'Este projeto foi possível graças ao apoio e comprometimento dessas pessoas.',
      team: 'E ao time do Neoson!',
    },
    footer: { guardrails: 'Guardrails ativos' },
  },

  // ── Español ───────────────────────────────────────────────────────────────────
  es: {
    chat: {
      goHome: 'Volver al inicio',
      expand: 'Expandir',
      collapse: 'Contraer',
      marketplace: 'Marketplace',
      newChat: 'Nueva conversación',
      agents: 'Agentes',
      history: 'Historial',
      noConversations: 'Sin conversaciones aún',
      deleteConv: 'Eliminar',
      theme: 'Tema',
      language: 'Idioma',
      messagePlaceholder: 'Mensaje para {agent}…',
      disclaimer: 'Respuestas generadas por IA. Verifique información importante con fuentes oficiales.',
      cancel: 'Cancelar',
      send: 'Enviar',
      copy: 'Copiar',
      inputPlaceholder: 'Escribe tu mensaje… (Enter para enviar)',
      agentNotFound: 'Agente no encontrado.',
      connectionError: 'Error de conexión. Inténtelo de nuevo.',
      unknownError: 'Error desconocido.',
      online: 'En línea',
    },
    nav: {
      agents: 'Agentes', intro: 'Intro', journey: 'Trayecto',
      status: 'Estado', supporters: 'Apoyadores',
      platform: 'Straumann Group · Plataforma de IA',
    },
    hero: {
      badge: 'Desarrollado con Amazon Bedrock AgentCore',
      headline1: 'Inteligencia Artificial',
      headline2: 'a escala global',
      sub: 'Más que un chat, un ecosistema de especialistas. Neoson entiende tu departamento y región para transformar documentos complejos en respuestas inmediatas y personalizadas.',
      pill1: 'Agentes especializados',
      pill2: 'IA generativa en tiempo real',
      pill3: 'Guardrails corporativos',
      cta1: 'Hablar con Neoson',
      cta2: 'Ver todos los agentes',
    },
    agents: {
      eyebrow: 'Asistentes disponibles',
      title: 'Elige tu agente',
      sub: 'Cada agente accede a la base de conocimiento corporativa en tiempo real y tiene herramientas dedicadas a su dominio.',
      cta: 'Iniciar conversación',
      online: 'En línea',
    },
    intro: {
      eyebrow: 'Introducción',
      title: '¿Qué es Neoson?',
    },
    journey: {
      eyebrow: 'El trayecto',
      title: 'De cero a AgentCore',
      sub: 'La evolución de la plataforma Neoson — de la arquitectura original al ecosistema nativo de AWS.',
      timeline: [
        {
          phase: '2025', label: 'Cómo Era Antes', color: 'from-violet-500 to-purple-600',
          title: 'La Prueba de Concepto Local',
          description: 'La PoC se centró en demostrar el valor de negocio de la IA Generativa para datos no estructurados. El objetivo principal era validar si un sistema RAG podía leer manuales y políticas internas y responder con precisión, sin alucinaciones. Fue una fase de experimentación rápida, ejecutada de forma aislada, para ganar tracción y demostrar que la IA podía ir más allá de los prototipos, resolviendo problemas reales de búsqueda de información para los empleados.',
          tags: TAGS.poc, image: '/backgrounds/slide-ui-antes.png', imageAlt: 'Interfaz original de Neoson',
        },
        {
          phase: 'Arquitectura v1', label: 'Dónde Estábamos', color: 'from-blue-500 to-indigo-600',
          title: 'Self-Developed Agent Brain',
          description: 'El cerebro agente desarrollado internamente con pipeline manual de ingestión de conocimiento, búsqueda de similitud propia vía LangChain y creación automatizada de agentes. La arquitectura funcionaba, pero era demasiado compleja para iterar rápidamente. Funcionaría bien a escala de Brasil, pero a escala global sería imposible de mantener con un equipo pequeño.',
          tags: TAGS.v1, image: '/backgrounds/slide-arq-antes.png', imageAlt: 'Arquitectura original de Neoson',
        },
        {
          phase: '2026 → Futuro', label: 'Hacia Dónde Vamos', color: 'from-emerald-500 to-teal-600',
          title: 'Amazon Bedrock AgentCore',
          description: 'La fase actual representa el salto a la madurez de nivel Enterprise. Neoson abandona el código de orquestación personalizado en favor del ecosistema nativo de AWS, adoptando una topología de enrutamiento de 3 capas (Global → Dominio → Hoja). El enfoque se desplaza del mantenimiento de infraestructura hacia la gobernanza de modelos, seguridad perimetral (RLS) y eficiencia de costos extrema (FinOps).',
          tags: TAGS.v2, image: '/backgrounds/slide-arq-nova.png', imageAlt: 'Nueva arquitectura con Amazon Bedrock AgentCore',
        },
      ],
    },
    status: {
      eyebrow: 'Progreso',
      title: 'Estado del Proyecto',
      sub: 'Actualmente en la fase de obtención de recursos para continuar el desarrollo.',
      done: 'Completado', inProgress: 'En progreso', pending: 'Pendiente',
      steps: [
        { label: 'Idealización',                    state: 'done' },
        { label: 'Desarrollo',                      state: 'done' },
        { label: 'Prueba de Concepto',              state: 'done' },
        { label: 'Aprobación del Liderazgo LATAM',  state: 'done' },
        { label: 'Alineamiento Global',             state: 'done' },
        { label: 'Recursos',                        state: 'current' },
        { label: 'Desarrollo',                      state: 'pending' },
        { label: 'Pruebas',                         state: 'pending' },
        { label: 'Despliegue',                      state: 'pending' },
      ],
    },
    supporters: {
      eyebrow: 'Créditos',
      title: 'Nuestros Apoyadores',
      sub: 'Este proyecto fue posible gracias al apoyo y compromiso de estas personas.',
      team: '¡Y al equipo de Neoson!',
    },
    footer: { guardrails: 'Guardrails activos' },
  },
};
