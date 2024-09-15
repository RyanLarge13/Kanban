let charNumbSymbs =
 "LzZNOGQkI~}AxWe>loK?6UucB0m}jh$]bs&Mi]Hn@Xk8DvP{wEr2%|Fg#^VdyJ,a`pf7[T+=RS(3t*C!91:>q_<4YQL.5";
let idStr = "";
let randomIds = [];

const genRandomInt = (magicInt = charNumbSymbs.length) =>
 Math.floor(Math.random() * magicInt);
 
export const getRandomId = () => {
 while (idStr.length < 17) {
  let randomInt = genRandomInt();
  let randomChar = charNumbSymbs.charAt(randomInt);
  idStr += randomChar;
 }
 const strCopy = idStr;
 idStr = "";
 return strCopy;
};
