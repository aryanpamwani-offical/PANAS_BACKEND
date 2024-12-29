import express from 'express';
import { createContact, showAllContacts, userDetails } from "../controller/user.controller.js";

const router=express.Router();
router.post('/create',createContact);
router.get('/showall',showAllContacts);
router.get('/showsingle/:id',userDetails);
export default router