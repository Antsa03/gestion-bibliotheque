import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, ArrowLeft, Loader2 } from "lucide-react";
import generateRandomString from "@/lib/generateRandomString";
import { showToast } from "@/lib/showSwal";
import ResetPasswordFinal from "./reset-password-final.component";

interface PasswordForm {
  password: string;
  confirm_password: string;
}

type ResetPasswordComponentProps = {
  email: string;
  setShowResetPassword: Dispatch<SetStateAction<boolean>>;
  reset: () => void;
};

function ResetPasswordComponent({
  email,
  setShowResetPassword,
  reset,
}: ResetPasswordComponentProps) {
  const [inputValue, setInputValue] = useState("");
  const [randomString, setRandomString] = useState("");
  const [showSecretCodeForm, setShowSecretCodeForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isSendSecretCode, setIsSendSecretCode] = useState(false);

  const sendSecretCode = async () => {
    try {
      setIsSendSecretCode(true);
      const generatedString: string = generateRandomString(8);
      setRandomString(generatedString);
      const subject = "Réinitialisation de mot de passe";
      const response = await fetch("/api/send-email/resetpass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, subject, code: generatedString }),
      });
      if (response.ok) {
        setIsSendSecretCode(false);
        showToast(
          "Email envoyé!",
          "Un code a été envoyé à votre adresse email!",
          "success"
        );
        setShowSecretCodeForm(true);
      } else {
        console.error(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (randomString === inputValue) {
      setShowPasswordForm(true);
      setShowSecretCodeForm(false);
    }
  };

  const handleUpdatePassword = async (password_props: PasswordForm) => {
    try {
      if (password_props.password === password_props.confirm_password) {
        const response = await fetch(`/api/reset-password/${email}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(password_props),
        });
        if (response.ok) {
          showToast("Information", "Mot de passe réinitialisé", "success");
          setShowResetPassword(false);
        } else {
          showToast("Information", "Échec de la réinitialisation", "error");
          console.error(response);
        }
      } else {
        showToast(
          "Information",
          "Les mots de passe ne correspondent pas",
          "error"
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full  flex flex-col items-center gap-4 p-4">
      <p className="text-sm sm:text-lg text-center primary font-semibold">
        Votre email :
      </p>
      <p className="text-sm sm:text-lg max-w-[400px] w-full text-center bg-gray-300 rounded-md py-2 text-black font-bold mb-4">
        {email}
      </p>

      {!showSecretCodeForm && !showPasswordForm && (
        <Button onClick={sendSecretCode} className="w-full font-bold">
          {isSendSecretCode ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin text-xl" />
              Code en cours d'envoi...
            </div>
          ) : (
            "Envoyer le code secret"
          )}
        </Button>
      )}

      {showSecretCodeForm && !showPasswordForm && (
        <form onSubmit={handleReset} className="w-full mt-4">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Entrez le code secret"
            className="mt-3"
          />
          <Button type="submit" className="w-full font-bold mt-2">
            Confirmer
          </Button>
        </form>
      )}

      {showPasswordForm && (
        <ResetPasswordFinal
          handleSubmit={handleUpdatePassword}
          setShowResetPassword={setShowResetPassword}
          reset={reset}
        />
      )}

      <Button
        onClick={() => {
          setShowResetPassword(false);
          reset();
        }}
        variant="ghost"
        className="flex items-center gap-2 mt-2"
      >
        <ArrowLeft className="text-md sm:text-lg text-black" />
        Retour
      </Button>
    </div>
  );
}

export default ResetPasswordComponent;
