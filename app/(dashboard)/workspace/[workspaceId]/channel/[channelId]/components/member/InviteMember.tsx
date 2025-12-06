import {
  inviteMemberSchema,
  InviteMemberSchemaType,
} from "@/app/schemas/member";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";

const InviteMember = () => {
  const form = useForm({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });
  function onSubmit(data: InviteMemberSchemaType) {}
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="size-4 mr-1" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Member:</DialogTitle>
          <DialogDescription>
            invite a new member to your workspace by using thier email
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMember;
