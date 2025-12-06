export function getAvatar(userPicture: string | null | undefined, email: string) {
  return userPicture ?? `https://avatar.vercel.sh/${email}`;
}
