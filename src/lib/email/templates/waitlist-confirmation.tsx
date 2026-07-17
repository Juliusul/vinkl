import {
  EButton,
  EHeading,
  EText,
  EmailShell,
  Kicker,
} from "./_components";

interface Props {
  confirmUrl: string;
  preview: string;
  greeting: string;
  body: string;
  button: string;
  ignore: string;
}

/**
 * Waitlist double-opt-in email — one job, one button.
 */
export function WaitlistConfirmationEmail({
  confirmUrl,
  preview,
  greeting,
  body,
  button,
  ignore,
}: Props) {
  return (
    <EmailShell preview={preview} footerNote={ignore}>
      <Kicker>Warteliste</Kicker>
      <EHeading>{greeting}</EHeading>
      <EText>{body}</EText>

      <div style={{ margin: "28px 0 8px" }}>
        <EButton href={confirmUrl}>{button}</EButton>
      </div>
    </EmailShell>
  );
}
