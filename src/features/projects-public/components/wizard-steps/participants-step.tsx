"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { Plus, Trash2 } from "lucide-react";
import { Participant } from "../project-wizard";
import { z } from "zod";

type ParticipantsStepProps = {
  participants: Participant[];
  onUpdate: (participants: Participant[]) => void;
};

export function ParticipantsStep({
  participants,
  onUpdate,
}: ParticipantsStepProps) {
  const [currentParticipant, setCurrentParticipant] = useState<
    Omit<Participant, "id">
  >({
    firstName: "",
    lastName: "",
    email: "",
    studentCode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateParticipant = () => {
    const newErrors: Record<string, string> = {};

    if (!currentParticipant.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    }

    if (!currentParticipant.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    }

    if (!currentParticipant.email.trim()) {
      newErrors.email = "El email es requerido";
    } else {
      try {
        z.string().email().parse(currentParticipant.email);
      } catch {
        newErrors.email = "El email no es válido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addParticipant = () => {
    if (validateParticipant()) {
      const newParticipant: Participant = {
        ...currentParticipant,
        id: Date.now().toString(),
      };
      onUpdate([...participants, newParticipant]);
      setCurrentParticipant({
        firstName: "",
        lastName: "",
        email: "",
        studentCode: "",
      });
      setErrors({});
    }
  };

  const removeParticipant = (id: string) => {
    onUpdate(participants.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Add Participant Form */}
      <div className="space-y-4 rounded-lg border border-default-200 bg-default-50 p-6">
        <h3 className="text-lg font-semibold">Agregar Participante</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Primer Nombre"
            placeholder="Juan"
            value={currentParticipant.firstName}
            onValueChange={(value) => {
              setCurrentParticipant({
                ...currentParticipant,
                firstName: value,
              });
              if (errors.firstName) setErrors({ ...errors, firstName: "" });
            }}
            isRequired
            isInvalid={!!errors.firstName}
            errorMessage={errors.firstName}
          />
          <Input
            label="Apellido"
            placeholder="Pérez"
            value={currentParticipant.lastName}
            onValueChange={(value) => {
              setCurrentParticipant({ ...currentParticipant, lastName: value });
              if (errors.lastName) setErrors({ ...errors, lastName: "" });
            }}
            isRequired
            isInvalid={!!errors.lastName}
            errorMessage={errors.lastName}
          />
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="juan.perez@universidad.edu"
            value={currentParticipant.email}
            onValueChange={(value) => {
              setCurrentParticipant({ ...currentParticipant, email: value });
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            isRequired
            isInvalid={!!errors.email}
            errorMessage={errors.email}
          />
          <Input
            label="Código Estudiantil"
            placeholder="2021-1234"
            value={currentParticipant.studentCode}
            onValueChange={(value) =>
              setCurrentParticipant({
                ...currentParticipant,
                studentCode: value,
              })
            }
          />
        </div>
        <Button
          color="primary"
          onPress={addParticipant}
          startContent={<Plus className="h-4 w-4" />}
        >
          Agregar Participante
        </Button>
      </div>

      {/* Participants List */}
      {participants.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            Participantes ({participants.length})
          </h3>
          {participants.map((participant) => (
            <Card key={participant.id}>
              <CardBody>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">
                      {participant.firstName} {participant.lastName}
                    </p>
                    <p className="text-sm text-default-500">
                      {participant.email}
                    </p>
                    {participant.studentCode && (
                      <p className="text-sm text-default-500">
                        Código: {participant.studentCode}
                      </p>
                    )}
                  </div>
                  <Button
                    isIconOnly
                    variant="light"
                    color="danger"
                    onPress={() => removeParticipant(participant.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {participants.length === 0 && (
        <div className="rounded-lg border border-dashed border-default-300 bg-default-50 p-8 text-center">
          <p className="text-default-500">
            No hay participantes agregados. Agregue al menos un participante
            para continuar.
          </p>
        </div>
      )}
    </div>
  );
}
