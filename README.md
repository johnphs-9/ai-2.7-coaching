# 2.7 Coaching Session: Refactoring the Guess Game with useReducer and useContext

## Session Overview

This coaching session gives learners hands-on practice applying `useReducer` and the Context API to a problem they already know. The first 30 minutes are open Q&A on anything from Lessons 2.5 and 2.6. Learners then spend approximately two hours working through a structured two-part activity using the `guess-game` starter project: first refactoring its `useState` logic into a reducer, then lifting that reducer into a shared context so components can read state and dispatch directly instead of through props. The session closes with an optional bonus challenge, two learner presentations, and an instructor walkthrough.

## Dependencies

- [Activity Brief](./lesson.md)
- [Starter Project](./guess-game)

## Session Objectives

- Refactor existing `useState` logic into a `useReducer` to centralise game state and update logic
- Create a React Context to share reducer state and dispatch across components without prop drilling

## Session Plan

| Duration  | What              | How or Why                                                                                                   |
| --------- | ----------------- | ------------------------------------------------------------------------------------------------------------ |
| 30 min    | Q&A               | Open floor for questions on Lessons 2.5 and 2.6; instructor addresses common misconceptions                  |
| 10 min    | Activity briefing | Instructor reads through the two parts and explains what moves from `useState` into the reducer, then into context |
| ~110 min  | Guided activity   | Learners work through Parts 2A and 2B with hints and reference solutions available; instructor circulates    |
| 30 min    | Debrief           | Two learners present their solutions; instructor walks through the reference solution                        |
| **Total** |                   | **~180 min**                                                                                                 |
