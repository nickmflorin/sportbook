/**
 * A generalized form of "@fortawesome/fontawesome-svg-core"'s {@link IconDefinition} that is used to replace a
 * "@fortawesome/fontawesome-svg-core" imported form.
 */
export type NaiveFAIconDefinition = {
  readonly prefix: string;
  readonly iconName: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  readonly icon: [number, number, string[], string, any];
};

/**
 * Asynchronously configures the application with FontAwesome.
 *
 * All icons in the registry (i.e. the icons that we use in the application) are first validated to ensure type-safe
 * usage and are subsequently loaded into the FontAwesome global library.
 *
 * The asynchronous configuration method (`configureAsync`) should be favored over the synchronous configuration method
 * (`configure`) when performing the configuration dynamically in an effort to reduce the bundle size sent to the
 * browser on the initial page load.
 */
export const configureAsync = async (): Promise<void> => {
  const { ICON_REGISTRY } = await import("./registry");
  const { library, config } = await import("@fortawesome/fontawesome-svg-core");
  const { configure } = await import("./configure");
  return configure({ registry: ICON_REGISTRY.slice() as NaiveFAIconDefinition[], library, config });
};
