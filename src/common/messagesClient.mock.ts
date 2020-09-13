import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {AddMessagePayload, Message, MessagesForUserResponse} from "~/common/messagesClient";


const ENABLE_MOCK_ADAPTER = true;

if (ENABLE_MOCK_ADAPTER) {
  enableMockAdapter();
}

function enableMockAdapter() {
  // This sets the mock adapter on the default instance
  var mock = new MockAdapter(axios, { delayResponse: 1000 });

  const mockMessagesByUser: { [user: string]: Message[] } = {
    "scott": [
      { subject: "I love mocks", message: "I love mocks.  This is a mock message.  Mocks mocks mocks." },
      { subject: "I love socks", message: "I love socks.  I'm wearing socks.  Socks socks socks." },
    ],
    "jim": [
      { subject: "Question: what kind of bear is best?", message: "Black bear." },
      { subject: "Fact: bears love beets", message: "Bears.  Beets.  Battlestar Galactica." },
    ],
  };

  mock.onGet("/messages").reply((req) => {
    const messages = mockMessagesByUser;

    // Encode the response in the expected API format:
    const response = {
      statusCode: 200,
      body: JSON.stringify(messages)
    };
    return [ response.statusCode, response ];
  });

  const messagesUserPattern = /\/messages\/(.*)/;
  mock.onGet(messagesUserPattern).reply((config) => {
    const user = config.url!.match(messagesUserPattern)![1];
    if (!user) return [ 404, "User not found" ];
    const userMessages = mockMessagesByUser[user];


    // Encode the response in the expected API format:
    const response = {
      statusCode: 200,
      body: JSON.stringify(userMessages),
    };
    return [ response.statusCode, response ];
  });

  mock.onPost("/messages").reply((config) => {
    const payload: AddMessagePayload = JSON.parse(config.data);
    const { operation, user, ...message } = payload;

    const messages = mockMessagesByUser[user] || (mockMessagesByUser[user] = []);
    messages.push(message);

    return [ 201, "Message created successfully" ];
  });
}
