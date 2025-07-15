export interface ICard {
  id: number;
  name: string;
  column: number;
  description: string;
  creation_date: string; // ISO string
}

export interface IComment {
  id: number;
  content: string;
  author: number;
  creation_date: string;
}

export interface IAttachment {
  id: number;
  file_url: string;
  filename: string;
  uploaded_at: string;
}

export interface ICardDetails {
  card: ICard;
  comments: IComment[];
  attachments: IAttachment[];
}
