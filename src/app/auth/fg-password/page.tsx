import type { Metadata } from "next";
import ForgotPasswordForm from "@/features/auth/components/fg-password";

export const metadata: Metadata = {
	title: "Recuperar contraseña",
};

export default function Page() {
	return <ForgotPasswordForm />;
}
