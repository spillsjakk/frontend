import { Dialog, DialogContent } from "@material-ui/core";
import React, {
  Context,
  FunctionComponent,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";

const PopupContext: Context<{
  isOpen: any;
  changeOpen: (status: boolean) => void;
  changeContent: (content: ReactElement) => void;
}> = React.createContext({
  isOpen: false,
  changeOpen: (status: boolean) => {},
  changeContent: (content: ReactElement) => {},
});

export const PopupProvider = PopupContext.Provider;
export default PopupContext;
export const usePopup = () => useContext(PopupContext);

interface Props {
  content: ReactElement;
}

const WithPopup: FunctionComponent<Props> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [content, setContent] = useState<ReactElement>(<></>);

  useEffect(() => {
    if (props.content) {
      setContent(props.content);
    }
  }, [props.content]);

  return (
    <PopupProvider
      value={{
        isOpen,
        changeOpen: (status: boolean) => {
          setIsOpen(status);
        },
        changeContent: (content: ReactElement) => {
          setContent(content);
        },
      }}
    >
      {props.children}
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <DialogContent>{content}</DialogContent>
      </Dialog>
    </PopupProvider>
  );
};
export { WithPopup };
