"use server"
import { CreateEventParams, DeleteEventParams, GetAllEventsParams, GetEventsByUserParams, GetRelatedEventsByCategoryParams, UpdateEventParams } from "@/types";
import { connectToDatabase } from "../database";
import { revalidatePath } from "next/cache";
import Event from "../database/models/event.model";
import { handleError } from "../utils";
import User from "../database/models/user.model";
import Category from "../database/models/category.model";

const populateEvent = (query: any) => {
    return query
     .populate({path:'organizer',model:User, select: ' _id firstName lastName'})
     .populate({path:'category',model:Category,select:'_id name'})
  }

// create event
export async function createEvent({ userId, event, path }: CreateEventParams) {
    try {
      await connectToDatabase()
      console.log("ALL PARAMS FROM FRONT",userId,event,path)
  
      const organizer = await User.findById(userId)
      if (!organizer) throw new Error('Organizer not found')
  
      const newEvent = await Event.create({ ...event, category: event.categoryId, organizer: userId })
      revalidatePath(path)
  
      return JSON.parse(JSON.stringify(newEvent))
    } catch (error) {
        console.log(error)
      handleError(error)
    }
  }
 //get event by Id
  export async function getEventById(eventId: string) {
    try {
        await connectToDatabase()
        const event = await populateEvent(Event.findById(eventId))
        if(!event) throw new Error("Event not Found")
    
        return JSON.parse(JSON.stringify(event))
        
    } catch (error) {
      console.log(error)
      handleError(error)
    }
  }

// UPDATE
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    await connectToDatabase()

    const eventToUpdate = await Event.findById(event._id)
    if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error('Unauthorized or event not found')
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId },
      { new: true }
    )
    revalidatePath(path)

    return JSON.parse(JSON.stringify(updatedEvent))
  } catch (error) {
    handleError(error)
  }
}

// DELETE
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    await connectToDatabase()

    const deletedEvent = await Event.findByIdAndDelete(eventId)
    if (deletedEvent) revalidatePath(path)
  } catch (error) {
    console.log(error)
    handleError(error)
  }
}


  export async function getAllEvents({ query, limit = 6, page, category }: GetAllEventsParams) {
    try {
      await connectToDatabase()
  
      const conditions= {};
      const eventsQuery= Event.find(conditions)
       .sort({ createdAt: 'desc' })
       .skip(0)
       .limit(limit)

      const events = await populateEvent(eventsQuery)
      const eventsCount = await Event.countDocuments(conditions)
  
      return {
        data: JSON.parse(JSON.stringify(events)),
        totalPages: Math.ceil(eventsCount / limit),
      }
    } catch (error) {
      console.log(error)
      handleError(error)
    }
  } 


// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    await connectToDatabase()

    const skipAmount = (Number(page) - 1) * limit
    const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
  } catch (error) {
    handleError(error)
  }
}

// GET EVENTS BY ORGANIZER
export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
  try {
    await connectToDatabase()

    const conditions = { organizer: userId }
    const skipAmount = (page - 1) * limit

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
  } catch (error) {
    handleError(error)
  }
}
// export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
//   try {
//     await connectToDatabase();
//     const conditions ={organizer:userId}
//     const skipAmount = (page - 1) * limit;

//     const eventsQuery = Event.find(conditions)
//       .sort({ createdAt: 'desc' })
//       .skip(skipAmount)
//       .limit(limit)

//       const events =await populateEvent(eventsQuery);
//       const eventsCount = await Event.countDocuments(conditions)
//       return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
//   } catch (error) {
//     console.log(error)
//     handleError(error)
//   }
// }
