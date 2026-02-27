import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role: string;
            profileId: string;
            isSubscribed: boolean;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role?: string;
        profileId?: string;
        fullName?: string;
        avatarUrl?: string;
        isSubscribed?: boolean;
    }
}
