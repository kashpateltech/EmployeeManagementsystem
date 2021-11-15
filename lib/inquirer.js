
class InquirerFunctions {
  constructor(type, name, message, choices) {
    this.type = type;
    this.name = name;
    this.message = message;
    this.choices = choices;
  }

  ask() {
    const askObj = {
      type: this.type,
      name: this.name,
      message: this.message,
    };
    if (this.choice === "undefined") {
      return askObj;
    } else {
      askObj.choices = this.choices;
      return askObj;
    }
  }
}

module.exports = InquirerFunctions;
