"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

type Profile = {
  id: number;
  nip: string;
  nama: string;
  jabatan: string;
  image_url: string;
  id_auth: string
};

type AuthContextType = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      console.log("data.session.user.id", data.session?.user.id);

      if (data.session?.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id_auth", data.session.user.id)
          .single();

        setProfile(profileData);
      }
      setLoading(false);
    };

    init();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);

        if (session?.user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id_auth", session.user.id)
            .single();

          setProfile(profileData);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
