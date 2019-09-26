export default class {
  constructor(fields) {
    this.inputFields = fields;
  }

  validate(inputData) {
    for (var field of this.inputFields) {
      let value = inputData[field.name];
      let isNull = field.isNull;
      if (isNull) {
        continue;
      }
      if (value === undefined || /^\s*$/.test(value)) {
        return field.desc + "不能为空！";
      } else if (field.pattern) {
        if (!field.pattern.test(value)) {
          return field.desc + "格式不正确！";
        }
      }
    }
    return true;
  };

  validateUnit(fieldName, inputObj) {
    let field;
    for (let i of this.inputFields) {
      if (fieldName == i.name) {
        field = i;
      }
    }
    let value = inputObj[field.name];
    let isNull = field.isNull;
    if (isNull) {
      return true;
    }
    if (value === undefined || /^\s*$/.test(value)) {
      return field.desc + "不能为空！";
    } else if (field.pattern) {
      if (!field.pattern.test(value)) {
        return field.desc + "格式不正确！";
      }
    }
    return true;
  };
}