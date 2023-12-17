import { Adapter, AdapterAccount, AdapterSession, AdapterUser, VerificationToken } from 'next-auth/adapters';

// Thanks to solution from https://github.com/nextauthjs/next-auth/issues/7538
export function AuthRestAdapter(): Adapter {
    const url = `${process.env.API_URL}/auth`
    const headers = {
        'Content-Type': 'application/json',
        'x-auth-secret': process.env.NEXTAUTH_SECRET || ''
    }
    const client = {
        get: async (path: string, other?: {params: {[x: string]: string}}) => {
            if(other) {
                const newUrl = new URL(url+path)
                const newParams = new URLSearchParams(other.params)
                newUrl.search = newParams.toString()
                return fetch(newUrl, {headers: headers})
            }
            return fetch(url+path, {headers: headers})
        },
        post: async (path: string, data: object) => {
            return fetch(url+path, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(data)
            })
        },
        patch: async (path: string, data: object) => {
            return fetch(url+path, {
                method: "PATCH",
                headers: headers,
                body: JSON.stringify(data)
            })
        },
        delete: async (path: string) => {
            return fetch(url+path, {
                method: "DELETE",
                headers: headers
            })
        }
    }

    return {
        createUser: async (user: Omit<AdapterUser, 'id'>) => {
            const response = await client.post('/', user);
            const data = await response.json()
            return format<AdapterUser>(data);
        },
        getUserByEmail: async (email: string) => {
            const response = await client.get('/', { params: { email } });
            const data = await response.json()
            return data ? format<AdapterUser>(data) : data;
        },
        getUserByAccount: async ({
            providerAccountId,
            provider
        }: Pick<AdapterAccount, 'provider' | 'providerAccountId'>) => {
            const response = await client.get(`/account/${provider}/${providerAccountId}`);
            const data = await response.json()
            return data ? format<AdapterUser>(data) : data;
        },
        getUser: async (id: string) => {
            const response = await client.get(`/${id}`);
            const data = await response.json()
            return data ? format<AdapterUser>(data) : data;
        },
        updateUser: async (user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>) => {
            const response = await client.patch('/', user);
            const data = await response.json()
            return format<AdapterUser>(data);
        },
        deleteUser: async (userId: string) => {
            const response = await client.delete(`/${userId}`);
            const data = await response.json()
            return data ? format<AdapterUser>(data) : data;
        },
        linkAccount: async (account: AdapterAccount) => {
            const response = await client.post('/account', account);
            const data = await response.json()
            return data ? format<AdapterAccount>(data) : data;
        },
        unlinkAccount: async ({ providerAccountId, provider }: Pick<AdapterAccount, 'provider' | 'providerAccountId'>) => {
            const response = await client.delete(`/account/${provider}/${providerAccountId}`);
            const data = await response.json()
            return data ? format<AdapterAccount>(data) : data;
        },
        createSession: async (session: { sessionToken: string; userId: string; expires: Date }) => {
            const response = await client.post('/session', session);
            const data = await response.json()
            return data ? format<AdapterSession>(data) : data;
        },
        getSessionAndUser: async (sessionToken: string) => {
            const response = await client.get(`/session/${sessionToken}`);
            const data = await response.json()

            if (!data) {
                return data;
            }

            const session = format<AdapterSession>(data.session);
            const user = format<AdapterUser>(data.user);
            return { session, user };
        },
        updateSession: async (session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>) => {
            const response = await client.patch('/session', session);
            const data = await response.json()
            return data ? format<AdapterSession>(data) : data;
        },
        deleteSession: async (sessionToken: string) => {
            const response = await client.delete(`/session/${sessionToken}`);
            const data = await response.json()
            return data ? format<AdapterSession>(data) : data;
        },
        createVerificationToken: async (verificationToken: VerificationToken) => {
            const response = await client.post('/verification', verificationToken);
            const data = await response.json()
            return data ? format<VerificationToken>(data) : data;
        },
        useVerificationToken: async (params: { identifier: string; token: string }) => {
            const response = await client.patch(`/verification`, params);
            const data = await response.json()
            return data ? format<VerificationToken>(data) : data;
        }
    };
}

function format<T>(obj: Record<string, unknown>): T {
    return Object.entries(obj).reduce((result, [key, value]) => {
        const newResult = result;

        if (value === null) {
            return newResult;
        }

        if (isDate(value)) {
            newResult[key] = new Date(value);
        } else {
            newResult[key] = value;
        }

        return newResult;
    }, {} as Record<string, unknown>) as T;
}

const isDate = (value: unknown): value is string =>
    typeof value === 'string' ? new Date(value).toString() !== 'Invalid Date' && !Number.isNaN(Date.parse(value)) : false;