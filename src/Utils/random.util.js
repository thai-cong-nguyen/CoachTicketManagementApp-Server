const alphabet = "abcdefghijklmnopqrstuvwxyz";

const randomString = (leng) => {
  let res = "";
  const alphabetLength = alphabet.length;
  for (let i = 0; i < leng; i++) {
    res += alphabet.charAt(Math.floor(Math.random() * alphabetLength));
  }
  return res;
};

module.exports = { randomString };
