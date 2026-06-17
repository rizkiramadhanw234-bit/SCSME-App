import { Request, Response } from "express";
import { Event } from "../entities/event.entity";
import { AppDataSource } from "../config/db";

const eventsRepo = AppDataSource.getRepository(Event);

export async function getEvents(req: Request, res: Response): Promise<void> {
  try {
    const getEvents = await eventsRepo.find();
    res.status(200).json({ message: "Events fetched", data: getEvents });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getEventById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const getEvent = await eventsRepo.findOneBy({ id });
    if (!getEvent) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.status(200).json({ message: "Event fetched", data: getEvent });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createEvent(req: Request, res: Response): Promise<void> {
  try {
    const {
      title,
      description,
      eventDate,
      location,
      price,
      capacity,

      coverImage,
      language,
    } = req.body as Event;

    if (
      !title ||
      !description ||
      !eventDate ||
      !location ||
      !price ||
      !capacity ||
      !coverImage ||
      !language
    ) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const eventExist = await eventsRepo.findOneBy({ title });
    if (eventExist) {
      res.status(400).json({ message: "Event already exists" });
      return;
    }

    const eventDateObj = new Date(eventDate);
    const newEvent = await eventsRepo.save({
      title,
      description,
      eventDate: eventDateObj,
      location,
      price,
      capacity,
      status: "draft",
      coverImage,
      language,
    });
    res.status(201).json({ message: "Event created", data: newEvent });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateEvent(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const {
      title,
      description,
      eventDate,
      location,
      price,
      capacity,
      coverImage,
      language,
    } = req.body as Event;
    const eventExist = await eventsRepo.findOneBy({ id });
    if (!eventExist) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    if (
      title === eventExist.title &&
      description === eventExist.description &&
      eventDate === eventExist.eventDate &&
      location === eventExist.location &&
      price === eventExist.price &&
      capacity === eventExist.capacity &&
      coverImage === eventExist.coverImage &&
      language === eventExist.language
    ) {
      res.status(400).json({ message: "No changes" });
      return;
    }

    const eventDateObj = new Date(eventDate);
    const updatedEvent = await eventsRepo.update(
      { id },
      {
        title,
        description,
        eventDate: eventDateObj,
        location,
        price,
        capacity,
        coverImage,
        language,
      },
    );
    res.status(200).json({ message: "Event updated", data: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
