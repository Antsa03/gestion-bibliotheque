import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreate } from "@/hooks/useCreate.hook";
import { User as PrismaUser } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CirclePlus, Eye, EyeOff } from "lucide-react";
import { showToast } from "@/lib/showSwal";

type User = PrismaUser & {
  confirm_password: string;
};

function AddUserComponent() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    watch,
  } = useForm<User>({
    mode: "all",
  });

  const queryClient = useQueryClient();
  const create_user = useCreate<User>("/api/users/create", () => {
    showToast(
      "Information",
      "L'information de l'utilisateur a été créé avec succès",
      "success"
    );
    setIsAddOpen(false);
    queryClient.invalidateQueries({ queryKey: ["users"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  });
  const onSubmit = async (data: User) => {
    const formData = new FormData();
    let shouldUpload = false;

    if (data.profile && (data.profile as unknown as FileList).length > 0) {
      formData.append("profile", (data.profile as unknown as FileList)[0]);
      shouldUpload = true;
    }

    if (shouldUpload) {
      const response = await fetch("/api/upload/profile", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      data.profile = result.profileFileName || "";
    }
    data.profile = "";
    await create_user.handleAdd(data);
  };

  //L'état du modal
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Pour afficher/masquer le mot de passe
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm_password, setShowConfirm_password] = useState(false);

  const password = watch("password");

  useEffect(() => {
    reset();
  }, [isAddOpen, setIsAddOpen]);

  return (
    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
      <Button onClick={() => setIsAddOpen(true)} className="w-[300px]">
        <CirclePlus className="h-5 w-5 mr-2" /> Ajouter un nouvel utilisateur
      </Button>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajout de nouvel utilisateur</DialogTitle>
          <DialogDescription>
            Formulaire pour ajouter de nouvel utilisateur
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* Profile */}
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="profile" className="text-center">
                Profile
              </Label>
              <Input
                {...register("profile")}
                className="col-span-3"
                type="file"
              />
            </div>
            {/* Nom */}
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="name" className="text-center">
                Nom
              </Label>
              <Input
                {...register("name", {
                  required: "Nom est requis",
                })}
                className={`col-span-3 ${errors.name ? "border-red-600" : ""}`}
              />
              {errors.name && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Prénom */}
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="firstname" className="text-center">
                Prénom
              </Label>
              <Input
                {...register("firstname", { required: "Prénom est requis" })}
                className={`col-span-3 ${
                  errors.firstname ? "border-red-600" : ""
                }`}
              />
              {errors.firstname && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.firstname.message}
                </p>
              )}
            </div>

            {/* Adresse */}
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="address" className="text-center">
                Adresse
              </Label>
              <Input
                {...register("address", { required: "Adresse est requise" })}
                className={`col-span-3 ${
                  errors.address ? "border-red-600" : ""
                }`}
              />
              {errors.address && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Téléphone */}
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="address" className="text-center">
                Téléphone
              </Label>
              <Input
                {...register("phone", {
                  required: "Téléphone est requis",
                  maxLength: {
                    value: 12,
                    message:
                      "Le numéro de téléphone doit comporter au maximum 12 caractères",
                  },
                })}
                className={`col-span-3 ${errors.phone ? "border-red-600" : ""}`}
              />
              {errors.phone && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Rôle */}
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="role" className="text-center">
                Rôle
              </Label>
              <Controller
                name="role"
                control={control}
                rules={{ required: "Rôle est requis" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="col-span-3 border rounded-md p-1 shadow-sm">
                      <SelectValue placeholder="Sélectionnez le rôle de l'utilisateur" />
                    </SelectTrigger>
                    <SelectContent
                      className={`col-span-3 ${
                        errors.role ? "border-red-600" : ""
                      }`}
                    >
                      <SelectGroup>
                        <SelectLabel>Rôle de l'utilisateur</SelectLabel>
                        <SelectItem value="Administrateur">
                          Administrateur
                        </SelectItem>
                        <SelectItem value="Adhérent">Adhérent</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="email" className="text-center">
                Email
              </Label>
              <Input
                {...register("email", {
                  required: "Email est requis",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Email invalide",
                  },
                })}
                className={`col-span-3 ${errors.email ? "border-red-600" : ""}`}
              />
              {errors.email && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Mot de passe */}
            <div className="grid grid-cols-4 items-center gap-1 relative">
              <Label htmlFor="password" className="text-center">
                Mot de passe
              </Label>
              <div className="col-span-3 relative">
                <Input
                  {...register("password", {
                    required: "Mot de passe est requis",
                    minLength: {
                      value: 8,
                      message:
                        "Le mot de passe doit comporter au moins 08 caractères",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  className={`w-full ${
                    errors.password ? "border-red-600" : ""
                  }`}
                />
                <Button
                  type="button"
                  className="absolute right-0 top-0"
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
            <div className="grid grid-cols-4 items-center gap-1 relative">
              <Label htmlFor="confirm_password" className="text-center">
                Confirmation Mot de passe
              </Label>
              <div className="col-span-3 relative">
                <Input
                  {...register("confirm_password", {
                    required: "Confirmation de mot de passe est requise",
                    validate: (value) =>
                      value === password ||
                      "Les mots de passe ne correspondent pas",
                  })}
                  type={showConfirm_password ? "text" : "password"}
                  className={`w-full ${
                    errors.confirm_password ? "border-red-600" : ""
                  }`}
                />
                <Button
                  type="button"
                  className="absolute right-0 top-0"
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
          <DialogFooter>
            <Button type="submit" className="w-[90px]">
              Ok
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsAddOpen(false);
              }}
            >
              Annuler
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddUserComponent;
