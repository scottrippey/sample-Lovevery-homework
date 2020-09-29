import { AddMessagePayload, messagesClient } from "~/common/messagesClient";
import React from "react";
import { useStatusReporter } from "~/components/contexts/StatusReporter";
import { useAsyncCallback } from "react-async-hook";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export interface AddMessageProps {
  onMessageAdding: (newMessage: AddMessagePayload) => void;
  onMessageAdded: () => void;
}

/**
 * Renders a "add message" form
 */
export function AddMessage({ onMessageAdding, onMessageAdded }: AddMessageProps) {
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
