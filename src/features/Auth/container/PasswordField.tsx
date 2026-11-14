import { useState, type ComponentProps } from "react";
import { PasswordField as PasswordFieldView } from "../components/PasswordField";

type PasswordFieldProps = Omit<
  ComponentProps<typeof PasswordFieldView>,
  "visible" | "onToggleVisibility"
>;

export const PasswordField = (props: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <PasswordFieldView
      {...props}
      visible={visible}
      onToggleVisibility={() => setVisible((current) => !current)}
    />
  );
};
