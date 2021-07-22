const checkRegex = (type, string) => {
  return REGEX[type].test(string);
};

const REGEX = {
  ID: /^(?=.*[a-zA-z])(?=.*[0-9]).{3,20}$/,
  TOWN: /^.{2,12}$/
};

export default checkRegex;
