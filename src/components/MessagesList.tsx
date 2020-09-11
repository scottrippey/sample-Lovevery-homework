import React from 'react';
import { useAsync } from 'react-async-hook';

import { messagesClient } from "~/common/messagesClient";

export const MessagesList = () => {
  const messages = useAsync(() => messagesClient.getAllMessages(), []);


  return (
    <div>
      { messages.loading && "Loading messages..."}
      { messages.error && `Failed to load messages!`}
      { messages.result && Object.keys(messages.result).map((user) => {
        const msgs = messages.result![user];
        return (
          <section key={user}>
            <h1> {user} </h1>
            { msgs.map((msg, msgIndex) =>
              <div key={msgIndex}>
                <h2> {msg.subject} </h2>
                <p> {msg.message} </p>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
