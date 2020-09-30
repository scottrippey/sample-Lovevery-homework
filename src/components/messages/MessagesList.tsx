import React from "react";
import { useAsync } from "react-async-hook";

import { AddMessagePayload, MessagesByUserResponse, messagesClient } from "~/common/messagesClient";
import { useStatusReporter } from "~/components/contexts/StatusReporter";
import { enableMockAdapter } from "~/common/messagesClient.mock";
import { MessagesForUser, MessagesForUserSkeleton } from "~/components/messages/MessagesForUser";
import { AddMessage } from "~/components/messages/AddMessage";
import css from "./messages.scss";

/**
 * Displays a list of messages, along with a Add Messages section
 */
export function MessagesList() {
  const statusReporter = useStatusReporter();
  // Retrieve all messages:
  const messages = useAsync(
    async () => {
      try {
        statusReporter.setStatus(<>Loading messages...</>);
        const messages = await messagesClient.getAllMessages();
        statusReporter.clearStatus();

        return messages;
      } catch (err) {
        // Show the error; if the mock is enabled, refresh:
        statusReporter.setStatus(<ServerError err={err} onMockEnabled={() => messages.execute()} />);
        throw err;
      }
    },
    [],
    {
      // Retain previous results when refreshing:
      setLoading: (state) => ({ ...state, loading: true }),
    }
  );

  const users = messages.result ? Object.keys(messages.result) : [];

  const usersList = (
    <>
      {!messages.loading && users.length === 0 && (
        <div className={css.messagesEmpty}> There are no messages to display. </div>
      )}
      {messages.loading && users.length === 0 && <MessagesForUserSkeleton />}
      {users.map((user) => {
        const msgs = messages.result![user];
        return <MessagesForUser key={user} user={user} messages={msgs} />;
      })}
    </>
  );

  function handleMessageAdding(newMessage: AddMessagePayload) {
    // Proactively add the user to the UI:
    if (messages.result) {
      injectMessageIntoExistingMessages(messages.result, newMessage);
      // Note, this will get overridden anyway after we refresh the list
    }
  }
  function handleMessageAdded() {
    messages.execute();
  }

  return (
    <div>
      {usersList}
      <AddMessage onMessageAdding={handleMessageAdding} onMessageAdded={handleMessageAdded} />
    </div>
  );
}

/**
 * If the server isn't reachable, show an error, and allow a mock adapter to be used.
 */
function ServerError({ err, onMockEnabled }: { err: Error; onMockEnabled: () => void }) {
  function handleEnableMock() {
    enableMockAdapter();
    onMockEnabled();
  }

  return (
    <>
      <span className={css.serverError}>Failed to load messages! {`${err}`}</span>
      <a onClick={handleEnableMock} className={css.mockServerLink}>
        Enable a mock server?
      </a>
    </>
  );
}

/**
 * Utility to inject the new message into the existing messages structure:
 */
function injectMessageIntoExistingMessages(result: MessagesByUserResponse, newMessage: AddMessagePayload) {
  const { user, ...message } = newMessage;

  // Inject the new message into the existing messages:
  const userKey = user.toLowerCase();
  if (!(userKey in result)) {
    result[userKey] = [];
  }
  result[userKey].push(message);
}
