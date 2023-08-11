import React from "react";

import { type z } from "zod";

import { LocationSchema } from "~/prisma/model";
import { TextInputField } from "~/components/fields/TextInputField";

import { Form, type FormProps } from "./Form";

export type LocationFormValues = z.infer<typeof LocationSchema>;

export type CreateLocationFormProps = Omit<FormProps<LocationFormValues>, "children" | "form">;

export const defaultValues = (): LocationFormValues => ({
  name: "",
  description: "",
  primaryStreetAddress: "",
  secondaryStreetAddress: "",
  zipCode: "",
  city: "",
  state: "",
});

export const CreateLocationForm = (props: CreateLocationFormProps): JSX.Element => {
  const form = Form.useForm<LocationFormValues>({
    schema: LocationSchema,
    defaultValues: {
      name: "",
      description: "",
      primaryStreetAddress: "",
      secondaryStreetAddress: "",
      zipCode: "",
      city: "",
      state: "",
    },
  });

  return (
    <Form<LocationFormValues> {...props} form={form}>
      <TextInputField
        form={form}
        name="name"
        label="Name"
        condition={Form.FieldCondition.REQUIRED}
        placeholder="Watkins Rink"
      />
      <TextInputField
        form={form}
        name="description"
        label="Description"
        condition={Form.FieldCondition.OPTIONAL}
        placeholder="Outdoor ball hockey court."
      />
      <TextInputField
        form={form}
        name="primaryStreetAddress"
        label="Primary Address"
        condition={Form.FieldCondition.REQUIRED}
        placeholder="123 Main St"
      />
      <TextInputField
        form={form}
        name="secondaryStreetAddress"
        label="Secondary Address"
        condition={Form.FieldCondition.OPTIONAL}
        placeholder="Apt 208"
      />
      <TextInputField
        form={form}
        name="city"
        label="City"
        condition={Form.FieldCondition.REQUIRED}
        placeholder="Phoenix"
      />
      <TextInputField
        form={form}
        name="state"
        label="State"
        condition={Form.FieldCondition.REQUIRED}
        placeholder="AZ"
      />
      <TextInputField
        form={form}
        name="zipCode"
        label="Zip"
        condition={Form.FieldCondition.REQUIRED}
        placeholder="12345"
      />
    </Form>
  );
};

export default CreateLocationForm;
