import React, { PureComponent } from "react";
import { en } from "./en";
import { no } from "./no";

import LangContext from "../LangContext";

type TranslatedProps = {
  str: string;
};

class Translated extends PureComponent<TranslatedProps, {}> {
  static contextType = LangContext;
  context!: React.ContextType<typeof LangContext>;

  private static getStr(key: string, lang: string) {
    if (key in (STRINGS as any)[lang]) {
      return (STRINGS as any)[lang][key];
    } else if (key in STRINGS.EN) {
      return (STRINGS as any).EN[key];
    } else {
      return key;
    }
  }

  static byKey(key: string) {
    const lang = localStorage.getItem("lang") ?? "EN";
    return Translated.getStr(key, lang);
  }

  render() {
    const str = this.props.str;
    const lang = this.context.lang;
    return Translated.getStr(str, lang);
  }
}

const STRINGS = {
  EN: en,
  NO: no,
};

export default Translated;
