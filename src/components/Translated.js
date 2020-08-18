import { PureComponent } from "react";

const STRINGS = {
  "contact": "Contact"
};

class Translated extends PureComponent {
  render() {
    let str = this.props.str;
    return str in STRINGS ? STRINGS[str] : str;
  }
}

export default Translated;