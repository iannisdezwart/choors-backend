import { Handler } from "express";

export const createTaskRequestBodyValidationMiddleware =
  (options: { fieldsRequired: boolean }): Handler =>
  (request, response, next) => {
    const {
      name,
      description,
      freqBase: freqBaseStr,
      freqOffset,
      timeLimit,
      scheduleOffset,
      points,
      penalty,
      responsibleTaskGroup,
    } = request.body;

    if (options.fieldsRequired && !name) {
      return response
        .status(400)
        .json({ error: "Missing required field 'name'." });
    }

    if (name && typeof name !== "string") {
      return response.status(400).json({
        error: "Unexpected type of 'name' field. Expected string.",
      });
    }

    if (name && name.length < 3) {
      return response
        .status(400)
        .json({ error: "Name must be at least 3 characters long." });
    }

    if (options.fieldsRequired && !description) {
      return response
        .status(400)
        .json({ error: "Missing required field 'description'." });
    }

    if (description && typeof description !== "string") {
      return response.status(400).json({
        error: "Unexpected type of 'description' field. Expected string.",
      });
    }

    if (options.fieldsRequired && !freqBaseStr) {
      return response
        .status(400)
        .json({ error: "Missing required field 'freqBase'." });
    }

    if (freqBaseStr && typeof freqBaseStr !== "string") {
      return response.status(400).json({
        error: "Unexpected type of 'freqBase' field. Expected date string.",
      });
    }

    if (freqBaseStr) {
      request.body.freqBase = new Date(freqBaseStr);

      if (isNaN(request.body.freqBase.getTime())) {
        return response
          .status(400)
          .json({ error: "Invalid date string in 'freqBase' field." });
      }
    }

    if (options.fieldsRequired && !freqOffset) {
      return response
        .status(400)
        .json({ error: "Missing required field 'freqOffset'." });
    }

    if (freqOffset && typeof freqOffset !== "number") {
      return response.status(400).json({
        error: "Unexpected type of 'freqOffset' field. Expected number.",
      });
    }

    if (options.fieldsRequired && !timeLimit) {
      return response
        .status(400)
        .json({ error: "Missing required field 'timeLimit'." });
    }

    if (timeLimit && typeof timeLimit !== "number") {
      return response.status(400).json({
        error: "Unexpected type of 'timeLimit' field. Expected number.",
      });
    }

    if (options.fieldsRequired && !scheduleOffset) {
      return response
        .status(400)
        .json({ error: "Missing required field 'scheduleOffset'." });
    }

    if (scheduleOffset && typeof scheduleOffset !== "number") {
      return response.status(400).json({
        error: "Unexpected type of 'scheduleOffset' field. Expected number.",
      });
    }

    if (options.fieldsRequired && !points) {
      return response
        .status(400)
        .json({ error: "Missing required field 'points'." });
    }

    if (points && typeof points !== "number") {
      return response.status(400).json({
        error: "Unexpected type of 'points' field. Expected number.",
      });
    }

    if (options.fieldsRequired && !penalty) {
      return response
        .status(400)
        .json({ error: "Missing required field 'penalty'." });
    }

    if (penalty && typeof penalty !== "number") {
      return response.status(400).json({
        error: "Unexpected type of 'penalty' field. Expected number.",
      });
    }

    if (options.fieldsRequired && !responsibleTaskGroup) {
      return response
        .status(400)
        .json({ error: "Missing required field 'responsibleTaskGroup'." });
    }

    if (responsibleTaskGroup && typeof responsibleTaskGroup !== "string") {
      return response.status(400).json({
        error:
          "Unexpected type of 'responsibleTaskGroup' field. Expected string.",
      });
    }

    next();
  };
