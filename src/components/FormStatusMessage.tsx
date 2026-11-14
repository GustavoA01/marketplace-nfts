import type { FormStatus } from "@/data/types/form-status";

type FormStatusMessageProps = {
  status: FormStatus;
  errorMessage?: string;
  successMessage?: string;
  submittingMessage?: string;
};

export const FormStatusMessage = ({
  status,
  errorMessage = "Não foi possível concluir a operação. Tente novamente.",
  successMessage = "Operação concluída com sucesso.",
  submittingMessage = "Enviando...",
}: FormStatusMessageProps) => {
  if (status === "idle") {
    return null;
  }

  if (status === "submitting") {
    return (
      <p className="font-mono text-sm text-text-secondary" role="status">
        {submittingMessage}
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="font-mono text-sm text-error" role="alert">
        {errorMessage}
      </p>
    );
  }

  return (
    <p className="font-mono text-sm text-success" role="status">
      {successMessage}
    </p>
  );
};
