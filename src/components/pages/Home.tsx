import React from "react";
import { MessagesList } from "~/components/MessagesList";
import { StatusReporterProvider } from "~/components/StatusReporter";
import { Header } from "~/components/Header";

/**
 * The Home page, including header and messages list
 */
export function Home() {
  return (
    <StatusReporterProvider>
      <Header />
      <Content>
        <MessagesList />
      </Content>
    </StatusReporterProvider>
  );
}

/**
 * Just a wrapper that includes the content padding
 */
function Content({ children }: React.PropsWithChildren<{}>) {
  return <section className="px-20 lg:px-40 py-20">{children}</section>;
}
