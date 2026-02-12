
export interface Option {
  id: string;
  label: string;
}

export interface QuizPage {
  id: number;
  type: 'question' | 'content';
  iconType?: 'context' | 'vision' | 'result' | 'criteria' | 'attention';
  title: string;
  subtitle: string;
  questionText?: string;
  options?: Option[];
  contentItems?: string[];
}
