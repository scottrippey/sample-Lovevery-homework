import React from 'react';
import { MessagesList } from "~/components/MessagesList";
import {AppBar, Typography} from "@material-ui/core";

export const Home: React.FC = () => {
    return <>
      <Header />
      <Content>
        <MessagesList />
      </Content>
    </>;
};

const Header = () => {
  return (
    <AppBar position="sticky" variant="elevation" className="p-10 px-20">
      <Typography> Rippey's Message App </Typography>
    </AppBar>
  );
};

/**
 * Just a wrapper that includes the content padding
 */
const Content = ({ children }) => {
  return <section className="px-20 lg:px-40 py-20">
    {children}
  </section>
}
