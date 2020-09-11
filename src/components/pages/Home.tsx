import React from 'react';
import { MessagesList } from "~/components/MessagesList";

export const Home: React.FC = () => {
    return <>
      <Content>
        <MessagesList />
      </Content>
    </>;
};

/**
 * Just a wrapper that includes the content padding
 */
const Content: React.FC = ({ children }) => {
  return <section className="px-20 lg:px-40 py-20">
    {children}
  </section>
}
