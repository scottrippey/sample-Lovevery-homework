import React from "react";
import { render } from "@testing-library/react";
import { MessagesList } from "./MessagesList";

import { enableMockAdapter } from "~/common/messagesClient.mock";
import { StatusReporterProvider } from "~/components/StatusReporter";

enableMockAdapter({ delayResponse: 100 });

describe("MessagesList", () => {
  const wrapper = ({ children }) => {
    return <StatusReporterProvider> {children} </StatusReporterProvider>;
  };
  it("should render a message list with mock entries", async () => {
    const el = render(<MessagesList />, { wrapper });

    // Ensure the messages were displayed correctly:
    await expect(el.findByText("Scott")).resolves.toBeDefined();
    await expect(el.findByText("I love mocks")).resolves.toBeDefined();
    await expect(el.findByText("I love socks")).resolves.toBeDefined();

    await expect(el.findByText("Jim")).resolves.toBeDefined();
    await expect(el.findByText("Question: what kind of bear is best?")).resolves.toBeDefined();
    await expect(el.findByText("Fact: bears love beets")).resolves.toBeDefined();
  });

  describe("add", () => {
    it.todo("should render the 'add' form");
    it.todo("should add an entry");
  });
});
