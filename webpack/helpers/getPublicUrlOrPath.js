const stubDomain = 'https://carecru.cool';

const getEnvPublicUrl = (isEnvDevelopment, envPublicUrl) => {
  // ensure last slash exists
  envPublicUrl = envPublicUrl.endsWith('/') ? envPublicUrl : `${envPublicUrl}/`;

  // validate if `envPublicUrl` is a URL or path like
  // `stubDomain` is ignored if `envPublicUrl` contains a domain
  const validPublicUrl = new URL(envPublicUrl, stubDomain);

  if (isEnvDevelopment) {
    return envPublicUrl.startsWith('.') ? '/' : validPublicUrl.pathname;
  }
  return envPublicUrl;
};

const getHomepage = (isEnvDevelopment, homepage) => {
  // strip last slash if exists
  homepage = homepage.endsWith('/') ? homepage : `${homepage}/`;

  // validate if `homepage` is a URL or path like and use just pathname
  const validHomepagePathname = new URL(homepage, stubDomain).pathname;
  if (isEnvDevelopment) {
    return homepage.startsWith('.') ? '/' : validHomepagePathname;
  }
  return homepage.startsWith('.') ? homepage : validHomepagePathname;
};

const getPublicUrlOrPath = (isEnvDevelopment, homepage, envPublicUrl) => {
  if (envPublicUrl) {
    return getEnvPublicUrl(isEnvDevelopment, envPublicUrl);
  }

  if (homepage) {
    return getHomepage(isEnvDevelopment, homepage);
  }

  return '/';
};

module.exports = getPublicUrlOrPath;
