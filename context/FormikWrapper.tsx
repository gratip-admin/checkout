import { Formik } from "formik";
import { FormikWrapperProps } from "@/types";

export default function FormikWrapper({
  children,
  initialValues,
  validationSchema,
  onSubmit,
  validate,
}: FormikWrapperProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validate={validate}
    >
      {children as any}
    </Formik>
  );
}
