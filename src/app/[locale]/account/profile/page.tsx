import { setRequestLocale } from "next-intl/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AccountProfileForm } from "@/components/account/account-profile-form";

type Props = { params: Promise<{ locale: string }> };

export default async function AccountProfilePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/account/login`);

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 400, margin: "0 0 24px" }}>Profil</h2>
      <AccountProfileForm
        currentName={user.user_metadata?.name ?? ""}
        currentEmail={user.email ?? ""}
      />
    </div>
  );
}
