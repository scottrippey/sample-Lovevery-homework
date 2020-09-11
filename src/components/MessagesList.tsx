import React from 'react';
import {useAsync, useAsyncCallback} from 'react-async-hook';

import { messagesClient } from "~/common/messagesClient";

export const MessagesList = () => {
  const messages = useAsync(() => messagesClient.getAllMessages(), []);

  const users = messages.result ? Object.keys(messages.result) : [ ];

  return (
    <div>
      { messages.loading && "Loading messages..."}
      { messages.error && `Failed to load messages!`}
      { !messages.loading && users.length === 0 && "No messages to display" }
      { users.map((user) => {
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

      <AddMessage
        onMessageAdded={messages.execute}
      />
    </div>
  );
}

const AddMessage = ({ onMessageAdded }) => {
  const [ user, setUser ] = React.useState("");
  const [ subject, setSubject ] = React.useState("");
  const [ message, setMessage ] = React.useState("");

  const messageAdd = useAsyncCallback(async () => {
    await messagesClient.addMessage({
      subject,
      message,
      user,
    });
    onMessageAdded();
  });

  return (
    <div>
      <label> Subject: <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} /> </label>
      <label> Message: <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} /> </label>
      <label> User: <input type="text" value={user} onChange={(e) => setUser(e.target.value)} /> </label>
      <button onClick={() => messageAdd.execute() } disabled={messageAdd.loading}>
        Add { messageAdd.loading && "..." }
      </button>
    </div>
  )
};
