import { getCurrentViewer } from "@/lib/current-viewer";

import { HeaderClient } from "./HeaderClient";

export const Header = async () => {
  const viewer = await getCurrentViewer();

  return (
    <HeaderClient
      isAdmin={viewer.isAdmin}
      isSignedIn={viewer.isSignedIn}
      displayName={viewer.displayName}
      displayEmail={viewer.displayEmail}
      isDriver={viewer.isDriver}
      hasDriverApplication={viewer.hasDriverApplication}
    />
  );
};
