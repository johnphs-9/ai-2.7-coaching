# 2.7 Coaching Session: Refactoring the Guess Game with useReducer and useContext

## Session Overview

This coaching session gives learners hands-on practice applying `useReducer` and the Context API to a problem they already know. The first 30 minutes are open Q&A on anything from Lessons 2.5 and 2.6. Learners then spend approximately two hours working through a structured two-part activity: first refactoring the Guess Game from Coaching 2.4 to use a reducer, then lifting the score history into a shared context. The session closes with two learner presentations followed by an instructor walkthrough.

## Dependencies

- [Activity Brief](./lesson.md)

## Session Objectives

- Refactor existing `useState` logic into a `useReducer` to centralise game state and update logic
- Create a React Context to share score history across components without prop drilling
- Connect reducer-managed state to a context using `useEffect` to trigger side effects at the right time

## Session Plan

| Duration  | What              | How or Why                                                                                                   |
| --------- | ----------------- | ------------------------------------------------------------------------------------------------------------ |
| 30 min    | Q&A               | Open floor for questions on Lessons 2.5 and 2.6; instructor addresses common misconceptions                  |
| 10 min    | Activity briefing | Instructor reads through the two parts and explains how the reducer score feeds into the context             |
| ~110 min  | Guided activity   | Learners work through Parts A and B with hints and reference solutions available; instructor circulates       |
| 30 min    | Debrief           | Two learners present their solutions; instructor walks through the reference solution                        |
| **Total** |                   | **~180 min**                                                                                                 |
