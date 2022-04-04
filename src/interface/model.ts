/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, Model } from 'mongoose';
export interface IModel {
    /** Class name to use for the model */
    key: string;
    /** schema to use */
    schema: Schema;
    /** getter for the model */
    get model(): Model<any>;
}