import React from 'react';
import { render } from '@testing-library/react';
import { MessagesList } from "./MessagesList";

import { enableMockAdapter } from "~/common/messagesClient.mock";

enableMockAdapter({ delayResponse: 0 });

describe("MessagesList", function () {
  it("should render an empty list", async () => {
    const el = render(<MessagesList />);

    await expect(el.findByText("No messages to display")).resolves.toBeDefined();
  });

  describe("add", () => {
    it.todo("should render the 'add' form");
    it.todo("should add an entry");
  });
});
