import axios from "axios";

/**
 * An Axios instance, tied to the base URL
 */
let messagesAPI = createClient();
function createClient() {
  return axios.create({
    baseURL: "https://abraxvasbh.execute-api.us-east-2.amazonaws.com/proto",
  });
}
/**
 * Resets the client; this is only necessary when the mock adapter is enabled
 */
export function resetClient() {
  messagesAPI = createClient();
}

// Some interfaces, which represent the REST API's responses
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
}
export interface MessagesAddResponse {
  /* unknown response */
}

/**
 * A wrapper around the Messages REST API
 */
export const messagesClient = {
  /**
   * Retrieves all messages, grouped by user
   */
  async getAllMessages() {
    const response = await messagesAPI.get<ResponseWrapper>("/messages");

    const messagesByUser: MessagesByUserResponse = JSON.parse(response.data.body);
    return messagesByUser;
  },

  /**
   * Retrieves all messages for the given user
   * @param user: The name of the user to retrieve
   */
  async getUserMessages(user: string) {
    const response = await messagesAPI.get<ResponseWrapper>(`/messages/${user}`);

    const messagesResponse: MessagesForUserResponse = JSON.parse(response.data.body);
    return messagesResponse.message;
  },

  /**
   * Adds a new message for the given user
   * @param newMessage - The new message to add
   */
  async addMessage(newMessage: AddMessagePayload) {
    const response = await messagesAPI.post<MessagesAddResponse>("/messages", {
      ...newMessage,
      operation: "add_message",
    });
  },
};
