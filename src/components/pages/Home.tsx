import React from "react";
import { MessagesList } from "~/components/messages/MessagesList";
import { StatusReporterProvider } from "~/components/contexts/StatusReporter";
import { Header } from "~/components/common/Header";

import css from "./home.scss";

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
  return <section className={css.mainWrapper}>{children}</section>;
}
