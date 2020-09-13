import React from 'react';
import {useAsync, useAsyncCallback} from 'react-async-hook';
import {Button, Paper, capitalize, Card, CircularProgress, TextField} from '@material-ui/core';

import { messagesClient } from "~/common/messagesClient";

export const MessagesList = () => {
  const messages = useAsync(() => messagesClient.getAllMessages(), []);

  const users = messages.result ? Object.keys(messages.result) : [ ];

  return (
    <div>
      { messages.loading && <div> <CircularProgress /> Loading messages...</div>}
      { messages.error && <div className="text-red">Failed to load messages! {`${messages.error}`}</div>}
      { !messages.loading && users.length === 0 && <div>No messages to display</div> }
      { users.map((user) => {
        const msgs = messages.result![user];
        return (
          <Card key={user} elevation={5} className="mb-10 p-10">
            <h1 className="text-30 text-blue mb-20"> {capitalize(user)} </h1>
            { msgs.map((msg, msgIndex) =>
              <div key={msgIndex}>
                <h2 className="text-20 text-bold"> {msg.subject} </h2>
                <p className="mb-20"> {msg.message} </p>
              </div>
            )}
          </Card>
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
    <Card elevation={5} className="p-10">
      <form>
        <TextField label="User" value={user} onChange={(e) => setUser(e.target.value)} />
        <TextField label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <TextField label="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button onClick={() => messageAdd.execute() } disabled={messageAdd.loading} color="primary" variant="contained">
          Add { messageAdd.loading && "..." }
        </Button>
      </form>
    </Card>
  )
};
