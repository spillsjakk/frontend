import React, { PureComponent } from "react";
import { en } from "./en";
import { no } from "./no";

import LangContext from "../LangContext";
import { readCookie } from "@mehmetsefabalik/cookie-helper/dist";

type TranslatedProps = {
  str: string;
};

class Translated extends PureComponent<TranslatedProps, {}> {
  static contextType = LangContext;
  context!: React.ContextType<typeof LangContext>;

  private static getStr(key: string, lang: string) {
    if (key in (STRINGS as any)[lang]) {
      return (STRINGS as any)[lang][key];
    } else if (key in STRINGS.en) {
      return (STRINGS as any).en[key];
    } else {
      return key;
    }
  }

  static byKey(key: string) {
    const lang = readCookie("lang") ?? "en";
    return Translated.getStr(key, lang);
  }

  render() {
    const str = this.props.str;
    const lang = this.context.lang;
    return Translated.getStr(str, lang);
  }
}

const STRINGS = {
  en,
  no,
};

export default Translated;
