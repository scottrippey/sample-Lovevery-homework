import React from "react";
import { useAsync, useAsyncCallback } from "react-async-hook";

import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import capitalize from "@material-ui/core/utils/capitalize";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { messagesClient } from "~/common/messagesClient";
import { useStatusReporter } from "~/components/StatusReporter";
import { enableMockAdapter } from "~/common/messagesClient.mock";

export const MessagesList = () => {
  const statusReporter = useStatusReporter();
  const messages = useAsync(
    async () => {
      try {
        statusReporter.setStatus(<>Loading messages...</>);
        const messages = await messagesClient.getAllMessages();
        statusReporter.clearStatus();

        return messages;
      } catch (err) {
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

  return (
    <div>
      {!messages.loading && users.length === 0 && <div>No messages to display</div>}
      {users.map((user) => {
        const msgs = messages.result![user];
        return (
          <Paper key={user} elevation={5} className="p-20 mb-20">
            <Typography variant="h4" className="text-blue">
              {" "}
              {capitalize(user)}{" "}
            </Typography>
            {msgs.map((msg, msgIndex) => (
              <div key={msgIndex} className="mt-10">
                <Typography variant="h5"> {msg.subject} </Typography>
                <Typography> {msg.message} </Typography>
              </div>
            ))}
          </Paper>
        );
      })}

      <AddMessage onMessageAdded={messages.execute} />
    </div>
  );
};

const AddMessage = ({ onMessageAdded }) => {
  const [user, setUser] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const subjectRef = React.useRef<HTMLInputElement>(null);

  const statusReporter = useStatusReporter();

  const messageAdd = useAsyncCallback(async () => {
    setSubject("");
    setMessage("");
    subjectRef.current?.focus();

    statusReporter.setStatus(<>Adding message...</>);

    await messagesClient.addMessage({
      subject,
      message,
      user,
    });

    statusReporter.clearStatus();

    onMessageAdded();
  });

  return (
    <Paper elevation={5} className="p-20">
      <form onSubmit={(e) => e.preventDefault()}>
        <TextField label="User" value={user} onChange={(e) => setUser(e.target.value)} fullWidth margin="normal" />
        <TextField
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          inputRef={subjectRef}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          onClick={() => messageAdd.execute()}
          disabled={messageAdd.loading}
          color="primary"
          variant="contained"
        >
          Add {messageAdd.loading && "..."}
        </Button>
      </form>
    </Paper>
  );
};

/**
 * If the server isn't reachable, let's allow a mock adapter to be used.
 * @param err
 * @param onMockEnabled
 * @constructor
 */
const ServerError = ({ err, onMockEnabled }) => {
  const handleEnableMock = (ev) => {
    ev.preventDefault();

    enableMockAdapter();
    onMockEnabled();
  };

  return (
    <>
      <span className="text-red mr-20">Failed to load messages! {`${err}`}</span>
      <a href="#" onClick={handleEnableMock} className="underline">
        Enable a mock server?
      </a>
    </>
  );
};
