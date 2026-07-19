import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useEnvironment } from "./keycloak-ui-shared";

let documentTitleStatus:
  { isOverridden: false } | { isOverridden: true; actualTitle: string } = {
  isOverridden: false,
};

export function SessionExpirationWarningOverlay(props: {
  warnUserSecondsBeforeAutoLogout: number;
}) {
  const { warnUserSecondsBeforeAutoLogout } = props;

  const { keycloak } = useEnvironment();
  const { t } = useTranslation();

  const [secondsLeft, setSecondsLeft] = useState<number | undefined>(undefined);

  useEffect(() => {
    const { oidc } = keycloak;

    if (!oidc || !oidc.isUserLoggedIn) {
      // In dev or when the session isn't established yet, skip the overlay wiring.
      return;
    }

    const { unsubscribeFromAutoLogoutCountdown } =
      oidc.subscribeToAutoLogoutCountdown(({ secondsLeft }) => {
        if (secondsLeft === undefined) {
          // The use had become active again. Hide the overlay
          setSecondsLeft(undefined);
          return;
        }

        if (secondsLeft > warnUserSecondsBeforeAutoLogout) {
          // The session expires in a while still, do not display the overlay.
          setSecondsLeft(undefined);
          return;
        }

        setSecondsLeft(secondsLeft);
      });

    return () => {
      unsubscribeFromAutoLogoutCountdown();
    };
  }, [keycloak, warnUserSecondsBeforeAutoLogout]);

  useEffect(() => {
    if (secondsLeft === undefined) {
      if (documentTitleStatus.isOverridden) {
        document.title = documentTitleStatus.actualTitle;
      }
      documentTitleStatus = { isOverridden: false };
      return;
    }

    if (!documentTitleStatus.isOverridden) {
      documentTitleStatus = {
        isOverridden: true,
        actualTitle: document.title,
      };
    }

    document.title = t("sessionSecondsLeftTitle", {
      seconds: secondsLeft,
      defaultValue: "{{seconds}} seconds left",
    });
  }, [secondsLeft, t]);

  useEffect(
    () => () => {
      if (documentTitleStatus.isOverridden) {
        document.title = documentTitleStatus.actualTitle;
        documentTitleStatus = { isOverridden: false };
      }
    },
    [],
  );

  if (secondsLeft === undefined) {
    return null;
  }

  return (
    <div
      role="presentation"
      // Full screen overlay, blurred background
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(10px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="session-expiring-title"
        aria-describedby="session-expiring-description session-expiring-instructions"
        style={{
          backgroundColor: "#fff",
          color: "#111",
          padding: "24px 28px",
          borderRadius: 8,
          boxShadow: "0 12px 28px rgba(0, 0, 0, 0.35)",
          maxWidth: 420,
          width: "90%",
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        <p
          id="session-expiring-title"
          style={{ margin: 0, fontSize: 18, fontWeight: 600 }}
        >
          {t("sessionExpiringTitle", {
            defaultValue: "Session expiring soon",
          })}
        </p>
        <p
          id="session-expiring-description"
          aria-live="assertive"
          style={{ margin: "12px 0 0" }}
        >
          {t("sessionExpiringMessage", {
            seconds: secondsLeft,
            defaultValue:
              "You will be signed out in {{seconds}} seconds due to inactivity.",
          })}
        </p>
        <p
          id="session-expiring-instructions"
          style={{ margin: "12px 0 0", fontSize: 13, opacity: 0.8 }}
        >
          {t("sessionExpiringInstructions", {
            defaultValue: "Move your mouse or press any key to stay signed in.",
          })}
        </p>
      </div>
    </div>
  );
}
