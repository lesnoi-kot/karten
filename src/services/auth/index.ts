const oauthURL = "https://github.com/login/oauth/authorize";

export const getGitHubOAuthURL = () => {
  const { VITE_GITHUB_CLIENT_ID, VITE_API_URL } = import.meta.env;
  const redirectURI = encodeURI(`${VITE_API_URL}/oauth-callback`);

  return `${oauthURL}?client_id=${VITE_GITHUB_CLIENT_ID}&scope=user:email&redirect_uri=${redirectURI}`;
};
