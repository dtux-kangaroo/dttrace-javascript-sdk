export default {
  get:(name) => {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
  },
  set:(name, value, time, cross_subdomain, is_secure) => {
    let cdomain = '',
      expires = '',
      secure = '';
    if (cross_subdomain) {
      const matches = document.location.hostname.match(/[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i),
      domain = matches ? matches[0] : '';
      cdomain = ((domain) ? '; domain=.' + domain : '');
    }
    if (time) {
      const date = new Date();
      date.setTime(date.getTime() + time);
      expires = '; expires=' + date.toGMTString();
    }
    if (is_secure) {
      secure = '; secure';
    }
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/' + cdomain + secure;
  },
  remove:(name, cross_subdomain) => {
    set(name, '', -1, cross_subdomain);
  }
}