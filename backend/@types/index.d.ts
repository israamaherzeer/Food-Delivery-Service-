import express from 'express';
import { NSUser } from './user.ts';

interface pagination {
    page: string;
    pageSize: string;
    category?: string;
    shopId?: number;
}

namespace ExpressNS {
    export interface RequestWithUser extends express.Request {
        user?: NSUser.IUser | null;
    }
}