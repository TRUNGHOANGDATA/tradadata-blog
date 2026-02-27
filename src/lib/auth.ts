import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { supabaseAdmin } from '@/lib/supabase/server';

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google' && user.email && supabaseAdmin) {
                try {
                    // Check if user profile exists
                    const { data: existingProfile } = await supabaseAdmin
                        .from('profiles')
                        .select('id')
                        .eq('email', user.email)
                        .single();

                    if (!existingProfile) {
                        // Create profile for first-time user
                        await supabaseAdmin.from('profiles').insert({
                            email: user.email,
                            full_name: user.name || '',
                            avatar_url: user.image || '',
                            role: 'reader',
                        });
                    }
                } catch (error) {
                    console.error('Error creating profile:', error);
                    // Still allow sign in even if profile creation fails
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user?.email && supabaseAdmin) {
                // Fetch role from profiles table
                const { data: profile } = await supabaseAdmin
                    .from('profiles')
                    .select('id, role, full_name, avatar_url, is_subscribed')
                    .eq('email', user.email)
                    .single();

                if (profile) {
                    token.role = profile.role;
                    token.profileId = profile.id;
                    token.fullName = profile.full_name;
                    token.avatarUrl = profile.avatar_url;
                    token.isSubscribed = profile.is_subscribed || false;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = (token.role as string) || 'reader';
                session.user.profileId = token.profileId as string;
                session.user.isSubscribed = (token.isSubscribed as boolean) || false;
            }
            return session;
        },
    },
});
