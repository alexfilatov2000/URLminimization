export const getPasswordResetURL = (user, token) => {
    return `http://localhost:3000/update-password/${user.id}/${token}`;
};

export const resetPasswordTemplate = (user, url) => {
    const from = process.env.EMAIL_LOGIN;
    const to = user.email;
    const subject = '🥵 URL-Minimization Password Reset 🥵';
    const html = `
  <p>Hey ${user.email},</p>
  <p>We heard that you lost your URL-Minimization password. Sorry about that!</p>
  <p>But don’t worry! You can use the following link to reset your password:</p>
  <a href=${url}>${url}</a>
  <p>If you don’t use this link within 1 hour, it will expire.</p>
  <p>Do something outside today! </p>
  <p>–Your friends at URL-Minimization</p>
  `;
    return { from, to, subject, html };
};
