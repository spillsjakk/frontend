import React, { FunctionComponent } from "react";
import MarkdownEditor from "@uiw/react-markdown-editor";

interface Props {
  value: string;
  onChange: (value: string) => void;
  height?: number;
}

const Editor: FunctionComponent<Props> = ({
  value,
  onChange,
  height = 300,
}) => {
  return (
    <MarkdownEditor
      value={value}
      onChange={(editor, data, value) => onChange(value)}
      height={height}
    />
  );
};

export { Editor };
