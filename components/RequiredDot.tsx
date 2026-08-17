/**
 * The required-field marker, shared by every form on the site.
 *
 * Purely decorative and therefore aria-hidden — a screen reader announcing "bullet" after
 * a field name tells nobody anything. The machine-readable half is `aria-required` on the
 * input itself. **Do not add one without the other:** the dot alone leaves a screen-reader
 * user with no way to know a field is required, and aria-required alone leaves a sighted
 * user guessing.
 *
 * Consolidated 2026-08-17. Before that the site ran three conventions at once — an orange
 * asterisk on /contact and /become-a-retailer, nothing at all on /register and
 * /warranty-claim, and this dot on the installation wizard — so the same required field
 * looked required, optional and unmarked depending on which page you were standing on.
 *
 * The paired convention is that optional fields say "(optional)" in words. Both halves
 * matter: a form where nothing is marked required reads as one where everything is.
 *
 * No "use client" — it renders no hooks and no handlers, so it composes into server and
 * client components alike.
 */
export function RequiredDot() {
  return (
    <span
      aria-hidden="true"
      className="ml-1 inline-block size-[5px] rounded-full bg-[var(--finevu-orange)] align-[3px]"
    />
  );
}
