import type { Metadata } from "next";
import ChangePasswordForm from "@/features/auth/components/chg-password";

export const metadata: Metadata = {
	title: "Cambiar contraseña",
};

export default function Page() {
	return <ChangePasswordForm />;
}
