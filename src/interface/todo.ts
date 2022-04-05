import { Document } from 'mongoose';

export interface ITodo extends Document {
    /**
     * Title of the todo.
     * 
     * `required`
     */
    title: string;
    /**
     * Description / notes of the todo.
     * 
     * `optional`
     */
    description?: string;
    /**
     * Marks the todo as done or not.
     */
    done: boolean;
    /**
     * Priority of the todo.
     * 
     * Default: `1`
     */
    priority: number;
    /**
     * Tag the todo is labled with.
     * Premium feature.
     * 
     * `optional`
     */
    tag?: string;
    /**
     * List the todo is ordered to, example
     * `Private` or `Work` - lists can be
     * created by the user.
     * 
     * `optional`
     */
    list?: string;
    /**
     * Due date and time of the todo.
     * 
     * `optional`
     */
    timestampDue?: number;
    /**
     * Unix timestamp the user wants to
     * get a notification about the todo
     * 
     * `optional`
     */
    timestampNotification?: number;
    /**
     * The uuid of the user this todo is
     * assigned to.
     * 
     * Default: `current user`
     */
    assigned: string;
    /**
     * Metadata of the todo object.
     * 
     * `required`
     */
    metadata: {
        /**
         * Creation metadata.
         * 
         * `required`
         */
        created?: {
            /** 
             * Unix timestamp of the creation.
             * 
             * Default: `Date.now()`
             */
            timestamp: number;
            /** 
             * uuid of the user who has created the todo.
             * 
             * Default: `current user` 
             */
            createdBy: string;
        },
        /**
         * Update metadata
         * 
         * Entry will be created on every update on the todo
         * record.
         * 
         * `optional`
         */
        updates?: [
            {
                /**
                 * Unix timestamp of the update
                 * 
                 * Default: `Date.now()`
                 */
                timestamp: number;
                /**
                 * uuid of the user who has updated the todo.
                 * 
                 * Default: `current user`
                 */
                updateBy: string;
            }
        ]
    }
    /**
     * Comments made on a todo.
     * 
     * `optional`
     */
    comments?: [
        {
            /**
             * Timestamp the comment was added.
             * 
             * Default: `Date.now()`
             */
            timestamp: number;
            /**
             * uuid of the user who has made the comment.
             * 
             * Default: `current user`
             */
            createdBy: string;
            /**
             * Content / Message of the comment.
             * 
             * `required`
             */
            content: string;
        }
    ]
}