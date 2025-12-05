import { useInfiniteQuery } from "@tanstack/react-query";
import MessageItem from "./MessageItem";
import { orpc } from "@/lib/orpc";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2, Mail } from "lucide-react";

import EmptyState from "@/components/general/EmptyState";

const MessageList = ({ channelId }: { channelId: string }) => {
  const [hasinitialedScrolled, setHasInitialScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

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
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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
      if (el) {
        el.scrollTop = el.scrollHeight;

        setHasInitialScrolled(true);
        setIsAtButton(true);
      }
    }
  }, [hasinitialedScrolled, data]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollToBottonIfNeeded = () => {
      if (isAtButton && hasinitialedScrolled) {
        el.scrollTop = el.scrollHeight;
      }
    };

const onImageLoaded = (e: Event) => {
    const target = e.target as Element | null;
    if (target?.tagName === "IMG") {
      scrollToBottonIfNeeded();
    }
  };
    el.addEventListener("load", onImageLoaded, true);

    const resizeObserver = new ResizeObserver(() => {
      scrollToBottonIfNeeded();
    });
    resizeObserver.observe(el);

    const mutationObServer = new MutationObserver(() => {
      scrollToBottonIfNeeded();
    });
    mutationObServer.observe(el, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => {
      resizeObserver.disconnect();
      el.removeEventListener("load", onImageLoaded, true);
      mutationObServer.disconnect();
    };
  }, [isAtButton, hasinitialedScrolled, items.length]);

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
        SetNewMessages(false);
        setIsAtButton(true);
      } else {
        SetNewMessages(true);
      }
    }
    LastItemRef.current = lastId;
  }, [items.length]);

  function scrollToBottom() {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
    SetNewMessages(false);
    setIsAtButton(true);
  }

  const empty = !error && !isFetching && items.length === 0;
  return (
    <div className="relative h-full w-full">
      <div
        className="h-full overflow-y-auto px-4 "
        ref={scrollRef}
        onScroll={handleScroll}>
        {empty ? (
          <div className="flex items-center justify-center p-5 w-full h-full">
            <EmptyState
              title="No messages yet!"
              buttonText="Send a message"
              href="#"
              description="Start the converation by sending the first message"
            />
          </div>
        ) : (
          items.map((message) => (
            <MessageItem message={message} key={message.id} />
          ))
        )}
      </div>
      <div ref={bottomRef}></div>
      {newMessages && !isAtButton ? (
        <Button
          type="button"
          onClick={scrollToBottom}
          size="sm"
          className="absolute bottom-4 right-8  cursor-pointer">
          <Mail className="size-4 mr-1" />
          New Message!
        </Button>
      ) : null}
      {isFetchingNextPage && (
        <div className="pointer-events-none absolute top-0 left-0  right-0 flex items-center justify-center py-2">
          <div className="flex gap-2 items-center rounded-md bg-linear-to-b from-white/80 to-transparent dark:from-neutral-900/80 backdrop-blur px-5">
            <Loader2 className="animate-spin size-4 text-muted-foreground" />
            <span>Loadin previos messages...</span>
          </div>
        </div>
      )}
      {!newMessages && !isAtButton && (
        <Button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-5 z-20  rounded-full hover:shadow-xl transition-all duration-200"
          size="sm"
          type="button">
          <ChevronDown className="size-4" />
        </Button>
      )}
      <div ref={bottomRef}></div>
    </div>
  );
};

export default MessageList;
