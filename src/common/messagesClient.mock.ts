import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  AddMessagePayload,
  Message,
  MessagesByUserResponse,
  MessagesForUserResponse,
  resetClient,
  ResponseWrapper,
} from "~/common/messagesClient";

/**
 * Enables a mock server for all API calls through axios.
 * @param delayResponse - Simulates a delayed response
 */
export function enableMockAdapter({ delayResponse = 1000 } = {}) {
  // This sets the mock adapter on the default instance
  var mock = new MockAdapter(axios, { delayResponse });

  resetClient();

  const mockMessagesByUser: MessagesByUserResponse = {
    scott: [
      { subject: "I love mocks", message: "I love mocks.  This is a mock message.  Mocks mocks mocks." },
      { subject: "I love socks", message: "I love socks.  I'm wearing socks.  Socks socks socks." },
    ],
    jim: [
      { subject: "Question: what kind of bear is best?", message: "Black bear." },
      { subject: "Fact: bears love beets", message: "Bears.  Beets.  Battlestar Galactica." },
    ],
  };

  mock.onGet("/messages").reply((req) => {
    const body = mockMessagesByUser;

    // Encode the response in the expected API format:
    const response: ResponseWrapper = {
      statusCode: 200,
      body: JSON.stringify(body),
    };
    return [response.statusCode, response];
  });

  const messagesUserPattern = /\/messages\/(.*)/;
  mock.onGet(messagesUserPattern).reply((config) => {
    const user = config.url!.match(messagesUserPattern)![1].toLowerCase();
    const userMessages = mockMessagesByUser[user];
    if (!user || !userMessages) return [404, "User not found"];

    const body: MessagesForUserResponse = {
      user,
      message: userMessages,
    };

    // Encode the response in the expected API format:
    const response: ResponseWrapper = {
      statusCode: 200,
      body: JSON.stringify(body),
    };

    return [response.statusCode, response];
  });

  mock.onPost("/messages").reply((config) => {
    const payload: AddMessagePayload & { operation: "add_message" } = JSON.parse(config.data);
    let { operation, user, ...message } = payload;
    user = user.toLowerCase();

    const messages: Message[] = mockMessagesByUser[user] || (mockMessagesByUser[user] = []);
    messages.push(message);

    return [201, "Message created successfully"];
  });
}
