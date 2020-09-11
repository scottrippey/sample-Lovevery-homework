import axios from 'axios';

const messagesServer = axios.create({
  baseURL: 'https://abraxvasbh.execute-api.us-east-2.amazonaws.com/proto'
});

export interface Message {
  subject: string;
  message: string;
}

export const messagesClient = {
  async getAllMessages() {
    interface MessagesResponse {
      statusCode: number;
      body: {
        [user: string]: Message[];
      };
    }
    const response = await messagesServer.get<MessagesResponse>('/messages');

    const messagesByUser = response.data.body;
    return messagesByUser;
  },
  async getUserMessages(user: string) {
    interface UserMessagesResponse {
      statusCode: number;
      body: {
        user: string;
        message: Message[];
      };
    }
    const response = await messagesServer.get<UserMessagesResponse>(`/messages/${user}`);

    const messages = response.data.body.message;
    return messages;
  },
  async addMessage(newMessage: Message & { user: string }) {
    type AddMessageResponse = unknown;
    const response = await messagesServer.post<AddMessageResponse>('/messages', {
      ...newMessage,
      operation: 'add_message',
    });
  },
};
