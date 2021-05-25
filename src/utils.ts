function classCase(str: string) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      const s = txt.trim();
      return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
    }
  );
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
