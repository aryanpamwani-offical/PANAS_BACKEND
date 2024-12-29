import express from 'express';
import { createContact, showAllContacts } from "../controller/user.controller.js";

const router=express.Router();
router.post('/create',createContact);
router.get('/showall',showAllContacts);
export default router