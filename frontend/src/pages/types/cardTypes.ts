export type Card = {
  due_date: string;
  id: number;
  name: string;
  position: number;
  priority: string;
  assigned_to: number | null;
  attachments: File[];
  column: number;
  comments: Comment[];
  creation_date: string;
  description: string;
};

export type Comment = {
  id: number;
  card: number;
  text: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    username: string;
    profile_image: string;
  };
};

export interface ICardDetails {
  attachments: any[];
  card: Card;
  comments: Comment[];
}