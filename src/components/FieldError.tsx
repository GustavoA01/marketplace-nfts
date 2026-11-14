type FieldErrorProps = {
  id?: string;
  message?: string;
};

export const FieldError = ({ id, message }: FieldErrorProps) => {
  if (!message) return null;
  return (
    <p id={id} className="font-mono text-xs text-error">
      {message}
    </p>
  );
};
