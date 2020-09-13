import axios from 'axios';

// Enable the mock server for now:
import './messagesClient.mock';

const messagesAPI = axios.create({
  baseURL: 'https://abraxvasbh.execute-api.us-east-2.amazonaws.com/proto'
});

export interface Message {
  subject: string;
  message: string;
}

export interface ResponseWrapper {
  statusCode: number;
  body: string;
}


export interface MessagesByUserResponse {
  [user: string]: Message[];
}

export interface MessagesForUserResponse {
  user: string;
  message: Message[];
}

export interface AddMessagePayload extends Message {
  user: string;
  operation: 'add_message';
}
interface MessagesAddResponse { /* unknown response */ }


export const messagesClient = {
  async getAllMessages() {
    const response = await messagesAPI.get<ResponseWrapper>('/messages');

    const messagesByUser: MessagesByUserResponse = JSON.parse(response.data.body);
    return messagesByUser;
  },
  async getUserMessages(user: string) {
    const response = await messagesAPI.get<ResponseWrapper>(`/messages/${user}`);

    const messagesResponse: MessagesForUserResponse = JSON.parse(response.data.body);
    return messagesResponse.message;
  },
  async addMessage(newMessage: Omit<AddMessagePayload, 'operation'>) {
    const response = await messagesAPI.post<MessagesAddResponse>('/messages', {
      ...newMessage,
      operation: 'add_message',
    });
  },
};
