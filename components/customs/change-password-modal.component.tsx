"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ResponsiveDialog } from "../responsive-dialog";
import { Button } from "../ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";
import { DialogFooter } from "../ui/dialog";
import { signOut, useSession } from "next-auth/react";
import bcrypt from "bcryptjs";
import { useUpdate } from "@/hooks/useUpdate.hook";
import { showToast } from "@/lib/showSwal";
import { useQueryClient } from "@tanstack/react-query";

type PasswordType = {
  old_password: string;
  password: string;
  confirm_password: string;
};

type ChangePasswordType = {
  id: number | string;
  password: string;
};

type ChangePasswordModalProps = {
  isChangePasswordOpen: boolean;
  setIsChangePasswordOpen: Dispatch<SetStateAction<boolean>>;
};

export default function ChangePasswordModal({
  isChangePasswordOpen,
  setIsChangePasswordOpen,
}: ChangePasswordModalProps) {
  // Pour afficher/masquer le mot de passe
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm_password, setShowConfirm_password] = useState(false);

  //Récupérer la session
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordType>({
    mode: "all",
  });

  const password = watch("password");

  //Logique de mise à jour de mot de passe
  const queryClient = useQueryClient();
  const change_password = useUpdate<ChangePasswordType>(
    "/api/change-password",
    () => {
      setIsChangePasswordOpen(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showToast("Info", "Votre mot de passe a été changé", "success");
      signOut();
    }
  );
  const handleSubmitChangePassword: SubmitHandler<PasswordType> = async (
    data
  ) => {
    let isValid = false;
    if (session && session.password) {
      isValid = await bcrypt.compare(data.old_password, session.password);
      if (isValid) {
        await change_password.handleUpdate({
          id: session.user_id,
          password: data.password,
        });
      } else {
        showToast("Erreur", "Une erreur s'est produite", "error");
      }
    } else {
      alert(session?.email);
      showToast("Erreur", "La session n'est pas définie", "error");
    }
  };

  useEffect(() => {
    reset();
  }, [isChangePasswordOpen, setIsChangePasswordOpen]);

  return (
    <ResponsiveDialog
      isOpen={isChangePasswordOpen}
      setIsOpen={setIsChangePasswordOpen}
      title="Modification de mot de passe"
      description="Formulaire pour modifier votre mot de passe"
    >
      <form
        onSubmit={handleSubmit(handleSubmitChangePassword)}
        className="space-y-6"
      >
        <div className="space-y-4">
          {/* Ancien mot de passe */}
          <div className="space-y-2">
            <Label htmlFor="old_password">Ancien mot de passe</Label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                {...register("old_password", {
                  required: "L'ancien mot de passe est requis",
                })}
                type={showOldPassword ? "text" : "password"}
                className={`pl-10 ${
                  errors.old_password ? "border-red-600" : ""
                }`}
              />
              <Button
                type="button"
                className="absolute right-0 top-0 hover:bg-transparent"
                onClick={() => setShowOldPassword(!showOldPassword)}
                variant="ghost"
              >
                {showOldPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
            {errors.old_password && (
              <p className="text-red-600 text-center col-span-4">
                {errors.old_password.message}
              </p>
            )}
          </div>

          {/* Mot de passe */}
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                {...register("password", {
                  required: "Le mot de passe est requis",
                  minLength: {
                    value: 8,
                    message:
                      "Le mot de passe doit comporter au moins 8 caractères",
                  },
                })}
                type={showPassword ? "text" : "password"}
                className={`pl-10 ${errors.password ? "border-red-600" : ""}`}
              />
              <Button
                type="button"
                className="absolute right-0 top-0 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                variant="ghost"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-center col-span-4">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirmation Mot de passe */}
          <div className="space-y-2">
            <Label htmlFor="confirm_password">Confirmation Mot de passe</Label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                {...register("confirm_password", {
                  required: "Confirmation de mot de passe est requise",
                  validate: (value) =>
                    value === password ||
                    "Les mots de passe ne correspondent pas",
                })}
                type={showConfirm_password ? "text" : "password"}
                className={`pl-10 ${
                  errors.confirm_password ? "border-red-600" : ""
                }`}
              />
              <Button
                type="button"
                className="absolute right-0 top-0 hover:bg-transparent"
                onClick={() => setShowConfirm_password(!showConfirm_password)}
                variant="ghost"
              >
                {showConfirm_password ? <EyeOff /> : <Eye />}
              </Button>
            </div>
            {errors.confirm_password && (
              <p className="text-red-600 text-center col-span-4">
                {errors.confirm_password.message}
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="gap-4">
          <Button type="submit" className="min-w-20">
            Ok
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setIsChangePasswordOpen(false);
            }}
          >
            Annuler
          </Button>
        </DialogFooter>
      </form>
    </ResponsiveDialog>
  );
}
