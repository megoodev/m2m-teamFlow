import { ThemeToggle } from "@/components/ui/Theme-toggle";

const ChannelHeader = () => {
  return (
    <div className="flex items-center justify-between h-14 w-full  px-4 border-b">
      <h1 className="">£ hossam-mostafa</h1>
      <div className="flex items-center space-x-2">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default ChannelHeader;
