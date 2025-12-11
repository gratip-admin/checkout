import Cookie from "js-cookie";

const cookie = () => {
  // const dev = process.env.NODE_ENV === "development";

  /**
   * use to set cookie
   * @param {*} key
   * @param {*} value
   */
  const setCookie = (key, value) => {
    return Cookie.set(key, value, {
      path: "/",
      expires: 2,
      domain: process.env.REACT_APP_PARENT_DOMAIN,
    });
  };

  /**
   * use to get cookie
   * @param {*} key
   */
  const getCookie = (key) => {
    return Cookie.get(key);
  };

  /**
   * use to delete cookie
   * @param {*} key
   */
  const deleteCookie = (key) => {
    return Cookie.remove(key, {
      path: "/",
      domain: process.env.REACT_APP_PARENT_DOMAIN,
    });
  };

  return { setCookie, getCookie, deleteCookie };
};


/**
 * use to set cookie
 * @param {*} key
 * @param {*} value
 */
 const setCookie = (key, value) => {
  return Cookie.set(key, value, {
    path: "/",
    expires: 2,
    domain: process.env.REACT_APP_PARENT_DOMAIN || undefined,
  });
};

/**
 * use to get cookie
 * @param {*} key
 */
const getCookie = (key) => {
  return Cookie.get(key);
};

/**
 * use to delete cookie
 * @param {*} key
 */
const deleteCookie = (key) => {
  return Cookie.remove(key, {
    path: "/",
    domain: process.env.REACT_APP_PARENT_DOMAIN,
  });
};

export  {
  setCookie,
  getCookie,
  deleteCookie,
};


export default cookie;


