export const urlTransform = (url: string) => {
  if (!/^[^:]+:\/\//.test(url)) {
    if (/^nav\.no/.test(url)) return `https://${url}`;
    return `http://${url}`;
  }
  return url;
};
