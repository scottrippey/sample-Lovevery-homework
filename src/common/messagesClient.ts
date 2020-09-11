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
      body: string;
    }
    interface ResponseBody {
      [user: string]: Message[];
    }
    const response = await messagesServer.get<MessagesResponse>('/messages');

    const messagesByUser: ResponseBody = JSON.parse(response.data.body);
    return messagesByUser;
  },
  async getUserMessages(user: string) {
    interface UserMessagesResponse {
      statusCode: number;
      body: string;
    }
    interface ResponseBody {
      user: string;
      message: Message[];
    }
    const response = await messagesServer.get<UserMessagesResponse>(`/messages/${user}`);

    const messages = JSON.parse(response.data.body).message;
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
