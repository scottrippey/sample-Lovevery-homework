import React from "react";
import { render } from "@testing-library/react";
import { MessagesList } from "./MessagesList";

import { enableMockAdapter } from "~/common/messagesClient.mock";
import { StatusReporterProvider } from "~/components/contexts/StatusReporter";

enableMockAdapter({ delayResponse: 100 });

describe("MessagesList", () => {
  const wrapper = ({ children }: React.PropsWithChildren<{}>) => {
    return <StatusReporterProvider> {children} </StatusReporterProvider>;
  };
  it("should render a message list with mock entries", async () => {
    const el = render(<MessagesList />, { wrapper });

    // Ensure the messages were displayed correctly:
    await el.findByText("Scott");
    await el.findByText("I love mocks");
    await el.findByText("I love socks");

    await el.findByText("Jim");
    await el.findByText("Question: what kind of bear is best?");
    await el.findByText("Fact: bears love beets");
  });

  describe("add", () => {
    it.todo("should render the 'add' form");
    it.todo("should add an entry");
  });
});
