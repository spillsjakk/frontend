import EN from "./en";
import NO from "./no";

export function getDictionary(lang: string) {
  const dictionary: any = {
    EN,
    NO,
  };
  return {
    getString: function (key: string) {
      let result: string;
      try {
        result = dictionary[lang][key];
        if (!(key in dictionary[lang])) {
          result = dictionary.en[key];
        }
      } catch (e) {
        result = dictionary.en[key];
      }
      return result;
    },
  };
}
