"use client"

import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Plus } from "lucide-react";
import { DialogService } from "./dialog-service";
import { Button } from "@/components/ui/button";

export function ServicesList() {

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
                            <DialogService />
                        </DialogContent>
                    </CardHeader>
                </Card>
            </section>
        </Dialog>
    )
}