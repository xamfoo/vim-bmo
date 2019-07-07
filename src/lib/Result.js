const ResultType = {
  Arguments: 'Arguments',
  BinaryExpression: 'BinaryExpression',
  Command: 'Command',
  CommandName: 'CommandName',
  Empty: 'Empty',
  Number: 'Number',
  String: 'String',
};

class Result {
  static binaryExpression({ operator, left, right }) {
    if (!['+', '-', '*', '/'].includes(operator)) {
      throw new Error(`binaryExpression() not implemented for operator: ${operator}`);
    }
    return new Result({
      type: ResultType.BinaryExpression,
      value: { operator, left, right }
    });
  }

  static empty() {
    return new Result({ type: ResultType.Empty });
  }

  static command({ name, arguments: a }) {
    return new Result({ type: ResultType.Command, value: { name, arguments: a } });
  }

  static commandName(value) {
    return new Result({ type: ResultType.CommandName, value });
  }

  static arguments(value) {
    return new Result({ type: ResultType.Arguments, value: Array.isArray(value) ? value : [value] });
  }
  
  static number(value) {
    return new Result({ type: ResultType.Number, value });
  }

  static string(value) {
    return new Result({ type: ResultType.String, value });
  }

  constructor({ type, value }) {
    Object.assign(this, { type, value });
  }

  concat(b) {
    const joinTypes = (aType, bType) => [aType, bType].join(',');

    if (this.type === ResultType.Empty) {
      return b;
    }

    if (b.type === ResultType.Empty) {
      return this;
    }

    switch (joinTypes(this.type, b.type)) {
      case joinTypes(ResultType.CommandName, ResultType.Arguments):
        return Result.command({ name: this, arguments: b });
      case joinTypes(ResultType.Arguments, ResultType.Arguments):
        return Result.arguments([ ...this.value, ...b.value]);
      default:
        throw new Error('Not Implemented!');
    }
  }

  toString() {
    switch (this.type) {
      case ResultType.BinaryExpression:
        return [
          this.value.left.toString(),
          this.value.operator.toString(),
          this.value.right.toString(),
        ].join(' ');

      case ResultType.Empty:
        return '';

      case ResultType.Command:
        return [
          this.value.name.toString(),
          ...this.value.arguments.value
            .map(it => it.type === ResultType.BinaryExpression
              ? `(${it.toString()})`
              : it.toString())
            .filter(i => i)
        ].join(' ');

      case ResultType.CommandName:
        return this.value;

      case ResultType.Number:
        return this.value.toString();

      case ResultType.String:
        return `'${this.value.replace(/'/g, '\\\'')}'`;

      default:
        throw new Error(`toString() not implemented for type: ${this.type}`);
    }
  }
}

module.exports = {
  Result
};
