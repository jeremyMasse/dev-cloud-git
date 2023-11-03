import React from "react";
import { render } from "@testing-library/react";
import CompletedTasks from "../index";

test("Snapshot du composant CompletedTasks", () => {
  const { asFragment } = render(<CompletedTasks />);
  expect(asFragment()).toMatchSnapshot();
});

const mockTasksContextValue = {
  tasks: [
    { id: 1, text: "Tâche 1", completed: false },
    { id: 2, text: "Tâche 2", completed: true },
    { id: 3, text: "Tâche 3", completed: true },
    // Ajoutez d'autres tâches si nécessaire
  ],
};

// Crée un mock de useContext pour fournir le contexte factice
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => mockTasksContextValue),
}));

test("Premier test : vérification que le composant ne rend rien quand il n'y a pas de tâches terminées", () => {
  const { container } = render(<CompletedTasks />);
  const taskList = container.querySelector("ul");
  expect(taskList).toBeNull();
});

test("Deuxième test : vérification que les tâches terminées sont bien rendues", () => {
  const { getByText } = render(<CompletedTasks />);
  const completedTask1 = getByText("Tâche 2");
  const completedTask2 = getByText("Tâche 3");
  expect(completedTask1).toBeInTheDocument();
  expect(completedTask2).toBeInTheDocument();
});

test("Troisième test : vérification que les tâches non terminées ne sont pas rendues", () => {
  const { queryByText } = render(<CompletedTasks />);
  const uncompletedTask = queryByText("Tâche 1");
  expect(uncompletedTask).toBeNull();
});

test("Quatrième test : vérification que le rendu du composant correspond à un instantané (snapshot) précédemment enregistré", () => {
  const { asFragment } = render(<CompletedTasks />);
  expect(asFragment()).toMatchSnapshot();
});
