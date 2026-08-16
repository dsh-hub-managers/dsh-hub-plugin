//#region src/index.d.ts
/** DSH Hub host marker plugin.
 *
 * The native marketplace runs in the browser client. This host half anchors
 * the installable bundle in the Cordis plugin tree so DSH can discover its
 * client contribution.
 */
/** Host dependencies required by the marker plugin. */
declare const inject: readonly string[];
/** Mount the marker plugin. */
declare function apply(): void;
//#endregion
export { apply, inject };