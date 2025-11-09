"use client";

import { useState } from "react";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/components/ui/notifications";
import { useSearchParams } from "next/navigation";

// Schema for change password (new password only)
const changePasswordSchema = z.object({
	password: z.string().min(6, "Mínimo 6 caracteres"),
});

export const ChangePasswordForm = () => {
	const { addNotification } = useNotifications();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const searchParams = useSearchParams();
	const token = searchParams?.get("token");

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold text-center">Cambiar contraseña</h3>
			<p className="text-sm text-muted-foreground text-center">
				Ingresa tu nueva contraseña.
			</p>
			<Form
				onSubmit={async (e) => {
					e.preventDefault();
					setIsSubmitting(true);
					try {
						const form = e.target as HTMLFormElement;
						const formData = new FormData(form);
						const raw = Object.fromEntries(formData) as Record<string, any>;
						const values = await changePasswordSchema.parseAsync(raw);

						// Simulación de petición al backend usando token si existe
						await new Promise((r) => setTimeout(r, 700));

						addNotification({
							type: "success",
							title: "Contraseña actualizada",
							message: "Ahora puedes iniciar sesión con tu nueva contraseña.",
						});
					} catch (error: any) {
						addNotification({
							type: "error",
							title: "Error",
							message: error?.message || "No se pudo actualizar la contraseña",
						});
					} finally {
						setIsSubmitting(false);
					}
				}}
			>
				<Input
					name="password"
					type="password"
					label="Nueva contraseña"
					placeholder="••••••••"
					isRequired
				/>
				<Button
					type="submit"
					className="w-full"
					isLoading={isSubmitting}
					disabled={isSubmitting}
				>
					Guardar contraseña
				</Button>
			</Form>
		</div>
	);
};

export default ChangePasswordForm;
