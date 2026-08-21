export type UrgencyLevel = 'urgent' | 'can wait';

export interface Task {
  id: string; // assigned client-side via crypto.randomUUID()
  title: string;
  description: string;
  urgency: UrgencyLevel;
  done: boolean;
}

// API request / response shapes

export interface GenerateChecklistRequest {
  userInput: string;
}

export interface GenerateChecklistResponse {
  tasks: Omit<Task, 'id' | 'done'>[];
}

export interface GenerateDocumentRequest {
  taskTitle: string;
  taskDescription: string;
  userInput: string;
}

export interface GenerateDocumentResponse {
  draft: string;
}
