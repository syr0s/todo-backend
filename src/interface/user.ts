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
     * The unix timestamp the user has confirmed the account
     * registration.
     */
    timestampConfirm?: number;
}