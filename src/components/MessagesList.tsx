import React from "react";
import { useAsync, useAsyncCallback } from "react-async-hook";

import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import capitalize from "@material-ui/core/utils/capitalize";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { AddMessagePayload, MessagesByUserResponse, messagesClient } from "~/common/messagesClient";
import { useStatusReporter } from "~/components/StatusReporter";
import { enableMockAdapter } from "~/common/messagesClient.mock";

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
      {!messages.loading && users.length === 0 && <div> No messages to display </div>}
      {users.map((user) => {
        const msgs = messages.result![user];
        // Render the User with all messages:
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

interface AddMessageProps {
  onMessageAdding: (newMessage: AddMessagePayload) => void;
  onMessageAdded: () => void;
}
/**
 * Renders a "add message" form
 */
function AddMessage({ onMessageAdding, onMessageAdded }: AddMessageProps) {
  const [user, setUser] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const subjectRef = React.useRef<HTMLInputElement>(null);

  const statusReporter = useStatusReporter();

  const messageAdd = useAsyncCallback(async () => {
    const newMessage: AddMessagePayload = {
      subject,
      message,
      user,
    };
    onMessageAdding(newMessage);

    // Reset the form, and focus the subject:
    setSubject("");
    setMessage("");
    subjectRef.current?.focus();

    // Add the message:
    statusReporter.setStatus(<>Adding message...</>);
    await messagesClient.addMessage(newMessage);

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
}

/**
 * If the server isn't reachable, show an error, and allow a mock adapter to be used.
 */
function ServerError({ err, onMockEnabled }: { err: Error; onMockEnabled: () => void }) {
  function handleEnableMock(ev: React.MouseEvent) {
    ev.preventDefault();

    enableMockAdapter();
    onMockEnabled();
  }

  return (
    <>
      <span className="text-red mr-20">Failed to load messages! {`${err}`}</span>
      <a href="#" onClick={handleEnableMock} className="underline">
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
