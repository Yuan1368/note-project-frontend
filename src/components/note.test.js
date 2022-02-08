import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import Note from "./note";

test("renders content", () => {
  const note = {
    content: "Component testing is done with testing-library/react",
  };

  const component = render(<Note content={note.content} />);

  expect(component.container).toHaveTextContent(
    "Component testing is done with testing-library/react"
  );
});
