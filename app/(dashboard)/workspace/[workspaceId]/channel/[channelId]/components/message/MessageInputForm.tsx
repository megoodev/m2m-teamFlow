"use client";
import { MessageInputType, messageSchema } from "@/app/schemas/message";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import MessageComposer from "./MessageComposer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { useState } from "react";
import { useAttachmentUpload } from "@/hooks/use-attachment-upload";

const MessageInputForm = ({ channelId }: { channelId: string }) => {
  const queryClient = useQueryClient();
  const upload = useAttachmentUpload();

  const [editorKey, setEditorKey] = useState(0);
  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
      channelId: channelId,
      imageUrl: upload.stageUrl ?? undefined
    },
  });
  const createMessageMutation = useMutation(
    orpc.messages.create.mutationOptions({
      onSuccess: () => {
        toast.success("Message sent successfully");
        form.reset();
        setEditorKey(editorKey + 1);
        upload.clear();
        queryClient.invalidateQueries({
          queryKey: orpc.messages.list.key(),
        });
      },
      onError: () => {
        toast.error("Failed to send message. Please try again");
      },
    })
  );
  function onSubmit(values: MessageInputType) {
    createMessageMutation.mutate({
      ...values,
      imageUrl: upload.stageUrl ?? undefined,
    });
  }
  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MessageComposer
                  upload={upload}
                  key={editorKey}
                  value={field.value}
                  onSubmit={() => onSubmit(form.getValues())}
                  isPending={createMessageMutation.isPending}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default MessageInputForm;
