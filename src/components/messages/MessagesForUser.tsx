import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";
import Skeleton from "@material-ui/lab/Skeleton";
import React from "react";
import { Message } from "~/common/messagesClient";
import css from "./messages.scss";

interface MessagesForUserProps {
  user: string;
  messages: Message[];
}

/**
 * Renders the user name, and all messages
 */
export function MessagesForUser({ user, messages }: MessagesForUserProps) {
  return (
    <Paper elevation={5} className={css.messageWrapper}>
      <Typography variant="h4" className={css.messageHeader}>
        {" "}
        {capitalize(user)}{" "}
      </Typography>
      {messages.map((msg, msgIndex) => (
        <Message key={msgIndex} message={msg} />
      ))}
    </Paper>
  );
}

/**
 * Render a skeleton, used while loading messages
 */
export function MessagesForUserSkeleton() {
  return (
    <Paper elevation={5} className={css.messageWrapper}>
      <Typography variant="h4" className={css.messageHeader}>
        {" "}
        <Skeleton />
      </Typography>
      <MessageSkeleton />
    </Paper>
  );
}

interface MessageProps {
  message: Message;
}

/**
 * Renders the message subject and text
 */
function Message({ message }: MessageProps) {
  return (
    <div className={css.messageEntry}>
      <Typography variant="h5"> {message.subject} </Typography>
      <Typography> {message.message} </Typography>
    </div>
  );
}

function MessageSkeleton() {
  return (
    <div className={css.messageEntry}>
      <Typography variant="h5">
        <Skeleton />
      </Typography>
      <Typography>
        <Skeleton />
      </Typography>
    </div>
  );
}
