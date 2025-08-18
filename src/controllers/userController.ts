import { Request, Response } from "express";
import { prisma } from "../prisma";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({});
  }
};

export const syncUserHandler = async (req: Request, res: Response) => {
  const { email, name, sub, picture } = req.body;
  const userId = req.user?.userId;
  try {
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: { email, name },
      create: { id: userId, email, name, sub, picture },
    });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: "Failed to sync user" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({});
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.create({
      data: { ...req.body },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({});
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { ...req.body },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({});
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({});
  }
};
