/**
 * next/image requires a root-relative path or an absolute http(s) URL. Anything
 * else makes it call new URL(src), which throws
 * "TypeError: Failed to construct 'URL': Invalid URL" and takes the page down.
 *
 * Image fields here are user-supplied and are not validated on input, so the
 * database really does contain values like "Https" and "Architecto pariatur".
 * A truthiness check is not enough - the value must actually be URL-shaped.
 */
export function isValidImageSrc(src) {
  return typeof src === "string" && /^(https?:\/\/|\/)/i.test(src.trim());
}
