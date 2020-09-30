import { messagesClient } from "./messagesClient";
import { enableMockAdapter } from "./messagesClient.mock";

enableMockAdapter({ delayResponse: 0 });

describe("messageClient", () => {
  describe("getAllMessages", () => {
    it("should return all messages", async () => {
      const messages = await messagesClient.getAllMessages();

      expect(messages).toMatchInlineSnapshot(`
        Object {
          "jim": Array [
            Object {
              "message": "Black bear.",
              "subject": "Question: what kind of bear is best?",
            },
            Object {
              "message": "Bears.  Beets.  Battlestar Galactica.",
              "subject": "Fact: bears love beets",
            },
          ],
          "scott": Array [
            Object {
              "message": "I love mocks.  This is a mock message.  Mocks mocks mocks.",
              "subject": "I love mocks",
            },
            Object {
              "message": "I love socks.  I'm wearing socks.  Socks socks socks.",
              "subject": "I love socks",
            },
          ],
        }
      `);
    });
  });
  describe("getUserMessages", function () {
    it("should return the messages associated with the user", async () => {
      await expect(messagesClient.getUserMessages("scott")).resolves.toMatchInlineSnapshot(`
              Array [
                Object {
                  "message": "I love mocks.  This is a mock message.  Mocks mocks mocks.",
                  "subject": "I love mocks",
                },
                Object {
                  "message": "I love socks.  I'm wearing socks.  Socks socks socks.",
                  "subject": "I love socks",
                },
              ]
            `);
      await expect(messagesClient.getUserMessages("jim")).resolves.toMatchInlineSnapshot(`
              Array [
                Object {
                  "message": "Black bear.",
                  "subject": "Question: what kind of bear is best?",
                },
                Object {
                  "message": "Bears.  Beets.  Battlestar Galactica.",
                  "subject": "Fact: bears love beets",
                },
              ]
            `);
      await expect(messagesClient.getUserMessages("INVALID")).rejects.toMatchInlineSnapshot(
        `[Error: Request failed with status code 404]`
      );
    });
  });
  describe("addMessage", function () {
    it("should add a message to an existing user", async () => {
      await messagesClient.addMessage({
        user: "scott",
        message: "new-message",
        subject: "new-subject",
      });

      expect(await messagesClient.getUserMessages("scott")).toMatchObject([
        {},
        {},
        { subject: "new-subject", message: "new-message" },
      ]);
    });
    it("should add a message to a new user", async () => {
      await messagesClient.addMessage({
        user: "new-user",
        message: "new-message",
        subject: "new-subject",
      });

      expect(await messagesClient.getUserMessages("new-user")).toMatchObject([
        { subject: "new-subject", message: "new-message" },
      ]);
    });
  });
});
