export type User = {
    name: string;
    lastName: string;
    email: string
};

export type RegisterPayload = User & {
    count: number;
    mode: number;
    eventId: number
};

export type ResultsParams = {
    sandbox: number;
    event: number
};