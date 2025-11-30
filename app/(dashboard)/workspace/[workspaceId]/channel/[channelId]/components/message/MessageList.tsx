import { useInfiniteQuery } from "@tanstack/react-query";
import MessageItem from "./MessageItem";
import { orpc } from "@/lib/orpc";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Mail } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MessageList = ({ channelId }: { channelId: string }) => {
  const [hasinitialedScrolled, setHasInitialScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [isAtButton, setIsAtButton] = useState(false);
  const [newMessages, SetNewMessages] = useState(false);
  const LastItemRef = useRef<string | undefined>(undefined);
  const initialOptins = orpc.messages.list.infiniteOptions({
    input: (pageParam: string | undefined) => ({
      channelId: channelId,
      cursor: pageParam,
      limit: 30,
    }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    select: (data) => ({
      pages: [...data.pages]
        .map((p) => ({ ...p, items: [...p.items].reverse() }))
        .reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  });

  const {
    data,
    isEnabled,
    isPending,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetched,
    isLoading,
    error,
  } = useInfiniteQuery({
    ...initialOptins,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const items = useMemo(() => {
    return data?.pages.flatMap((p) => p.items) ?? [];
  }, [data]);

  useEffect(() => {
    if (!hasinitialedScrolled && data?.pages.length) {
      const el = scrollRef.current;
      if (el !== null) {
        el.scrollTop = el.scrollHeight;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasInitialScrolled(true);
        setIsAtButton(true);
      }
    }
  }, [hasinitialedScrolled, data]);
  const isNearButton = (el: HTMLDivElement) =>
    el.scrollHeight - el.scrollTop - el.clientHeight <= 80;

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop <= 80 && hasNextPage && !isFetching) {
      const prevScrollHeight = el.scrollHeight;
      const prevScrollTop = el.scrollTop;
      fetchNextPage().then(() => {
        const newScrollHight = el.scrollHeight;
        el.scrollTop = newScrollHight - prevScrollHeight + prevScrollTop;
      });
    }
    setIsAtButton(isNearButton(el));
  }
  useEffect(() => {
    if (!items.length) return;

    const lastId = items[items.length - 1].id;
    const prevLastId = LastItemRef.current;
    const el = scrollRef.current;
    if (prevLastId && lastId !== prevLastId) {
      if (el && isNearButton(el)) {
        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight;
        });
        // eslint-disable-next-line react-hooks/set-state-in-effect
        SetNewMessages(false);
        setIsAtButton(true);
      } else {
        SetNewMessages(true);
      }
    }
    LastItemRef.current = lastId;
  }, [items]);
  function scrollToBottom() {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
    SetNewMessages(false);
    setIsAtButton(true);
  }
  return (
    <div className="relative h-full w-full">
      <div
        className="h-full overflow-y-auto px-4 "
        ref={scrollRef}
        onScroll={handleScroll}>
        {items?.map((message) => (
          <MessageItem message={message} key={message.id} />
        ))}
      </div>
      {newMessages && !isAtButton ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              onClick={scrollToBottom}
              size="sm"
              variant='secondary'
              className="absolute bottom-4 right-8 size-10 cursor-pointer rounded-full">
              <ChevronDown className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="invert  border-accent-foreground" side="left">
            <p className="flex items-center">
              <Mail className="size-4 mr-1" /> New Messages
            </p>
          </TooltipContent>
        </Tooltip>
      ) : null}
    </div>
  );
};

export default MessageList;
