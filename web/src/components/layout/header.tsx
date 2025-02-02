import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/use-auth";
import { $router } from "@/lib/router";
import { cn } from "@/lib/utils";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
import { $enableFilter, setEnableFilter } from "@/lib/store";

const Header = () => {
  const enableFilter = useStore($enableFilter);
  const page = useStore($router);
  const [label, setLabel] = useState<string>("Posts");
  const { user } = useAuth();
  const showUserFilter = user && user.username;

  useEffect(() => {
    if (page?.route === "post") {
      setLabel("Comments");
    } else {
      setLabel("Posts");
    }
  }, [page]);

  if (!page) return null;

  return (
    <div className="flex justify-center gap-3 p-1 border-b">
      {showUserFilter && (
        <Button
          variant={"link"}
          className={cn({
            underline: showUserFilter && enableFilter,
            "text-primary": enableFilter,
            "text-primary/60": !enableFilter,
          })}
          onClick={() => setEnableFilter(true)}
        >{`My ${label}`}</Button>
      )}
    </div>
  );
};

export default Header;
