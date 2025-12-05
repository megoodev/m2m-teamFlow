"use client";
import { MessageInputType, messageSchema } from "@/app/schemas/message";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import MessageComposer from "./MessageComposer";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { useState } from "react";
import { useAttachmentUpload } from "@/hooks/use-attachment-upload";
import { Message } from "@/lib/generated/prisma/client";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
interface MessageInputFormProps {
  channelId: string;
  user: KindeUser<Record<string, unknown>>;
}
type MessageProps = {
  items: Message[];
  nextCursor?: string;
};
type infinteMessages = InfiniteData<MessageProps>;
const MessageInputForm = ({ channelId, user }: MessageInputFormProps) => {
  const queryClient = useQueryClient();
  const upload = useAttachmentUpload();

  const [editorKey, setEditorKey] = useState(0);
  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
      channelId: channelId,
      imageUrl: upload.stageUrl ?? undefined,
    },
  });
  const createMessageMutation = useMutation(
    orpc.messages.create.mutationOptions({
      onMutate: async (data) => {
        queryClient.cancelQueries({
          queryKey: ["message.list", channelId],
        });
        const prevData = queryClient.getQueryData<infinteMessages>([
          "message.list",
          channelId,
        ]);
        const tempId = `optimistic-${crypto.randomUUID()}`;

        const optimisticData: Message = {
          content: data.content,
          imageUrl: data.imageUrl ?? null,
          authorId: user.id,
          AuthorAvatar: user.picture!,
          authorEmail: user.email!,
          AuthorName: user.given_name ?? "Jhon Done",
          channelId: channelId,
          createdAt: new Date(),
          updatedAt: new Date(),
          id: tempId,
        };
        queryClient.setQueryData<infinteMessages>(
          ["message.list", channelId],
          (old) => {
            if (!old) {
              return {
                pages: [
                  {
                    items: [optimisticData],
                    nextCursor: undefined,
                  },
                ],
                pageParams: [undefined],
              } satisfies infinteMessages;
            }

            const firstPage = old.pages[0] ?? {
              items: [],
              nextCursor: undefined,
            };
            const updatedMessages: MessageProps = {
              ...firstPage,
              items: [optimisticData, ...firstPage.items],
            };
            return {
              ...old,
              pages: [updatedMessages, ...old.pages.slice(0)],
            };
          }
        );

        return {
          prevData,
          tempId,
        };
      },
      onSuccess: (data, _varibalies, context) => {
        toast.success("Message send successfully");
        queryClient.setQueryData<infinteMessages>(
          ["message.list", channelId],
          (old) => {
            if (!old) return old;

            const updatedPages = old.pages.map((page) => ({
              ...page,
              items: page.items.map((m) =>
                m.id === context.tempId ? { ...data } : m
              ),
            }));
            return {
              ...old,
              pages: updatedPages,
            };
          }
        );
        form.reset();
        setEditorKey(editorKey + 1);
        upload.clear();
      },
      onError: (_err, _varibalies, context) => {
        if (context?.prevData) {
          queryClient.setQueryData(
            ["message.list", channelId],
            context.prevData
          );
        }
        toast.error("Somethong went wrong");
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
