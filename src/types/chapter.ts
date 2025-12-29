// Types for chapter content loaded from backend

export interface ChapterData {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  image: {
    src: string;
    alt: string;
    caption?: string;
  };
  clickableText?: {
    label: string;
    endpoint: string;
  } | null;
}

export interface AdditionalContent {
  text: string;
}

// API response types
export interface ChapterResponse {
  chapter: ChapterData;
}

export interface AdditionalContentResponse {
  additionalContent: AdditionalContent;
}
