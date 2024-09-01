import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
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
import { showToast } from "@/lib/showSwal";
import {
  CirclePlus,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  UserCog,
} from "lucide-react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import ActionLoading from "@/components/action-loading.component";

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
    } else {
      data.profile = "";
    }
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
    <>
      <Button onClick={() => setIsAddOpen(true)}>
        <CirclePlus className="h-5 w-5 mr-2" /> Ajouter un nouvel utilisateur
      </Button>
      <ResponsiveDialog
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        title="Ajout de nouvel utilisateur"
        description="Formulaire pour ajouter de nouvel utilisateur"
      >
        {create_user.isAdding ? (
          <ActionLoading text="En cours d'enregistrement" />
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
                  {/* Nom */}
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
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                {/* Prénom(s) */}
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
              {/* Rôle */}
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <div className="relative">
                  <UserCog
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Controller
                    name="role"
                    control={control}
                    rules={{ required: "Rôle est requis" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          className={`pl-10 border rounded-md p-1 shadow-sm ${
                            errors.role ? "border-red-600" : ""
                          }`}
                        >
                          <span className="pl-10">
                            <SelectValue placeholder="Sélectionnez le rôle de l'utilisateur" />
                          </span>
                        </SelectTrigger>
                        <SelectContent>
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
                </div>
                {errors.role && (
                  <p className="text-red-500 text-sm">{errors.role.message}</p>
                )}
              </div>
              {/* Adresse */}
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    {...register("address", { required: "Adresse requise" })}
                    className={`pl-10 ${
                      errors.address ? "border-red-500" : ""
                    }`}
                    placeholder="Votre adresse"
                  />
                </div>
                {errors.address && (
                  <p className="text-red-500 text-sm">
                    {errors.address.message}
                  </p>
                )}
              </div>
              {/* Téléphone */}
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
                      maxLength: {
                        value: 12,
                        message: "12 caractères maximum",
                      },
                    })}
                    className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                    placeholder="Votre numéro de téléphone"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>
              {/* Email */}
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
                      required: "Mot de passe requis",
                      minLength: { value: 8, message: "8 caractères minimum" },
                    })}
                    type={showPassword ? "text" : "password"}
                    className={`pl-10 ${
                      errors.password ? "border-red-500" : ""
                    }`}
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
              {/* Confirmation mot de passe */}
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
                    type={showConfirm_password ? "text" : "password"}
                    className={`pl-10 ${
                      errors.confirm_password ? "border-red-500" : ""
                    }`}
                    placeholder="Confirmez votre mot de passe"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-0 top-0 hover:bg-transparent"
                    onClick={() =>
                      setShowConfirm_password(!showConfirm_password)
                    }
                  >
                    {showConfirm_password ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
                {errors.confirm_password && (
                  <p className="text-red-500 text-sm">
                    {errors.confirm_password.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button type="submit" className="min-w-[90px]">
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
        )}
      </ResponsiveDialog>
    </>
  );
}

export default AddUserComponent;
