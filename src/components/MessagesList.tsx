import React from 'react';
import {useAsync, useAsyncCallback} from 'react-async-hook';
import {Button, Paper, capitalize, Card, CircularProgress, TextField, Typography, Grid} from '@material-ui/core';

import { messagesClient } from "~/common/messagesClient";

export const MessagesList = () => {
  const messages = useAsync(() => messagesClient.getAllMessages(), [], {
    // Retain previous results when refreshing:
    setLoading: state => ({ ...state, loading: true }),
  });

  const users = messages.result ? Object.keys(messages.result) : [ ];

  return (
    <div>
      { messages.loading && <div> <CircularProgress /> Loading messages...</div>}
      { messages.error && <div className="text-red">Failed to load messages! {`${messages.error}`}</div>}
      { !messages.loading && users.length === 0 && <div>No messages to display</div> }
      { users.map((user) => {
        const msgs = messages.result![user];
        return (
          <Paper key={user} elevation={5} className="p-20 mb-20">
            <Typography variant="h4" className="text-blue"> {capitalize(user)} </Typography>
            { msgs.map((msg, msgIndex) =>
              <div key={msgIndex} className="mt-10">
                <Typography variant="h5"> {msg.subject} </Typography>
                <Typography> {msg.message} </Typography>
              </div>
            )}
          </Paper>
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
  const subjectRef = React.useRef<HTMLInputElement>(null);

  const messageAdd = useAsyncCallback(async () => {
    setSubject("");
    setMessage("");
    subjectRef.current?.focus();

    await messagesClient.addMessage({
      subject,
      message,
      user,
    });

    onMessageAdded();
  });

  return (
    <Paper elevation={5} className="p-20">
      <form onSubmit={e => e.preventDefault()}>
        <TextField
          label="User"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          fullWidth margin="normal"
        />
        <TextField
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          inputRef={subjectRef}
          fullWidth margin="normal"
        />
        <TextField
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth margin="normal"
        />
        <Button
          type="submit"
          onClick={() => messageAdd.execute() } disabled={messageAdd.loading}
          color="primary" variant="contained"
        >
          Add { messageAdd.loading && "..." }
        </Button>
      </form>
    </Paper>
  )
};
