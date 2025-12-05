"use client";
import { useCallback, useMemo, useState } from "react";

export const useAttachmentUpload = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stageUrl, setStageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const onUploaded = useCallback((url: string) => {
    setStageUrl(url);
    setIsUploading(false);
    setIsOpen(false);
  }, []);
  const clear = useCallback(() => {
    setStageUrl(null);
    setIsUploading(false);
  }, []);
  return useMemo(
    () => ({
      isOpen,
      setIsOpen,
      onUploaded,
      stageUrl,
      isUploading,
      clear,
    }),
    [isOpen, setIsOpen, onUploaded, stageUrl, isUploading, clear]
  );
};

export type useAttachmentUploadType = ReturnType<typeof useAttachmentUpload>;
