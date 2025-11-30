"use client";
import {
  channelNameSchema,
  channelNameSchemaType,
  transformChannelName,
} from "@/app/schemas/channel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { orpc } from "@/lib/orpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { isDefinedError } from "@orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateNewChannel = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(channelNameSchema),
    defaultValues: {
      name: "",
    },
  });
  const queryClient = useQueryClient();
  const createNewChannelMutation = useMutation(
    orpc.channels.create.mutationOptions({
      onSuccess: (newchannel) => {
        toast.success(`Channel ${newchannel.name} created successfully`);
        form.reset();
        router.push(
          `/workspace/${newchannel.workspaceId}/channel/${newchannel.id}`
        );
        setOpen(false);
        queryClient.invalidateQueries({
          queryKey: orpc.channels.list.queryKey(),
        });
      },
      onError: (error) => {
        if (isDefinedError(error)) {
          toast.error(error.message);
          return;
        }
        toast.error("Failed to create channel. Please try again");
      },
    })
  );
  function onSubmit(value: channelNameSchemaType) {
    createNewChannelMutation.mutate(value);
  }
  const watchName = form.watch("name");
  const transformedName = watchName ? transformChannelName(watchName) : "";
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          <Plus className="size-4" />
          Add Channel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-80">
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
          <DialogDescription>
            Create new channel to get started!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="My Channel" />
                    </FormControl>
                    {transformedName && transformedName !== watchName && (
                      <p>
                        Will be create as :{" "}
                        <code className="bg-muted px-1 rounded text-xs  py-0.5">
                          {transformedName}
                        </code>
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button type="submit" disabled={createNewChannelMutation.isPending}>
              {createNewChannelMutation.isPending
                ? "Creating..."
                : "Create new Channel"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewChannel;
