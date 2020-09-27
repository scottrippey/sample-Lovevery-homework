import React from "react";
import { MessagesList } from "~/components/MessagesList";
import { StatusReporterProvider } from "~/components/StatusReporter";
import { Header } from "~/components/Header";

export const Home: React.FC = () => {
  return (
    <StatusReporterProvider>
      <Header />
      <Content>
        <MessagesList />
      </Content>
    </StatusReporterProvider>
  );
};

/**
 * Just a wrapper that includes the content padding
 */
const Content = ({ children }) => {
  return <section className="px-20 lg:px-40 py-20">{children}</section>;
};
