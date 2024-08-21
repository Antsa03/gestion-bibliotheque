"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface UpdatePasswordProps {
  handleSubmit: (values: PasswordType) => void;
  setShowResetPassword: Dispatch<SetStateAction<boolean>>;
  reset: () => void;
}

type PasswordType = {
  password: string;
  confirm_password: string;
};

export default function ResetPasswordFinal({
  handleSubmit,
  setShowResetPassword,
  reset,
}: UpdatePasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit: handleFormSubmit,
    watch,
    formState: { errors },
  } = useForm<PasswordType>();

  const password = watch("password");

  const onSubmit: SubmitHandler<PasswordType> = (data) => {
    handleSubmit(data);
  };

  return (
    <div className="w-full p-4">
      <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
        {/* Nouveau mot de passe */}
        <div className="relative">
          <Label htmlFor="password">Nouveau mot de passe</Label>
          <Input
            {...register("password", {
              required: "Ce champ est obligatoire",
              minLength: {
                value: 8,
                message: "Au moins 8 caractères",
              },
            })}
            type={showPassword ? "text" : "password"}
            className={`mt-1 w-full ${errors.password ? "border-red-600" : ""}`}
          />
          <Button
            type="button"
            variant="ghost"
            className="absolute right-0 top-7"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </Button>
          {errors.password && (
            <p className="text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Confirmer le mot de passe */}
        <div className="relative">
          <Label htmlFor="confirm_password">Confirmer le mot de passe</Label>
          <Input
            {...register("confirm_password", {
              required: "Ce champ est obligatoire",
              minLength: {
                value: 8,
                message: "Au moins 8 caractères",
              },
              validate: (value) =>
                value === password || "Les mots de passe ne correspondent pas",
            })}
            type={showConfirmPassword ? "text" : "password"}
            className={`mt-1 w-full ${
              errors.confirm_password ? "border-red-600" : ""
            }`}
          />
          <Button
            type="button"
            variant="ghost"
            className="absolute right-0 top-7"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </Button>
          {errors.confirm_password && (
            <p className="text-red-600">{errors.confirm_password.message}</p>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col space-y-2">
          <Button type="submit" className="w-full">
            Confirmer
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={() => {
              setShowResetPassword(false);
              reset();
            }}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}
