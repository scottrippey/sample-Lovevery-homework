import React from 'react';
import { render, screen } from '@testing-library/react';
import { MessagesList } from "./MessagesList";

describe("MessagesList", function () {
  it("should render", async () => {
    render(<MessagesList />);

    expect(screen.getByText("Loading messages...")).toBeDefined();
  });
});
