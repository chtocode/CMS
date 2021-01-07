import { ListResponse, Paginator } from './api';
import { User } from './user';

export interface Message {
  createdAt: string;
  id: number;
  content: string;
  status: number;
  from: Omit<User, 'email'>;
  type: MessageType;
}

export type MessageType = 'notification' | 'message';

export interface MessagesRequest extends Paginator {
  userId: number;
  status?: number; // 0: unread 1: read;
  type: MessageType;
}

export interface MessagesResponse extends ListResponse {
  messages: Message[];
}

export interface MessageStatistic {
  total: number;
  read: number;
  unread: number;
}

export interface MessageStatisticGroup {
  notification: MessageStatistic;
  message: MessageStatistic;
}

export interface MessageStatisticResponse {
  sent: MessageStatisticGroup;
  receive: MessageStatisticGroup;
}
