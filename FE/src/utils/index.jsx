import { jwtDecode } from "jwt-decode";
import { province } from "../services/province";

export const handleMultipleContent = (answers) => {
  return answers.some(
    (answer) => !answer.content || answer.content.trim() === ""
  );
};

export const handleMultipleCorrect = (answers) => {
  const correctAnswers = answers.filter((answer) => answer.isCorrect);

  return correctAnswers.length <= 1;
};

export const hasEmptyContent = (answers) => {
  return answers.some(
    (answer) => !answer.content || answer.content.trim() === ""
  );
};

export const hasCorrectAnswer = (answers) => {
  return answers.some((answer) => answer.isCorrect);
};

export const formatDate = (value) => {
  if (!value) return "";

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  const date = new Date(value);
  const formattedDate = date.toLocaleString("vi-VN", options);

  return formattedDate.replace("lúc ", "");
};

export const SUCCESS = (toast, msg = "") => {
  toast.current.show({
    severity: "success",
    summary: "Success",
    detail: msg || "You have succeeded",
    life: 3000,
  });
};

export const ACCEPT = (toast, msg = "") => {
  toast.current.show({
    severity: "info",
    summary: "Confirmed",
    detail: msg || "You have accepted",
    life: 3000,
  });
};

export const REJECT = (toast, msg = "") => {
  toast.current.show({
    severity: "warn",
    summary: "Rejected",
    detail: msg || "You have rejected",
    life: 3000,
  });
};

export const CHECKMAIL = (toast, msg = "") => {
  toast.current.show({
    severity: "success",
    summary: "Success",
    detail: msg || "You should check mail to verify account",
    life: 4000,
  });
};

export function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, " ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  return str;
}

export const decodeToken = (token) => {
  if (!token) {
    throw new Error("Invalid token");
  }

  try {
    return jwtDecode(token);
  } catch (error) {
    throw new Error("Error decoding token");
  } finally {
    // Ensure token is deleted or cleared regardless of the try/catch outcome
    token = null; // Clearing the token variable
  }
};

export const getTokenFromLocalStorage = () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (token === null) {
      throw new Error("Token not found in localStorage");
    }
    return token;
  } catch (error) {
    return null;
  }
};

export const isLoggedIn = () => {
  const storedToken = localStorage.getItem("accessToken");

  if (!storedToken) {
    return false;
  }

  try {
    const decodedToken = decodeToken(storedToken);

    // Check if the token has expired
    const currentTimestamp = Date.now() / 1000; // Convert milliseconds to seconds
    if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
      return false; // Token has expired
    }

    return true; // Token is valid and not expired
  } catch (error) {
    return false; // Token decoding failed
  }
};

const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const logout = () => {
  clearTokens();
};

export const decodeIfNeeded = (content) => {
  try {
    if (/^[A-Za-z0-9+/=]+\s*$/.test(content)) {
      // Decode Base64 to binary string
      const decodedString = atob(content);

      const utf8String = decodeURIComponent(
        Array.from(decodedString)
          .map(
            (char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2)
          )
          .join("")
      );

      // Remove <meta>, <title>, and <style> tags from the decoded content
      const cleanedContent = utf8String
        .replace(/<meta[^>]*>/g, "")
        .replace(/<title[^>]*>(.*?)<\/title>/g, "")
        .replace(/<style[^>]*>(.*?)<\/style>/g, "");

      return cleanedContent;
    }
  } catch (error) {
    console.error("Error decoding Base64 content:", error);
  }

  return content;
};

export const isBase64 = (content) => {
  if (/^[A-Za-z0-9+/=]+\s*$/.test(content)) {
    return true;
  }
  return false;
};

export const getProvinceByName = (name) => {
  const foundProvince = province.data.find(
    (province) => province.name === name
  );
  return foundProvince;
};
export const TYPE = [
  { name: "Tự Luận", code: 1 },
  { name: "Trắc Nghiệm", code: 2 },
];

export const getTypeByCode = (code) => {
  return TYPE.find((type) => type.code === code);
};

