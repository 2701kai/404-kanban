export interface Column {
  id: string;
  name: string;
  color: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'file' | 'link';
  url?: string;
  size?: string;
}

export interface Comment {
  id: string;
  author: string;
  authorInitials?: string;
  text: string;
  createdAt: string;
}

export interface Card {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  labels?: string[];
  attachments?: Attachment[];
  comments?: Comment[];
  createdAt: string;
  dueDate?: string;
  attachmentCount: number;
  commentCount: number;
  archivedAt?: string;
}
