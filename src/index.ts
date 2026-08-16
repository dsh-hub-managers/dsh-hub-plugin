/** DSH Hub host marker plugin.
 *
 * The native marketplace runs in the browser client. This host half anchors
 * the installable bundle in the Cordis plugin tree so DSH can discover its
 * client contribution.
 */

/** Host dependencies required by the marker plugin. */
export const inject: readonly string[] = []

/** Mount the marker plugin. */
export function apply(): void {}
