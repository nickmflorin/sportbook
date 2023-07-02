enum DataModelType {
  EXAMPLE = "example",
}

const modelTypeResult = <T extends string>(name: T) => ({
  modelType: {
    needs: {},
    compute(): T {
      return name;
    },
  },
});

/**
 * An extension for the {@link PrismaClient} that attributes prisma models with a 'modelType' attribute that can be used
 * as a discriminator in type guards or other type checks.
 */
export const ModelTypeExtension = {
  name: "modelTypeExtension",
  result: {
    example: modelTypeResult(DataModelType.EXAMPLE),
  },
};
