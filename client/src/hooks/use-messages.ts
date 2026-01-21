import { useMutation } from "@tanstack/react-query";
import { api, type InsertMessage } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useCreateMessage() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: InsertMessage) => {
      // Runtime validation before sending
      const validated = api.messages.create.input.parse(data);
      
      const res = await fetch(api.messages.create.path, {
        method: api.messages.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.messages.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to send message');
      }

      return api.messages.create.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Message Transmitted",
        description: "Your signal has been received successfully.",
        variant: "default",
        className: "border-primary text-primary bg-background/90 backdrop-blur"
      });
    },
    onError: (error) => {
      toast({
        title: "Transmission Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
