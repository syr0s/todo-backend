import { Document } from 'mongoose';

export interface IUser extends Document {
    /** 
     * E-Mail address the user has registered this account.
     * The e-mail must be unique in the database.
     */
    email: string;

    /**
     * The password as `sha-256` hash. We never require to 
     * send the plaintext password to the backend.
     */
    passwordHash: string;

    /**
     * The unix timestamp of the account creation.
     */
    timestampCreated: number;

    /**
     * Determines the account to be active or not. An account
     * will become activ in the moment the user makes the
     * confirmation request on the endpoint `/auth/confirm`
     * with the parameters provided by e-mail. (Multi-step
     * registration process). Once this value is set to
     * `true` the user is not able to change this.
     */
    active: boolean;

    /**
     * Link to confirm a new registered user account on the
     * backend. Will be created during the account registration.
     */
    confirmationLink?: string;

    /**
     * The unix timestamp the user has confirmed the account
     * registration.
     */
    timestampConfirm?: number;

    /**
     * Number value of the already completed todos within
     * the application. Can be used to generate achieves and
     * badges.
     */
    completed: number;

    /**
     * Badges the user has received by using the application.
     */
    badges: [
        {
            received: number,
            id: string,
        }
    ];
}