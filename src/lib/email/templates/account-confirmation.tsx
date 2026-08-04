import { EButton, EHeading, EText, EmailShell, Kicker, email } from "./_components";

interface Props {
  firstName: string;
  confirmUrl: string;
  emailConfirmHeading?: string;
  emailConfirmBody?: string;
  emailFooter?: string;
}

export function AccountConfirmationEmail({
  firstName,
  confirmUrl,
  emailConfirmHeading = "Bestätige dein Konto, {name}",
  emailConfirmBody = "Noch ein Klick, dann kannst du deine Bestellungen verfolgen und Rechnungen jederzeit herunterladen.",
  emailFooter = "Bei Fragen antworte einfach auf diese E-Mail.",
}: Props) {
  return (
    <EmailShell
      preview="Bestätige dein VINKL-Konto"
      footerNote="Dieser Link ist 24 Stunden gültig."
    >
      <Kicker>Konto bestätigen</Kicker>
      <EHeading>{emailConfirmHeading.replace("{name}", firstName)}</EHeading>
      <EText>{emailConfirmBody}</EText>

      <div style={{ margin: "28px 0" }}>
        <EButton href={confirmUrl}>Konto bestätigen</EButton>
      </div>

      <EText style={{ margin: 0, fontSize: 13, color: email.inkTertiary }}>
        {emailFooter}
      </EText>
    </EmailShell>
  );
}
