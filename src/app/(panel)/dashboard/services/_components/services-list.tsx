"use client"

import {
    X,
    Plus,
    Pencil,
} from "lucide-react";

import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
} from "@/components/ui/card";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogService } from "./dialog-service";
import { Service } from "@/generated/prisma/client";
import { formatCurrency } from "@/utils/formatCurrency";

interface ServicesListProps {
    services: Service[];
}

export function ServicesList({ services }: ServicesListProps) {

    console.log("services", services)

    const [isDialog, setIsDialogOpen] = useState(false);

    return (
        <Dialog open={isDialog} onOpenChange={setIsDialogOpen}>
            <section className="mx-auto">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>
                            Serviços
                        </CardTitle>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogService
                                closeModal={() => {
                                    setIsDialogOpen(false)
                                }}
                            />
                        </DialogContent>
                    </CardHeader>
                    <CardContent>
                        <section className="space-y-4 mt-5">
                            {services.map(service => (
                                <article
                                key={service.id}
                               className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">{service.name}</span>
                                        <span className="text-gray-500">-</span>
                                        <span className="text-gray-500">{formatCurrency((service.price / 100))}</span>
                                    </div>
                                    <div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => { }}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => { }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </article>
                            ))}
                        </section>
                    </CardContent>
                </Card>
            </section>
        </Dialog>
    )
}