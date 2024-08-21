import React from "react";
import clsx from "clsx";

interface InputErrorProps {
  message?: string;
  classname?: string;
}

const InputError: React.FC<InputErrorProps> = ({ message, classname }) => {
  if (!message) return null;

  return (
    <p className={clsx("text-xs 2xl:text-sm text-red-600", classname)}>
      {message}
    </p>
  );
};

export default InputError;
