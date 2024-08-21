"use client";
"use client";
import React, { useEffect, useState } from "react";
import { ResponsiveDialog } from "../responsive-dialog";
import { Button } from "../ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { signIn } from "next-auth/react";
import RegisterModal from "./register-modal.component";
import ResetPasswordComponent from "./reset-password.component";
import { Separator } from "../ui/separator";

type Login = {
  email: string;
  password: string;
};

function LoginModal() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resetPasswordError, setResetPasswordError] = useState("");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const { register, reset, handleSubmit, getValues } = useForm<Login>({
    mode: "all",
  });

  const handleSubmitLogin: SubmitHandler<Login> = async (data) => {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.ok) {
        setIsLoginOpen(false);
        setErrorMessage("");
      } else if (res?.error) {
        setErrorMessage("Email ou mot de passe invalide");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = () => {
    if (errorMessage) {
      setErrorMessage("");
    }
    if (resetPasswordError) {
      setResetPasswordError("");
    }
  };

  const openRegisterModal = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  // Logique du mot de passe oublié
  const [showResetPassword, setShowResetPassword] = useState(false);
  const handleForgotPassword = () => {
    const trimmedEmail = getValues("email")?.trim(); // Get the current value of email

    if (!trimmedEmail) {
      setResetPasswordError("Veuillez entrer l'email");
    } else {
      setShowResetPassword(true);
    }
  };

  useEffect(() => {
    if (!isLoginOpen) {
      reset();
      setShowResetPassword(false);
      setErrorMessage("");
      setResetPasswordError("");
    }
  }, [isLoginOpen, reset]);

  return (
    <>
      <Button onClick={() => setIsLoginOpen(true)} variant="outline">
        Se connecter
      </Button>
      <ResponsiveDialog
        isOpen={isLoginOpen}
        setIsOpen={setIsLoginOpen}
        title={`${showResetPassword ? "Mot de passe oublié?" : "Bienvenue"}`}
        description={`${
          showResetPassword
            ? "Réinitialisez votre mot de passe"
            : "Connectez-vous à votre compte"
        }`}
      >
        {showResetPassword ? (
          <ResetPasswordComponent
            email={getValues("email")}
            setShowResetPassword={setShowResetPassword}
            reset={reset}
          />
        ) : (
          <form
            onSubmit={handleSubmit(handleSubmitLogin)}
            className="space-y-6"
          >
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Adresse e-mail
                </Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    {...register("email", { required: "L'email est requis" })}
                    className="pl-10"
                    placeholder="exemple@mail.com"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {/* Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    {...register("password", {
                      required: "Le mot de passe est requis",
                    })}
                    type={showPassword ? "text" : "password"}
                    className="pl-10"
                    onChange={handleInputChange}
                  />
                  <Button
                    type="button"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    size="sm"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Affichage des messages d'erreur */}
            {(errorMessage || resetPasswordError) && (
              <p className="text-red-500 text-sm text-center">
                {errorMessage || resetPasswordError}
              </p>
            )}

            <Button type="submit" className="w-full">
              Se connecter
            </Button>

            <Button
              onClick={handleForgotPassword}
              className="w-full"
              variant="link"
            >
              Mot de passe oublié ?
            </Button>

            <Separator />

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Vous n'avez pas de compte ?
              </p>
              <Button
                onClick={openRegisterModal}
                className="w-full"
                variant="outline"
              >
                S'inscrire maintenant
              </Button>
            </div>
          </form>
        )}
      </ResponsiveDialog>
      <RegisterModal
        isRegisterOpen={isRegisterOpen}
        setIsRegisterOpen={setIsRegisterOpen}
      />
    </>
  );
}

export default LoginModal;
