
import { QuizPage } from './types';

export const QUIZ_PAGES: QuizPage[] = [
  {
    id: 1,
    type: 'question',
    iconType: 'context',
    title: "Como você descreveria sua atividade atual?",
    subtitle: "Isso nos ajuda a personalizar o diagnóstico para o seu momento.",
    options: [
      { id: "1a", label: "Operação Recorrente: Emprestar dinheiro já faz parte da minha rotina profissional." },
      { id: "1b", label: "Operação Ocasional: Faço negócios apenas quando surgem boas oportunidades." },
      { id: "1c", label: "Perfil Iniciante: Estou começando a estruturar meus primeiros passos agora." },
      { id: "1d", label: "Busca por Controle: Já tive problemas antes e hoje priorizo a organização." }
    ]
  },
  {
    id: 2,
    type: 'question',
    iconType: 'vision',
    title: "Qual seu nível de clareza sobre o caixa?",
    subtitle: "Não estamos falando de papel, mas da sua visão real na prática.",
    options: [
      { id: "2a", label: "Nenhuma clareza: Sinto que não tenho controle e o fluxo é imprevisível." },
      { id: "2b", label: "Alguma noção: Tenho uma ideia geral, mas os números exatos fogem." },
      { id: "2c", label: "Clareza real: Sei exatamente o que esperar de retorno nos próximos meses." },
      { id: "2d", label: "Visão limitada: Nunca parei para analisar os números com profundidade." }
    ]
  },
  {
    id: 3,
    type: 'question',
    iconType: 'result',
    title: "Seu capital está crescendo como deveria?",
    subtitle: "Lembre-se: receber parcelas não significa necessariamente lucro real.",
    options: [
      { id: "3a", label: "Dinheiro estagnado: Percebo que o valor gira, mas o montante final não cresce." },
      { id: "3b", label: "Algo me trava: Sinto que a operação poderia render mais, mas não sei onde." },
      { id: "3c", label: "Sem análise: Ainda não medi a evolução real do meu patrimônio." },
      { id: "3d", label: "Crescimento saudável: Acredito que o capital está evoluindo de forma constante." }
    ]
  },
  {
    id: 4,
    type: 'question',
    iconType: 'criteria',
    title: "Como você decide os juros e prazos hoje?",
    subtitle: "Entender seu critério ajuda a medir sua maturidade de gestão.",
    questionText: "Na prática, como você define se um negócio vale a pena?",
    options: [
      { id: "4a", label: "Feeling e Relação: Decido com base na confiança e no perfil do cliente." },
      { id: "4b", label: "Padrão Único: Uso praticamente a mesma taxa para todos os contratos." },
      { id: "4c", label: "Análise Solta: Avalio caso a caso, mas sem um método padronizado." },
      { id: "4d", label: "Critério Definido: Tenho regras claras antes de fechar qualquer valor." }
    ]
  },
  {
    id: 5,
    type: 'question',
    iconType: 'attention',
    title: "Você sabe quando seu dinheiro volta?",
    subtitle: "Não falamos de datas exatas, mas de previsibilidade real.",
    questionText: "Hoje, você consegue prever o impacto dos contratos no seu caixa?",
    options: [
      { id: "5a", label: "Fluxo reativo: Vou acompanhando conforme o dinheiro entra." },
      { id: "5b", label: "Visão parcial: Tenho uma noção geral, mas não com clareza total." },
      { id: "5c", label: "Contratos isolados: Sei de alguns negócios, mas perco a visão do todo." },
      { id: "5d", label: "Visão completa: Tenho total clareza do fluxo, dos prazos e do impacto." }
    ]
  },
  {
    id: 6,
    type: 'question',
    iconType: 'result',
    title: "O que você quer priorizar agora?",
    subtitle: "Com base no seu perfil, identificamos o melhor caminho para sua gestão.",
    options: [
      { id: "6a", label: "Previsibilidade de Caixa: Quero saber exatamente quanto vou receber e quando." },
      { id: "6b", label: "Segurança Jurídica: Preciso de contratos que me protejam de verdade." },
      { id: "6c", label: "Crescimento de Patrimônio: Meu foco é fazer o capital girar e crescer com critério." }
    ]
  }
];

export const COLORS = {
  primary: '#34A0A4',
  secondary: '#B5E48C',
  text: '#1e293b',
  textLight: '#64748b'
};
