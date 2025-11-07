import { HttpResponse, http } from "msw";

import { env } from "@/config/env";

import { db, persistDb } from "../db";
import {
  requireAuth,
  // requireAdmin,
  networkDelay,
} from "../utils";

type CourseBody = {
  code: string;
  description: string;
  eventIds: string[];
  status?: "active" | "inactive";
};

export const coursesHandlers = [
  // Get all courses
  http.get(`${env.API_URL}/courses`, async ({ cookies, request }) => {
    await networkDelay();

    try {
      const { /*user,*/ error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const url = new URL(request.url);
      const page = Number(url.searchParams.get("page") || 1);
      const filterEventId = url.searchParams.get("eventId");

      // Base dataset (optionally filtered by event)
      let allCourses = db.course.getAll();
      if (filterEventId) {
        const courseEvents = db.courseEvent.findMany({
          where: { eventId: { equals: filterEventId } },
        });
        const courseIds = courseEvents.map((ce) => ce.courseId);
        allCourses = allCourses.filter((course) => courseIds.includes(course.id));
      }

      const total = allCourses.length;
      const totalPages = Math.ceil(total / 10);

      const paginated = allCourses.slice(10 * (page - 1), 10 * page);

      const courses = paginated.map((course) => {
        const courseEvents = db.courseEvent.findMany({
          where: { courseId: { equals: course.id } },
        });

        const events = courseEvents
          .map((ce) => {
            const event = db.event.findFirst({
              where: { id: { equals: ce.eventId } },
            });
            return event ? { id: event.id, title: event.title } : null;
          })
          .filter(Boolean);

        return {
          id: course.id,
          code: course.code,
          description: course.description,
          events,
          status: course.status,
          createdAt: course.createdAt,
        };
      });

      return HttpResponse.json({
        data: courses,
        meta: { page, total, totalPages },
      });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),

  // Get course by ID
  http.get(`${env.API_URL}/courses/:courseId`, async ({ params, cookies }) => {
    await networkDelay();

    try {
      const { /*user,*/ error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const courseId = params.courseId as string;
      const course = db.course.findFirst({
        where: { id: { equals: courseId } },
      });

      if (!course) {
        return HttpResponse.json(
          { message: "Course not found" },
          { status: 404 }
        );
      }
      const courseEvents = db.courseEvent.findMany({
        where: { courseId: { equals: course.id } },
      });

      const events = courseEvents.map((ce) => {
        const event = db.event.findFirst({
          where: { id: { equals: ce.eventId } },
        });
        return event ? { id: event.id, title: event.title } : null;
      }).filter(Boolean);

      const result = {
        ...course,
        events,
      };

      return HttpResponse.json({ data: result });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),

  http.post(`${env.API_URL}/courses`, async ({ request, cookies }) => {
    await networkDelay();

    try {
      const { user, error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const data = (await request.json()) as CourseBody;
      // requireAdmin(user);

      if (data.eventIds && data.eventIds.length > 0) {
        for (const eventId of data.eventIds) {
          const event = db.event.findFirst({
            where: { id: { equals: eventId } },
          });

          if (!event) {
            return HttpResponse.json(
              { message: `Event with ID ${eventId} not found` },
              { status: 404 }
            );
          }
        }
      }

      const existingCourse = db.course.findFirst({
        where: { code: { equals: data.code } },
      });

      if (existingCourse) {
        return HttpResponse.json(
          { message: "Course code already exists" },
          { status: 400 }
        );
      }

      const course = db.course.create({
        code: data.code,
        description: data.description,
        status: data.status ?? "active",
      });

      // Create courseEvent relations
      if (data.eventIds && data.eventIds.length > 0) {
        data.eventIds.forEach((eventId) => {
          db.courseEvent.create({
            courseId: course.id,
            eventId,
          });
        });
      }

      await persistDb("course");
      await persistDb("courseEvent");

      // Return course with events
      const events = data.eventIds?.map((eventId) => {
        const event = db.event.findFirst({
          where: { id: { equals: eventId } },
        });
        return event ? { id: event.id, title: event.title } : null;
      }).filter(Boolean) || [];

      return HttpResponse.json({
        data: { ...course, events },
      });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),

  // Update course
  http.patch(
    `${env.API_URL}/courses/:courseId`,
    async ({ params, request, cookies }) => {
      await networkDelay();

      try {
        const { /*user,*/ error } = requireAuth(cookies);
        if (error) {
          return HttpResponse.json({ message: error }, { status: 401 });
        }

        const courseId = params.courseId as string;
        const data = (await request.json()) as Partial<CourseBody>;
        // requireAdmin(user);

        // Validate course exists
        const existingCourse = db.course.findFirst({
          where: { id: { equals: courseId } },
        });

        if (!existingCourse) {
          return HttpResponse.json(
            { message: "Course not found" },
            { status: 404 }
          );
        }

        // If updating eventIds, validate all events exist
        if (data.eventIds && data.eventIds.length > 0) {
          for (const eventId of data.eventIds) {
            const event = db.event.findFirst({
              where: { id: { equals: eventId } },
            });

            if (!event) {
              return HttpResponse.json(
                { message: `Event with ID ${eventId} not found` },
                { status: 404 }
              );
            }
          }
        }

        // If updating code, check for duplicates
        if (data.code && data.code !== existingCourse.code) {
          const duplicateCourse = db.course.findFirst({
            where: { code: { equals: data.code } },
          });

          if (duplicateCourse && duplicateCourse.id !== courseId) {
            return HttpResponse.json(
              { message: "Course code already exists" },
              { status: 400 }
            );
          }
        }

        // Update course
        const course = db.course.update({
          where: { id: { equals: courseId } },
          data: {
            ...(data.code && { code: data.code }),
            ...(data.description && { description: data.description }),
            ...(data.status && { status: data.status }),
          },
        });

        // If eventIds are provided, update the relations
        if (data.eventIds) {
          // Delete existing relations
          const existingRelations = db.courseEvent.findMany({
            where: { courseId: { equals: courseId } },
          });

          existingRelations.forEach((relation) => {
            db.courseEvent.delete({
              where: { id: { equals: relation.id } },
            });
          });

          // Create new relations
          data.eventIds.forEach((eventId) => {
            db.courseEvent.create({
              courseId: courseId,
              eventId,
            });
          });
        }

        await persistDb("course");
        await persistDb("courseEvent");

        // Return course with events
        const courseEvents = db.courseEvent.findMany({
          where: { courseId: { equals: courseId } },
        });

        const events = courseEvents.map((ce) => {
          const event = db.event.findFirst({
            where: { id: { equals: ce.eventId } },
          });
          return event ? { id: event.id, title: event.title } : null;
        }).filter(Boolean);

        return HttpResponse.json({
          data: { ...course, events },
        });
      } catch (error: any) {
        return HttpResponse.json(
          { message: error?.message || "Server Error" },
          { status: 500 }
        );
      }
    }
  ),

  // Delete course
  http.delete(`${env.API_URL}/courses/:courseId`, async ({ params, cookies }) => {
    await networkDelay();

    try {
      const { /*user,*/ error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const courseId = params.courseId as string;
      // requireAdmin(user);

      const course = db.course.findFirst({
        where: { id: { equals: courseId } },
      });

      if (!course) {
        return HttpResponse.json(
          { message: "Course not found" },
          { status: 404 }
        );
      }

      // Delete all courseEvent relations first
      const courseEvents = db.courseEvent.findMany({
        where: { courseId: { equals: courseId } },
      });

      courseEvents.forEach((relation) => {
        db.courseEvent.delete({
          where: { id: { equals: relation.id } },
        });
      });

      // Delete the course
      db.course.delete({
        where: { id: { equals: courseId } },
      });

      await persistDb("course");
      await persistDb("courseEvent");

      return HttpResponse.json({ data: course });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),

  // Get courses by event
  http.get(
    `${env.API_URL}/courses/by-event/:eventId`,
    async ({ params, cookies, request }) => {
      await networkDelay();

      try {
        const { /*user,*/ error } = requireAuth(cookies);
        if (error) {
          return HttpResponse.json({ message: error }, { status: 401 });
        }

        const eventId = params.eventId as string;
        const url = new URL(request.url);
        const page = Number(url.searchParams.get("page") || 1);

        // Validate event exists
        const event = db.event.findFirst({
          where: { id: { equals: eventId } },
        });

        if (!event) {
          return HttpResponse.json(
            { message: "Event not found" },
            { status: 404 }
          );
        }

        // Get all courseEvent relations for this event
        const courseEvents = db.courseEvent.findMany({
          where: { eventId: { equals: eventId } },
        });

        const courseIds = courseEvents.map((ce) => ce.courseId);

        // Get courses
        const allCourses = db.course.findMany({}).filter((course) =>
          courseIds.includes(course.id)
        );

        const total = allCourses.length;
        const totalPages = Math.ceil(total / 10);

        const paginatedCourses = allCourses
          .slice(10 * (page - 1), 10 * page)
          .map((course) => {
            // Get all events for this course
            const allCourseEvents = db.courseEvent.findMany({
              where: { courseId: { equals: course.id } },
            });

            const events = allCourseEvents.map((ce) => {
              const evt = db.event.findFirst({
                where: { id: { equals: ce.eventId } },
              });
              return evt ? { id: evt.id, title: evt.title } : null;
            }).filter(Boolean);

            return {
              id: course.id,
              code: course.code,
              description: course.description,
              events,
              status: course.status,
              createdAt: course.createdAt,
            };
          });

        return HttpResponse.json({
          data: paginatedCourses,
          meta: { page, total, totalPages },
        });
      } catch (error: any) {
        return HttpResponse.json(
          { message: error?.message || "Server Error" },
          { status: 500 }
        );
      }
    }
  ),

  // Get courses dropdown (simplified list for select inputs)
  http.get(`${env.API_URL}/courses-dropdown`, async ({ cookies, request }) => {
    await networkDelay();

    try {
      const { error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const url = new URL(request.url);
      const eventId = url.searchParams.get("eventId");

      let courses;
      if (eventId) {
        // Get courses for specific event
        const courseEvents = db.courseEvent.findMany({
          where: { eventId: { equals: eventId } },
        });
        const courseIds = courseEvents.map((ce) => ce.courseId);
        courses = db.course.findMany({}).filter((course) =>
          courseIds.includes(course.id)
        );
      } else {
        courses = db.course.findMany({});
      }

      const result = courses.map((course) => ({
        id: course.id,
        code: course.code,
        description: course.description,
      }));

      return HttpResponse.json({ data: result });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || "Server Error" },
        { status: 500 }
      );
    }
  }),
];
