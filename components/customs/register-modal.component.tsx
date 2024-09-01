import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { User as PrismaUser } from "@prisma/client";
import { useCreate } from "@/hooks/useCreate.hook";
import { showToast } from "@/lib/showSwal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Eye, EyeOff, User, Mail, Phone, MapPin, Lock } from "lucide-react";
import { ResponsiveDialog } from "../responsive-dialog";
import ActionLoading from "../action-loading.component";

type User = PrismaUser & {
  confirm_password: string;
};

type RegisterModalProps = {
  isRegisterOpen: boolean;
  setIsRegisterOpen: Dispatch<SetStateAction<boolean>>;
};

function RegisterModal({
  isRegisterOpen,
  setIsRegisterOpen,
}: RegisterModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<User>({ mode: "all" });

  const queryClient = useQueryClient();
  const create_user = useCreate<User>("/api/register", () => {
    showToast("Information", "Votre compte a été créé avec succès", "success");
    setIsRegisterOpen(false);
    queryClient.invalidateQueries({ queryKey: ["users"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password");

  useEffect(() => {
    reset();
  }, [isRegisterOpen, reset]);

  const onSubmit = async (data: User) => {
    const formData = new FormData();
    if (data.profile && (data.profile as unknown as FileList).length > 0) {
      formData.append("profile", (data.profile as unknown as FileList)[0]);
      const response = await fetch("/api/upload/profile", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      data.profile = result.profileFileName || "";
    } else {
      data.profile = "";
    }
    await create_user.handleAdd(data);
  };

  return (
    <ResponsiveDialog
      isOpen={isRegisterOpen}
      setIsOpen={setIsRegisterOpen}
      title="Inscription"
      description="S'inscrire en quelques étapes"
    >
      {create_user.isAdding ? (
        <ActionLoading text="En cours d'enregistrement ..." />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile">Photo de profil</Label>
              <Input
                {...register("profile")}
                type="file"
                className="h-fit file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    {...register("name", { required: "Nom requis" })}
                    className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                    placeholder="Votre nom"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstname">Prénom(s)</Label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    {...register("firstname", { required: "Prénom requis" })}
                    className={`pl-10 ${
                      errors.firstname ? "border-red-500" : ""
                    }`}
                    placeholder="Votre prénom"
                  />
                </div>
                {errors.firstname && (
                  <p className="text-red-500 text-sm">
                    {errors.firstname.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  {...register("address", { required: "Adresse requise" })}
                  className={`pl-10 ${errors.address ? "border-red-500" : ""}`}
                  placeholder="Votre adresse"
                />
              </div>
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  {...register("phone", {
                    required: "Téléphone requis",
                    maxLength: { value: 12, message: "12 caractères maximum" },
                  })}
                  className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                  placeholder="Votre numéro de téléphone"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  {...register("email", {
                    required: "Email requis",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Email invalide",
                    },
                  })}
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  {...register("password", {
                    required: "Mot de passe requis",
                    minLength: { value: 8, message: "8 caractères minimum" },
                  })}
                  type={showPassword ? "text" : "password"}
                  className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                  placeholder="Votre mot de passe"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-0 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">
                Confirmation du mot de passe
              </Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  {...register("confirm_password", {
                    required: "Confirmation requise",
                    validate: (value) =>
                      value === password ||
                      "Les mots de passe ne correspondent pas",
                  })}
                  type={showConfirmPassword ? "text" : "password"}
                  className={`pl-10 ${
                    errors.confirm_password ? "border-red-500" : ""
                  }`}
                  placeholder="Confirmez votre mot de passe"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-0 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-sm">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">
              Confirmer
            </Button>
          </DialogFooter>
        </form>
      )}
    </ResponsiveDialog>
  );
}

export default RegisterModal;
