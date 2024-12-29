import express from 'express';
import { createContact, showAllContacts } from "../controller/user.controller.js";

const router=express.Router();
router.post('/create',createContact);
router.get('/show',showAllContacts);
export default router