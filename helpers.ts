export const removeFrontAndTailTick = (text: string) => {
  return text.substr(1, text.length - 2);
};

export const removeTaillTick = (text: string) => {
  return text.substr(0, text.length - 1);
};

export const getUrl = (httpRaw: string) => {
  let opt:any = {};
  let flag = '';
  let method = '';
  const split = httpRaw.split(' ');
  split.forEach((s, i) => {
    if (s == '--request') {
      flag = 'url';
      method = '';
      return true;
    }
    if (s == '--header') {
      flag = 'header';
      method = '';
      return true;
    }

    if (flag == 'url') {
      if (method == '') {
        method = s;
        opt.method = s;
      } else {
        opt.url = removeFrontAndTailTick(s);
        method = '';
        flag = '';
      }
    }
    if (flag == 'header') {
      if (method == '') {
        if (!opt.headers) {
          opt.headers = {};
        }
        method = removeFrontAndTailTick(s);
      } else {
        opt.headers[method] = removeTaillTick(s);
        method = '';
        flag = '';
      }
    }
  });

  return opt;
};

export const getBody = (bodyRaw: string) => {
  const cleanBody = bodyRaw.replace('--data-raw ', '');
  const body = removeFrontAndTailTick(cleanBody);
  return JSON.parse(body);
};