export const containsRudeWords = (content) => {
  const rudeWords = [
    "buồi",
    "buoi",
    "dau buoi",
    "daubuoi",
    "caidaubuoi",
    "nhucaidaubuoi",
    "dau boi",
    "bòi",
    "dauboi",
    "caidauboi",
    "đầu bòy",
    "đầu bùi",
    "dau boy",
    "dauboy",
    "caidauboy",
    "b`",
    "cặc",
    "cak",
    "kak",
    "kac",
    "cac",
    "concak",
    "nungcak",
    "bucak",
    "caiconcac",
    "caiconcak",
    "cu",
    "cặk",
    "cak",
    "dái",
    "giái",
    "zái",
    "kiu",
    "cứt",
    "cuccut",
    "cutcut",
    "cứk",
    "cuk",
    "cười ỉa",
    "cười ẻ",
    "đéo",
    "đếch",
    "đếk",
    "dek",
    "đết",
    "đệt",
    "đách",
    "dech",
    "đ",
    "deo",
    "d",
    "đel",
    "đél",
    "del",
    "dell ngửi",
    "dell ngui",
    "dell chịu",
    "dell chiu",
    "dell hiểu",
    "dell hieu",
    "dellhieukieugi",
    "dell nói",
    "dell noi",
    "dellnoinhieu",
    "dell biết",
    "dell biet",
    "dell nghe",
    "dell ăn",
    "dell an",
    "dell được",
    "dell duoc",
    "dell làm",
    "dell lam",
    "dell đi",
    "dell di",
    "dell chạy",
    "dell chay",
    "deohieukieugi",
    "địt",
    "đm",
    "dm",
    "đmm",
    "dmm",
    "đmmm",
    "dmmm",
    "đmmmm",
    "dmmmm",
    "đmmmmm",
    "dmmmmm",
    "đcm",
    "dcm",
    "đcmm",
    "dcmm",
    "đcmmm",
    "dcmmm",
    "đcmmmm",
    "dcmmmm",
    "đệch",
    "đệt",
    "dit",
    "dis",
    "diz",
    "đjt",
    "djt",
    "địt mẹ",
    "địt mịe",
    "địt má",
    "địt mía",
    "địt ba",
    "địt bà",
    "địt cha",
    "địt con",
    "địt bố",
    "địt cụ",
    "dis me",
    "disme",
    "dismje",
    "dismia",
    "dis mia",
    "dis mie",
    "đis mịa",
    "đis mịe",
    "ditmemayconcho",
    "ditmemay",
    "ditmethangoccho",
    "ditmeconcho",
    "dmconcho",
    "dmcs",
    "ditmecondi",
    "ditmecondicho",
    "đụ",
    "đụ mẹ",
    "đụ mịa",
    "đụ mịe",
    "đụ má",
    "đụ cha",
    "đụ bà",
    "đú cha",
    "đú con mẹ",
    "đú má",
    "đú mẹ",
    "đù cha",
    "đù má",
    "đù mẹ",
    "đù mịe",
    "đù mịa",
    "đủ cha",
    "đủ má",
    "đủ mẹ",
    "đủ mé",
    "đủ mía",
    "đủ mịa",
    "đủ mịe",
    "đủ mie",
    "đủ mia",
    "đìu",
    "đờ mờ",
    "đê mờ",
    "đờ ma ma",
    "đờ mama",
    "đê mama",
    "đề mama",
    "đê ma ma",
    "đề ma ma",
    "dou",
    "doma",
    "duoma",
    "dou má",
    "duo má",
    "dou ma",
    "đou má",
    "đìu má",
    "á đù",
    "á đìu",
    "đậu mẹ",
    "đậu má",
    "đĩ",
    "di~",
    "đuỹ",
    "điếm",
    "cđĩ",
    "cdi~",
    "đilol",
    "điloz",
    "đilon",
    "diloz",
    "dilol",
    "dilon",
    "condi",
    "condi~",
    "dime",
    "di me",
    "dimemay",
    "condime",
    "condimay",
    "condimemay",
    "con di cho",
    "con di cho",
    "condicho",
    "bitch",
    "biz",
    "bít chi",
    "con bích",
    "con bic",
    "con bíc",
    "con bít",
    "phò",
    "4`",
    "lồn",
    "l`",
    "loz",
    "lìn",
    "nulo",
    "ml",
    "matlon",
    "cailon",
    "matlol",
    "matloz",
    "thml",
    "thangmatlon",
    "thangml",
    "đỗn lì",
    "tml",
    "thml",
    "diml",
    "dml",
    "hãm",
    "xàm lol",
    "xam lol",
    "xạo lol",
    "xao lol",
    "con lol",
    "ăn lol",
    "an lol",
    "mát lol",
    "mat lol",
    "cái lol",
    "cai lol",
    "lòi lol",
    "loi lol",
    "ham lol",
    "củ lol",
    "cu lol",
    "ngu lol",
    "tuổi lol",
    "tuoi lol",
    "mõm lol",
    "mồm lol",
    "mom lol",
    "như lol",
    "nhu lol",
    "nứng lol",
    "nung lol",
    "nug lol",
    "nuglol",
    "rảnh lol",
    "ranh lol",
    "đách lol",
    "dach lol",
    "mu lol",
    "banh lol",
    "tét lol",
    "tet lol",
    "vạch lol",
    "vach lol",
    "cào lol",
    "cao lol",
    "tung lol",
    "mặt lol",
    "mát lol",
    "mat lol",
    "xàm lon",
    "xam lon",
    "xạo lon",
    "xao lon",
    "con lon",
    "ăn lon",
    "an lon",
    "mát lon",
    "mat lon",
    "cái lon",
    "cai lon",
    "lòi lon",
    "loi lon",
    "ham lon",
    "củ lon",
    "cu lon",
    "ngu lon",
    "tuổi lon",
    "tuoi lon",
    "mõm lon",
    "mồm lon",
    "mom lon",
    "như lon",
    "nhu lon",
    "nứng lon",
    "nung lon",
    "nug lon",
    "nuglon",
    "rảnh lon",
    "ranh lon",
    "đách lon",
    "dach lon",
    "mu lon",
    "banh lon",
    "tét lon",
    "tet lon",
    "vạch lon",
    "vach lon",
    "cào lon",
    "cao lon",
    "tung lon",
    "mặt lon",
    "mát lon",
    "mat lon",
    "cái lờ",
    "cl",
    "clgt",
    "cờ lờ gờ tờ",
    "cái lề gì thốn",
    "đốn cửa lòng",
    "sml",
    "sapmatlol",
    "sapmatlon",
    "sapmatloz",
    "sấp mặt",
    "sap mat",
    "vlon",
    "vloz",
    "vlol",
    "vailon",
    "vai lon",
    "vai lol",
    "vailol",
    "nốn lừng",
    "vcl",
    "vl",
    "vleu",
    "chịch",
    "chich",
    "vãi",
    "v~",
    "đụ",
    "nứng",
    "nug",
    "đút đít",
    "chổng mông",
    "banh háng",
    "xéo háng",
    "xhct",
    "xephinh",
    "la liếm",
    "đổ vỏ",
    "xoạc",
    "xoac",
    "chich choac",
    "húp sò",
    "fuck",
    "fck",
    "đụ",
    "bỏ bú",
    "buscu",
    "ngu",
    "óc chó",
    "occho",
    "lao cho",
    "láo chó",
    "bố láo",
    "chó má",
    "cờ hó",
    "sảng",
    "thằng chó",
    "thang cho",
    "thang cho",
    "chó điên",
    "thằng điên",
    "thang dien",
    "đồ điên",
    "sủa bậy",
    "sủa tiếp",
    "sủa đi",
    "sủa càn",
    "mẹ bà",
    "mẹ cha mày",
    "me cha may",
    "mẹ cha anh",
    "mẹ cha nhà anh",
    "mẹ cha nhà mày",
    "me cha nha may",
    "mả cha mày",
    "mả cha nhà mày",
    "ma cha may",
    "ma cha nha may",
    "mả mẹ",
    "mả cha",
    "kệ mẹ",
    "kệ mịe",
    "kệ mịa",
    "kệ mje",
    "kệ mja",
    "ke me",
    "ke mie",
    "ke mia",
    "ke mja",
    "ke mje",
    "bỏ mẹ",
    "bỏ mịa",
    "bỏ mịe",
    "bỏ mja",
    "bỏ mje",
    "bo me",
    "bo mia",
    "bo mie",
    "bo mje",
    "bo mja",
    "chetme",
    "chet me",
    "chết mẹ",
    "chết mịa",
    "chết mja",
    "chết mịe",
    "chết mie",
    "chet mia",
    "chet mie",
    "chet mja",
    "chet mje",
    "thấy mẹ",
    "thấy mịe",
    "thấy mịa",
    "thay me",
    "thay mie",
    "thay mia",
    "tổ cha",
    "bà cha mày",
    "cmn",
    "cmnl",
    "tiên sư nhà mày",
    "tiên sư bố",
    "tổ sư",
  ]; // Add more words as needed
  const sentenceWords = content.split(" ");
  console.log(content);
  for (let word of sentenceWords) {
    if (rudeWords.includes(word)) {
      console.log(word);
      return true;
    }
  }
  return false;
};
